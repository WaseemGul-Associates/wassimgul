// Runs a .sql file directly against the Supabase Postgres database using SUPABASE_DB_URL.
// Usage: node scripts/run-sql.js path/to/file.sql
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/run-sql.js <path/to/file.sql>');
    process.exit(1);
  }

  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    console.error('SUPABASE_DB_URL is not set in .env.local');
    process.exit(1);
  }

  const sql = fs.readFileSync(path.resolve(file), 'utf8');
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  await client.connect();
  console.log(`Connected. Running ${file} ...`);
  try {
    await client.query(sql);
    console.log('Done.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
