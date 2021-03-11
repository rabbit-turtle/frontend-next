import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { invitedRoomId } from 'apollo/store';
import Skeleton from 'components/Skeleton';

function Invitation({ isLogined }: { isLogined: boolean }) {
  const router = useRouter();

  useEffect(() => {
    const { ROOM_ID } = router.query;
    invitedRoomId(ROOM_ID as string);
    if (isLogined) router.push(`/chat/${ROOM_ID}`);
  }, []);

  if (isLogined) return <Skeleton />;
  return (
    <div>
      <main>토끼와 거북이는 로그인을 해야 이용할 수 있어요!</main>
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
