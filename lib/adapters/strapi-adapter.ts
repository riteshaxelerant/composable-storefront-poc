import { ContentAdapter, ResolvedContent } from '../middleware/types';
import { strapiClient } from '../strapi/client';
import { GET_ARTICLE_BY_SLUG, GET_PAGE_BY_SLUG } from '../../graphql/strapi/queries';

export class StrapiAdapter implements ContentAdapter {
  public name = 'strapi';
  public priority = 50; // Lower priority than Magento
  public enabled = true;

  constructor(priority: number = 50) {
    this.priority = priority;
  }

  async resolve(slug: string): Promise<ResolvedContent | null> {
    if (!this.isEnabled()) return null;

    // Try articles first, then pages
    const queries = [
      {
        query: GET_ARTICLE_BY_SLUG,
        variables: { slug },
        type: 'article' as const
      },
      {
        query: GET_PAGE_BY_SLUG,
        variables: { slug },
        type: 'page' as const
      }
    ];

    for (const { query, variables, type } of queries) {
      try {
        const result = await strapiClient.query({
          query,
          variables,
          errorPolicy: 'all',
        });

        let content = null;
        if (type === 'article' && result.data?.articles?.length > 0) {
          content = result.data.articles[0];
        } else if (type === 'page' && result.data?.pages?.length > 0) {
          content = result.data.pages[0];
        }

        if (content) {
          return {
            type,
            source: 'strapi',
            data: content,
            metadata: {
              title: content.title,
              description: content.description || content.seo?.metaDescription,
              seo: content.seo
            }
          };
        }
      } catch (error) {
        console.error(`[StrapiAdapter] ${type} query failed:`, error);
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