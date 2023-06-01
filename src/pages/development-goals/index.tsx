import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getDevelopmentGoals, deleteDevelopmentGoalById } from 'apiSdk/development-goals';
import { DevelopmentGoalInterface } from 'interfaces/development-goal';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function DevelopmentGoalListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<DevelopmentGoalInterface[]>(
    () => '/development-goals',
    () =>
      getDevelopmentGoals({
        relations: ['player'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteDevelopmentGoalById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Development Goal
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('development_goal', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/development-goals/create`}>
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
                  <Th>start_date</Th>
                  <Th>end_date</Th>
                  {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>player_id</Th>}

                  {hasAccess('development_goal', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('development_goal', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('development_goal', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.id}</Td>
                    <Td>{record.description}</Td>
                    <Td>{record.start_date as unknown as string}</Td>
                    <Td>{record.end_date as unknown as string}</Td>
                    {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/players/view/${record.player?.id}`}>{record.player?.id}</Link>
                      </Td>
                    )}

                    {hasAccess('development_goal', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/development-goals/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('development_goal', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/development-goals/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('development_goal', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'development_goal',
  operation: AccessOperationEnum.READ,
})(DevelopmentGoalListPage);
