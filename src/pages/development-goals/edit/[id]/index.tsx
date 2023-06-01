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
import { getDevelopmentGoalById, updateDevelopmentGoalById } from 'apiSdk/development-goals';
import { Error } from 'components/error';
import { developmentGoalValidationSchema } from 'validationSchema/development-goals';
import { DevelopmentGoalInterface } from 'interfaces/development-goal';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlayerInterface } from 'interfaces/player';
import { getPlayers } from 'apiSdk/players';

function DevelopmentGoalEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DevelopmentGoalInterface>(
    () => (id ? `/development-goals/${id}` : null),
    () => getDevelopmentGoalById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: DevelopmentGoalInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateDevelopmentGoalById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<DevelopmentGoalInterface>({
    initialValues: data,
    validationSchema: developmentGoalValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Development Goal
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
              <FormLabel>description</FormLabel>
              <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
            </FormControl>
            <FormControl id="start_date" mb="4">
              <FormLabel>start_date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.start_date}
                onChange={(value: Date) => formik.setFieldValue('start_date', value)}
              />
            </FormControl>
            <FormControl id="end_date" mb="4">
              <FormLabel>end_date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.end_date}
                onChange={(value: Date) => formik.setFieldValue('end_date', value)}
              />
            </FormControl>
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'development_goal',
  operation: AccessOperationEnum.UPDATE,
})(DevelopmentGoalEditPage);
