import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Auth link for potential future authentication
const authLink = setContext((_, { headers }) => {
  // Add any authentication headers here if needed
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    }
  };
});

// Magento GraphQL Client
const magentoHttpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL || 'https://shop.axelerators.ai/graphql',
  credentials: 'omit', // Magento typically doesn't need credentials for public queries
  fetchOptions: {
    rejectUnauthorized: false, // Handle self-signed certificates
  },
  fetch: (uri: any, options: any) => {
    // Handle self-signed certificate issues in Node.js environment
    if (typeof process !== 'undefined' && process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
    return fetch(uri, options);
  },
});

export const magentoClient = new ApolloClient({
  link: from([errorLink, authLink, magentoHttpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            merge(existing = [], incoming) {
              return incoming; // Replace existing data
            },
          },
          categories: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// Strapi GraphQL Client
const strapiHttpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL || 'http://localhost:1337/graphql',
  credentials: 'omit',
});

export const strapiClient = new ApolloClient({
  link: from([errorLink, authLink, strapiHttpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          articles: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          pages: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          categories: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// Utility function to execute GraphQL queries with timeout
export async function executeQuery<T = any>(
  client: ApolloClient<any>,
  query: any,
  variables?: any,
  timeout: number = 10000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const result = await client.query({
      query,
      variables,
      context: {
        fetchOptions: {
          signal: controller.signal,
        },
      },
    });

    clearTimeout(timeoutId);
    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Utility function to execute GraphQL mutations
export async function executeMutation<T>(
  client: ApolloClient<any>,
  mutation: any,
  variables?: any,
  timeout: number = 10000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const result = await client.mutate({
      mutation,
      variables,
      context: {
        fetchOptions: {
          signal: controller.signal,
        },
      },
    });

    clearTimeout(timeoutId);
    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
} 