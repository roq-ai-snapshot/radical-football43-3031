import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getPerformanceData, deletePerformanceDataById } from 'apiSdk/performance-data';
import { PerformanceDataInterface } from 'interfaces/performance-data';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function PerformanceDataListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<PerformanceDataInterface[]>(
    () => '/performance-data',
    () =>
      getPerformanceData({
        relations: ['player'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePerformanceDataById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Performance Data
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('performance_data', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/performance-data/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>id</Th>
                  <Th>data_type</Th>
                  <Th>value</Th>
                  <Th>date</Th>
                  {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>player_id</Th>}

                  {hasAccess('performance_data', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('performance_data', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('performance_data', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.id}</Td>
                    <Td>{record.data_type}</Td>
                    <Td>{record.value}</Td>
                    <Td>{record.date as unknown as string}</Td>
                    {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/players/view/${record.player?.id}`}>{record.player?.id}</Link>
                      </Td>
                    )}

                    {hasAccess('performance_data', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/performance-data/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('performance_data', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/performance-data/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('performance_data', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'performance_data',
  operation: AccessOperationEnum.READ,
})(PerformanceDataListPage);
