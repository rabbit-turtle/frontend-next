import dynamic from 'next/dynamic';
const LoginForm = dynamic(() => import('components/LoginForm'));

function LoginPage() {
  return <LoginForm />;
}

export default LoginPage;
