import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Chatlog from "components/chatlog";
import { TChatlog } from "types";

function Chat({ chatlogFromProps }: { chatlogFromProps: TChatlog[] }) {
  const [user, setUser] = useState("Mengkki");
  const [socket, setSocket] = useState<WebSocket>();
  const [value, setValue] = useState<string>("");
  const [chatlog, setChatlog] = useState<TChatlog[]>(chatlogFromProps);
  const chatPane = useRef(null);

  useEffect(() => {
    const exampleSocket = new WebSocket("ws://www.example.com/socketserver", "protocolOne");
    exampleSocket.onopen = () => {
      exampleSocket.send(
        JSON.stringify({
          ROOM_ID: "어쩌구",
          action: "enterRoom",
        })
      );
    };
    setSocket(socket);
    return () => {
      socket.send(
        JSON.stringify({
          ROOM_ID: "어쩌구",
          action: "leaveRoom",
        })
      );
      socket.close();
    };
  }, []);

  useEffect(() => {
    chatPane.current?.scrollBy({ behavior: "smooth", top: 100 });
  }, [chatlog]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!value) return;
    e.preventDefault();
    // socket.send(
    //   JSON.stringify({
    //     ROOM_ID: "어쩌구",
    //     message: value,
    //     action: "sendMessage",
    //   })
    // );
    setChatlog([...chatlog, { id: Date.now(), user, message: value }]);
    setValue("");
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
        <div className="sticky top-0 flex justify-center items-center h-10 bg-white">모모와의 채팅</div>
        <div className="h-5/6 overflow-auto" ref={chatPane}>
          {chatlog?.map((chat, idx) => (
            <Chatlog key={idx} user={chat.user} message={chat.message} />
          ))}
        </div>
        <form className="sticky bottom-3" onSubmit={handleSubmit}>
          <TextField fullWidth placeholder="채팅해보세염" variant="filled" onChange={handleChange} value={value} />
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:3000/data/chatdata.json");
    const json = await res.json();
    return { props: { chatlogFromProps: json.chats } };
  } catch (error) {
    return { props: { chatlogFromProps: null } };
  }
}

export default Chat;
