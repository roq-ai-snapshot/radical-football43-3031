import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getParents, deleteParentById } from 'apiSdk/parents';
import { ParentInterface } from 'interfaces/parent';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function ParentListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<ParentInterface[]>(
    () => '/parents',
    () =>
      getParents({
        relations: ['user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteParentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Parent
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('parent', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/parents/create`}>
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
                  <Th>first_name</Th>
                  <Th>last_name</Th>
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>user_id</Th>}

                  {hasAccess('parent', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('parent', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('parent', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.id}</Td>
                    <Td>{record.first_name}</Td>
                    <Td>{record.last_name}</Td>
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/users/view/${record.user?.id}`}>{record.user?.id}</Link>
                      </Td>
                    )}

                    {hasAccess('parent', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/parents/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('parent', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/parents/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('parent', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'parent',
  operation: AccessOperationEnum.READ,
})(ParentListPage);
