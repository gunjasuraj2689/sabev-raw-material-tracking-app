const { Client } = require('pg');

const client = new Client({
  user: 'postgres.hrusbblafrwwuunakgmr',
  password: 'Sabevrawmaterial@2026',
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

const sql = `
-- Add employee id column to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS id TEXT UNIQUE;

-- Add password column to users if not exists
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;

-- Drop password_hash column if it exists to clean up
ALTER TABLE public.users DROP COLUMN IF EXISTS password_hash;
`;

async function main() {
  try {
    console.log("Connecting to database to alter users table...");
    await client.connect();
    console.log("Connected successfully!");

    await client.query(sql);
    console.log("Altered users table successfully!");
  } catch (err) {
    console.error("Error altering table:", err);
  } finally {
    await client.end();
  }
}

main();
