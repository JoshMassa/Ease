import { gql } from '@apollo/client';

export const ADD_MESSAGE = gql`
  mutation AddMessage($content: String!, $client_offset: Int!) {
    addMessage(content: $content, client_offset: $client_offset) {
      id
      content
      client_offset
      createdAt
      updatedAt
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      _id
      username
      email
      token
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      _id
      username
      email
      token
    }
  }
`;
