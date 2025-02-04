//Mark is_converted comuln as true is the email or phone is present in students table of prod-database
/**
 * This script updates the `is_converted` field in db1 (leads_collection_2) based on matching records from db2 (students).
 * - Fetches all email and phone numbers from the read-only `students` table in db2.
 * - Searches for matches in db1 (leads_collection_2) using emails and phone numbers.
 * - Updates the `is_converted` flag to `true` for all matching records in db1.
 * - Processes data in batches to prevent API errors and handle large datasets efficiently.
 * - Implements error handling and logging for better monitoring.
 */



const supabase = require('../config/config');  // db1 (Read & Write)
const pool = require('../config/pgConfig');    // db2 (Read-Only)

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
