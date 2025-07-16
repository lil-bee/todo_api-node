import * as dotenv from "dotenv";
import { Pool } from "pg";

// Load environment variables
dotenv.config();

export const testDb = new Pool({
  user: "test_user",
  password: "testpassword",
  host: "localhost",
  database: "test_db",
  port: 5432,
});

// Setup sebelum semua test
beforeAll(async () => {
  // Buat tabel yang dibutuhkan untuk testing
  await testDb.query(`
    CREATE TABLE IF NOT EXISTS todos (
      todo_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      priority VARCHAR(20) DEFAULT 'medium',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await testDb.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

// Cleanup setelah semua test selesai
afterAll(async () => {
  await testDb.end();
});
