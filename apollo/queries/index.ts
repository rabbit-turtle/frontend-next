import { gql } from '@apollo/client';

export const GOOGLE_LOGIN = gql`
  query LoginByGoogle($google_token: String!) {
    loginByGoogle(google_token: $google_token) {
      id
      name
      created_at
      social_type_id
      token
      profile_url
    }
  }
`;
