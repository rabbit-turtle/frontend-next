import { useEffect, useState } from 'react';

export const useWebsocket = (
  ROOM_ID: string,
  onMessage: (this: WebSocket, ev: MessageEvent<any>) => any,
): WebSocket => {
  const [socket, setSocket] = useState<WebSocket>();

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

    websocket.onmessage = onMessage;

    return () => {
      websocket.close();
    };
  }, []);

  return socket;
};
