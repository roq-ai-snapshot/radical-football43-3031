import * as yup from 'yup';

export const developmentGoalValidationSchema = yup.object().shape({
  description: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  player_id: yup.string().nullable(),
});
