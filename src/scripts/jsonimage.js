require("dotenv").config(); // Load .env variables

const { createCanvas } = require("canvas");
const fs = require("fs");
const { Client } = require("pg");
const express = require("express");
const path = require("path");

const db1 = new Client({
  user: process.env.PG_USER_1,
  host: process.env.PG_HOST_1,
  database: process.env.PG_DATABASE_1,
  password: process.env.PG_PASSWORD_1,
  port: process.env.PG_PORT_1,
});

// Function to fetch email statistics
async function fetchEmailData() {
  await db1.connect();
  const query = `
    SELECT 
        sent_on::DATE AS sent_date,
        category,
        COUNT(*) AS total_emails,
        COUNT(events->'processed') AS processed_count,
        COUNT(events->'dropped') AS dropped_count,
        COUNT(events->'delivered') AS delivered_count,
        COUNT(events->'deferred') AS deferred_count,
        COUNT(events->'bounce') AS bounce_count,
        COUNT(events->'open') AS opened_count,
        COUNT(events->'click') AS clicked_count,
        COUNT(events->'spam_report') AS spam_report_count,
        COUNT(events->'unsubscribe') AS unsubscribe_count,
        COUNT(events->'group_unsubscribe') AS group_unsubscribe_count,
        COUNT(events->'group_resubscribe') AS group_resubscribe_count,
        COUNT(events->'account_status_change') AS account_status_change_count
    FROM email_logs
    GROUP BY sent_date, category
    ORDER BY sent_date DESC, total_emails DESC
    LIMIT 10;`;

  const result = await db1.query(query);
  await db1.end();
  return result.rows;
}

// Function to create an image from data
async function createImage(data) {
  const width = 1200;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#000000";
  ctx.font = "bold 28px Arial";
  ctx.fillText("Email Statistics Report", 50, 50);

  const headers = ["Date", "Category", "Total", "Processed", "Dropped", "Delivered", "Opened", "Clicked"];
  const startX = 50;
  const startY = 100;
  const columnWidths = [120, 180, 80, 100, 100, 100, 100, 100];

  ctx.font = "bold 16px Arial";
  headers.forEach((header, i) => {
    ctx.fillText(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), startY);
  });

  ctx.font = "14px Arial";
  data.forEach((row, index) => {
    const yPos = startY + 30 * (index + 1);
    const formattedDate = new Date(row.sent_date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    ctx.fillText(formattedDate, startX, yPos);
    ctx.fillText(row.category, startX + columnWidths[0], yPos);
    ctx.fillText(row.total_emails.toString(), startX + columnWidths[0] + columnWidths[1], yPos);
    ctx.fillText(row.processed_count.toString(), startX + columnWidths[0] + columnWidths[1] + columnWidths[2], yPos);
    ctx.fillText(row.dropped_count.toString(), startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], yPos);
    ctx.fillText(row.delivered_count.toString(), startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], yPos);
    ctx.fillText(row.opened_count.toString(), startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4] + columnWidths[5], yPos);
    ctx.fillText(row.clicked_count.toString(), startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4] + columnWidths[5] + columnWidths[6], yPos);
  });

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("email_report.png", buffer);
  console.log("Image created: email_report.png");
}

// Main function
async function main() {
  try {
    const data = await fetchEmailData();
    await createImage(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

const app = express();
const port = 3000;

app.get("/generate-email-report", async (req, res) => {
  await main();
  res.sendFile(path.join(__dirname, "email_report.png"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
