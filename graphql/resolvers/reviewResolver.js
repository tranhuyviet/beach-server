import Beach from '../../models/beachModel';
import { reviewValidate } from '../../validate/reviewValidate';
import errorParse from '../../utils/errorParse';
import { UserInputError } from 'apollo-server';

export default {
    Query: {
        // GET ALL REVIEWS BY BEACHNAME
        getReviews: async (_, { beachName }) => {
            try {
                const beach = await Beach.findOne({ name: beachName });

                if (!beach) {
                    throw new UserInputError('GET REVIEWS ERROR - COULD NOT FOUND BEACH');
                }

                console.log(beach.reviews);
                return beach.reviews;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
    },
    Mutation: {
        // CREATE NEW REVIEW
        createReview: async (_, args) => {
            try {
                let errors = {};

                try {
                    await reviewValidate.validate(args, { abortEarly: false });
                } catch (error) {
                    errors = errorParse(error);
                    throw new UserInputError('CREATE REVIEW ERROR - VALIDATE', { errors });
                }

                const { name, comment, rating, beachName } = args;

                const beach = await Beach.findOne({ name: beachName });
                if (!beach) {
                    throw new UserInputError('CREATE REVIEW ERROR - BEACH NOT FOUND');
                }

                beach.reviews.unshift({
                    name,
                    comment,
                    rating,
                    createdAt: new Date().toISOString(),
                });

                await beach.save();

                // const review = new Review({
                //     beachName,
                //     name,
                //     comment,
                //     rating,
                //     createdAt: new Date().toISOString(),
                // });
                // await review.save();
                return beach;
            } catch (error) {
                // console.log(error);
                return error;
            }
        },
    },
};
