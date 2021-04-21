import { gql, useMutation } from '@apollo/client';
import { GET_ROOM, GET_CHATS } from '../queries/index';

export const CREATE_CHAT = gql`
  mutation CreateChat($createChatData: CreateChatInput!) {
    createChat(createChatData: $createChatData) {
      id
      content
      isSender
      created_at
      chat_type_id
      sender {
        id
      }
    }
  }
`;

export interface CreateChatInput {
  id: string;
  room_id: string;
  content: string;
  created_at: Date;
  chat_type_id: string;
}

export const useCreateChat = (ROOM_ID: string) => {
  const [createChat] = useMutation(CREATE_CHAT, {
    update(cache, { data }) {
      const newChatFromResponse = data?.createChat;

      const existingRoom = cache.readQuery({
        query: GET_ROOM,
        variables: { room_id: ROOM_ID, offset: 0, limit: 20 },
      }) as { room: { chats: any[] } };

      // console.log('existingRoom', existingRoom, ROOM_ID);

      cache.writeQuery({
        query: GET_ROOM,
        data: {
          room: {
            ...existingRoom.room,
            recentChat: newChatFromResponse,
            chats: [...existingRoom.room.chats, newChatFromResponse],
          },
        },
        variables: { room_id: ROOM_ID, offset: 0, limit: 20 },
      });

      // const existingChats = cache.readQuery({
      //   query: GET_CHATS,
      //   variables: { room_id: ROOM_ID },
      // }) as { chats: any[] };

      // cache.writeQuery({
      //   query: GET_CHATS,
      //   data: {
      //     chats: [...existingChats.chats, newChatFromResponse],
      //   },
      //   variables: {
      //     room_id: ROOM_ID,
      //   },
      // });

      // cache.writeFragment({
      //   id: `Room:${ROOM_ID}`,
      //   fragment: gql`
      //     fragment RecentChat on Room {
      //       recentChat
      //     }
      //   `,
      //   data: {
      //     recentChat: newChatFromResponse,
      //   },
      // });
    },
  });

  return { createChat };
};
