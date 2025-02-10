require('dotenv').config();
const { Pool } = require('pg');


console.log("PG_USER:", process.env.PG_USER_WALTON);
console.log("PG_HOST:", process.env.PG_HOST_WALTON);
console.log("PG_DATABASE:", process.env.PG_DATABASE_WALTON);
console.log("PG_PASSWORD:", process.env.PG_PASSWORD_WALTON);
console.log("PG_PORT:", process.env.PG_PORT_WALTON);

const client = new Pool({
  user: process.env.PG_USER_WALTON,
  host: process.env.PG_HOST_WALTON,
  database: process.env.PG_DATABASE_WALTON,
  password: process.env.PG_PASSWORD_WALTON,
  port: Number(process.env.PG_PORT_WALTON),
//   ssl: { rejectUnauthorized: false },  // ✅ Enable SSL
//   ssl: false 
});

client.connect()
  .then(() => console.log("Connected successfully"))
  .catch(err => console.error("Connection error", err))
  .finally(() => client.end());
