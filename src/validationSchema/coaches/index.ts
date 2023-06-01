import * as yup from 'yup';
import { trainingExerciseValidationSchema } from 'validationSchema/training-exercises';

export const coachValidationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  user_id: yup.string().nullable(),
  academy_id: yup.string().nullable(),
  training_exercise: yup.array().of(trainingExerciseValidationSchema),
});
