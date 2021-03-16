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

function RoomLog({
  id,
  recentChat,
  lastViewedChat,
  roomStatus,
  title,
  location,
  myId,
  receiver,
  inviter,
}: IRoomLog) {
  const router = useRouter();

  const isNewMessage = recentChat?.id !== lastViewedChat?.id && !recentChat?.isSender;
  return (
    <div
      className="flex flex-col px-5 py-5 cursor-pointer"
      onClick={() => router.push(`/chat/${id}`)}
    >
      <div className="flex justify-between items-center text-lg font-bold mb-2">
        <div>
          {inviter.id !== myId ? inviter.name : receiver?.name}
          <span className="w-32 truncate text-base font-semibold mx-2 text-gray-600">{title}</span>
          {isNewMessage && (
            <span className="text-sm font-semibold text-red-500 ml-2 animate-pulse">new</span>
          )}
        </div>
        <span className="text-sm justify-self-end">{PROGRESS[roomStatus.id]}</span>
      </div>
      {recentChat ? (
        <div className="flex justify-between">
          <div className="flex">
            <Image
              src={`/images/${recentChat.isSender ? 'rabbit' : 'turtle'}.png`}
              alt="profile"
              width={20}
              height={20}
            />
            <p className="w-32 text-base font-semibold mx-2 truncate">{recentChat.content}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">
              {dayjs(recentChat.created_at).format('M월 D일 h:mm a')}
            </span>
          </div>
        </div>
      ) : (
        <span className="text-base font-semibold text-gray-400">채팅을 시작해 보세요💬</span>
      )}
    </div>
  );
}

export default RoomLog;
