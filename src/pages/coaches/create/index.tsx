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
import { createCoach } from 'apiSdk/coaches';
import { Error } from 'components/error';
import { coachValidationSchema } from 'validationSchema/coaches';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';
import { getPlayers } from 'apiSdk/players';
import { PlayerInterface } from 'interfaces/player';
import { getUsers } from 'apiSdk/users';
import { getAcademies } from 'apiSdk/academies';
import { CoachInterface } from 'interfaces/coach';

function CoachCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CoachInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCoach(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CoachInterface>({
    initialValues: {
      first_name: '',
      last_name: '',
      user_id: (router.query.user_id as string) ?? null,
      academy_id: (router.query.academy_id as string) ?? null,
      training_exercise: [],
    },
    validationSchema: coachValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Coach
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'coach',
  operation: AccessOperationEnum.CREATE,
})(CoachCreatePage);
