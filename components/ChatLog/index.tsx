import React from 'react';
import { IChatlog } from 'types';
import Image from 'next/image';

function Chatlog({ isSender, content, created_at }: IChatlog) {
  const Time = <span className="font-extralight text-xs text-gray-800">{created_at}</span>;
  return (
    <div
      className={`flex ${isSender ? 'justify-end' : 'justify-start'}
      items-end py-2 px-3`}
    >
      {isSender && Time}
      {!isSender && <Image src="/images/turtle.png" alt="turtle profile" width={30} height={30} />}
      <p
        className={`${
          isSender ? 'bg-primary' : 'bg-secondary'
        } rounded-lg min-w-0 max-w-2/3 py-1 px-2 mx-2 text-base shadow-sm break-all`}
      >
        {content}
      </p>
      {!isSender && Time}
    </div>
  );
}

export default Chatlog;
