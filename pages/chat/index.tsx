import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import TextField from '@material-ui/core/TextField';
import Chatlog from 'components/chatlog';
import { IChatlog } from 'types';
import { useWebsocket } from 'hooks/useWebsocket';

function Chat({ chatlogFromProps }: { chatlogFromProps: IChatlog[] }) {
  const [user, setUser] = useState('Mengkki');
  const [socket, setSocket] = useState<WebSocket>();
  const [value, setValue] = useState<string>('');
  const [chatlog, setChatlog] = useState<IChatlog[]>(chatlogFromProps);
  const chatPane = useRef(null);

  const mysocket = useWebsocket('test', e => {
    console.log(e.data);
  });

  useEffect(() => {
    chatPane.current?.scrollBy({ behavior: 'smooth', top: 100 });
  }, [chatlog]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!value) return;
    e.preventDefault();
    mysocket.send(
      JSON.stringify({
        ROOM_ID: 'test',
        message: value,
        action: 'sendMessage',
      }),
    );
    setChatlog([...chatlog, { id: Date.now(), user, message: value }]);
    setValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      <Head>
        <title>채팅</title>
      </Head>
      <div className="relative px-6 h-screen">
        <div className="sticky top-0 flex justify-center items-center h-10 bg-white">
          모모와의 채팅
        </div>
        <div className="h-5/6 overflow-auto" ref={chatPane}>
          {chatlog?.map((chat, idx) => (
            <Chatlog key={idx} user={chat.user} message={chat.message} />
          ))}
        </div>
        <form className="sticky bottom-3" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="채팅해보세염"
            variant="filled"
            onChange={handleChange}
            value={value}
          />
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch('http://localhost:3000/data/chatdata.json');
    const json = await res.json();
    return { props: { chatlogFromProps: json.chats } };
  } catch (error) {
    return { props: { chatlogFromProps: null } };
  }
}

export default Chat;
