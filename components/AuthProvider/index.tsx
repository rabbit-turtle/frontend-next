import React from 'react';
import { useAuth } from 'hooks/useAuth';
import { useReactiveVar } from '@apollo/client';
import { authVar } from 'apollo/store';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  // const _authVar = useReactiveVar(authVar);
  // if (loading || _authVar) return null;

  return <>{children}</>;
}

export default AuthProvider;
