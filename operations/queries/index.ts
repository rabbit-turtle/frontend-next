import { gql } from '@apollo/client';

export const GOOGLE_LOGIN = gql`
  query LoginByGoogle($google_token: String!) {
    loginByGoogle(google_token: $google_token) {
      value
    }
  }
`;
