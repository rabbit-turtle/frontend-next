import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useClipboard = (
  setIsCreateModalOn?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const [ROOM_ID, setRoomId] = useState<string>('');

  const copyToClipBoard = (ROOM_ID: string | undefined) => {
    setRoomId(ROOM_ID);
  };

  useEffect(() => {
    if (!ROOM_ID) return;

    navigator.clipboard
      .writeText(`${window.location.origin}/invitation?ROOM_ID=${ROOM_ID}`)
      .then(() => {
        console.log('copy completed');
      }, console.log);

    toast.info(`초대 링크가 클립보드에 복사되었습니다`, {
      position: 'bottom-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
    });

    setRoomId('');

    if (!setIsCreateModalOn) return;
    setIsCreateModalOn(false);
  }, [ROOM_ID]);

  return { copyToClipBoard };
};
