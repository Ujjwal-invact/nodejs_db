// const supabase = require('./config');  // db1 (Read & Write)
// const pool = require('./pgConfig');    // db2 (Read-Only)

// const BATCH_SIZE = 50; // Reduced batch size
// const DELAY_MS = 1000;  // Delay between batches

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// const updateIsConverted = async () => {
//     try {
//         console.log('🔍 Fetching email and phone from db2 (students table)...');

//         // Step 1: Fetch all email and phone from db2 (read-only)
//         const result = await pool.query('SELECT email, phone FROM students;');

//         if (!result.rows.length) {
//             console.log('⚠️ No records found in db2 (students). Exiting...');
//             return;
//         }

//         // Convert emails and phones into arrays
//         const emails = result.rows.map(row => row.email).filter(e => e);
//         const phones = result.rows.map(row => row.phone).filter(p => p);

//         console.log(`✅ Retrieved ${emails.length} emails and ${phones.length} phone numbers from db2.`);

//         // Step 2: Process in batches to avoid "414 Request-URI Too Large"
//         const matchingLeads = new Set();

//         console.log('🔍 Checking for matches in db1 (leads_collection)...');

//         // Increase statement timeout
//         await supabase.rpc('set_config', { name: 'statement_timeout', value: '60000' }); // 60 seconds

//         for (let i = 0; i < emails.length; i += BATCH_SIZE) {
//             const emailBatch = emails.slice(i, i + BATCH_SIZE);

//             if (emailBatch.length > 0) {
//                 const { data, error } = await supabase
//                     .from('leads_collection')
//                     .select('id')
//                     .in('email_id', emailBatch);

//                 if (error) {
//                     console.error(`⚠️ Error fetching batch ${i / BATCH_SIZE + 1}:`, error.message);
//                 } else {
//                     data.forEach(lead => matchingLeads.add(lead.id));
//                 }
//             }

//             await delay(DELAY_MS); // Add delay between batches
//         }

//         for (let i = 0; i < phones.length; i += BATCH_SIZE) {
//             const phoneBatch = phones.slice(i, i + BATCH_SIZE);

//             if (phoneBatch.length > 0) {
//                 const { data, error } = await supabase
//                     .from('leads_collection')
//                     .select('id')
//                     .in('phone_number', phoneBatch);

//                 if (error) {
//                     console.error(`⚠️ Error fetching batch ${i / BATCH_SIZE + 1}:`, error.message);
//                 } else {
//                     data.forEach(lead => matchingLeads.add(lead.id));
//                 }
//             }

//             await delay(DELAY_MS); // Add delay between batches
//         }

//         if (!matchingLeads.size) {
//             console.log('✅ No matching leads found in db1. Exiting...');
//             return;
//         }

//         console.log(`✅ Found ${matchingLeads.size} matching leads in db1. Updating is_converted...`);

//         // Step 3: Batch update is_converted = TRUE
//         const leadIds = [...matchingLeads];
//         for (let i = 0; i < leadIds.length; i += BATCH_SIZE) {
//             const batch = leadIds.slice(i, i + BATCH_SIZE);

//             const { error: updateError } = await supabase
//                 .from('leads_collection')
//                 .update({ is_converted: true })
//                 .in('id', batch);

//             if (updateError) {
//                 console.error(`⚠️ Error updating batch ${i / BATCH_SIZE + 1}:`, updateError.message);
//             } else {
//                 console.log(`✅ Successfully updated ${batch.length} records (Batch ${i / BATCH_SIZE + 1})`);
//             }

//             await delay(DELAY_MS); // Add delay between batches
//         }

//     } catch (error) {
//         console.error('❌ Unexpected Error:', error.message);
//     } finally {
//         pool.end(); // Close db2 (PostgreSQL) connection
//     }
// };

// // Run the update process
// updateIsConverted();


const supabase = require('./config');  // db1 (Read & Write)
const pool = require('./pgConfig');    // db2 (Read-Only)

const BATCH_SIZE = 500; // Reduce batch size to prevent API errors

const updateIsConverted = async () => {
    try {
        console.log('🔍 Fetching email and phone from db2 (students table)...');

        // Step 1: Fetch all email and phone from db2 (read-only)
        const result = await pool.query('SELECT email, phone FROM students;');

        if (!result.rows.length) {
            console.log('⚠️ No records found in db2 (students). Exiting...');
            return;
        }

        // Convert emails and phones into arrays & filter out null values
        const emails = result.rows.map(row => row.email).filter(e => e);
        const phones = result.rows.map(row => row.phone).filter(p => p);

        console.log(`✅ Retrieved ${emails.length} emails and ${phones.length} phone numbers from db2.`);

        // Step 2: Process in batches to avoid "Bad Request"
        const matchingLeads = new Set();

        console.log('🔍 Checking for matches in db1 (leads_collection_2)...');

        for (let i = 0; i < emails.length; i += BATCH_SIZE) {
            const emailBatch = emails.slice(i, i + BATCH_SIZE);

            if (emailBatch.length === 0) continue; // Skip empty batch

            const { data, error } = await supabase
                .from('leads_collection_2')
                .select('id')
                .in('email_id', emailBatch);

            if (error) {
                console.error(`⚠️ Error fetching batch ${i / BATCH_SIZE + 1}:`, error.message);
            } else {
                data.forEach(lead => matchingLeads.add(lead.id));
            }
        }

        for (let i = 0; i < phones.length; i += BATCH_SIZE) {
            const phoneBatch = phones.slice(i, i + BATCH_SIZE);

            if (phoneBatch.length === 0) continue; // Skip empty batch

            const { data, error } = await supabase
                .from('leads_collection_2')
                .select('id')
                .in('phone_number', phoneBatch);

            if (error) {
                console.error(`⚠️ Error fetching batch ${i / BATCH_SIZE + 1}:`, error.message);
            } else {
                data.forEach(lead => matchingLeads.add(lead.id));
            }
        }

        if (!matchingLeads.size) {
            console.log('✅ No matching leads found in db1. Exiting...');
            return;
        }

        console.log(`✅ Found ${matchingLeads.size} matching leads in db1. Updating is_converted...`);

        // Step 3: Batch update is_converted = TRUE
        const leadIds = [...matchingLeads];
        for (let i = 0; i < leadIds.length; i += BATCH_SIZE) {
            const batch = leadIds.slice(i, i + BATCH_SIZE);

            const { error: updateError } = await supabase
                .from('leads_collection_2')
                .update({ is_converted: true })
                .in('id', batch);

            if (updateError) {
                console.error(`⚠️ Error updating batch ${i / BATCH_SIZE + 1}:`, updateError.message);
            } else {
                console.log(`✅ Successfully updated ${batch.length} records (Batch ${i / BATCH_SIZE + 1})`);
            }
        }

    } catch (error) {
        console.error('❌ Unexpected Error:', error.message);
    } finally {
        pool.end(); // Close db2 (PostgreSQL) connection
    }
};

// Run the update process
updateIsConverted();
