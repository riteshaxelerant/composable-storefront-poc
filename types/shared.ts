// Shared type definitions

// Hook return types
export interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Content sources
export type ContentSource = 'magento' | 'strapi';

// URL resolution types
export interface UrlResolutionResult {
  content: any;
  source: ContentSource;
  contentType: string;
  error?: string;
}

// Component props
export interface PageComponentProps<T> {
  content: T;
  loading?: boolean;
  error?: string | null;
}

// Layout types
export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  source?: ContentSource;
}

// Navigation types
export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

// SEO types
export interface SEOData {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}