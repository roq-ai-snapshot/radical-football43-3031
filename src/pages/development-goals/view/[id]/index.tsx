import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getDevelopmentGoalById } from 'apiSdk/development-goals';
import { Error } from 'components/error';
import { DevelopmentGoalInterface } from 'interfaces/development-goal';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function DevelopmentGoalViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DevelopmentGoalInterface>(
    () => (id ? `/development-goals/${id}` : null),
    () =>
      getDevelopmentGoalById(id, {
        relations: ['player'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Development Goal Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              description: {data?.description}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              start_date: {data?.start_date as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              end_date: {data?.end_date as unknown as string}
            </Text>
            {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                player: <Link href={`/players/view/${data?.player?.id}`}>{data?.player?.id}</Link>
              </Text>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'development_goal',
  operation: AccessOperationEnum.READ,
})(DevelopmentGoalViewPage);
