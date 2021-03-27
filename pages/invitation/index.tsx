import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { invitedRoomIdVar, authVar } from 'apollo/store';
import { useSaveReceiver } from 'apollo/mutations/saveReceiver';
import Skeleton from 'components/Skeleton';
import NavigationBar from 'components/NavigationBar';

function Invitation({ isLogined }: { isLogined: boolean }) {
  const router = useRouter();
  const _authVar = useReactiveVar(authVar);
  const { ROOM_ID } = router.query;
  const { saveReceiver } = useSaveReceiver();

  useEffect(() => {
    if (!ROOM_ID || !_authVar) return;
    if (!_authVar?.access_token) {
      invitedRoomIdVar(ROOM_ID as string);
      router.push('/login');
      return;
    }
    saveReceiver({
      variables: {
        room_id: ROOM_ID,
      },
    });
  }, [_authVar, ROOM_ID]);

  if (!_authVar || !_authVar?.access_token)
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
