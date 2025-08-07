// Magento type definitions

export interface MagentoImage {
  url: string;
  label?: string;
  position?: number;
}

export interface MagentoPrice {
  value: number;
  currency: string;
}

export interface MagentoPriceRange {
  minimum_price: {
    regular_price: MagentoPrice;
    final_price: MagentoPrice;
  };
}

export interface MagentoCategory {
  id: string;
  uid: string;
  level: number;
  name: string;
  url_path: string;
  url_key?: string;
  description?: string;
  image?: string;
  children?: MagentoCategory[];
  products?: {
    items: MagentoProduct[];
  };
}

export interface MagentoProduct {
  id: string;
  name: string;
  sku: string;
  url_key: string;
  price_range: MagentoPriceRange;
  description?: {
    html: string;
  };
  media_gallery?: MagentoImage[];
  stock_status: 'IN_STOCK' | 'OUT_OF_STOCK';
  categories?: MagentoCategory[];
  created_at?: string;
  updated_at?: string;
}

export interface MagentoCmsPage {
  id: string;
  title: string;
  identifier: string;
  content: {
    html: string;
  };
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at?: string;
  updated_at?: string;
}

// API Response types
export interface MagentoProductsResponse {
  products: {
    items: MagentoProduct[];
  };
}

export interface MagentoCategoriesResponse {
  categoryList: MagentoCategory[];
}

export interface MagentoCmsPageResponse {
  cmsPage: MagentoCmsPage;
}