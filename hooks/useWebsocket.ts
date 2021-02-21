import { useEffect, useState, useRef, useCallback } from 'react';

interface UserWebsocketResult {
  sendMessage: (message: string) => void;
  received: string | object;
}

export const useWebsocket = (ROOM_ID: string): UserWebsocketResult => {
  const socketRef = useRef<WebSocket>();
  const [received, setReceived] = useState<string>('');

  useEffect(() => {
    socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_SERVER);
    const { current: socket } = socketRef;

    socket.onopen = () => {
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
    (message: string) => {
      socketRef.current.send(
        JSON.stringify({
          ROOM_ID,
          message,
          action: 'sendMessage',
        }),
      );
    },
    [socketRef.current],
  );

  return { sendMessage, received };
};
