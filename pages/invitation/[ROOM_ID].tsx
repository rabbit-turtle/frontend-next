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
  const { ROOM_ID } = router.query;

  const { saveReceiver, error } = useSaveReceiver();

  useEffect(() => {
    if (!ROOM_ID) return; //나중에 useAuth 활성화하고나면 풀것
    if (!_authVar?.token) {
      invitedRoomIdVar(ROOM_ID as string);
      router.push('/login');
      return;
    }
    saveReceiver({
      variables: {
        room_id: ROOM_ID,
      },
    });
    router.push(`/chat/${ROOM_ID}`);
  }, [_authVar, ROOM_ID]);

  if (!_authVar || !_authVar?.token)
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

export default Invitation;
