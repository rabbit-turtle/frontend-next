import { useState, useEffect } from 'react';
import CreateRoomModal from 'components/CreateRoomModal';
import { useQuery } from '@apollo/client';
import { GET_ROOMS } from 'apollo/queries';
import RoomLog from 'components/RoomLog';
import { IRoomLog } from 'types';
import { useWebsocket } from 'hooks/useWebsocket';
import { useChatReceived } from 'hooks/useChatReceived';

function RoomList() {
  const [isCreateModalOn, setIsCreateModalOn] = useState<boolean>(false);
  const { data, loading } = useQuery(GET_ROOMS);
  const { received, enterRoom, isSocketConnected } = useWebsocket();
  useChatReceived(received);

  useEffect(() => {
    if (loading || !data || !isSocketConnected) return;

    data.rooms.forEach(room => {
      enterRoom(room.id);
    });
  }, [data, loading, isSocketConnected]);

  return (
    <div className="relative h-screen transform divide-y-2">
      {data?.rooms.map((room: IRoomLog) => (
        <RoomLog
          key={room.id}
          roomStatus={room.roomStatus}
          recentChat={room.recentChat}
          id={room.id}
        />
      ))}
      {isCreateModalOn ? (
        <CreateRoomModal setIsCreateModalOn={setIsCreateModalOn} />
      ) : (
        <button
          className="absolute right-3 bottom-3 bg-primary w-12 h-12 rounded-50 text-white focus:outline-none"
          onClick={() => setIsCreateModalOn(prev => !prev)}
        >
          +
        </button>
      )}
    </div>
  );
}

export default RoomList;
