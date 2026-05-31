import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
  useNullAsDefault: true,
  migrations: {
    directory: './src/database/migrations',
  },
});

export default db;