import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GOOGLE_LOGIN } from 'apollo/queries';

function Login() {
  const [googleLogin, { called, loading, data }] = useLazyQuery(GOOGLE_LOGIN);

  useEffect(() => {
    const onSuccess = googleUser => {
      const id_token = googleUser.getAuthResponse().id_token;

      googleLogin({ variables: { google_token: id_token } });
    };

    const onFailure = error => {
      console.log(error);
    };

    const initGoogle = () => {
      const { gapi } = window as any;
      gapi?.load('auth2', () => {
        const myauth2 = gapi.auth2.init({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        console.log('init');
        const mybtn = document.querySelector('#loginButton');
        myauth2.attachClickHandler(mybtn, {}, onSuccess, onFailure);
      });
    };
    window.onload = initGoogle;
  }, []);

  console.log('data>>>', data);

  return (
    <>
      <div id="loginButton">로그인버튼</div>
    </>
  );
}

export default Login;
