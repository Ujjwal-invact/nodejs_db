const { Pool } = require('pg');
const QueryStream = require('pg-query-stream');
const { pipeline } = require('stream/promises');
const ExcelJS = require('exceljs');
require('dotenv').config();

// PostgreSQL connection
const pool = new Pool({
    host: process.env.PG_HOST_1, 
    port: process.env.PG_PORT_1 || 5432, 
    database: process.env.PG_DATABASE_1, 
    user: process.env.PG_USER_1, 
    password: process.env.PG_PASSWORD_1, 
    ssl: { rejectUnauthorized: false }, // Ensure SSL for cloud DBs
    statement_timeout: 0, // No timeout
    query_timeout: 0
});

// 🚀 Function to Stream and Write Data to Excel
const exportLeadsToExcel = async () => {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Leads Data');

        let isHeaderWritten = false;
        let offset = 0;
        const batchSize = 50000; // Fetch 50,000 rows per batch

        while (true) {
            console.log(`🔄 Fetching batch with OFFSET ${offset}...`);

            const query = new QueryStream(`SELECT * FROM leads_collection ORDER BY id LIMIT ${batchSize} OFFSET ${offset}`);
            const stream = client.query(query);
            let batchProcessed = false;

            await pipeline(
                stream,
                async function* (source) {
                    for await (const row of source) {
                        batchProcessed = true;
                        if (!isHeaderWritten) {
                            worksheet.columns = Object.keys(row).map((col) => ({
                                header: col,
                                key: col,
                                width: 20
                            }));
                            isHeaderWritten = true;
                        }
                        worksheet.addRow(row);
                    }
                }
            );

            console.log(`✅ Batch with OFFSET ${offset} processed.`);

            if (!batchProcessed) break; // Stop if no more rows

            offset += batchSize;
        }

        console.log('✅ All data streamed and written to Excel.');

        const filePath = './leads_collection.xlsx';
        await workbook.xlsx.writeFile(filePath);
        console.log(`✅ Excel file saved at: ${filePath}`);
    } catch (error) {
        console.error('❌ Error exporting data:', error);
    } finally {
        client.release();
        await pool.end();
    }
};

// Run the export function
exportLeadsToExcel();