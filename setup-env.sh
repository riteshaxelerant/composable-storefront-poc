#!/bin/bash

# Create .env.local file with GraphQL endpoints
cat > .env.local << EOF
NEXT_PUBLIC_MAGENTO_GRAPHQL_URL=https://shop.axelerators.ai/graphql
NEXT_PUBLIC_STRAPI_GRAPHQL_URL=http://localhost:1337/graphql
EOF

echo "Environment variables created in .env.local"
echo "Make sure Strapi is running on localhost:1337" 