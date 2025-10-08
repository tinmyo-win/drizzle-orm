import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';

const connection = await mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'admin',
  password: 'admin',
  database: 'drizzle_db',
});

export const db = drizzle(connection, { schema: { ...schema }, mode: 'default' });
export { connection };
