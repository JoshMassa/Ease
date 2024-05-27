import { gql } from 'graphql-tag';

const typeDefs = gql`
    type Message {
        id: ID!
        content: String!
        client_offset: Int!
        createdAt: String
        updatedAt: String
    }

    type Query {
        messages: [Message]
    }

    type Mutation {
        addMessage(content: String!, client_offset: Int!): Message
    }
`;

export default typeDefs;