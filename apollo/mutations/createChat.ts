import { gql, useMutation } from '@apollo/client';
import { GET_ROOM } from '../queries/index';

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
        variables: { room_id: ROOM_ID },
      }) as { room: { chats: string[] } };

      cache.writeQuery({
        query: GET_ROOM,
        data: {
          room: {
            ...existingRoom.room,
            recentChat: newChatFromResponse,
            chats: [...existingRoom.room.chats, newChatFromResponse],
          },
        },
      });
    },
  });

  return { createChat };
};
