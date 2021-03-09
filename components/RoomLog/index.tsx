import React from 'react';
import { IRoomLog } from 'types';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router';

const PROGRESS = {
  1: '거래 진행중🐢',
  2: '거래 대기중',
  3: '거래 취소🍅',
  4: '거래 완료🥕',
};

function RoomLog({ id, recentChat, roomStatus }: IRoomLog) {
  const router = useRouter();

  return (
    <div
      className="flex justify-between items-center px-5 py-5 cursor-pointer"
      onClick={() => router.push(`/chat/${id}`)}
    >
      <span className="flex items-center">
        {recentChat ? (
          <>
            <Image
              src={`/images/${recentChat.isSender ? 'rabbit' : 'turtle'}.png`}
              alt="profile"
              width={30}
              height={30}
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
      <span className="text-sm">{PROGRESS[roomStatus.id]}</span>
    </div>
  );
}

export default RoomLog;
