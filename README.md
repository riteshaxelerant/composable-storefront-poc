# Composable Storefront POC

A modern composable commerce solution built with Next.js, React, and GraphQL that stitches together multiple backend services (Magento and Strapi) into a unified frontend experience.

## 🏗️ Architecture Overview

This POC implements a **middleware-based architecture** for content resolution, providing enterprise-grade features like circuit breakers, caching, and plug-and-play adapters.

### Architecture Flow:
```
User Request → Next.js Page → Middleware Chain → Content Adapters → Backend Services
```

### Key Components:
- **Middleware Engine**: Centralized content resolution with caching and circuit breakers
- **Content Adapters**: Plug-and-play adapters for different content sources
- **GraphQL Clients**: Optimized clients for Magento and Strapi
- **React Query**: Client-side data fetching with caching
- **TypeScript**: Full type safety throughout the application

## 🚀 Features

### ✅ **Middleware Architecture**
- **Priority-based Content Resolution**: Configurable adapter priority
- **Circuit Breakers**: Prevents cascading failures
- **Smart Caching**: Configurable TTL and cache invalidation
- **Error Handling**: Graceful degradation and fallbacks
- **Observability**: Comprehensive logging and metrics

### ✅ **Content Sources**
- **Magento**: Products, Categories, CMS Pages
- **Strapi**: Articles, Pages, Global Content

### ✅ **URL Resolution**
- **Dynamic Routing**: Catch-all route with middleware resolution
- **SEO Optimization**: Proper meta tags and structured data
- **Performance**: Server-side rendering with client-side hydration

## 📁 Project Structure

```
react-nextjs-strapi-magento/
├── lib/
│   ├── middleware/           # Middleware engine and types
│   │   ├── types.ts         # Core interfaces
│   │   ├── url-resolver.ts  # Main middleware engine
│   │   └── index.ts         # Configuration and singleton
│   ├── adapters/            # Content source adapters
│   │   ├── magento-adapter.ts
│   │   └── strapi-adapter.ts
│   ├── magento/             # Magento GraphQL client
│   └── strapi/              # Strapi GraphQL client
├── composables/             # React Query hooks
│   ├── magento/            # Magento-specific hooks
│   └── strapi/             # Strapi-specific hooks
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   ├── magento/            # Magento-specific components
│   └── strapi/             # Strapi-specific components
├── graphql/                # GraphQL queries
│   ├── magento/            # Magento queries
│   └── strapi/             # Strapi queries
├── types/                  # TypeScript type definitions
├── pages/                  # Next.js pages
└── layouts/                # Page layouts
```

## 🌐 Available URLs & Endpoints

### **Frontend Pages**

#### **Homepage**
- **URL**: `http://localhost:3000/`
- **Description**: Landing page with navigation to all sections

#### **Magento Categories**
- **URL**: `http://localhost:3000/categories`
- **Description**: Displays all Magento categories with hierarchy
- **Data**: Name, UID, Level, Children categories
- **Source**: Magento GraphQL (`getCategories.graphql`)

#### **Magento Products by Category**
- **URL**: `http://localhost:3000/products`
- **Description**: Shows products from hardcoded category "Mw==" (Gear category)
- **Data**: Product names and basic info
- **Source**: Magento GraphQL (`getProductsByCategory.graphql`)

#### **Strapi Blog List**
- **URL**: `http://localhost:3000/blog`
- **Description**: Lists all Strapi articles
- **Data**: Article titles, descriptions, authors, categories
- **Source**: Strapi GraphQL

#### **Strapi Blog Detail**
- **URL**: `http://localhost:3000/blog/[slug]`
- **Example**: `http://localhost:3000/blog/top-places-to-visit`
- **Description**: Individual blog article with full content
- **Data**: Complete article data with SEO metadata
- **Source**: Strapi GraphQL

#### **Dynamic Content Pages**
- **URL**: `http://localhost:3000/[slug]`
- **Examples**: 
  - `http://localhost:3000/trending-in-mens` (Strapi Page)
  - `http://localhost:3000/mother-earth` (Strapi Article)
  - `http://localhost:3000/love-the-nature` (Strapi Article)
- **Description**: Catch-all route that resolves content via middleware
- **Resolution Order**: Strapi Articles → Strapi Pages → Magento Products → Magento Categories → Magento CMS Pages

### **API Endpoints**

#### **Magento GraphQL Proxy**
- **URL**: `http://localhost:3000/api/magento/graphql`
- **Method**: POST
- **Description**: Proxies GraphQL requests to Magento with SSL certificate handling
- **Headers**: `Content-Type: application/json`
- **Body**: Standard GraphQL query with variables

#### **Strapi GraphQL Proxy**
- **URL**: `http://localhost:3000/api/strapi/graphql`
- **Method**: POST
- **Description**: Proxies GraphQL requests to Strapi for consistent architecture
- **Headers**: `Content-Type: application/json`
- **Body**: Standard GraphQL query with variables

#### **Content Resolution API**
- **URL**: `http://localhost:3000/api/content/resolve`
- **Method**: POST
- **Description**: Uses middleware to resolve content by slug
- **Headers**: `Content-Type: application/json`
- **Body**: 
  ```json
  {
    "slug": "product-slug",
    "context": {
      "userAgent": "browser-info",
      "locale": "en-US"
    }
  }
  ```

## 🔧 Setup Instructions

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Strapi running on `localhost:1337`
- Magento GraphQL endpoint accessible

### **1. Clone and Install**
```bash
git clone <repository-url>
cd react-nextjs-strapi-magento
npm install
```

### **2. Environment Configuration**
```bash
# Run the setup script
chmod +x setup-env.sh
./setup-env.sh
```

Or manually create `.env.local`:
```env
NEXT_PUBLIC_MAGENTO_GRAPHQL_URL=https://shop.axelerators.ai/graphql
NEXT_PUBLIC_STRAPI_GRAPHQL_URL=http://localhost:1337/graphql
```

### **3. Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🧪 Testing the URLs

### **Test All Working URLs:**
```bash
# Homepage
curl http://localhost:3000/

# Magento Categories
curl http://localhost:3000/categories

# Magento Products
curl http://localhost:3000/products

# Strapi Blog List
curl http://localhost:3000/blog

# Strapi Blog Detail
curl http://localhost:3000/blog/top-places-to-visit

# Dynamic Strapi Page
curl http://localhost:3000/trending-in-mens

# Dynamic Strapi Article
curl http://localhost:3000/mother-earth
```

### **Test API Endpoints:**
```bash
# Test Magento GraphQL proxy
curl -X POST http://localhost:3000/api/magento/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query GetCategories { categoryList { id, uid, level, name, url_path } }"}'

# Test Strapi GraphQL proxy
curl -X POST http://localhost:3000/api/strapi/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query GetArticles { articles { data { id, attributes { title, slug } } } }"}'

# Test content resolution
curl -X POST http://localhost:3000/api/content/resolve \
  -H "Content-Type: application/json" \
  -d '{"slug":"trending-in-mens"}'
```

## 🔄 Middleware Configuration

### **Adapter Priority**
```typescript
// In lib/middleware/index.ts
const middlewareConfig: MiddlewareConfig = {
  adapters: [
    new MagentoAdapter(100), // High priority
    new StrapiAdapter(50),   // Lower priority
  ],
  // ... other config
};
```

### **Adding New Adapters**
```typescript
import { ShopifyAdapter } from './lib/adapters/shopify-adapter';

const middleware = getMiddleware();
const shopifyAdapter = new ShopifyAdapter(75);
middleware.addAdapter(shopifyAdapter);
```

### **Middleware Features**
- **Caching**: 5-minute TTL with automatic invalidation
- **Circuit Breakers**: Opens after 3 consecutive failures
- **Priority Resolution**: Higher priority adapters tried first
- **Error Handling**: Graceful fallback to next adapter
- **Observability**: Comprehensive logging and metrics

## 🛠️ Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### **Adding New Content Types**
1. Create adapter in `lib/adapters/`
2. Add GraphQL queries in `graphql/`
3. Create components in `components/`
4. Update types in `types/`
5. Add composables in `composables/`

### **Middleware Debugging**
```typescript
// Get middleware stats
const middleware = getMiddleware();
console.log(middleware.getStats());

// Clear cache
middleware.clearCache();

// Disable adapter
middleware.getAdapter('magento')?.setEnabled(false);
```

## 📊 Performance Features

### **Caching Strategy**
- **Server-side**: Middleware cache with 5-minute TTL
- **Client-side**: React Query with configurable stale time
- **GraphQL**: Apollo Client cache with type policies

### **Optimization**
- **SSR**: Server-side rendering for better SEO
- **Code Splitting**: Automatic Next.js code splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in webpack analysis

## 🔒 Security

### **SSL Certificate Handling**
- **Magento**: API route proxy handles self-signed certificates
- **Strapi**: API route proxy for consistent architecture and security
- **Environment Variables**: Secure configuration management

### **Error Handling**
- **Circuit Breakers**: Prevents cascading failures
- **Graceful Degradation**: Fallback content when services fail
- **Input Validation**: TypeScript and runtime validation

## 🚀 Production Deployment

### **Environment Variables**
```env
NEXT_PUBLIC_MAGENTO_GRAPHQL_URL=https://your-magento-domain.com/graphql
NEXT_PUBLIC_STRAPI_GRAPHQL_URL=https://your-strapi-domain.com/graphql
```

### **Build and Deploy**
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add TypeScript types for new features
3. Update documentation for new URLs/endpoints
4. Test all middleware adapters
5. Ensure proper error handling

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js, React, GraphQL, and modern web technologies** 