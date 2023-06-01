import * as yup from 'yup';

export const communicationValidationSchema = yup.object().shape({
  message: yup.string().required(),
  date_sent: yup.date().required(),
  sender_id: yup.string().nullable(),
  receiver_id: yup.string().nullable(),
});
