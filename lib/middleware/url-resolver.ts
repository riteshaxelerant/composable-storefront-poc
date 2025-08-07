import { ContentAdapter, ResolvedContent, MiddlewareConfig, MiddlewareContext } from './types';

export class UrlResolverMiddleware {
  private config: MiddlewareConfig;
  private cache: Map<string, { data: ResolvedContent; timestamp: number }> = new Map();
  private circuitBreakers: Map<string, { failures: number; lastFailure: number }> = new Map();

  constructor(config: MiddlewareConfig) {
    this.config = config;
  }

  async resolve(slug: string, context: Partial<MiddlewareContext> = {}): Promise<ResolvedContent | null> {
    const fullContext: MiddlewareContext = {
      slug,
      fullPath: `/${slug}`,
      timestamp: Date.now(),
      ...context,
    };

    // Check cache first
    if (this.config.cacheEnabled) {
      const cached = this.getFromCache(slug);
      if (cached) return cached;
    }

    // Sort adapters by priority
    const enabledAdapters = this.config.adapters
      .filter(adapter => adapter.isEnabled())
      .sort((a, b) => b.priority - a.priority);

    // Try each adapter in priority order
    for (const adapter of enabledAdapters) {
      // Check circuit breaker
      if (this.isCircuitBreakerOpen(adapter.name)) {
        console.log(`[Middleware] Circuit breaker open for ${adapter.name}, skipping`);
        continue;
      }

      try {
        console.log(`[Middleware] Trying adapter: ${adapter.name} for slug: ${slug}`);
        
        const result = await adapter.resolve(slug);
        
        if (result) {
          console.log(`[Middleware] Found content via ${adapter.name}: ${result.type}`);
          
          // Cache the result
          if (this.config.cacheEnabled) {
            this.setCache(slug, result);
          }
          
          // Reset circuit breaker on success
          this.resetCircuitBreaker(adapter.name);
          
          return result;
        }
      } catch (error) {
        console.error(`[Middleware] Adapter ${adapter.name} failed:`, error);
        
        // Update circuit breaker
        this.recordFailure(adapter.name);
      }
    }

    console.log(`[Middleware] No content found for slug: ${slug}`);
    return null;
  }

  private getFromCache(slug: string): ResolvedContent | null {
    const cached = this.cache.get(slug);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.config.cacheTTL) {
      this.cache.delete(slug);
      return null;
    }

    return cached.data;
  }

  private setCache(slug: string, data: ResolvedContent): void {
    this.cache.set(slug, { data, timestamp: Date.now() });
  }

  private isCircuitBreakerOpen(adapterName: string): boolean {
    if (!this.config.enableCircuitBreaker) return false;

    const breaker = this.circuitBreakers.get(adapterName);
    if (!breaker) return false;

    const now = Date.now();
    const timeSinceLastFailure = now - breaker.lastFailure;
    
    // Circuit breaker opens after threshold failures
    // and stays open for 30 seconds
    return breaker.failures >= this.config.circuitBreakerThreshold && 
           timeSinceLastFailure < 30000;
  }

  private recordFailure(adapterName: string): void {
    if (!this.config.enableCircuitBreaker) return;

    const breaker = this.circuitBreakers.get(adapterName) || { failures: 0, lastFailure: 0 };
    breaker.failures++;
    breaker.lastFailure = Date.now();
    this.circuitBreakers.set(adapterName, breaker);
  }

  private resetCircuitBreaker(adapterName: string): void {
    this.circuitBreakers.delete(adapterName);
  }

  // Public methods for management
  addAdapter(adapter: ContentAdapter): void {
    this.config.adapters.push(adapter);
    this.config.adapters.sort((a, b) => b.priority - a.priority);
  }

  removeAdapter(adapterName: string): void {
    this.config.adapters = this.config.adapters.filter(a => a.name !== adapterName);
  }

  getAdapter(adapterName: string): ContentAdapter | undefined {
    return this.config.adapters.find(a => a.name === adapterName);
  }

  clearCache(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      cacheSize: this.cache.size,
      circuitBreakers: Object.fromEntries(this.circuitBreakers),
      adapters: this.config.adapters.map(a => ({
        name: a.name,
        enabled: a.isEnabled(),
        priority: a.priority,
      })),
    };
  }
} 