import React from 'react';
import { IChatlog } from 'types';

function Chatlog({ isSender, content, created_at }: IChatlog) {
  return (
    <div
      className={`flex ${isSender ? 'justify-end' : 'justify-start'}
      items-center my-2 mx-3`}
    >
      <div
        className={`${
          isSender ? 'bg-primary' : 'bg-secondary'
        } rounded-lg w-max max-w-5/6 py-1 px-2 text-lg shadow-sm`}
      >
        {content}
      </div>
    </div>
  );
}

export default Chatlog;
