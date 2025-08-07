import { gql } from '@apollo/client';

// Get all categories - using your provided query
export const GET_CATEGORIES = gql`
  query GetCategories {
    categoryList {
      id,
      uid,
      level,
      name,
      url_path,
      children {
        id,
        uid,
        level,
        name,
        url_path,
        children { id,uid, level, name, url_path }
      }
    }
  }
`;

// Get products by category - using your provided query structure
export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryUid: String!) {
    products(filter: { category_uid: { eq: $categoryUid } }) {
      items {
        id,
        name
      }
    }
  }
`;

// Get product by URL key (slug)
export const GET_PRODUCT_BY_URL_KEY = gql`
  query GetProductByUrlKey($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        id
        name
        sku
        url_key
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
            final_price {
              value
              currency
            }
          }
        }
        description {
          html
        }
        media_gallery {
          url
          label
          position
        }
        stock_status
        categories {
          id
          name
          url_key
        }
        created_at
        updated_at
      }
    }
  }
`;

// Get category by URL key
export const GET_CATEGORY_BY_URL_KEY = gql`
  query GetCategoryByUrlKey($urlKey: String!) {
    categories(filters: { url_key: { eq: $urlKey } }) {
      items {
        id
        name
        url_key
        description
        image
        children {
          id
          name
          url_key
        }
        products {
          items {
            id
            name
            sku
            url_key
            price_range {
              minimum_price {
                regular_price {
                  value
                  currency
                }
              }
            }
            media_gallery {
              url
              label
            }
          }
        }
      }
    }
  }
`;

// Get CMS page by identifier - fixed field names
export const GET_CMS_PAGE_BY_IDENTIFIER = gql`
  query GetCmsPageByIdentifier($identifier: String!) {
    cmsPage(identifier: $identifier) {
      title
      identifier
      content
      meta_title
      meta_description
      meta_keywords
    }
  }
`;