import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.js',
  out: './migrations',
  dialect: 'mysql',
  driver: 'mysql2',
  dbCredentials: {
    host: 'localhost',
    port: 3306,
    user: 'admin',
    password: 'admin',
    database: 'drizzle_db',
  },
});
