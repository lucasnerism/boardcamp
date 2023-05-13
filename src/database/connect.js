import pg from "pg";
import "dotenv/config.js";

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

export default db;