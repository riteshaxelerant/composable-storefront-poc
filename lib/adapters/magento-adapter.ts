import { ContentAdapter, ResolvedContent } from '../middleware/types';
import { magentoClient } from '../magento/client';
import { 
  GET_PRODUCT_BY_URL_KEY, 
  GET_CATEGORY_BY_URL_KEY, 
  GET_CMS_PAGE_BY_IDENTIFIER 
} from '../../graphql/magento/queries';

export class MagentoAdapter implements ContentAdapter {
  public name = 'magento';
  public priority = 100; // High priority
  public enabled = true;

  constructor(priority: number = 100) {
    this.priority = priority;
  }

  async resolve(slug: string): Promise<ResolvedContent | null> {
    if (!this.isEnabled()) return null;

    // Try different content types in order of preference
    const queries = [
      {
        query: GET_PRODUCT_BY_URL_KEY,
        variables: { urlKey: slug },
        type: 'product' as const
      },
      {
        query: GET_CATEGORY_BY_URL_KEY,
        variables: { urlKey: slug },
        type: 'category' as const
      },
      {
        query: GET_CMS_PAGE_BY_IDENTIFIER,
        variables: { identifier: slug },
        type: 'cms_page' as const
      }
    ];

    for (const { query, variables, type } of queries) {
      try {
        const result = await magentoClient.query({
          query,
          variables,
          errorPolicy: 'all',
        });

        let content = null;
        if (type === 'product' && result.data?.products?.items?.length > 0) {
          content = result.data.products.items[0];
        } else if (type === 'category' && result.data?.categories?.items?.length > 0) {
          content = result.data.categories.items[0];
        } else if (type === 'cms_page' && result.data?.cmsPage) {
          content = result.data.cmsPage;
        }

        if (content) {
          return {
            type,
            source: 'magento',
            data: content,
            metadata: {
              title: content.title || content.name,
              description: content.meta_description || content.description?.html,
              seo: {
                meta_title: content.meta_title,
                meta_description: content.meta_description,
                meta_keywords: content.meta_keywords,
              }
            }
          };
        }
      } catch (error) {
        console.error(`[MagentoAdapter] ${type} query failed:`, error);
        // Continue to next query type
      }
    }

    return null;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
} 