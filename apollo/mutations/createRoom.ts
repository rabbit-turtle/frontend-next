import { ICoords } from 'types';
import { gql, useMutation } from '@apollo/client';
import { GET_ROOMS } from 'apollo/queries/index';

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
  const [createRoom] = useMutation(CREATE_ROOM, {
    update(cache, { data }) {
      // const newChatFromResponse = data?.createChat;
      const existingRooms = cache.readQuery({
        query: GET_ROOMS,
      });
      console.log('existingRooms', existingRooms);
      console.log('data', data);

      // cache.writeQuery({query: GET_ROOMS, data: {
      //   rooms: [...existingRooms.rooms, data]
      // }})

      // cache.writeQuery({
      //   query: GET_ROOMS,
      //   data: {
      //     room: {
      //       ...existingRoom.room,
      //       recentChat: newChatFromResponse,
      //       chats: [...existingRoom.room.chats, newChatFromResponse],
      //     },
      //   },
      // });
    },
  });

  return { createRoom };
};
