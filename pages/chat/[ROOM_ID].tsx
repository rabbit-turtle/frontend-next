import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import TextField from '@material-ui/core/TextField';
import Chatlog from 'components/chatlog';
import { IChatlog } from 'types';
import { useWebsocket } from 'hooks/useWebsocket';
import { gql } from '@apollo/client';
import { useRouter } from 'next/router';

function Chat() {
  const [user, setUser] = useState('Mengkki');
  const [value, setValue] = useState<string>('');
  const [chatlog, setChatlog] = useState<IChatlog[]>([]);
  const router = useRouter();
  const { ROOM_ID } = router.query;
  const chatPane = useRef(null);

  const { enterRoom, sendMessage, isConnected, received } = useWebsocket();

  useEffect(() => {
    if (!ROOM_ID || !isConnected) return;

    enterRoom(ROOM_ID as string);
  }, [ROOM_ID, isConnected]);

  useEffect(() => {
    chatPane.current?.scrollBy({ behavior: 'smooth', top: 100 });
  }, [chatlog]);

  useEffect(() => {
    if (!received) return;
    const { message } = JSON.parse(received);
    setChatlog([
      ...chatlog,
      { isSender: false, content: message, created_at: Date.now.toString() },
    ]);
  }, [received]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!value || !ROOM_ID) return;
    sendMessage(ROOM_ID as string, value);
    setChatlog([...chatlog, { isSender: true, content: value, created_at: Date.now().toString() }]);
    setValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  return (
    <>
      <Head>
        <title>채팅</title>
      </Head>
      <div className="relative px-6 h-screen">
        <div className="sticky top-0 flex justify-center items-center h-10">모모와의 채팅</div>
        <div className="h-5/6 overflow-auto bg-gray-100" ref={chatPane}>
          {chatlog?.map((chat, idx) => (
            <Chatlog
              key={idx}
              isSender={chat.isSender}
              content={chat.content}
              created_at={chat.created_at}
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
    </>
  );
}

const AUTH_TEST = gql`
  query {
    authTest
  }
`;

// export const getServerSideProps: GetServerSideProps = async ({
//   query,
//   req,
// }: GetServerSidePropsContext) => {
//   const { ROOM_ID } = query;
//   const cookies = req.cookies;

//   console.log(cookies);
//   setToken(
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrbHU4bXEzNTAwMDFkNm94YnRnZ210aG0iLCJpYXQiOjE2MTQ4MjQ4NTd9.QRyt5ZRtvCs5ZY6MY-2dj4A1rt20arpCly56PoR2E3k',
//   );

//   const apolloClient = initializeApollo('asdf');
//   await apolloClient.query({
//     query: AUTH_TEST,
//   });

//   return {
//     props: {
//       ROOM_ID,
//     },
//   };
// };

export default Chat;
