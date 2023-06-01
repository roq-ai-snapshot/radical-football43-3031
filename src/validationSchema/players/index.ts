import * as yup from 'yup';
import { developmentGoalValidationSchema } from 'validationSchema/development-goals';
import { performanceDataValidationSchema } from 'validationSchema/performance-data';
import { trainingExerciseValidationSchema } from 'validationSchema/training-exercises';

export const playerValidationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  date_of_birth: yup.date().required(),
  position: yup.string().required(),
  user_id: yup.string().nullable(),
  academy_id: yup.string().nullable(),
  development_goal: yup.array().of(developmentGoalValidationSchema),
  performance_data: yup.array().of(performanceDataValidationSchema),
  training_exercise: yup.array().of(trainingExerciseValidationSchema),
});
