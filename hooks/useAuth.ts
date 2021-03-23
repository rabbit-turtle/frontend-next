import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql, useReactiveVar, useLazyQuery } from '@apollo/client';
import { authVar, invitedRoomIdVar } from 'apollo/store';
import { REFRESH_TOKEN } from 'apollo/queries';

export const useAuth = () => {
  const { data, error, refetch } = useQuery(REFRESH_TOKEN, {
    fetchPolicy: 'network-only',
  });
  const timeoutId = useRef<NodeJS.Timeout>(null);
  const _authVar = useReactiveVar(authVar);
  const router = useRouter();

  const onLogout = () => {
    router.push(`/login`);
    clearTimeout(timeoutId.current);
  };

  const setTimer = (second: number) => {
    const newtimeoutId = setTimeout(() => {
      refetch();
    }, second * 1000);
    timeoutId.current = newtimeoutId;
  };

  useEffect(() => {
    if (!data || error) {
      // refresh 했는데 토큰이 없는경우
      // console.log('data', data, 'error', error);

      authVar({ access_token: '', isLogined: false, userId: '', name: '', expires_in: 0 });
      return;
    }

    const { access_token, id: userId, name, expires_in } = data.refreshToken;
    authVar({ access_token, isLogined: true, userId, expires_in, name });
  }, [data]);

  useEffect(() => {
    if (!_authVar || !_authVar.access_token) {
      onLogout();
      return;
    }

    setTimer(_authVar.expires_in - 10);
  }, [_authVar]);
};
