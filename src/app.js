// /**
//  * Express server to handle SendGrid webhook events
//  * - Listens for SendGrid webhook triggers
//  * - Filters based on allowed categories
//  * - Checks if email log exists, updates the `events` column
//  * - Stores timestamps in UNIX and IST format
//  * - Adds SendGrid `sg_message_id` in metadata if not present
//  */

// const express = require("express");
// const { Pool } = require("pg");
// const moment = require("moment-timezone");
// require('dotenv').config();
// const app = express();
// app.use(express.json());

// // Database connection using pg Pool
// const pool = new Pool({
// 	user: process.env.PG_USER_1, // Use this as variables below
// 	host: process.env.PG_HOST_1,
// 	database: process.env.PG_DATABASE_1,
// 	password: process.env.PG_PASSWORD_1,
// 	port: process.env.PG_PORT_1, // Change if your PostgreSQL runs on a different port
// });

// // Allowed categories for processing
// const ALLOWED_CATEGORIES = new Set(["dev", "kxdaemail"]);
// // const ALLOWED_CATEGORIES = new Set(["IHDEmail", "kxDaEmail"]);

// app.get('/', (req, res)=> {
//     res.send('Welcome beta ji. Aap taraki ke raste pe chal rahe hai!!')
// })

// // Webhook endpoint
// app.post("/sendgrid-webhook", async (req, res) => {
//   try {
//     console.log(JSON.stringify(req.body,null,2))
//     const events = req.body;

//     for (const event of events) {
//       // Skip processing if the event category is not allowed
//     //   if (!event.category || !ALLOWED_CATEGORIES.has(event.category)) {
//     //     continue;
//     //   }


//     if (!event.category || !event.category.some(cat => ALLOWED_CATEGORIES.has(String(cat).toLowerCase()))) {
//         continue;
//       }
      
    

//       const email = event.email;
//       const sgMessageId = event.sg_message_id;
//       const eventName = event.event;
//       const unixTimestamp = event.timestamp;
//       const istTimestamp = moment.unix(unixTimestamp).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

//       // Check if an entry exists with the same email_id, sent_on, and category
//       // const queryResult = await pool.query(
//       //   `SELECT id, events, metadata FROM email_logs 
//       //    WHERE email_id = $1 AND sent_on = to_timestamp($2) AND category = $3`,
//       //   [email, unixTimestamp, event.category]
//       // );
//       const queryResult = await pool.query(
// 				`SELECT id, events, metadata FROM email_logs 
//          WHERE email_id = $1 AND sg_message_id = $2`,
// 				[email, sgMessageId],
// 			);

//       if (queryResult.rows.length > 0) {
//         // Email log exists, update events
//         const existingEvents = queryResult.rows[0].events || {};
//         existingEvents[eventName] = { unix_timestamp: unixTimestamp, timestamp: istTimestamp };

//         // Update metadata if sg_message_id is missing
//         const existingMetadata = queryResult.rows[0].metadata || {};
//         if (!existingMetadata.sg_message_id) {
//           existingMetadata.sg_message_id = sgMessageId;
//         }

//         await pool.query(
//           `UPDATE email_logs SET events = $1, metadata = $2, updated_at = NOW() WHERE email_id = $3`,
//           [existingEvents, existingMetadata, email]
//         );
//       } else {
//         // Insert new email log
//         const newEvents = { [eventName]: { unix_timestamp: unixTimestamp, timestamp: istTimestamp } };
//         const metadata = { sg_message_id: sgMessageId };


//         await pool.query(
//           `INSERT INTO email_logs (email_id, sent_on, category, events, metadata,sg_message_id) VALUES ($1, to_timestamp($2), $3, $4, $5, $6)`,
//           [email, unixTimestamp, event.category?.[0], newEvents, metadata,sgMessageId]
//         );
//       }
//     }

//     res.status(200).send("OK");
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Start server
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


/**
 * Express server to handle SendGrid webhook events
 * - Listens for SendGrid webhook triggers
 * - Filters based on allowed categories
 * - Checks if email log exists, updates the `events` column
 * - Stores timestamps in UNIX and IST format
 * - Adds SendGrid `sg_message_id` in metadata if not present
 * - Implements robust error handling and logging
 * - Implements database connection retries and timeout settings
 */

const express = require("express");
const { Pool } = require("pg");
const moment = require("moment-timezone");
require("dotenv").config();
const app = express();
app.use(express.json());

// Database connection using pg Pool with timeout and retry settings
const pool = new Pool({
  user: process.env.PG_USER_1,
  host: process.env.PG_HOST_1,
  database: process.env.PG_DATABASE_1,
  password: process.env.PG_PASSWORD_1,
  port: process.env.PG_PORT_1,
  idleTimeoutMillis: 30000 , // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // Timeout connection attempts after 10s
});

// Handle unexpected database errors
displayUnexpectedErrors = (err) => {
  console.error("Unexpected database error:", err);
};
pool.on("error", displayUnexpectedErrors);

// Query execution with retry mechanism
const executeQueryWithRetry = async (query, params, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await pool.query(query, params);
    } catch (error) {
      console.error(`Database query failed (attempt ${i + 1}):`, error);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
    }
  }
};

// Allowed categories for processing
const ALLOWED_CATEGORIES = new Set(["ihd", "kxdaemail"]);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome beta ji. Aap taraki ke raste pe chal rahe hai!!");
});

// Webhook endpoint
app.post("/sendgrid-webhook", async (req, res) => {
  try {
    console.log("Received webhook event:", JSON.stringify(req.body, null, 2));
    const events = req.body;

    if (!Array.isArray(events) || events.length === 0) {
      console.warn("Invalid webhook payload: Expected an array of events.");
      return res.status(400).send("Invalid webhook payload.");
    }

    for (const event of events) {
      try {
        if (!event.category || !event.category.some((cat) => ALLOWED_CATEGORIES.has(String(cat).toLowerCase()))) {
          console.warn("Skipping event due to unallowed category:", event);
          continue;
        }

        const email = event.email;
        const sgMessageId = event.sg_message_id;
        const eventName = event.event;
        const unixTimestamp = event.timestamp;
        const istTimestamp = moment.unix(unixTimestamp).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

        if (!email || !sgMessageId || !eventName || !unixTimestamp) {
          console.warn("Skipping event due to missing required fields:", event);
          continue;
        }

        const queryResult = await executeQueryWithRetry(
          `SELECT id, events, metadata FROM email_logs WHERE email_id = $1 AND sg_message_id = $2`,
          [email, sgMessageId]
        );

        if (queryResult.rows.length > 0) {
          const existingEvents = queryResult.rows[0].events || {};
          existingEvents[eventName] = { unix_timestamp: unixTimestamp, timestamp: istTimestamp };

          const existingMetadata = queryResult.rows[0].metadata || {};
          if (!existingMetadata.sg_message_id) {
            existingMetadata.sg_message_id = sgMessageId;
          }

          await executeQueryWithRetry(
            `UPDATE email_logs SET events = $1, metadata = $2, updated_at = NOW() WHERE email_id = $3`,
            [existingEvents, existingMetadata, email]
          );
          console.log(`Updated email log for: ${email}`);
        } else {
          const newEvents = { [eventName]: { unix_timestamp: unixTimestamp, timestamp: istTimestamp } };
          const metadata = { sg_message_id: sgMessageId };

          await executeQueryWithRetry(
            `INSERT INTO email_logs (email_id, sent_on, category, events, metadata, sg_message_id) VALUES ($1, to_timestamp($2), $3, $4, $5, $6)`,
            [email, unixTimestamp, event.category?.[0], newEvents, metadata, sgMessageId]
          );
          console.log(`Inserted new email log for: ${email}`);
        }
      } catch (eventError) {
        console.error("Error processing individual event:", event, eventError);
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Critical error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
