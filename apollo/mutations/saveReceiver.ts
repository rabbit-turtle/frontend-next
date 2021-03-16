import { gql, useMutation } from '@apollo/client';

export const SAVE_RECEIVER = gql`
  mutation SaveReceiver($room_id: String!) {
    saveReceiver(room_id: $room_id) {
      id
      title
      location {
        latitude
        longitude
      }
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

export const useSaveReceiver = () => {
  const [saveReceiver, { data: savedRoom, error }] = useMutation(SAVE_RECEIVER);
  return { saveReceiver, savedRoom, error };
};
