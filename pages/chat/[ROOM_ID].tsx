import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authVar } from 'apollo/store';
import { GET_ROOM, GET_CHATS } from 'apollo/queries';
import { useCreateChat, CreateChatInput } from 'apollo/mutations/createChat';
import {
  useSaveLastViewedChat,
  SaveLastViewedChatInput,
} from 'apollo/mutations/saveLastViewedChat';
import { useLazyQuery, useReactiveVar, useQuery } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import styled, { css } from 'styled-components';
import Chatlog from 'components/ChatLog';
import NavigationBar from 'components/NavigationBar';
import MapNavigationBar from 'components/MapNavigationBar';
import { useWebsocket } from 'hooks/useWebsocket';
import { useChatReceived } from 'hooks/useChatReceived';
import { Send } from 'react-ionicons';
import { ALLOWED_CHAT_TYPES } from 'constants/index';
const CreateRoomModal = dynamic(() => import('components/CreateRoomModal'));

const limit = 10;

function Chat() {
  const [value, setValue] = useState<string>('');
  const [isCreateModalOn, setIsCreateModalOn] = useState<boolean>(false);
  const chatEndRef = useRef(null);
  const router = useRouter();
  const { ROOM_ID } = router.query;
  const lastChatId = useRef<string>('');
  const offsetRef = useRef<number>(0);
  const firstChatRef = useRef(null);
  const { data } = useQuery(GET_ROOM, {
    errorPolicy: 'ignore',
    variables: { room_id: ROOM_ID },
  });
  const { data: chats, fetchMore } = useQuery(GET_CHATS, {
    variables: {
      room_id: ROOM_ID,
      limit,
      offset: 0,
    },
    errorPolicy: 'ignore',
    onCompleted: () => {
      chatEndRef.current?.scrollIntoView();
      observerRef.current.observe(firstChatRef.current);
    },
  });
  const observerRef = useRef<IntersectionObserver>(
    new IntersectionObserver(
      async (entries, observer) => {
        if (entries[0].isIntersecting) {
          await fetchMore({
            variables: { room_id: ROOM_ID, offset: offsetRef.current + limit, limit },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return {
                chats: [...fetchMoreResult.chats, ...prev.chats],
              };
            },
          });
          offsetRef.current += limit;
          observer.unobserve(entries[0].target);
          if (entries[0].target.id !== firstChatRef.current.id)
            observer.observe(firstChatRef.current);
        }
      },
      { threshold: 0 },
    ),
  );

  const { enterRoom, sendMessage, received, isSocketConnected } = useWebsocket();
  useChatReceived(received);
  const { createChat } = useCreateChat(ROOM_ID as string);
  const { saveLastViewedChat } = useSaveLastViewedChat(ROOM_ID as string);

  const _authVar = useReactiveVar(authVar);

  //intersection observer 설정, unmount시 lastviewedchat 저장
  useEffect(() => {
    if (!firstChatRef.current) return;

    return () => {
      observerRef.current?.disconnect();
      saveLastViewedChat({
        variables: {
          saveLastViewedChatData: {
            room_id: ROOM_ID,
            chat_id: lastChatId.current,
          } as SaveLastViewedChatInput,
        },
      });
    };
  }, []);

  useEffect(() => {
    if (!ROOM_ID || !isSocketConnected) return;

    enterRoom(ROOM_ID as string);
  }, [ROOM_ID, isSocketConnected]);

  useEffect(() => {
    // chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (offsetRef.current !== 0) return;
    // chatEndRef.current?.scrollIntoView();
    const chatsLength = chats?.chats.length;
    const lastChat = chats?.chats[chatsLength - 1];
    if (lastChat) lastChatId.current = lastChat.id;
  }, [chats]);

  const handleSubmit = (): void => {
    if (!value || !ROOM_ID) return;
    const id = uuidv4();
    const created_at = new Date();
    sendMessage({
      id,
      ROOM_ID: ROOM_ID as string,
      message: value,
      created_at,
    });

    createChat({
      variables: {
        createChatData: {
          id,
          room_id: ROOM_ID,
          content: value,
          created_at,
          chat_type_id: ALLOWED_CHAT_TYPES.NORMAL,
        } as CreateChatInput,
      },
    });
    setValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  return (
    <div className="relative flex flex-col h-screen">
      <Head>
        <title>채팅</title>
      </Head>
      <div className="sticky top-0 z-10 bg-white">
        <NavigationBar
          title={
            data?.room?.inviter?.id !== _authVar?.userId
              ? data?.room?.inviter?.name
              : data?.room?.receiver?.name
          }
          receiver={data?.room.receiver}
          setIsCreateModalOn={setIsCreateModalOn}
        />
        <MapNavigationBar title={data?.room.title} reserved_time={data?.room.reserved_time} />
      </div>
      <ChatLogWrapper data={data}>
        {chats?.chats.map((chat, idx: number) => (
          <span key={chat.id} id={`chat${chat.id}`} ref={idx === 0 ? firstChatRef : null}>
            <Chatlog
              isSender={chat.isSender}
              content={chat.content}
              created_at={dayjs(chat.created_at).format('h:mm A')}
            />
          </span>
        ))}
        <div ref={chatEndRef} />
      </ChatLogWrapper>
      <div />
      <div className="fixed bottom-0 w-full sm:w-448 py-1 flex items-center justify-between bg-gray-100 border-t border-gray-300">
        <MessageInput
          placeholder="채팅해 보세요🥕"
          onChange={handleChange}
          value={value}
          onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSubmit()}
        />
        <span
          className={`absolute right-2 cursor-pointer ${value ? 'opacity-100' : 'opacity-40'}`}
          onClick={handleSubmit}
        >
          <Send color={'#ef9a9a'} height="25px" width="25px" />
        </span>
      </div>
      {isCreateModalOn && (
        <CreateRoomModal
          type="chat"
          id={data?.room.id}
          title={data?.room.title}
          reserved_time={data?.room.reserved_time}
          reserved_location={data?.room.location}
          setIsCreateModalOn={setIsCreateModalOn}
        />
      )}
    </div>
  );
}

export default Chat;

const ChatLogWrapper = styled.div`
  flex-grow: 1;
  background-color: rgba(131, 124, 124, 0.1);
  padding-bottom: 60px;
  overflow: auto;
`;

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
