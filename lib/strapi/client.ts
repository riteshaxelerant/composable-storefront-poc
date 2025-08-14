import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Error handling link for Strapi
const strapiErrorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[Strapi GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Strapi Network error]: ${networkError}`);
  }
});

// Auth link for Strapi (can be extended for API tokens)
const strapiAuthLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    }
  };
});

// Strapi HTTP link
const strapiHttpLink = createHttpLink({
  uri: typeof window === 'undefined' 
    ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/strapi/graphql`
    : '/api/strapi/graphql',
  credentials: 'same-origin',
});

// Strapi Apollo Client
export const strapiClient = new ApolloClient({
  link: from([strapiErrorLink, strapiAuthLink, strapiHttpLink]),
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