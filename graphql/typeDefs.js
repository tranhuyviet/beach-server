import { gql } from 'apollo-server';

export default gql`
    type Beach {
        _id: ID!
        name: String!
        lat: Float!
        lon: Float!
    }

    type Query {
        getBeaches: [Beach]!
    }

    type Mutation {
        createBeach(name: String!, lat: Float!, lon: Float!): Beach!
    }
`;
