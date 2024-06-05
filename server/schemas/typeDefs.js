import { gql } from "graphql-tag";

const typeDefs = gql`
  type Message {
    id: ID!
    content: String!
    client_offset: Int!
    createdAt: String
    updatedAt: String
    user: User!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    token: String
    friends: [User]
    firstName: String
    lastName: String
    city: String
    state: String
    country: String
    aboutMe: String
    profilePicture: String
    university: String
    major: String
    title: String
    company: String
  }

  input UserUpdateInput {
    username: String
    email: String
    firstName: String
    lastName: String
    city: String
    state: String
    country: String
    aboutMe: String
    profilePicture: String
    university: String
    major: String
    title: String
    company: String
  }

  type Query {
    messages: [Message]
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    addMessage(content: String!, client_offset: Int!): Message
    signup(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): User!
    addFriend(userId: ID!, friendId: ID!): User
    removeFriend(userId: ID!, friendId: ID!): User
    updateUser(id: ID!, input: UserUpdateInput!): User
  }
`;

export default typeDefs;
