import * as yup from 'yup';

export const performanceDataValidationSchema = yup.object().shape({
  data_type: yup.string().required(),
  value: yup.number().integer().required(),
  date: yup.date().required(),
  player_id: yup.string().nullable(),
});
