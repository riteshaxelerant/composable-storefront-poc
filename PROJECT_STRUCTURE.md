# Project Structure - Composable Storefront POC

## Overview

This project has been restructured following VueStorefront best practices to create a scalable, maintainable composable commerce solution that integrates Magento and Strapi GraphQL backends.

## Folder Structure

```
├── assets/                     # Static assets (CSS, JS)
│   ├── css/
│   └── js/
├── components/                 # All React components
│   ├── ui/                    # Reusable UI components (Button, Card, etc.)
│   ├── layout/                # Layout components (Header, Footer)
│   ├── magento/               # Magento-specific components
│   │   ├── CategoryList.tsx   # Displays Magento categories
│   │   └── ProductList.tsx    # Displays Magento products
│   ├── strapi/                # Strapi-specific components
│   │   ├── ArticleList.tsx    # Displays Strapi articles
│   │   └── ArticleDetail.tsx  # Individual article view
│   └── shared/                # Shared components
├── composables/               # Data fetching hooks
│   ├── magento/               # Magento-specific hooks
│   │   ├── useCategories.ts   # Hook for Magento categories
│   │   └── useProductsByCategory.ts
│   ├── strapi/                # Strapi-specific hooks
│   │   ├── useArticles.ts     # Hook for Strapi articles
│   │   └── useArticleBySlug.ts
│   └── shared/                # Shared hooks
├── graphql/                   # GraphQL queries
│   ├── magento/
│   │   ├── queries.ts         # All Magento GraphQL queries
│   │   ├── getCategories.graphql
│   │   └── getProductsByCategory.graphql
│   └── strapi/
│       ├── queries.ts         # All Strapi GraphQL queries
│       ├── articles/          # Article queries
│       ├── categories/        # Category queries
│       └── pages/             # Page queries
├── helpers/                   # Utility functions
│   ├── magento/              # Magento-specific helpers
│   ├── strapi/               # Strapi-specific helpers
│   └── shared/               # Shared utilities
├── layouts/                  # Layout components
│   └── DefaultLayout.tsx     # Main layout with header/footer
├── lib/                      # Library configurations
│   ├── magento/
│   │   └── client.ts         # Magento Apollo Client
│   └── strapi/
│       └── client.ts         # Strapi Apollo Client
├── pages/                    # Next.js pages
│   ├── index.tsx             # Homepage
│   ├── categories.tsx        # Categories listing
│   ├── blog.tsx              # Blog listing
│   ├── blog/[slug].tsx       # Individual blog posts
│   └── [...slug].tsx         # Catch-all route (preserved)
└── types/                    # TypeScript type definitions
    ├── magento.ts            # Magento types
    ├── strapi.ts             # Strapi types
    └── shared.ts             # Shared types
```

## Key Features Implemented

### 1. **Composable Architecture**
- **Magento Client**: Dedicated Apollo client with SSL handling for self-signed certificates
- **Strapi Client**: Separate Apollo client for local Strapi instance
- **Type Safety**: Full TypeScript support with separate type definitions

### 2. **Component Organization**
- **Source-Specific Components**: Separate components for Magento and Strapi
- **Reusable UI**: Shared UI components (Button, Card, LoadingSpinner)
- **Layout System**: Consistent layout with header/footer

### 3. **Data Fetching Patterns**
- **React Query Integration**: Intelligent caching and background updates
- **Composable Hooks**: Dedicated hooks for each data source
- **Error Handling**: Graceful error handling and loading states

### 4. **Scalable Structure**
- **Easy Extension**: Adding new data sources requires minimal changes
- **Clear Separation**: Each data source has its own folder structure
- **Best Practices**: Following VueStorefront organizational patterns

## Working Features

### ✅ Strapi Integration
- **Blog Listing**: `/blog` - Shows all articles from Strapi
- **Article Detail**: `/blog/[slug]` - Individual article pages
- **Data Rendering**: Successfully fetches and displays:
  - Article titles, descriptions, cover images
  - Author information and categories
  - Published dates
  - Responsive image handling
- **Consistent Proxy Architecture**: All Strapi requests go through `/api/strapi/graphql` proxy

### ✅ Magento Integration
- **Categories Listing**: `/categories` - Shows Magento category tree
- **SSL Issue Resolved**: Fixed self-signed certificate issue via proxy
- **Hierarchical Display**: Shows nested categories with proper indentation
- **Raw Data Rendering**: Successfully displays:
  - Category names, UIDs, levels
  - URL paths for navigation
  - Nested category structures
- **Consistent Proxy Architecture**: All Magento requests go through `/api/magento/graphql` proxy

### ✅ Layout System
- **Consistent Header/Footer**: Shows data source indicators
- **Responsive Design**: Works on mobile and desktop
- **Navigation**: Clean navigation between sections

## Testing Results

All new pages are working correctly:

| URL | Status | Content Source |
|-----|--------|----------------|
| `/` | ✅ 200 | Static homepage with new navigation |
| `/blog` | ✅ 200 | Strapi articles list |
| `/blog/top-places-to-visit` | ✅ 200 | Individual Strapi article |
| `/blog/mother-earth` | ✅ 200 | Individual Strapi article |
| `/blog/love-the-nature` | ✅ 200 | Individual Strapi article |
| `/categories` | ✅ 200 | Magento categories tree |

## Technical Improvements

### 1. **SSL Certificate Handling**
- Fixed self-signed certificate issues with Magento
- Added proper fetch configuration for Node.js environment
- Implemented consistent proxy architecture for both Magento and Strapi
- Graceful fallback for SSL validation

### 2. **GraphQL Client Optimization**
- Separate Apollo clients for each data source
- Proper error handling and logging
- Intelligent caching policies

### 3. **Type Safety**
- Comprehensive TypeScript types for both data sources
- Runtime validation with Zod schemas
- Proper interface definitions

### 4. **Performance**
- React Query for intelligent caching
- Code splitting by data source
- Optimized image handling with Next.js Image component

## Next Steps for Enhancement

1. **Product Detail Pages**: Complete Magento product detail implementation
2. **Search Functionality**: Add search across both data sources
3. **Authentication**: Add user authentication for both platforms
4. **Cart Integration**: Implement shopping cart functionality
5. **SEO Optimization**: Add meta tags and structured data
6. **Internationalization**: Multi-language support
7. **Performance Monitoring**: Add analytics and performance tracking

## Development Workflow

### Adding New Magento Features
1. Add GraphQL query to `graphql/magento/queries.ts`
2. Create composable hook in `composables/magento/`
3. Build component in `components/magento/`
4. Add page in `pages/` if needed

### Adding New Strapi Features
1. Add GraphQL query to `graphql/strapi/queries.ts`
2. Create composable hook in `composables/strapi/`
3. Build component in `components/strapi/`
4. Add page in `pages/` if needed

### Adding New Data Sources
1. Create new folder in `lib/`, `composables/`, `components/`
2. Add GraphQL client configuration
3. Update types in `types/`
4. Create dedicated components and hooks

This structure provides a solid foundation for building a production-ready composable commerce solution that can easily be extended with additional features and data sources.