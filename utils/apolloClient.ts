import { useMemo } from 'react';
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

let apolloClient;
let token: string;

const authLink = setContext((_, { headers }) => {
  if (typeof window !== 'undefined') {
    const tokenValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('token'))
      .split('=')[1];
    token = tokenValue;
  }
  if (headers) token = headers.token;
  return {
    headers: {
      ...headers,
      token: token ? token : '',
    },
  };
});

const createApolloClient = () => {
  console.log('created');
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(
      new HttpLink({
        uri: 'http://10.231.1.143:8000/graphql',
      }),
    ),
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = (initialState = null): ApolloClient<NormalizedCacheObject> => {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, initialState });
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
