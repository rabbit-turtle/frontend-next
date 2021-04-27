import dynamic from 'next/dynamic';
import Head from 'next/head';
const LoginForm = dynamic(() => import('components/LoginForm'));

function LoginPage() {
  return (
    <>
      <Head>
        <title>토끼와거북이 로그인</title>
      </Head>
      <LoginForm />
    </>
  );
}

export default LoginPage;
