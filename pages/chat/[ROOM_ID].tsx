import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import TextField from '@material-ui/core/TextField';
import Chatlog from 'components/ChatLog';
import { useWebsocket } from 'hooks/useWebsocket';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import NavigationBar from 'components/NavigationBar';
import { useLazyQuery } from '@apollo/client';
import { GET_ROOM } from 'apollo/queries';
import { v4 as uuidv4 } from 'uuid';
import { useChatReceived } from 'hooks/useChatReceived';
import { useCreateChat, CreateChatInput } from 'apollo/mutations/createChat';
import {
  useSaveLastViewedChat,
  SaveLastViewedChatInput,
} from 'apollo/mutations/saveLastViewedChat';

function Chat() {
  const [value, setValue] = useState<string>('');
  const chatEndRef = useRef(null);
  const router = useRouter();
  const { ROOM_ID } = router.query;
  const lastChatId = useRef<string>('');

  const [getRoom, { data }] = useLazyQuery(GET_ROOM);
  const { enterRoom, sendMessage, received, isSocketConnected } = useWebsocket();
  useChatReceived(received);
  const { createChat } = useCreateChat(ROOM_ID as string);
  const { saveLastViewedChat } = useSaveLastViewedChat(ROOM_ID as string);

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
        } as CreateChatInput,
      },
    });
    setValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  return (
    <div className="relative px-6 h-screen">
      <Head>
        <title>채팅</title>
      </Head>
      <NavigationBar title={data?.room.title} />
      <div className="h-5/6 overflow-auto bg-gray-100">
        {data?.room.chats.map(chat => (
          <Chatlog
            key={chat.id}
            isSender={chat.isSender}
            content={chat.content}
            created_at={dayjs(chat.created_at).format('h:mm A')}
          />
        ))}
        <div ref={chatEndRef} />
      </div>
      <form className="sticky bottom-3" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          placeholder="채팅 해 보세요🥕"
          variant="filled"
          onChange={handleChange}
          value={value}
        />
      </form>
    </div>
  );
}

export default Chat;
