import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { invitedRoomIdVar, authVar } from 'apollo/store';
import { useSaveReceiver } from 'apollo/mutations/saveReceiver';
import Skeleton from 'components/Skeleton';
import NavigationBar from 'components/NavigationBar';

function Invitation({ isLogined }: { isLogined: boolean }) {
  const router = useRouter();
  const _authVar = useReactiveVar(authVar);

  const { saveReceiver } = useSaveReceiver();
  // useEffect(() => {
  //   const { ROOM_ID } = router.query;
  //   invitedRoomIdVar(ROOM_ID as string);
  //   if (isLogined) router.push(`/chat/${ROOM_ID}`);
  //   else router.push('/login');
  // }, []);

  //실제로는 useAuth hook에서 authVar를 세팅해줄것임
  useEffect(() => {
    authVar({ token: 'hello', isLogined: true, userId: 'mengkki' });
  }, []);

  useEffect(() => {
    if (!_authVar) return;
    const { ROOM_ID: room_id } = router.query;
    if (_authVar.token) {
      saveReceiver({
        variables: {
          room_id,
        },
      });
      router.push(`/chat/${room_id}`);
      return;
    }
    invitedRoomIdVar(room_id as string);
    router.push('/login');
  }, [_authVar]);

  if (!_authVar || !_authVar.token)
    return (
      <div className="h-screen">
        <Skeleton />
      </div>
    );
  return (
    <main className="px-6">
      <NavigationBar title="" />
      <div className="relative h-full">
        <Skeleton />
      </div>
    </main>
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
