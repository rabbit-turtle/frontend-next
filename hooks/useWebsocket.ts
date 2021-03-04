import { useEffect, useState, useRef, useCallback } from 'react';
import { ICoords } from 'types';
import { SOCKET_MESSAGE_TYPE } from 'constants/index';

interface UserWebsocketResult {
  sendMessage: (message: string | ICoords) => void;
  received: string;
}

export const useWebsocket = (ROOM_ID: string): UserWebsocketResult => {
  const socketRef = useRef<WebSocket>();
  const [received, setReceived] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_SERVER);
    const { current: socket } = socketRef;

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(
        JSON.stringify({
          ROOM_ID,
          action: 'enterRoom',
        }),
      );
    };

    socket.onerror = () => {
      console.log('WebSocket 연결 에러');
    };

    socket.onmessage = (e: MessageEvent) => {
      setReceived(e.data);
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = useCallback(
    (message: string | ICoords) => {
      if (!isConnected) return; // 연결 되기 전에는 sendMessage 못함.
      socketRef.current.send(
        JSON.stringify({
          ROOM_ID,
          message,
          action: 'sendMessage',
          messageType:
            typeof message === 'string' ? SOCKET_MESSAGE_TYPE.chat : SOCKET_MESSAGE_TYPE.map,
        }),
      );
    },
    [socketRef.current, isConnected],
  );

  return { sendMessage, received };
};
