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
        shower: Boolean!
        toilet: Boolean!
        restaurant: Boolean!
        children: Boolean!
        changing: Boolean!
        guard: Boolean!
        fitness: Boolean!
        reviews: [Review]
        ratingAverage: Float
        data: [DataSensor]
        info: String
        hslUrl: String
        mapsUrl: String
        noAlgae: String
        sighting: Sighting
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

    type Sighting {
        distance: String
        date: String
        text: String
    }

    type Query {
        getBeaches(
            city: [String]
            forDogs: String
            winterSwimming: String
            shower: String
            toilet: String
            restaurant: String
            children: String
            changing: String
            guard: String
            fitness: String
            isOver18: String
            noAlgae: String
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
