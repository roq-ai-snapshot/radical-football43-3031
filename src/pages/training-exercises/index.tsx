import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getTrainingExercises, deleteTrainingExerciseById } from 'apiSdk/training-exercises';
import { TrainingExerciseInterface } from 'interfaces/training-exercise';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function TrainingExerciseListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<TrainingExerciseInterface[]>(
    () => '/training-exercises',
    () =>
      getTrainingExercises({
        relations: ['coach', 'player'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteTrainingExerciseById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Training Exercise
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('training_exercise', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/training-exercises/create`}>
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
                  <Th>description</Th>
                  <Th>date_assigned</Th>
                  <Th>date_due</Th>
                  <Th>status</Th>
                  {hasAccess('coach', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>coach_id</Th>}
                  {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>player_id</Th>}

                  {hasAccess('training_exercise', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('training_exercise', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('training_exercise', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.id}</Td>
                    <Td>{record.description}</Td>
                    <Td>{record.date_assigned as unknown as string}</Td>
                    <Td>{record.date_due as unknown as string}</Td>
                    <Td>{record.status}</Td>
                    {hasAccess('coach', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/coaches/view/${record.coach?.id}`}>{record.coach?.id}</Link>
                      </Td>
                    )}
                    {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/players/view/${record.player?.id}`}>{record.player?.id}</Link>
                      </Td>
                    )}

                    {hasAccess('training_exercise', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/training-exercises/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('training_exercise', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/training-exercises/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('training_exercise', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'training_exercise',
  operation: AccessOperationEnum.READ,
})(TrainingExerciseListPage);
