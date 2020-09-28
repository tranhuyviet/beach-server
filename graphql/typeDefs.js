import { gql } from 'apollo-server';

export default gql`
    type Beach {
        _id: ID!
        name: String!
        lat: Float!
        lon: Float!
        address: String!
        city: String!
        forDogs: Boolean!
    }

    type Query {
        getBeaches(city: [String], forDogs: String): [Beach]!
    }

    type Mutation {
        createBeach(
            name: String!
            lat: Float!
            lon: Float!
            address: String!
            city: String!
            forDogs: Boolean!
        ): Beach!
    }
`;
