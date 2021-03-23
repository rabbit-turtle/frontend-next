import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { authVar } from 'apollo/store';
import { GET_ROOM } from 'apollo/queries';
import { useCreateChat, CreateChatInput } from 'apollo/mutations/createChat';
import {
  useSaveLastViewedChat,
  SaveLastViewedChatInput,
} from 'apollo/mutations/saveLastViewedChat';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
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

function Chat() {
  const [value, setValue] = useState<string>('');
  const [isCreateModalOn, setIsCreateModalOn] = useState<boolean>(false);
  const chatEndRef = useRef(null);
  const router = useRouter();
  const { ROOM_ID } = router.query;
  const lastChatId = useRef<string>('');

  const [getRoom, { data }] = useLazyQuery(GET_ROOM);
  const { enterRoom, sendMessage, received, isSocketConnected } = useWebsocket();
  useChatReceived(received);
  const { createChat } = useCreateChat(ROOM_ID as string);
  const { saveLastViewedChat } = useSaveLastViewedChat(ROOM_ID as string);

  const _authVar = useReactiveVar(authVar);

  useEffect(() => {
    if (!ROOM_ID) return;
    getRoom({ variables: { room_id: ROOM_ID } });

    return () => {
      if (!lastChatId.current) return;

      saveLastViewedChat({
        variables: {
          saveLastViewedChatData: {
            room_id: ROOM_ID,
            chat_id: lastChatId.current,
          } as SaveLastViewedChatInput,
        },
      });
    };
  }, [ROOM_ID]);

  useEffect(() => {
    if (!ROOM_ID || !isSocketConnected) return;

    enterRoom(ROOM_ID as string);
  }, [ROOM_ID, isSocketConnected]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    const chatsLength = data?.room.chats.length;
    const lastChat = data?.room.chats[chatsLength - 1];
    if (lastChat) lastChatId.current = lastChat.id;
  }, [data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

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
    <div className="relative">
      <Head>
        <title>채팅</title>
      </Head>
      <div className="sticky -top-0 overflow-hidden">
        <NavigationBar
          title={
            data?.room.inviter?.id !== _authVar?.userId
              ? data?.room.inviter?.name
              : data?.room.receiver?.name
          }
          setIsCreateModalOn={setIsCreateModalOn}
        />
        <MapNavigationBar title={data?.room.title} />
      </div>
      <ChatLogWrapper data={data}>
        {data?.room.chats.map(chat => (
          <Chatlog
            key={chat.id}
            isSender={chat.isSender}
            content={chat.content}
            created_at={dayjs(chat.created_at).format('h:mm A')}
          />
        ))}
        <div ref={chatEndRef} />
      </ChatLogWrapper>
      <form
        className="fixed bottom-0 w-full 2xl:w-512 py-1 flex items-center justify-between bg-gray-100 border-t border-gray-300"
        onSubmit={handleSubmit}
      >
        <MessageInput placeholder="채팅해 보세요🥕" onChange={handleChange} value={value} />
        <span className={`absolute right-2 cursor-pointer ${value ? 'opacity-100' : 'opacity-40'}`}>
          <Send color={'#ef9a9a'} height="25px" width="25px" />
        </span>
      </form>
      {isCreateModalOn && <CreateRoomModal setIsCreateModalOn={setIsCreateModalOn} />}
    </div>
  );
}

export default Chat;

const ChatLogWrapper = styled.div`
  ${props =>
    !props.data ||
    (props.data?.room.chats.length < 10 &&
      css`
        @media (max-height: 700px) {
          height: 450px;
        }
        @media (min-height: 700px) {
          height: 570px;
        }
        @media (min-height: 900px) {
          height: 760px;
        }
      `)}

  background-color: rgba(131, 124, 124, 0.1);
  padding-bottom: 60px;
`;

const MessageInput = styled.input`
  margin: 5px 0 5px 5px;
  width: 85%;
  height: 35px;
  outline: none;
  border-radius: 40px;
  text-indent: 15px;
  border: 1px solid rgba(131, 124, 124, 0.4);
  background-color: white;

  ::placeholder {
    font-size: 16px;
  }

  &:focus {
    border: 1px solid #ef9a9a;
  }
`;
