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
import { createPerformanceData } from 'apiSdk/performance-data';
import { Error } from 'components/error';
import { performanceDataValidationSchema } from 'validationSchema/performance-data';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlayerInterface } from 'interfaces/player';
import { getPlayers } from 'apiSdk/players';
import { PerformanceDataInterface } from 'interfaces/performance-data';

function PerformanceDataCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PerformanceDataInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPerformanceData(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PerformanceDataInterface>({
    initialValues: {
      data_type: '',
      value: 0,
      date: new Date(new Date().toDateString()),
      player_id: (router.query.player_id as string) ?? null,
    },
    validationSchema: performanceDataValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Performance Data
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="data_type" mb="4" isInvalid={!!formik.errors?.data_type}>
            <FormLabel>data_type</FormLabel>
            <Input type="text" name="data_type" value={formik.values?.data_type} onChange={formik.handleChange} />
            {formik.errors.data_type && <FormErrorMessage>{formik.errors?.data_type}</FormErrorMessage>}
          </FormControl>
          <FormControl id="value" mb="4" isInvalid={!!formik.errors?.value}>
            <FormLabel>value</FormLabel>
            <NumberInput
              name="value"
              value={formik.values?.value}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('value', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.value && <FormErrorMessage>{formik.errors?.value}</FormErrorMessage>}
          </FormControl>
          <FormControl id="date" mb="4">
            <FormLabel>date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.date}
              onChange={(value: Date) => formik.setFieldValue('date', value)}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'performance_data',
  operation: AccessOperationEnum.CREATE,
})(PerformanceDataCreatePage);
