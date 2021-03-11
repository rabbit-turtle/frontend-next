import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import { invitedRoomId } from 'apollo/store';
import Skeleton from 'components/Skeleton';
import NavigationBar from 'components/NavigationBar';
import LoginForm from 'components/LoginForm';

function Invitation({ isLogined }: { isLogined: boolean }) {
  const router = useRouter();

  useEffect(() => {
    const { ROOM_ID } = router.query;
    invitedRoomId(ROOM_ID as string);
    if (isLogined) router.push(`/chat/${ROOM_ID}`);
  }, []);

  if (isLogined)
    return (
      <main className="px-6">
        <NavigationBar title="" />
        <div className="relative h-full">
          <Skeleton />
        </div>
      </main>
    );
  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center pb-6">
        <Typography variant="h6">🐰 토끼와 거북이는 로그인을 해야 이용할 수 있어요! 🐢</Typography>
      </div>
      <LoginForm />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const isLogined = context.req.cookies.token ? true : false;

  return {
    props: {
      isLogined: false,
    },
  };
};

export default Invitation;
