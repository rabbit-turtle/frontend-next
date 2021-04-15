import React, { useCallback, useEffect, useRef, useMemo, memo } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useApolloClient, useLazyQuery, gql } from '@apollo/client';
import dayjs from 'dayjs';
import { GET_CHATS, GET_ROOM, GET_ROOMS } from 'apollo/queries';
import Chatlog from 'components/ChatLog';
import {
  useSaveLastViewedChat,
  SaveLastViewedChatInput,
} from 'apollo/mutations/saveLastViewedChat';
import { throttle } from 'lodash';
import styled from 'styled-components';

const limit = 10;

interface IChat {
  id?: string;
  content?: string;
  created_at?: string;
  room_id?: string;
  isSender?: boolean;
  chat_type_id?: string;
}

interface IChatList {
  chats?: IChat[];
  isChatAdded: boolean;
  setIsChatAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatList({ chats, isChatAdded, setIsChatAdded }: IChatList) {
  const router = useRouter();
  const { ROOM_ID } = router.query;
  const {} = useQuery(GET_ROOM, {
    variables: {
      room_id: ROOM_ID,
      offset: 0,
      limit,
    },
    onCompleted: data => {
      listRef.current.scrollTo({ top: 2000 }); // 맨 처음 들어왔을 때 맨 아래로 스크롤 내림
    },
  });

  const [paginate, { client }] = useLazyQuery(GET_CHATS, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      if (!data.chats.length) {
        observerRef.current.disconnect();
        return;
      }
      const existingRoom = client.readQuery({
        query: GET_ROOM,
        variables: { room_id: ROOM_ID, offset: 0, limit: 10 },
      }) as { room: { chats: any[] } };

      if (existingRoom.room.chats[0].id === data.chats[0].id) return;

      client.writeQuery({
        query: GET_ROOM,
        data: {
          room: {
            ...existingRoom.room,
            chats: [...data.chats, ...existingRoom.room.chats],
          },
        },
        variables: { room_id: ROOM_ID, offset: 0, limit: 10 },
      });
    },
  });

  const chatTopRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<number>(chats?.length || 0);
  const firstChatRef = useRef<HTMLSpanElement>(null);
  const prevFirstChatIdRef = useRef<String>('');
  const listRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightMinusTopRef = useRef<number>(0);
  const lastChatIdRef = useRef<String>(null);
  const { saveLastViewedChat } = useSaveLastViewedChat(ROOM_ID as string);
  const observerRef = useRef<IntersectionObserver>(null);

  useEffect(() => {
    return () => {
      console.log('save lastviewed', lastChatIdRef.current);
      saveLastViewedChat({
        variables: {
          saveLastViewedChatData: {
            room_id: ROOM_ID,
            chat_id: lastChatIdRef.current,
          },
        },
      });
    };
  }, []);

  useEffect(() => {
    if (!listRef.current) return;

    const intersectionObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          const { scrollHeight, scrollTop } = listRef.current;
          prevScrollHeightMinusTopRef.current = scrollHeight - scrollTop;
          paginate({
            variables: {
              room_id: ROOM_ID,
              limit,
              offset: offsetRef.current,
            },
          });
        }
      },
      {
        threshold: 1,
      },
    );
    intersectionObserver.observe(chatTopRef.current);
    observerRef.current = intersectionObserver;
  }, [listRef]);

  useEffect(() => {
    if (!chats?.length) return;
    offsetRef.current = chats?.length || 0;

    lastChatIdRef.current = chats[chats.length - 1].id;

    if (isChatAdded) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsChatAdded(false);
      return;
    }
    listRef.current.scrollTop = listRef.current.scrollHeight - prevScrollHeightMinusTopRef.current;
    prevFirstChatIdRef.current = chats[0].id;
    return;
  }, [chats]);

  return (
    <>
      <div ref={listRef} className="flex-grow bg-gray-100 overflow-auto mb-12">
        <div ref={chatTopRef} />
        {chats?.map((chat, idx: number, arr: IChat[]) => (
          <span key={chat.id}>
            <span id={`chat${chat.id}`} ref={idx === 0 ? firstChatRef : null}>
              <Chatlog
                isSender={chat.isSender}
                content={chat.content}
                created_at={dayjs(chat.created_at).format('h:mm A')}
              />
            </span>
            {idx < arr.length - 1 &&
              dayjs(arr[idx].created_at).date() !== dayjs(arr[idx + 1].created_at).date() && (
                <div className="text-center text-gray-500 text-xs">
                  {dayjs(arr[idx + 1].created_at).format('YYYY년 M월 D일')}
                </div>
              )}
          </span>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div />
    </>
  );
}

export default memo(ChatList);
