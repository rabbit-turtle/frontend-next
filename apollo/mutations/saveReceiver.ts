import { useEffect } from 'react';
import { gql, useMutation, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { invitedRoomIdVar } from 'apollo/store';

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
  const [saveReceiver, { data: savedRoom, error }] = useMutation(SAVE_RECEIVER, {
    errorPolicy: 'all',
  });
  const _invitedRoomIdVar = useReactiveVar(invitedRoomIdVar);
  const router = useRouter();

  useEffect(() => {
    if (!savedRoom) return;
    router.push(`/chat/${_invitedRoomIdVar}`);
    invitedRoomIdVar('');
  }, [savedRoom]);

  useEffect(() => {
    if (!error) return;
    router.push('/list');
    toast.info(`유효하지 않은 채팅방입니다`, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
    });
  }, [error]);

  return { saveReceiver, savedRoom, error };
};
