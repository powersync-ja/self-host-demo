import { column, Schema, TableV2 } from '@journeyapps/powersync-sdk-web';

export const CUSTOMERS_TABLE = 'customers';

const customers = new TableV2({
  name: column.text
});

export const AppSchema = new Schema({
  customers
});

export type Database = (typeof AppSchema)['types'];
export type CustomerRecord = Database['customers'];
