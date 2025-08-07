export interface ContentAdapter {
  name: string;
  priority: number;
  enabled: boolean;
  resolve(slug: string): Promise<ResolvedContent | null>;
  isEnabled(): boolean;
  setEnabled(enabled: boolean): void;
}

export interface ResolvedContent {
  type: 'product' | 'category' | 'cms_page' | 'article' | 'page';
  source: 'magento' | 'strapi' | 'shopify' | 'contentful';
  data: any;
  metadata?: {
    title?: string;
    description?: string;
    seo?: any;
  };
}

export interface MiddlewareConfig {
  adapters: ContentAdapter[];
  cacheEnabled: boolean;
  cacheTTL: number;
  fallbackStrategy: 'first-match' | 'best-match' | 'all';
  enableCircuitBreaker: boolean;
  circuitBreakerThreshold: number;
}

export interface MiddlewareContext {
  slug: string;
  fullPath: string;
  userAgent?: string;
  locale?: string;
  timestamp: number;
} 