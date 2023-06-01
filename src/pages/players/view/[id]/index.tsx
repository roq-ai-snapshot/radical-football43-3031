import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getPlayerById } from 'apiSdk/players';
import { Error } from 'components/error';
import { PlayerInterface } from 'interfaces/player';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteDevelopmentGoalById } from 'apiSdk/development-goals';
import { deletePerformanceDataById } from 'apiSdk/performance-data';
import { deleteTrainingExerciseById } from 'apiSdk/training-exercises';

function PlayerViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerInterface>(
    () => (id ? `/players/${id}` : null),
    () =>
      getPlayerById(id, {
        relations: ['user', 'academy', 'development_goal', 'performance_data', 'training_exercise'],
      }),
  );

  const development_goalHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteDevelopmentGoalById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const performance_dataHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePerformanceDataById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

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
        Player Detail View
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
            <Text fontSize="md" fontWeight="bold">
              date_of_birth: {data?.date_of_birth as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              position: {data?.position}
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
            {hasAccess('development_goal', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Development Goal
                </Text>
                <Link href={`/development-goals/create?player_id=${data?.id}`}>
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
                        <Th>start_date</Th>
                        <Th>end_date</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.development_goal?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.description}</Td>
                          <Td>{record.start_date as unknown as string}</Td>
                          <Td>{record.end_date as unknown as string}</Td>
                          <Td>
                            <Button>
                              <Link href={`/development-goals/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/development-goals/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => development_goalHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('performance_data', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Performance Data
                </Text>
                <Link href={`/performance-data/create?player_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>data_type</Th>
                        <Th>value</Th>
                        <Th>date</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.performance_data?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.data_type}</Td>
                          <Td>{record.value}</Td>
                          <Td>{record.date as unknown as string}</Td>
                          <Td>
                            <Button>
                              <Link href={`/performance-data/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/performance-data/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => performance_dataHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('training_exercise', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Training Exercise
                </Text>
                <Link href={`/training-exercises/create?player_id=${data?.id}`}>
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
  entity: 'player',
  operation: AccessOperationEnum.READ,
})(PlayerViewPage);
