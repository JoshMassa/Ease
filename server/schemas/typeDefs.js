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
    status: String!
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

  type Auth {
    token: ID!
    user: User
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
    status: String
  }

  type Query {
    messages: [Message]
    users: [User]
    user(id: ID!): User
    usersByStatus(status: String!): [User]
  }

  type Mutation {
    addMessage(content: String!, client_offset: Int!): Message
    signup(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addFriend(userId: ID!, friendId: ID!): User
    removeFriend(userId: ID!, friendId: ID!): User
    updateUser(id: ID!, input: UserUpdateInput!): User
    updateUserStatus(status: String!): User
    logout: User
  }
`;

export default typeDefs;