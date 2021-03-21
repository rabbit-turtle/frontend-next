import React from 'react';
import { useAuth } from 'hooks/useAuth';

function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuth();
  return <>{children}</>;
}

export default AuthProvider;
