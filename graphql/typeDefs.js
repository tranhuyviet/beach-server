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
        winterSwimming: Boolean!
        reviews: [Review]
        ratingAverage: Float
        data: [DataSensor]
        info: String
    }

    type DataSensor {
        temp_air: Float
        temp_water: Float
        time: String
    }

    type Review {
        _id: ID!
        name: String!
        comment: String!
        rating: Float!
        createdAt: String!
    }

    type Query {
        getBeaches(
            city: [String]
            forDogs: String
            winterSwimming: String
            isOver18: String
        ): [Beach]!
        getBeach(name: String!): Beach!
        getReviews(beachName: String!): [Review]!
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
        createReview(name: String!, comment: String!, rating: Float, beachName: String!): Beach!
    }
`;
