import { gql } from '@apollo/client';

// Get all articles
export const GET_ARTICLES = gql`
  query GetArticles($limit: Int, $start: Int, $status: PublicationStatus) {
    articles(
      pagination: { limit: $limit, start: $start },
      status: $status,
      sort: "publishedAt:desc"
    ) {
      documentId
      title
      description
      slug
      publishedAt
      cover {
        name
        alternativeText
        url
      }
      author {      
        name
      }
      category {      
        name
      }
    }
  }
`;

// Get article by slug
export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: String!) {
    articles(filters: { slug: { eq: $slug } }, status: PUBLISHED) {
      documentId
      title
      description
      slug
      publishedAt
      cover {
        name
        alternativeText
        url
      }
      author {      
        name
      }
      category {      
        name
      }
    }
  }
`;

// Get all pages
export const GET_PAGES = gql`
  query GetPages($limit: Int, $start: Int) {
    pages(pagination: { limit: $limit, start: $start }, sort: "title:asc") {
      documentId
      title
      slug
      seo {
        metaTitle
        metaDescription
      }
    }
  }
`;

// Get page by slug - using your provided query
export const GET_PAGE_BY_SLUG = gql`
  query GetPage($slug: String!) {
    pages(filters: { slug: { eq: $slug } }) {
      documentId
      title
      slug
      seo {
        metaTitle
        metaDescription
      }
      contentSections {
        __typename
        ... on ComponentSectionsHeroBanner {
          id
          herotitle: title
          subtitle        
          backgroundImage {      
            alternativeText
            caption
            url
          }
          buttonText
          buttonUrl
        }
        ... on ComponentSectionsFeatureGrid {
          id
          sectionTitle
          features {
            id
            title
            description
            icon {
              alternativeText
              url
            }
          }
        }
        ... on ComponentSectionsPromotionalCta {
          id
          title
          body
          buttonText
          buttonUrl
        }
        ... on ComponentSectionsImageCarousel {
          id
          images {
            caption
            alternativeText
            url
          }
        }
        ... on ComponentSectionsTestimonials {
          id
          sectionTitle
          items {
            id
            quote
            authorImage {
              alternativeText
              caption
              url
            }
            authorName
            authorTitle
          }
        }
        ... on ComponentSectionsBlogPostsTeaser {
          id
          sectionTitle
          posts(pagination: { limit: 3 }) {
            id
            title
            link
            summary          
            image {
              alternativeText
              caption
              url
            }
          }
        }
        ... on ComponentSectionsFaqSection {
          id
          sectionTitle
          faqs {
            id
            image {
              alternativeText
              caption
              url
            }
            summary
            title
          }
        }
        ... on ComponentSectionsCategoryHighlight {
          id
          sectionTitle
          categories {
            description
            id
            image {
              alternativeText
              caption
              url
            }
            link
            name
          } 
        }
        ... on ComponentSectionsRichTextBlock {
          id
          content
        }
        ... on ComponentSectionsProductSlider {
          id
          slides {
            image {
              caption
              alternativeText
              url
            }
            link
            name
          }
          title
        }
        ... on ComponentSharedCategoryCard {
          description
          id
          image {
            caption
            alternativeText
            name
            url
          }
          link
          name
        }
      }
    }
  }
`;

// Get all categories
export const GET_CATEGORIES = gql`
  query GetCategories($limit: Int, $start: Int) {
    categories(pagination: { limit: $limit, start: $start }, sort: "name:asc") {
      documentId
      name
      slug
    }
  }
`;

// Get category by slug
export const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: String!) {
    categories(filters: { slug: { eq: $slug } }) {
      documentId
      name
      slug
    }
  }
`;

// Get authors
export const GET_AUTHORS = gql`
  query GetAuthors($limit: Int, $start: Int) {
    authors(pagination: { limit: $limit, start: $start }, sort: "name:asc") {
      documentId
      name
      email
    }
  }
`;

// Get global data
export const GET_GLOBAL = gql`
  query GetGlobal {
    global {
      data {
        attributes {
          siteName
          siteDescription
          favicon {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;