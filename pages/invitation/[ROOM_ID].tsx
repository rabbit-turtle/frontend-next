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

  const { saveReceiver, error } = useSaveReceiver();

  useEffect(() => {
    // if (!_authVar) return;
    const { ROOM_ID: room_id } = router.query;
    if (_authVar?.token) {
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

export default Invitation;
