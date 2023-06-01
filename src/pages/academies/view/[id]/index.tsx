import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getAcademyById } from 'apiSdk/academies';
import { Error } from 'components/error';
import { AcademyInterface } from 'interfaces/academy';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteCoachById } from 'apiSdk/coaches';
import { deletePlayerById } from 'apiSdk/players';

function AcademyViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AcademyInterface>(
    () => (id ? `/academies/${id}` : null),
    () =>
      getAcademyById(id, {
        relations: ['user', 'coach', 'player'],
      }),
  );

  const coachHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCoachById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const playerHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePlayerById(id);
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
        Academy Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              name: {data?.name}
            </Text>
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                user: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.id}</Link>
              </Text>
            )}
            {hasAccess('coach', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Coach
                </Text>
                <Link href={`/coaches/create?academy_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>first_name</Th>
                        <Th>last_name</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.coach?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.first_name}</Td>
                          <Td>{record.last_name}</Td>
                          <Td>
                            <Button>
                              <Link href={`/coaches/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/coaches/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => coachHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Player
                </Text>
                <Link href={`/players/create?academy_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>id</Th>
                        <Th>first_name</Th>
                        <Th>last_name</Th>
                        <Th>date_of_birth</Th>
                        <Th>position</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.player?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.id}</Td>
                          <Td>{record.first_name}</Td>
                          <Td>{record.last_name}</Td>
                          <Td>{record.date_of_birth as unknown as string}</Td>
                          <Td>{record.position}</Td>
                          <Td>
                            <Button>
                              <Link href={`/players/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/players/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => playerHandleDelete(record.id)}>Delete</Button>
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
  entity: 'academy',
  operation: AccessOperationEnum.READ,
})(AcademyViewPage);
