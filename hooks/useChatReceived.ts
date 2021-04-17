import { useEffect } from 'react';
import { useApolloClient, gql } from '@apollo/client';
import { GET_CHATS, GET_ROOM } from 'apollo/queries';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { SOCKET_MESSAGE_TYPE } from 'constants/index';

export const useChatReceived = (received: string) => {
  const apolloClient = useApolloClient();
  const router = useRouter();

  useEffect(() => {
    if (!received) return;
    const { message, created_at, ROOM_ID, id, messageType } = JSON.parse(received);
    if (messageType !== SOCKET_MESSAGE_TYPE.chat) return;

    const newChatFromSocket = {
      __typename: 'Chat',
      id,
      content: message,
      isSender: false,
      created_at,
    };

    const existingRoom = apolloClient.readQuery({
      query: GET_ROOM,
      variables: { room_id: ROOM_ID, offset: 0, limit: 20 },
    });

    if (existingRoom) {
      apolloClient.writeQuery({
        query: GET_ROOM,
        variables: { room_id: ROOM_ID, offset: 0, limit: 20 },
        data: {
          room: {
            ...existingRoom.room,
            recentChat: newChatFromSocket,
          },
        },
      });
    } else {
      apolloClient.writeFragment({
        id: `Room:${ROOM_ID}`,
        fragment: gql`
          fragment RecentChat on Room {
            recentChat
          }
        `,
        data: {
          recentChat: newChatFromSocket,
        },
      });
    }

    const isCurrentRoom = router.query.hasOwnProperty('ROOM_ID');
    const isTheSameRoom = router.query['ROOM_ID'] === ROOM_ID;

    if (isCurrentRoom && isTheSameRoom) return;

    toast(`💌 ${message}`, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      onClick: () => router.push(`${isCurrentRoom ? '' : '/chat/'}${ROOM_ID}`),
    });
  }, [received]);
};
