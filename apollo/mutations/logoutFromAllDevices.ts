import { gql, useMutation } from '@apollo/client';

export const LOGOUT_FROM_ALL_DEVICES = gql`
  mutation LogoutFromAllDevices {
    logoutFromAllDevices
  }
`;

export const useLogout = () => {
  const [logout, { data, error }] = useMutation(LOGOUT_FROM_ALL_DEVICES);

  return { logout, data, error };
};
