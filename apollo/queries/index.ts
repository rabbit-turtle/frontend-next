import { gql } from '@apollo/client';

export const GOOGLE_LOGIN = gql`
  query LoginByGoogle($google_token: String!) {
    loginByGoogle(google_token: $google_token) {
      value
    }
  }
`;

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
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

export const GET_ROOM = gql`
  query GetRoom($room_id: String!, $offset: Int, $limit: Int) {
    room(room_id: $room_id) {
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
      chats(offset: $offset, limit: $limit) {
        id
        isSender
        content
        created_at
      }
    }
  }
`;
