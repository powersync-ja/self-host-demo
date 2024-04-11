import { usePowerSyncWatchedQuery } from '@journeyapps/powersync-react';
import { Box, Typography } from '@mui/material';
import { CUSTOMERS_TABLE, CustomerRecord } from '@/library/powersync/AppSchema';
import { ListItemWidget } from '@/components/widgets/ListItemWidget';
import Layout from '@/components/widgets/Layout';

export default function TodoListsPage() {
  const customers = usePowerSyncWatchedQuery<CustomerRecord>(`SELECT * from ${CUSTOMERS_TABLE}`);

  return (
    <Layout>
      <Typography variant="h4">Customers</Typography>
      <Typography>Modify the customers table in Postgres to see changes synced here</Typography>
      <Box>
        {customers.map((c) => (
          <ListItemWidget key={c.id} title={c.name ?? 'Unknown'} />
        ))}
      </Box>
    </Layout>
  );
}
