import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import TextField from '@material-ui/core/TextField';
import Chatlog from 'components/ChatLog';
import { IChatlog } from 'types';
import { useWebsocket } from 'hooks/useWebsocket';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import NavigationBar from 'components/NavigationBar';

function Chat() {
  const [value, setValue] = useState<string>('');
  const [chatLogs, setChatlog] = useState<IChatlog[]>([]);
  const router = useRouter();
  const { ROOM_ID } = router.query;
  const chatPane = useRef(null);

  const { enterRoom, sendMessage, isConnected, received } = useWebsocket();

  useEffect(() => {
    if (!ROOM_ID || !isConnected) return;

    enterRoom(ROOM_ID as string);
  }, [ROOM_ID, isConnected]);

  useEffect(() => {
    chatPane.current?.scrollBy({ behavior: 'smooth', top: 1000 });
  }, [chatLogs]);

  useEffect(() => {
    if (!received) return;
    const { message, createdAt } = JSON.parse(received);
    setChatlog([
      ...chatLogs,
      { isSender: false, content: message, createdAt: dayjs(createdAt).format('h:mm A') },
    ]);
  }, [received]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!value || !ROOM_ID) return;
    sendMessage(ROOM_ID as string, value);
    setChatlog([
      ...chatLogs,
      { isSender: true, content: value, createdAt: dayjs(new Date()).format('h:mm A') },
    ]);
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
      <NavigationBar title={'채팅'} />
      <div className="h-5/6 overflow-auto bg-gray-100" ref={chatPane}>
        {chatLogs?.map((chat, idx) => (
          <Chatlog
            key={idx}
            isSender={chat.isSender}
            content={chat.content}
            createdAt={chat.createdAt}
          />
        ))}
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
