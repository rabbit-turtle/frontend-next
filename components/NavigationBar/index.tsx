import { useState, memo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import { ROUTES } from 'constants/index';
import { ArrowBackIosRounded } from '@material-ui/icons';

function NavigationBar({ title }: { title: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<string>(router.pathname.startsWith(ROUTES.map) ? 'map' : 'chat');

  return (
    <nav className="flex items-center justify-between py-3 px-7">
      <span className="cursor-pointer">
        <ArrowBackIosRounded fontSize="small" onClick={() => router.push('/list')} />
      </span>
      <Typography variant="h6">{title}</Typography>
      <Link
        href={
          mode === 'map'
            ? `${ROUTES.chat}/${router.query.ROOM_ID}`
            : `${ROUTES.map}/${router.query.ROOM_ID}`
        }
      >
        <a className="text-primary-dark">{mode === 'map' ? 'chat' : 'map'}</a>
      </Link>
    </nav>
  );
}

export default memo(NavigationBar);
