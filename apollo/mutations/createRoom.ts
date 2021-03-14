import { gql, useMutation } from '@apollo/client';
import { GET_ROOMS } from 'apollo/queries/index';
import { ICoords } from 'types';

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

export interface CreateRoomInput {
  title: string;
  reserved_time?: string;
  location?: ICoords;
}

export const useCreateRoom = () => {
  const [createRoom, { data: createdRoom }] = useMutation(CREATE_ROOM, {
    update(cache, { data }) {
      const existingRooms = cache.readQuery({
        query: GET_ROOMS,
      }) as { rooms: any[] }; // 사실은 ROOM[]인데...눈물

      cache.writeQuery({
        query: GET_ROOMS,
        data: {
          rooms: [data.createRoom, ...existingRooms.rooms],
        },
      });
    },
  });

  return { createRoom, createdRoom };
};
