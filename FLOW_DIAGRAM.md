# 🔄 Request Flow Architecture

## Overview
This document explains how requests flow through the middleware-based composable storefront architecture when made through a browser.

## 🎯 Request Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Next.js       │    │   Middleware    │
│                 │    │   Pages         │    │   Engine        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. HTTP Request       │                       │
         │ GET /trending-in-mens │                       │
         │──────────────────────▶│                       │
         │                       │                       │
         │                       │ 2. Route Resolution   │
         │                       │ pages/[...slug].tsx   │
         │                       │──────────────────────▶│
         │                       │                       │
         │                       │                       │ 3. getServerSideProps
         │                       │                       │ getMiddleware().resolve()
         │                       │                       │──────────────────────▶│
         │                       │                       │
         │                       │                       │ 4. Adapter Chain
         │                       │                       │ [Magento → Strapi]
         │                       │                       │──────────────────────▶│
         │                       │                       │
         │                       │                       │ 5. GraphQL Queries
         │                       │                       │ [Magento/Strapi APIs]
         │                       │                       │──────────────────────▶│
         │                       │                       │
         │                       │                       │ 6. Content Resolution
         │                       │                       │ Return ResolvedContent
         │                       │                       │◀──────────────────────│
         │                       │                       │
         │                       │ 7. Props & Rendering  │
         │                       │◀──────────────────────│
         │                       │                       │
         │ 8. HTML Response      │                       │
         │◀──────────────────────│                       │
         │                       │                       │
```

## 🔍 Detailed Flow Breakdown

### **Phase 1: Browser Request**
```
Browser → GET http://localhost:3000/trending-in-mens
```

### **Phase 2: Next.js Route Resolution**
```
Next.js Router → pages/[...slug].tsx
```

**File: `pages/[...slug].tsx`**
```typescript
// 1. Extract slug from URL
const pathSegments = params?.slug as string[];
const slug = pathSegments[pathSegments.length - 1]; // "trending-in-mens"

// 2. Skip system URLs
if (fullPath.startsWith('__webpack_hmr') || fullPath.startsWith('_next')) {
  return { notFound: true };
}
```

### **Phase 3: Middleware Resolution**
```
getServerSideProps → getMiddleware().resolve()
```

**File: `pages/[...slug].tsx`**
```typescript
// 3. Use middleware to resolve content
const middleware = getMiddleware();
const resolvedContent = await middleware.resolve(slug, {
  fullPath,
  userAgent: res?.getHeader('user-agent') as string,
});
```

### **Phase 4: Middleware Engine Processing**
```
UrlResolverMiddleware → Adapter Chain
```

**File: `lib/middleware/url-resolver.ts`**
```typescript
async resolve(slug: string, context: Partial<MiddlewareContext> = {}): Promise<ResolvedContent | null> {
  // 4a. Check cache first
  if (this.config.cacheEnabled) {
    const cached = this.getFromCache(slug);
    if (cached) return cached;
  }

  // 4b. Sort adapters by priority
  const enabledAdapters = this.config.adapters
    .filter(adapter => adapter.isEnabled())
    .sort((a, b) => b.priority - a.priority);
  // Result: [MagentoAdapter(100), StrapiAdapter(50)]

  // 4c. Try each adapter in priority order
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
        
        return result;
      }
    } catch (error) {
      console.error(`[Middleware] Adapter ${adapter.name} failed:`, error);
      this.recordFailure(adapter.name);
    }
  }
}
```

### **Phase 5: Adapter Resolution**

#### **5a. Magento Adapter (Priority 100)**
**File: `lib/adapters/magento-adapter.ts`**
```typescript
async resolve(slug: string): Promise<ResolvedContent | null> {
  // Try different content types in order
  const queries = [
    { query: GET_PRODUCT_BY_URL_KEY, variables: { urlKey: slug }, type: 'product' },
    { query: GET_CATEGORY_BY_URL_KEY, variables: { urlKey: slug }, type: 'category' },
    { query: GET_CMS_PAGE_BY_IDENTIFIER, variables: { identifier: slug }, type: 'cms_page' }
  ];

  for (const { query, variables, type } of queries) {
    try {
      const result = await magentoClient.query({ query, variables, errorPolicy: 'all' });
      
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
          metadata: { title: content.title || content.name, ... }
        };
      }
    } catch (error) {
      console.error(`[MagentoAdapter] ${type} query failed:`, error);
    }
  }
  
  return null; // No content found in Magento
}
```

#### **5b. Strapi Adapter (Priority 50)**
**File: `lib/adapters/strapi-adapter.ts`**
```typescript
async resolve(slug: string): Promise<ResolvedContent | null> {
  // Try articles first, then pages
  const queries = [
    { query: GET_ARTICLE_BY_SLUG, variables: { slug }, type: 'article' },
    { query: GET_PAGE_BY_SLUG, variables: { slug }, type: 'page' }
  ];

  for (const { query, variables, type } of queries) {
    try {
      const result = await strapiClient.query({ query, variables, errorPolicy: 'all' });
      
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
          metadata: { title: content.title, ... }
        };
      }
    } catch (error) {
      console.error(`[StrapiAdapter] ${type} query failed:`, error);
    }
  }
  
  return null; // No content found in Strapi
}
```

### **Phase 6: GraphQL API Calls**

#### **6a. Magento GraphQL (via API Route)**
```
magentoClient.query() → /api/magento/graphql → https://shop.axelerators.ai/graphql
```

**File: `pages/api/magento/graphql.ts`**
```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, variables } = req.body;
  
  // Set SSL certificate bypass for Node.js environment
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const response = await fetch(process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Store': 'default' },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  return res.status(200).json(data);
}
```

**File: `pages/api/strapi/graphql.ts`**
```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, variables } = req.body;

  const response = await fetch(process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  return res.status(200).json(data);
}
```

#### **6b. Strapi GraphQL (via API Route)**
```
strapiClient.query() → /api/strapi/graphql → http://localhost:1337/graphql
```

### **Phase 7: Content Resolution & Response**

#### **7a. Successful Resolution**
```typescript
// Strapi finds the page "trending-in-mens"
const resolvedContent = {
  type: 'page',
  source: 'strapi',
  data: { title: 'Trending in Mens', slug: 'trending-in-mens', contentSections: [...] },
  metadata: { title: 'Trending in Mens', description: 'Description about Trending in Mens' }
};
```

#### **7b. Return to getServerSideProps**
```typescript
if (resolvedContent) {
  console.log(`[SSR] Found content via ${resolvedContent.source}: ${resolvedContent.type}`);
  
  return {
    props: {
      content: resolvedContent.data,
      contentType: resolvedContent.type,
      source: resolvedContent.source,
      slug,
      metadata: resolvedContent.metadata,
    },
  };
}
```

### **Phase 8: Component Rendering**

#### **8a. Page Component Selection**
```typescript
// In pages/[...slug].tsx
if (source === 'strapi' && contentType === 'page') {
  return (
    <DefaultLayout 
      title={metadata?.title || content.title} 
      description={metadata?.description || content.seo?.metaDescription}
      source="strapi"
    >
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StrapiPage slug={slug} />
        </div>
      </div>
    </DefaultLayout>
  );
}
```

#### **8b. Component Data Fetching**
```typescript
// In components/strapi/StrapiPage.tsx
export function StrapiPage({ slug }: StrapiPageProps) {
  const { page, loading, error } = useStrapiPage({ slug });
  
  // Client-side data fetching for additional content
  // This uses the same Strapi adapter but on the client side
}
```

## 🔄 Alternative Flows

### **Flow 2: Client-Side Navigation**
```
Browser → React Router → useStrapiPage() → /api/content/resolve → Middleware → Strapi
```

### **Flow 3: Direct API Access**
```
Browser → fetch('/api/content/resolve') → Middleware → Adapters → Backend APIs
```

## 📊 Performance Optimizations

### **Caching Layers**
1. **Middleware Cache**: 5-minute TTL for resolved content
2. **Apollo Client Cache**: GraphQL query results
3. **React Query Cache**: Client-side data with stale time
4. **Next.js Cache**: Static generation and ISR

### **Circuit Breakers**
- **Threshold**: 3 consecutive failures
- **Timeout**: 30 seconds before retry
- **Fallback**: Skip failed adapter, try next

### **Priority Resolution**
- **Magento**: Priority 100 (High)
- **Strapi**: Priority 50 (Medium)
- **Future**: Shopify Priority 75, Contentful Priority 25

## 🐛 Error Handling

### **Adapter Failures**
```typescript
try {
  const result = await adapter.resolve(slug);
  if (result) return result;
} catch (error) {
  console.error(`[Middleware] Adapter ${adapter.name} failed:`, error);
  this.recordFailure(adapter.name); // Update circuit breaker
  // Continue to next adapter
}
```

### **No Content Found**
```typescript
if (!resolvedContent) {
  return { notFound: true }; // Next.js 404 page
}
```

### **GraphQL Errors**
```typescript
// In adapters
const result = await client.query({ query, variables, errorPolicy: 'all' });
if (result.error) {
  console.error(`[${adapterName}] GraphQL error:`, result.error);
  // Continue to next query type
}
```

## 🎯 Key Benefits of This Flow

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Fault Tolerance**: Circuit breakers and fallbacks prevent cascading failures
3. **Performance**: Multiple caching layers and priority-based resolution
4. **Extensibility**: Easy to add new adapters and content sources
5. **Observability**: Comprehensive logging at each step
6. **Type Safety**: Full TypeScript support throughout the flow 