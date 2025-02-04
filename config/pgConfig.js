const { Pool } = require('pg');
require('dotenv').config();

// Read-Only PostgreSQL Connection
const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432, // Default PostgreSQL port
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: { rejectUnauthorized: false }, // Enable SSL for secure connections
});

console.log('✅ PostgreSQL Read-Only DB Connected:', process.env.PG_HOST);

module.exports = pool;
