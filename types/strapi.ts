// Strapi type definitions

export interface StrapiImage {
  name: string;
  alternativeText?: string;
  url: string;
}

export interface StrapiSEO {
  metaTitle?: string;
  metaDescription?: string;
}

export interface StrapiAuthor {
  documentId: string;
  name: string;
  email?: string;
}

export interface StrapiCategory {
  documentId: string;
  name: string;
  slug: string;
}

export interface StrapiArticle {
  documentId: string;
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  cover?: StrapiImage;
  author?: {
    name: string;
  };
  category?: {
    name: string;
  };
}

export interface StrapiPage {
  documentId: string;
  title: string;
  slug: string;
  seo?: StrapiSEO;
}

export interface StrapiGlobal {
  data: {
    attributes: {
      siteName: string;
      siteDescription: string;
      favicon?: {
        data: {
          attributes: {
            url: string;
          };
        };
      };
    };
  };
}

// API Response types
export interface StrapiArticlesResponse {
  articles: StrapiArticle[];
}

export interface StrapiPagesResponse {
  pages: StrapiPage[];
}

export interface StrapiCategoriesResponse {
  categories: StrapiCategory[];
}

export interface StrapiAuthorsResponse {
  authors: StrapiAuthor[];
}

export interface StrapiGlobalResponse {
  global: StrapiGlobal;
}