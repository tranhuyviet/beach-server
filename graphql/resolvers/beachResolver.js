import Beach from '../../models/beachModel';
import { UserInputError } from 'apollo-server';

export default {
    Query: {
        // GET BEACHES
        getBeaches: async () => {
            try {
                const beaches = await Beach.find();

                if (!beaches) throw new UserInputError('Beaches not found');

                return beaches;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
    },

    Mutation: {
        // CREATE BEACH
        createBeach: async (_, args) => {
            try {
                const { name, lat, lon } = args;

                const beach = await Beach.findOne({ name });

                if (beach) {
                    throw new UserInputError('Beach already exists');
                }

                const newBeach = new Beach({ name, lat, lon });
                await newBeach.save();
                return newBeach;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
    },
};
