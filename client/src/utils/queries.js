import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      id
      content
      client_offset
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      _id
      username
      email
      friends {
        _id
        username
      }
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
      status
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      _id
      username
      email
      friends {
        _id
        username
      }
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
      status
    }
  }
`;

export const GET_CURRENT_USER = gql`
query GetCurrentUser {
  currentUser {
    _id
    username
    email
    friends {
      _id
      username
    }
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
    status
  }
}
`;

export const USERS_BY_STATUS = gql`
  query usersByStatus($status: String!) {
    usersByStatus(status: $status) {
      _id
      username
      status
    }
  }
`;