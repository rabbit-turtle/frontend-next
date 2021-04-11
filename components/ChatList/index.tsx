import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { GET_CHATS } from 'apollo/queries';
import Chatlog from 'components/ChatLog';
import {
  useSaveLastViewedChat,
  SaveLastViewedChatInput,
} from 'apollo/mutations/saveLastViewedChat';
import styled from 'styled-components';

const limit = 10;

function ChatList() {
  const router = useRouter();
  const { data: chats, fetchMore } = useQuery(GET_CHATS, {
    variables: {
      room_id: router.query.ROOM_ID,
      limit,
      offset: 0,
    },
    onError: console.log,
    onCompleted: data => {
      offsetRef.current = data.chats.length;
      chatEndRef.current?.scrollIntoView();
    },
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<number>(0);
  const firstChatRef = useRef<HTMLSpanElement>(null);
  const lastChatIdRef = useRef<String>(null);
  const { saveLastViewedChat } = useSaveLastViewedChat(router.query.ROOM_ID as string);

  const observerRef = useRef<IntersectionObserver>(
    new IntersectionObserver(
      async (entries, observer) => {
        if (entries[0].isIntersecting) {
          console.log('intersect', entries[0]);
          await fetchMore({
            variables: { room_id: router.query.ROOM_ID, offset: offsetRef.current, limit },
          });
          chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
          observer.unobserve(entries[0].target);
          if (entries[0].target.id !== firstChatRef.current.id)
            observer.observe(firstChatRef.current);
        }
      },
      { threshold: 0.2 },
    ),
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      saveLastViewedChat({
        variables: {
          saveLastViewedChatData: {
            room_id: router.query.ROOM_ID,
            chat_id: lastChatIdRef.current,
          } as SaveLastViewedChatInput,
        },
      });
    };
  }, []);

  useEffect(() => {
    if (!chats) return;
    if (lastChatIdRef.current !== chats?.chats[chats.chats.length - 1].id) {
      // 새로운 채팅이 추가된경우
      observerRef.current.observe(firstChatRef.current);
      lastChatIdRef.current && chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    offsetRef.current = chats?.chats.length;
    lastChatIdRef.current = chats?.chats[chats?.chats.length - 1].id;
  }, [chats]);

  return (
    <>
      <div className="flex-grow pb-14 bg-gray-100 overflow-auto">
        {chats?.chats.map((chat, idx: number, arr: any[]) => (
          <span key={chat.id}>
            {idx < arr.length - 1 &&
              dayjs(arr[idx].created_at).date() !== dayjs(arr[idx + 1].created_at).date() && (
                <div className="text-center text-gray-500 text-xs">
                  {dayjs(arr[idx + 1].created_at).format('YYYY년 M월 D일')}
                </div>
              )}
            <span id={`chat${chat.id}`} ref={idx === 0 ? firstChatRef : null}>
              <Chatlog
                isSender={chat.isSender}
                content={chat.content}
                created_at={dayjs(chat.created_at).format('h:mm A')}
              />
            </span>
          </span>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div />
    </>
  );
}

export default ChatList;

const MessageInput = styled.input`
  margin: 5px 0 5px 5px;
  width: 85%;
  height: 35px;
  outline: none;
  border-radius: 40px;
  text-indent: 15px;
  font-size: 16px;
  border: 1px solid rgba(131, 124, 124, 0.4);
  background-color: white;

  ::placeholder {
    font-size: 16px;
  }

  &:focus {
    border: 1px solid #ef9a9a;
  }
`;
