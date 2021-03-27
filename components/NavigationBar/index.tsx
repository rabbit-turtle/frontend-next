import { useState, memo, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import { ROUTES } from 'constants/index';
import { CreateOutline, PersonCircleOutline, ChevronBackOutline } from 'react-ionicons';
import { useClickOutside } from 'hooks/useClickOutside';
import { useLogout } from 'apollo/mutations/logoutFromAllDevices';
import { authVar } from 'apollo/store';

interface NavProps {
  title: string;
  receiver?: string;
  setIsCreateModalOn?: (isModalOn: boolean) => void;
}

function NavigationBar({ title, receiver, setIsCreateModalOn }: NavProps) {
  const router = useRouter();
  const [mode, setMode] = useState<string>(router.pathname.startsWith(ROUTES.map) ? 'map' : 'chat');
  const [isUserMenuOn, setIsUserMenuOn] = useState<boolean>(false);
  const { logout, data, error } = useLogout();
  const userMenuRef = useRef(null);
  const userbtnRef = useRef(null);

  const linkToPage = () => {
    mode === 'map' ? router.back() : router.push('/list');
  };

  const handleEditClick = () => {
    setIsCreateModalOn && setIsCreateModalOn(true);
  };

  const closeUserMenu = () => {
    setIsUserMenuOn(false);
  };

  useClickOutside(userMenuRef, closeUserMenu, userbtnRef);

  const handleLogout = async () => {
    await logout();
    authVar({ isLogined: false, access_token: '', userId: '', name: '', expires_in: 0 });
  };

  return (
    <nav className={`relative flex items-center justify-between py-3 px-7 bg-white z-100`}>
      <div className="cursor-pointer w-4">
        {router.pathname !== '/list' && (
          <ChevronBackOutline color={'#00000'} height="27px" width="27px" onClick={linkToPage} />
        )}
      </div>
      <Typography variant="h6">{title}</Typography>
      {router.pathname !== '/list' && receiver && (
        <span className="cursor-pointer" onClick={() => setIsCreateModalOn(true)}>
          <CreateOutline color={'#00000'} height="25px" width="25px" />
        </span>
      )}
    </nav>
  );
}

export default memo(NavigationBar);
