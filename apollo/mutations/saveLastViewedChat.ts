import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';

export const SAVE_LAST_VIEWED_CHAT = gql`
  mutation SaveLastViewedChat($saveLastViewedChatData: SaveLastViewedChatInput!) {
    saveLastViewedChat(saveLastViewedChatData: $saveLastViewedChatData) {
      id
      content
      isSender
      created_at
    }
  }
`;

export interface SaveLastViewedChatInput {
  room_id: string;
  chat_id: string;
}

export const useSaveLastViewedChat = (ROOM_ID: string) => {
  const [saveLastViewedChat, { error, data }] = useMutation(SAVE_LAST_VIEWED_CHAT, {
    errorPolicy: 'ignore',
    update(cache, { data }) {
      const lastViewedChat = data?.saveLastViewedChat;

      cache.writeFragment({
        id: `Room:${ROOM_ID}`,
        fragment: gql`
          fragment LastViewedChat on Room {
            lastViewedChat
          }
        `,
        data: {
          lastViewedChat,
        },
      });
    },
  });

  return { saveLastViewedChat };
};
