import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql, useReactiveVar, useLazyQuery } from '@apollo/client';
import { authVar, invitedRoomIdVar } from 'apollo/store';
import { REFRESH_TOKEN } from 'apollo/queries';

export const useAuth = () => {
  // const { data, refetch, error } = useQuery(REFRESH_TOKEN, {
  //   fetchPolicy: 'network-only',
  // });
  const [refreshToken, { data, error }] = useLazyQuery(REFRESH_TOKEN, {
    fetchPolicy: 'network-only',
  });
  const intervalId = useRef<NodeJS.Timeout>(null);
  const _authVar = useReactiveVar(authVar);
  const router = useRouter();

  const onLogout = () => {
    router.push(`/login`);
    authVar({ access_token: '', isLogined: false, userId: '', name: '', expires_in: 0 });
    clearInterval(intervalId.current);
  };

  const setTimer = (second: number) => {
    console.log('timer setted', second);
    const newIntervalId = setInterval(() => {
      console.log('prevIntervalId', intervalId.current);
      clearInterval(intervalId.current);
      console.log('refetch, newIntervalId', newIntervalId);
      refreshToken();
      intervalId.current = newIntervalId;
    }, second * 1000);
  };

  useEffect(() => {
    if (!data || error) {
      // refresh 했는데 토큰이 없는경우
      console.log('data', data, 'error', error);
      onLogout();
      return;
    }
    console.log('data', data);

    const { access_token, id: userId, name, expires_in } = data.refreshToken;
    authVar({ access_token, isLogined: true, userId, expires_in, name });
    // authVar({token: data.token, isLogined: true}) //데이터에서 받아온 토큰을 reactiva variable에 설정
    // const { expires_in } = data.refreshToken;
    setTimer(expires_in - 10);

    // const newIntervalId = setInterval(() => {
    //   clearInterval(intervalId.current);
    //   refreshToken();
    //   intervalId.current = newIntervalId;
    // }, 2000); //data에서 뽑은 token의 만료시간 - 2분 뭐 이런식으로...
  }, [data]);

  useEffect(() => {
    if (!_authVar || !_authVar.access_token) {
      router.push('/login');
      return;
    }
    if (!intervalId.current) {
      setTimer(_authVar.expires_in - 10);
    }
  }, [_authVar]);

  useEffect(() => {
    refreshToken();
  }, []);

  console.log('authvar', _authVar, 'data', data);
};
