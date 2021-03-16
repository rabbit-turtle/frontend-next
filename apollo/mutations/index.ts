import { gql } from '@apollo/client';
import { ICoords } from 'types/index';

export const CREATE_ROOM = gql`
  mutation CreateRoom($createRoomData: CreateRoomInput!) {
    createRoom(createRoomData: $createRoomData) {
      id
      title
      location
      reserved_time
      completed_time
      roomStatus {
        id
        name
      }
      recentChat {
        id
        content
        isSender
        created_at
      }
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

export interface CreateRoomInput {
  title: string;
  reserved_time?: string;
  location?: ICoords;
}
