import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { invitedRoomIdVar } from 'apollo/store';
import Skeleton from 'components/Skeleton';
import NavigationBar from 'components/NavigationBar';

function Invitation({ isLogined }: { isLogined: boolean }) {
  const router = useRouter();

  useEffect(() => {
    const { ROOM_ID } = router.query;
    invitedRoomIdVar(ROOM_ID as string);
    if (isLogined) router.push(`/chat/${ROOM_ID}`);
    else router.push('/login');
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
    <div className="h-screen">
      <Skeleton />
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
