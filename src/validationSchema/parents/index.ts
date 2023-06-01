import * as yup from 'yup';

export const parentValidationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  user_id: yup.string().nullable(),
});
