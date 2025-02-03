const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const supabase = require('./config'); // Import Supabase client

const CSV_FILE_PATH = path.join(__dirname, 'files/processed_merged_output_2.csv');  // Update with your CSV filename
const TABLE_NAME = 'leads_collection';  // Supabase table name

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



// const fetch_record = async()=>{
//     try {
//         const { data, error } = await supabase
//             .from(TABLE_NAME)
//             .select({where :{email_id : 'rahul@invact.com'}});
//             console.log(data)
//         // if (error) {
//         //     console.error(`⚠️ Error inserting batch ${i / batchSize + 1}:`, error.message);
//         // } else {
//         //     console.log(`✅ Successfully inserted ${batch.length} records (Batch ${i / batchSize + 1})`);
//         // }
//     } catch (error) {
//         // console.error(`❌ Unexpected error in batch ${i / batchSize + 1}:`, error.message);
//     }

// }

// fetch_record();

// (async () => {
//     const { data, error } = await supabase.from('leads_collection').select('*');
    
//     if (error) {
//         console.error('Error:', error);
//     } else {
//         console.log('Data:', data);
//     }
// })();