import { useEffect, useState } from 'react';

interface UserWebsocketResult {
  sendMessage: (message: string) => void;
  received: string | object;
}

export const useWebsocket = (ROOM_ID: string): UserWebsocketResult => {
  const [socket, setSocket] = useState<WebSocket>();
  const [received, setReceived] = useState<string>('');

  useEffect(() => {
    const websocket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_SERVER);
    websocket.onopen = () => {
      setSocket(websocket);
      websocket.send(
        JSON.stringify({
          ROOM_ID,
          action: 'enterRoom',
        }),
      );
    };

    websocket.onerror = () => {
      console.log('websocket 연결 에러');
    };

    websocket.onmessage = (e: MessageEvent) => {
      setReceived(e.data);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    socket.send(
      JSON.stringify({
        ROOM_ID,
        message,
        action: 'sendMessage',
      }),
    );
  };

  return { sendMessage, received };
};
