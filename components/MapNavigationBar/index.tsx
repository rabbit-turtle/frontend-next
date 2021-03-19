import { useRouter } from 'next/router';
import { Location } from 'react-ionicons';
import Link from 'next/link';
import { ROUTES } from 'constants/index';
import ProgressBar from 'components/ProgressBar';

function MapNavigationBar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <Link href={`${ROUTES.map}/${router.query.ROOM_ID}`}>
      <div className="2xl:w-512 top-13 w-full flex items-center justify-between py-3 px-7 bg-white border-t border-gray-200 cursor-pointer">
        <Location color="#b2dfdb" height="37px" width="37px" />
        <div className="w-4/5">
          <p className="mt-4 text-lg">{title}</p>
          <ProgressBar type="distance" value={40} />
        </div>
      </div>
    </Link>
  );
}

export default MapNavigationBar;
