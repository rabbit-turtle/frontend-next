import { useState, memo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import { ROUTES } from 'constants/index';
import { ChevronBackOutline } from 'react-ionicons';
import { CreateOutline } from 'react-ionicons';

interface NavProps {
  title: string;
  setIsCreateModalOn?: (isModalOn: boolean) => void;
}

function NavigationBar({ title, setIsCreateModalOn }: NavProps) {
  const router = useRouter();
  const [mode, setMode] = useState<string>(router.pathname.startsWith(ROUTES.map) ? 'map' : 'chat');

  const linkToPage = () => {
    mode === 'map' ? router.back() : router.push('/list');
  };

  return (
    <nav
      className={`flex items-center ${
        router.pathname === '/list' ? 'justify-center' : 'justify-between'
      } py-3 px-7 bg-white z-100`}
    >
      {router.pathname !== '/list' && (
        <span className="cursor-pointer" onClick={linkToPage}>
          <ChevronBackOutline color={'#00000'} height="27px" width="27px" />
        </span>
      )}
      <Typography variant="h6">{title}</Typography>
      {router.pathname !== '/list' && (
        <span className="cursor-pointer" onClick={() => setIsCreateModalOn(true)}>
          <CreateOutline color={'#00000'} height="25px" width="25px" />
        </span>
      )}
    </nav>
  );
}

export default memo(NavigationBar);
