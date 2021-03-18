import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { GOOGLE_LOGIN } from 'apollo/queries';
import { invitedRoomIdVar, authVar } from 'apollo/store';
import { useSaveReceiver } from 'apollo/mutations/saveReceiver';

function Login(props) {
  const _invitedRoomIdVar = useReactiveVar(invitedRoomIdVar);
  const _authVar = useReactiveVar(authVar);
  const [googleLogin, { called, loading, data: googleData, error }] = useLazyQuery(GOOGLE_LOGIN);
  const router = useRouter();
  const { saveReceiver } = useSaveReceiver();

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
    const onSuccess = async googleUser => {
      const id_token: string = await googleUser.getAuthResponse().id_token;
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

    setTimeout(() => {
      initGoogleKakao();
    }, 100);
  }, []);

  useEffect(() => {
    if (!googleData) return;
    const { token, id: userId } = googleData.loginByGoogle;
    authVar({ token, isLogined: true, userId });
  }, [googleData]);

  useEffect(() => {
    if (!_authVar || !_authVar.token) return;
    if (_invitedRoomIdVar) {
      saveReceiver({
        variables: {
          room_id: _invitedRoomIdVar,
        },
      });
      invitedRoomIdVar('');
      router.push(`/chat/${_invitedRoomIdVar}`);
    } else router.push(`/list`);
  }, [_authVar]);

  return (
    <section className="flex flex-col items-center">
      <p className="my-6 text-2xl font-semibold leading-relaxed mb-10">
        토끼랑 거북이랑
        <br />
        누가 더 빠를까요?
      </p>
      <button
        id="googleLogin"
        className="flex justify-center items-center rounded-xl w-1/2 py-4 shadow-md hover:text-white hover:bg-google-dark transition-colors"
      >
        <Image src="/images/google.png" alt="구글 로그인" width="20" height="20" />
        <span className="ml-2 text-md">구글로 4초만에 시작하기</span>
      </button>
      <button
        className="flex justify-center items-center rounded-xl w-1/2 py-4 shadow-md mt-3 bg-kakao hover:bg-kakao-dark transition-colors"
        onClick={handleKakaoLogin}
      >
        <Image src="/images/kakao.png" alt="카카오 로그인" width="20" height="20" />
        <span className="ml-2 text-md">카카오로 4초만에 시작하기</span>
      </button>
    </section>
  );
}

export default Login;
