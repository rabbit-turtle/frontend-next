import { useEffect } from 'react';
import { useApolloClient, gql } from '@apollo/client';
import { GET_ROOM } from 'apollo/queries';

export const useChatReceived = (received: string) => {
  const apolloClient = useApolloClient();

  useEffect(() => {
    if (!received) return;
    const { message, created_at, ROOM_ID, id } = JSON.parse(received);
    const newChatFromSocket = {
      __typename: 'Chat',
      id,
      content: message,
      isSender: false,
      created_at,
    };

    const existingRoom = apolloClient.readQuery({
      query: GET_ROOM,
      variables: { room_id: ROOM_ID },
    });

    if (existingRoom) {
      apolloClient.writeQuery({
        query: GET_ROOM,
        variables: { room_id: ROOM_ID },
        data: {
          room: {
            ...existingRoom.room,
            recentChat: newChatFromSocket,
            chats: [...existingRoom.room.chats, newChatFromSocket],
          },
        },
      });

      return;
    }

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
  }, [received]);
};
