import { useEffect, useState, useCallback } from 'react';
import { ICoords } from 'types';
import { SOCKET_MESSAGE_TYPE } from 'constants/index';
import { useReactiveVar } from '@apollo/client';
import { currentSocketVar, isSocketConnectedVar } from 'apollo/store';

export interface sendMessageInput {
  id?: string;
  ROOM_ID: string;
  message: string | ICoords;
  created_at: Date;
}

interface UseWebsocketResult {
  enterRoom: (ROOM_ID: string) => void;
  sendMessage: (sendMessageData: sendMessageInput) => void;
  isSocketConnected: boolean;
  received: string;
}

export const useWebsocket = (): UseWebsocketResult => {
  const [received, setReceived] = useState<string>('');
  const socket = useReactiveVar(currentSocketVar);
  const isSocketConnected = useReactiveVar(isSocketConnectedVar);

  useEffect(() => {
    if (!socket) {
      currentSocketVar(new WebSocket(process.env.NEXT_PUBLIC_SOCKET_SERVER));
      return;
    }

    socket.onopen = () => {
      console.log('***this should be called only once!***');
      isSocketConnectedVar(true);
    };

    socket.onerror = () => {
      console.log('WebSocket 연결 에러');
    };

    socket.onmessage = (e: MessageEvent) => {
      setReceived(e.data);
    };

    // return () => {
    //   socket.close();
    // };
  }, [socket]);

  const enterRoom = useCallback(
    (ROOM_ID: string) => {
      if (!socket || !isSocketConnected) return;

      socket.send(
        JSON.stringify({
          ROOM_ID,
          action: 'enterRoom',
        }),
      );
    },
    [socket, isSocketConnected],
  );

  const sendMessage = useCallback(
    (sendMessageData: sendMessageInput) => {
      if (!socket || !isSocketConnected) return;

      socket.send(
        JSON.stringify({
          action: 'sendMessage',
          ...sendMessageData,
          messageType:
            typeof sendMessageData.message === 'string'
              ? SOCKET_MESSAGE_TYPE.chat
              : SOCKET_MESSAGE_TYPE.map,
        }),
      );
    },
    [socket, isSocketConnected],
  );

  return { enterRoom, sendMessage, received, isSocketConnected };
};
