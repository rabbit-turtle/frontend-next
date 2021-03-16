import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql, useReactiveVar } from '@apollo/client';
import { authVar, invitedRoomIdVar } from 'apollo/store';

const SILENT_REFRESH = gql`
  query 어쩌구 {
    token
    token_expire
  }
`; //대충 이런 모양

export const useAuth = () => {
  const [prevIntervalId, setPrevIntervalId] = useState<NodeJS.Timeout>(null);
  const { data, refetch } = useQuery(SILENT_REFRESH);
  const _authVar = useReactiveVar(authVar);
  const router = useRouter();

  const onLogout = () => {
    router.push(`/login`);
    authVar({ token: '', isLogined: false });
    clearInterval(prevIntervalId);
  };

  useEffect(() => {
    if (!data) {
      // refresh 했는데 토큰이 없는경우
      onLogout();
      return;
    }

    // authVar({token: data.token, isLogined: true}) //데이터에서 받아온 토큰을 reactiva variable에 설정
    const newIntervalId = setInterval(() => {
      clearInterval(prevIntervalId);
      // refetch()
      setPrevIntervalId(newIntervalId);
    }, 2000); //data에서 뽑은 token의 만료시간 - 2분 뭐 이런식으로...
  }, [data]);
};
