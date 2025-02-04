/**
 * This send csv data to the dedicated table 
 * Only use for send email list data from nportal to leads_collection or similar kind of table
 */

/**
 * This script reads a CSV file, processes its data, and uploads it to a Supabase table.
 * - Parses the CSV file and cleans the data by handling empty values and formatting fields correctly.
 * - Converts specific columns to appropriate data types (e.g., integers, lowercase emails).
 * - Uploads data to Supabase in batches to avoid rate limits.
 * - Provides error handling and logging for debugging and tracking progress.
 */

const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const supabase = require('../config/config'); // Import Supabase client

const CSV_FILE_PATH = path.join(__dirname, 'files/csv.csv');  // Update with your CSV filename
const TABLE_NAME = 'email_logs';  // Supabase table name

// 🚀 Function to parse CSV and insert data into Supabase
const uploadCsvToSupabase = async () => {
    try {
        const records = [];

        console.log(`📂 Reading CSV file: ${CSV_FILE_PATH}`);

        return new Promise((resolve, reject) => {
            fs.createReadStream(CSV_FILE_PATH)
                .pipe(csvParser())
                .on('data', (row) => {
                    // Convert empty strings to NULL and ensure data integrity
                    const cleanedRow = Object.fromEntries(
                        Object.entries(row).map(([key, value]) => {
                            if (value === '') return [key, null]; // Convert empty values to NULL
                            if (key === 'email_id' && value) return [key, value.toLowerCase()]; // Convert email_id to lowercase
                            if (['ug_graduation_year', 'pg_graduation_year', 'doctorate_graduation_year', 'pin_code'].includes(key)) {
                                return [key, value ? parseInt(value, 10) : null]; // Convert to INTEGER
                            }
                            return [key, value];
                        })
                    );

                    records.push(cleanedRow);
                })
                .on('end', async () => {
                    console.log(`✅ Parsed ${records.length} records from CSV.`);

                    if (records.length === 0) {
                        console.log('⚠️ No data to upload.');
                        resolve();
                        return;
                    }

                    // 🚀 Insert records in batches to avoid Supabase rate limits
                    const batchSize = 50;
                    for (let i = 0; i < records.length; i += batchSize) {
                        const batch = records.slice(i, i + batchSize);

                        try {
                            const { data, error } = await supabase
                                .from(TABLE_NAME)
                                .insert(batch);

                            if (error) {
                                console.error(`⚠️ Error inserting batch ${i / batchSize + 1}:`, error.message);
                            } else {
                                console.log(`✅ Successfully inserted ${batch.length} records (Batch ${i / batchSize + 1})`);
                            }
                        } catch (error) {
                            console.error(`❌ Unexpected error in batch ${i / batchSize + 1}:`, error.message);
                        }
                    }

                    resolve();
                })
                .on('error', (error) => reject(error));
        });
    } catch (error) {
        console.error('❌ Error processing CSV file:', error.message);
    }
};

// Run the upload process
uploadCsvToSupabase();



