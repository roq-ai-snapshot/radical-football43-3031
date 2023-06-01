import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createTrainingExercise } from 'apiSdk/training-exercises';
import { Error } from 'components/error';
import { trainingExerciseValidationSchema } from 'validationSchema/training-exercises';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CoachInterface } from 'interfaces/coach';
import { PlayerInterface } from 'interfaces/player';
import { getCoaches } from 'apiSdk/coaches';
import { getPlayers } from 'apiSdk/players';
import { TrainingExerciseInterface } from 'interfaces/training-exercise';

function TrainingExerciseCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TrainingExerciseInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTrainingExercise(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TrainingExerciseInterface>({
    initialValues: {
      description: '',
      date_assigned: new Date(new Date().toDateString()),
      date_due: new Date(new Date().toDateString()),
      status: '',
      coach_id: (router.query.coach_id as string) ?? null,
      player_id: (router.query.player_id as string) ?? null,
    },
    validationSchema: trainingExerciseValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Training Exercise
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <FormControl id="date_assigned" mb="4">
            <FormLabel>date_assigned</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.date_assigned}
              onChange={(value: Date) => formik.setFieldValue('date_assigned', value)}
            />
          </FormControl>
          <FormControl id="date_due" mb="4">
            <FormLabel>date_due</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.date_due}
              onChange={(value: Date) => formik.setFieldValue('date_due', value)}
            />
          </FormControl>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CoachInterface>
            formik={formik}
            name={'coach_id'}
            label={'coach_id'}
            placeholder={'Select Coach'}
            fetcher={getCoaches}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <AsyncSelect<PlayerInterface>
            formik={formik}
            name={'player_id'}
            label={'player_id'}
            placeholder={'Select Player'}
            fetcher={getPlayers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'training_exercise',
  operation: AccessOperationEnum.CREATE,
})(TrainingExerciseCreatePage);
