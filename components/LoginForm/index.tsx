import { useEffect } from 'react';
import Image from 'next/image';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { GOOGLE_LOGIN } from 'apollo/queries';
import { invitedRoomId } from 'apollo/store';

function Login(props) {
  const _invitedRoomId = useReactiveVar(invitedRoomId);
  const [googleLogin, { called, loading, data: googleData }] = useLazyQuery(GOOGLE_LOGIN);

  const handleKakaoLogin = () => {
    const { Kakao } = window;
    Kakao.Auth.login({
      success: res => {
        console.log(res);
      },
      fail: console.log,
    });
  };

  // google Login setting
  useEffect(() => {
    const onSuccess = googleUser => {
      const id_token = googleUser.getAuthResponse().id_token;
      googleLogin({ variables: { google_token: id_token } });
    };

    const onFailure = error => {
      console.log(error);
    };

    const initGoogleKakao = () => {
      const { gapi, Kakao } = window;
      gapi?.load('auth2', () => {
        const myauth2 = gapi.auth2.init({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });
        const mybtn = document.querySelector('#googleLogin');
        myauth2.attachClickHandler(mybtn, {}, onSuccess, onFailure);
      });

      if (Kakao.isInitialized()) return;
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    };
    window.onload = initGoogleKakao;
  }, []);

  useEffect(() => {
    if (!googleData) return;
    console.log('google>>>', googleData);
  }, [googleData]);
  return (
    <section className="flex flex-col justify-center items-center">
      <button
        id="googleLogin"
        className="flex justify-center items-center rounded-xl w-1/2 py-4 shadow-md m-2 hover:text-white hover:bg-google-dark transition-colors"
      >
        <Image src="/images/google.png" alt="구글 로그인" width="20" height="20" />
        <span className="ml-2 text-md">구글로 4초만에 시작하기</span>
      </button>
      <button
        className="flex justify-center items-center rounded-xl w-1/2 py-4 shadow-md m-2  bg-kakao hover:bg-kakao-dark transition-colors"
        onClick={handleKakaoLogin}
      >
        <Image src="/images/kakao.png" alt="카카오 로그인" width="20" height="20" />
        <span className="ml-2 text-md">카카오로 4초만에 시작하기</span>
      </button>
    </section>
  );
}

export default Login;
