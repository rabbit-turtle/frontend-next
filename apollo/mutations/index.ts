import { gql } from '@apollo/client';

export const CREATE_ROOM = gql`
  mutation CreateRoom($createRoomData: CreateRoomInput!) {
    createRoom(createRoomData: $createRoomData) {
      id
      title
    }
  }
`;
