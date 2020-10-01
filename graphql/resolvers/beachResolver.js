import Beach from '../../models/beachModel';
import { UserInputError } from 'apollo-server';
import _ from 'lodash';
import axios from 'axios';

export default {
    Beach: {
        ratingAverage: (parent) => {
            if (parent.reviews.length === 0) return 0;
            return _.meanBy(parent.reviews, (review) => review.rating);
        },
    },
    Query: {
        // GET BEACHES
        getBeaches: async (parent, args) => {
            try {
                const { city, forDogs } = args;

                let query = {};

                if (city && city.length > 0) {
                    query.city = { $in: city };
                }

                if (forDogs && forDogs === 'true') {
                    query.forDogs = true;
                }

                // console.log(query);

                const beaches = await Beach.find(query);

                if (!beaches) throw new UserInputError('Beaches not found');

                return beaches;
            } catch (error) {
                console.log(error);
                return error;
            }
        },

        // GET BEACH BY NAME
        getBeach: async (parent, { name }) => {
            try {
                let beach = await Beach.findOne({ name });

                if (!beach) {
                    throw new UserInputError('GET BEACH ERROR - COULD NOT FOUND BEACH');
                }

                let dataAPI = await axios.get('https://iot.fvh.fi/opendata/uiras/uiras2_v1.json');
                dataAPI = Object.values(dataAPI.data.sensors);
                // console.log('DATA API', dataAPI);
                dataAPI = dataAPI.find((beach) => beach.meta.name === name);
                console.log('DATA', dataAPI);

                beach.data = dataAPI.data;

                return beach;
            } catch (error) {
                console.log(error);
            }
        },
    },

    Mutation: {
        // CREATE BEACH
        createBeach: async (parent, args) => {
            try {
                const { name, lat, lon } = args;

                const beach = await Beach.findOne({ name });

                if (beach) {
                    throw new UserInputError('Beach already exists');
                }

                const newBeach = new Beach({ name, lat, lon, address, city, forDogs });
                await newBeach.save();
                return newBeach;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
    },
};
