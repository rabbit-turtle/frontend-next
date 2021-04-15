import { useMemo } from 'react';
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { authVar } from 'apollo/store';

let apolloClient;
let token: string;

const authLink = setContext((_, { headers }) => {
  if (typeof window !== 'undefined') {
    token = authVar()?.access_token;
  }
  if (headers) token = headers.token;
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(
      new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER,
        credentials: 'include',
      }),
    ),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // chats: {
            //   keyArgs: ['room_id'],
            //   merge(existing = [], incoming, { args }) {
            //     console.log(existing, incoming);
            //     if (!args.offset) {
            //       return [...incoming];
            //     }
            //     return [...incoming, ...existing];
            //   },
            // },
            // room: {
            //   keyArgs: ['room_id'],
            //   merge(existing, incoming, { readField }) {
            //     console.log('existing', existing?.chats, 'incoming', incoming?.chats);
            //     return { ...incoming };
            //   },
            // },
          },
        },
      },
    }),
  });
};

export const initializeApollo = (initialState = null): ApolloClient<NormalizedCacheObject> => {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  //ssg나 ssr인 경우
  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
};

export const useApollo = initialState => {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
};
