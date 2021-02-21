import React from "react";

function Chatlog({ user, message }: { user: string; message: string }) {
  return (
    <div
      className={`flex ${user === "Mengkki" ? "justify-end" : "justify-start"}
      items-center my-2`}>
      <div className={`${user === "Mengkki" ? "bg-pink-100" : "bg-blue-100"} rounded-lg w-max max-w-5/6 py-1 px-2`}>
        {message}
      </div>
    </div>
  );
}

export default Chatlog;
