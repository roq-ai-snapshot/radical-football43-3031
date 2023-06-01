import * as yup from 'yup';

export const trainingExerciseValidationSchema = yup.object().shape({
  description: yup.string().required(),
  date_assigned: yup.date().required(),
  date_due: yup.date().required(),
  status: yup.string().required(),
  coach_id: yup.string().nullable(),
  player_id: yup.string().nullable(),
});
