import { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { authTokenVar } from 'apollo/store';

const SILENT_REFRESH = gql`
  query 어쩌구 {
    token
    token_expire
  }
`; //대충 이런 모양

export const useAuth = () => {
  const [prevIntervalId, setPrevIntervalId] = useState<NodeJS.Timeout>(null);
  const [silentRefresh, { data }] = useLazyQuery(SILENT_REFRESH);

  useEffect(() => {
    // silentRefresh();
  }, [prevIntervalId]);

  useEffect(() => {
    if (!data) return;

    // authTokenVar(data.token) //데이터에서 받아온 토큰을 reactiva variable에 설정
    const newIntervalId = setInterval(() => {
      clearInterval(prevIntervalId);
      setPrevIntervalId(newIntervalId);
    }, 2000); //data에서 뽑은 token의 만료시간 - 2분 뭐 이런식으로...
  }, [data]);
};
