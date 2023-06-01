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
import { getParentById, updateParentById } from 'apiSdk/parents';
import { Error } from 'components/error';
import { parentValidationSchema } from 'validationSchema/parents';
import { ParentInterface } from 'interfaces/parent';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function ParentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ParentInterface>(
    () => (id ? `/parents/${id}` : null),
    () => getParentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ParentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateParentById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ParentInterface>({
    initialValues: data,
    validationSchema: parentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Parent
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
  entity: 'parent',
  operation: AccessOperationEnum.UPDATE,
})(ParentEditPage);
