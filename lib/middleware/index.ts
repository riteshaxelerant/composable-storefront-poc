import { UrlResolverMiddleware } from './url-resolver';
import { MiddlewareConfig } from './types';
import { MagentoAdapter } from '../adapters/magento-adapter';
import { StrapiAdapter } from '../adapters/strapi-adapter';

// Middleware configuration
const middlewareConfig: MiddlewareConfig = {
  adapters: [
    new MagentoAdapter(100), // High priority
    new StrapiAdapter(50),   // Lower priority
  ],
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  fallbackStrategy: 'first-match',
  enableCircuitBreaker: true,
  circuitBreakerThreshold: 3,
};

// Singleton instance
let middlewareInstance: UrlResolverMiddleware | null = null;

export function getMiddleware(): UrlResolverMiddleware {
  if (!middlewareInstance) {
    middlewareInstance = new UrlResolverMiddleware(middlewareConfig);
  }
  return middlewareInstance;
}

// Export types and classes for external use
export { UrlResolverMiddleware } from './url-resolver';
export { MagentoAdapter } from '../adapters/magento-adapter';
export { StrapiAdapter } from '../adapters/strapi-adapter';
export type { ContentAdapter, ResolvedContent, MiddlewareConfig } from './types'; 