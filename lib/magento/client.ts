import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Error handling link for Magento
const magentoErrorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[Magento GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Magento Network error]: ${networkError}`);
  }
});

// Auth link for Magento (can be extended for customer tokens)
const magentoAuthLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'Store': 'default', // Magento store code
    }
  };
});

// Magento HTTP link - use our API route to handle SSL certificate bypass
const magentoHttpLink = createHttpLink({
  uri: '/api/magento/graphql',
  credentials: 'same-origin',
});

// Magento Apollo Client
export const magentoClient = new ApolloClient({
  link: from([magentoErrorLink, magentoAuthLink, magentoHttpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            merge(existing = [], incoming) {
              return incoming; // Replace existing data
            },
          },
          categoryList: {
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
      fetchPolicy: 'network-only', // Always fetch from network
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'network-only', // Always fetch from network
    },
  },
});