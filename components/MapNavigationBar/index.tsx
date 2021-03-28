import { memo } from 'react';
import { useRouter } from 'next/router';
import { Location } from 'react-ionicons';
import Link from 'next/link';
import { ROUTES } from 'constants/index';
import ProgressBar from 'components/ProgressBar';
import dayjs from 'dayjs';

function MapNavigationBar({ title, reserved_time }: { title: string; reserved_time: string }) {
  const router = useRouter();

  return (
    <Link href={`${ROUTES.map}/[ROOM_ID]`} as={`${ROUTES.map}/${router.query.ROOM_ID}`}>
      <div className="w-full flex items-center justify-between py-1 px-7 bg-white border-t border-gray-200 cursor-pointer">
        <Location color="#b2dfdb" height="37px" width="37px" />
        <div className="w-4/5">
          <p className="text-md truncate">{title}</p>
          <p className="text-primary-dark">
            {dayjs(reserved_time).subtract(9, 'hours').format('YYYY년 M월 D일 h:mm a')}
          </p>
          <ProgressBar type="distance" value={40} />
        </div>
      </div>
    </Link>
  );
}

export default memo(MapNavigationBar);
