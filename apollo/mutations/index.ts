import { gql } from '@apollo/client';

export const CREATE_ROOM = gql`
  mutation CreateRoom($createRoomData: CreateRoomInput!) {
    createRoom(createRoomData: $createRoomData) {
      id
      title
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation CreateChat($createChatData: CreateChatInput!) {
    createChat(createChatData: $createChatData) {
      id
      content
      created_at
    }
  }
`;

export interface CreateChatInput {
  id: string;
  room_id: string;
  content: string;
  created_at: Date;
}
