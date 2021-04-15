import { gql, useMutation } from '@apollo/client';
import { GET_ROOM } from 'apollo/queries';
import { ICoords } from 'types';

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($updateRoomData: UpdateRoomInput!) {
    updateRoom(updateRoomData: $updateRoomData) {
      reserved_time
      location {
        latitude
        longitude
      }
    }
  }
`;

export interface UpdateRoomInput {
  room_id: string;
  reserved_time: string;
  location?: ICoords;
}

export const useUpdateRoom = (ROOM_ID: string) => {
  const [updateRoom, { error, data: updatedRoom }] = useMutation(UPDATE_ROOM, {
    update(cache, { data }) {
      const changed = data?.updateRoom;

      const existingRoom = cache.readQuery({
        query: GET_ROOM,
        variables: { room_id: ROOM_ID, offset: 0, limit: 10 },
      }) as { room: { chats: string[] } };

      cache.writeQuery({
        query: GET_ROOM,
        data: {
          room: {
            ...existingRoom.room,
            reserved_time: changed.reserved_time,
            location: {
              __typename: 'Coords',
              latitude: changed.location.latitude,
              longitude: changed.location.longitude,
            },
          },
        },
      });
    },
  });
  return { updateRoom, updatedRoom };
};
