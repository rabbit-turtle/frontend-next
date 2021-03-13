import React from 'react';
import { ICoords, IRoomLog } from 'types';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router';

const PROGRESS = {
  1: '거래 진행중🐢',
  2: '거래 대기중',
  3: '거래 취소🍅',
  4: '거래 완료🥕',
};

function RoomLog({ id, recentChat, lastViewedChat, roomStatus, title, location }: IRoomLog) {
  const router = useRouter();

  const isNewMessage = recentChat?.id !== lastViewedChat?.id && !recentChat?.isSender;
  return (
    <div
      className="flex flex-col px-5 py-5 cursor-pointer"
      onClick={() => router.push(`/chat/${id}`)}
    >
      <div className="text-lg font-bold mb-2">
        {title}
        {isNewMessage && (
          <span className="text-sm font-semibold text-red-500 ml-2 animate-pulse">new</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span>
          {recentChat ? (
            <>
              <Image
                src={`/images/${recentChat.isSender ? 'rabbit' : 'turtle'}.png`}
                alt="profile"
                width={20}
                height={20}
              />

              <span className="text-base font-semibold mx-2">{recentChat.content}</span>
              <span className="text-sm text-gray-500">
                {dayjs(recentChat.created_at).format('YY/MMM/D h:mm a')}
              </span>
            </>
          ) : (
            <span className="text-base font-semibold text-gray-400">채팅을 시작 해 보세요💬</span>
          )}
        </span>
        <span className="text-sm justify-self-end">{PROGRESS[roomStatus.id]}</span>
      </div>
    </div>
  );
}

export default RoomLog;
