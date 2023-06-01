import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getCoachById } from 'apiSdk/coaches';
import { Error } from 'components/error';
import { CoachInterface } from 'interfaces/coach';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteTrainingExerciseById } from 'apiSdk/training-exercises';

function CoachViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CoachInterface>(
    () => (id ? `/coaches/${id}` : null),
    () =>
      getCoachById(id, {
        relations: ['user', 'academy', 'training_exercise'],
      }),
  );

  const training_exerciseHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteTrainingExerciseById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Coach Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              first_name: {data?.first_name}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              last_name: {data?.last_name}
            </Text>
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                user: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.id}</Link>
              </Text>
            )}
            {hasAccess('academy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                academy: <Link href={`/academies/view/${data?.academy?.id}`}>{data?.academy?.id}</Link>
              </Text>
            )}
            {hasAccess('training_exercise', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Training Exercise
                </Text>
                <Link href={`/training-exercises/create?coach_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>description</Th>
                        <Th>date_assigned</Th>
                        <Th>date_due</Th>
                        <Th>status</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.training_exercise?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.description}</Td>
                          <Td>{record.date_assigned as unknown as string}</Td>
                          <Td>{record.date_due as unknown as string}</Td>
                          <Td>{record.status}</Td>
                          <Td>
                            <Button>
                              <Link href={`/training-exercises/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/training-exercises/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => training_exerciseHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'coach',
  operation: AccessOperationEnum.READ,
})(CoachViewPage);
