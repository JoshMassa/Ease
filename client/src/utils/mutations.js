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

export const ADD_FRIEND = gql`
  mutation AddFriend($userId: ID!, $friendId: ID!) {
    addFriend(userId: $userId, friendId: $friendId) {
      _id
      username
      email
      friends {
        _id
        username
      }
    }
  }
`;

export const REMOVE_FRIEND = gql`
  mutation RemoveFriend($userId: ID!, $friendId: ID!) {
    removeFriend(userId: $userId, friendId: $friendId) {
      _id
      username
      email
      friend {
        _id
        username
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      _id
      username
      email
      firstName
      lastName
      city
      state
      country
      aboutMe
      profilePicture
      university
      major
      title
      company
    }
  }
`;
