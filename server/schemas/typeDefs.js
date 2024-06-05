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
  }
`;

export default typeDefs;
