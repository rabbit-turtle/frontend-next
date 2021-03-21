import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useQuery, useReactiveVar, gql, useMutation } from '@apollo/client';
import { GET_ROOMS, GET_ROOM } from 'apollo/queries';
import { authVar } from 'apollo/store';
import RoomLog from 'components/RoomLog';
import { IRoomLog } from 'types';
import { useWebsocket } from 'hooks/useWebsocket';
import { useChatReceived } from 'hooks/useChatReceived';
import NavigationBar from 'components/NavigationBar';
const CreateRoomModal = dynamic(() => import('components/CreateRoomModal'));

function RoomList() {
  const [isCreateModalOn, setIsCreateModalOn] = useState<boolean>(false);
  const { data, loading, error } = useQuery(GET_ROOMS);
  const { received, enterRoom, isSocketConnected } = useWebsocket();
  useChatReceived(received);
  const _authVar = useReactiveVar(authVar);

  useEffect(() => {
    if (loading || !data || !isSocketConnected) return;

    data.rooms.forEach(room => {
      enterRoom(room.id);
    });
  }, [data, loading, isSocketConnected]);

  return (
    <>
      <div className="h-screen transform divide-y-2">
        <NavigationBar title={'채팅'} />
        {data?.rooms.map((room: IRoomLog) => (
          <RoomLog
            key={room.id}
            roomStatus={room.roomStatus}
            recentChat={room.recentChat}
            lastViewedChat={room.lastViewedChat}
            title={room.title}
            location={room.location}
            id={room.id}
            myId={_authVar.userId}
            receiver={room.receiver}
            inviter={room.inviter}
          />
        ))}
      </div>
      {isCreateModalOn ? (
        <CreateRoomModal type="list" setIsCreateModalOn={setIsCreateModalOn} />
      ) : (
        <button
          className="fixed right-3 2xl:right-400 bottom-3 bg-primary w-12 h-12 rounded-50 text-white hover:bg-primary-dark focus:outline-none"
          onClick={() => setIsCreateModalOn(prev => !prev)}
        >
          +
        </button>
      )}
    </>
  );
}

export default RoomList;
