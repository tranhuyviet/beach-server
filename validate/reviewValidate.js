import * as Yup from 'yup';

const name = Yup.string()
    .min(3, 'Name must be at least 3 characters!')
    .max(50, 'Name cannot be longer than 50 characters!')
    .required('Name cannot be empty!');
const comment = Yup.string()
    .min(3, 'Comment must be at least 3 characters!')
    .max(500, 'Comment cannot be longer than 500 characters!')
    .required('Comment cannot be empty!');
const rating = Yup.number()
    .min(0.5, 'Rating can not be smaller than 0.5!')
    .max(5, 'Rating can not be biger than 5!');

const beachName = Yup.string().required('Beach name can not be empty!');

export const reviewValidate = Yup.object({
    name,
    comment,
    rating,
    beachName,
});
