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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getPlayerById, updatePlayerById } from 'apiSdk/players';
import { Error } from 'components/error';
import { playerValidationSchema } from 'validationSchema/players';
import { PlayerInterface } from 'interfaces/player';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';
import { getUsers } from 'apiSdk/users';
import { getAcademies } from 'apiSdk/academies';
import { developmentGoalValidationSchema } from 'validationSchema/development-goals';
import { performanceDataValidationSchema } from 'validationSchema/performance-data';
import { trainingExerciseValidationSchema } from 'validationSchema/training-exercises';

function PlayerEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerInterface>(
    () => (id ? `/players/${id}` : null),
    () => getPlayerById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PlayerInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePlayerById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PlayerInterface>({
    initialValues: data,
    validationSchema: playerValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Player
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="first_name" mb="4" isInvalid={!!formik.errors?.first_name}>
              <FormLabel>first_name</FormLabel>
              <Input type="text" name="first_name" value={formik.values?.first_name} onChange={formik.handleChange} />
              {formik.errors.first_name && <FormErrorMessage>{formik.errors?.first_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="last_name" mb="4" isInvalid={!!formik.errors?.last_name}>
              <FormLabel>last_name</FormLabel>
              <Input type="text" name="last_name" value={formik.values?.last_name} onChange={formik.handleChange} />
              {formik.errors.last_name && <FormErrorMessage>{formik.errors?.last_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="date_of_birth" mb="4">
              <FormLabel>date_of_birth</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.date_of_birth}
                onChange={(value: Date) => formik.setFieldValue('date_of_birth', value)}
              />
            </FormControl>
            <FormControl id="position" mb="4" isInvalid={!!formik.errors?.position}>
              <FormLabel>position</FormLabel>
              <Input type="text" name="position" value={formik.values?.position} onChange={formik.handleChange} />
              {formik.errors.position && <FormErrorMessage>{formik.errors?.position}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'user_id'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.id}
                </option>
              )}
            />
            <AsyncSelect<AcademyInterface>
              formik={formik}
              name={'academy_id'}
              label={'academy_id'}
              placeholder={'Select Academy'}
              fetcher={getAcademies}
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'player',
  operation: AccessOperationEnum.UPDATE,
})(PlayerEditPage);
