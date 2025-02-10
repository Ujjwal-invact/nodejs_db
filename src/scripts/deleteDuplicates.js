const supabase = require('../config/config'); // Import Supabase client

const TABLE_NAME = 'leads_collection';  // Supabase table name

// 🚀 Function to find duplicate IDs
const getDuplicateIds = async () => {
    console.log('🔍 Fetching duplicate records...');
    try {
        // Fetch duplicate IDs except the first occurrence (MIN id)
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('id, job_title, date_of_application, name, email_id, phone_number, current_location, preferred_locations, total_experience, curr_company_name, curr_company_designation, department, role, industry, key_skills, annual_salary, notice_period, resume_headline, summary, ug_degree, ug_specialization, ug_university, ug_graduation_year, pg_degree, pg_specialization, pg_university, pg_graduation_year, doctorate_degree, doctorate_specialization, doctorate_university, doctorate_graduation_year, gender, marital_status, home_town, pin_code, work_permit_usa, date_of_birth, permanent_address');

        if (error) {
            console.error('❌ Error fetching records:', error.message);
            return [];
        }

        console.log(`✅ Retrieved ${data.length} records. Identifying duplicates...`);

        // Create a map to track unique rows
        const uniqueRecords = new Map();
        const duplicateIds = [];

        data.forEach((row) => {
            const key = JSON.stringify({
                job_title: row.job_title, date_of_application: row.date_of_application, name: row.name, email_id: row.email_id, phone_number: row.phone_number, current_location: row.current_location, preferred_locations: row.preferred_locations, total_experience: row.total_experience, curr_company_name: row.curr_company_name, curr_company_designation: row.curr_company_designation, department: row.department, role: row.role, industry: row.industry, key_skills: row.key_skills, annual_salary: row.annual_salary, notice_period: row.notice_period, resume_headline: row.resume_headline, summary: row.summary, ug_degree: row.ug_degree, ug_specialization: row.ug_specialization, ug_university: row.ug_university, ug_graduation_year: row.ug_graduation_year, pg_degree: row.pg_degree, pg_specialization: row.pg_specialization, pg_university: row.pg_university, pg_graduation_year: row.pg_graduation_year, doctorate_degree: row.doctorate_degree, doctorate_specialization: row.doctorate_specialization, doctorate_university: row.doctorate_university, doctorate_graduation_year: row.doctorate_graduation_year, gender: row.gender, marital_status: row.marital_status, home_town: row.home_town, pin_code: row.pin_code, work_permit_usa: row.work_permit_usa, date_of_birth: row.date_of_birth, permanent_address: row.permanent_address
            });

            if (uniqueRecords.has(key)) {
                duplicateIds.push(row.id);
            } else {
                uniqueRecords.set(key, row.id);
            }
        });

        console.log(`✅ Found ${duplicateIds.length} duplicate records to delete.`);
        return duplicateIds;
    } catch (error) {
        console.error('❌ Unexpected Error:', error.message);
        return [];
    }
};

// 🚀 Function to delete duplicates in batches
const deleteDuplicateRecords = async () => {
    let batchNumber = 1;

    while (true) {
        const duplicateIds = await getDuplicateIds();

        if (duplicateIds.length === 0) {
            console.log('✅ No more duplicate records found. Exiting...');
            break;
        }

        console.log(`🚀 Deleting ${duplicateIds.length} duplicate records (Batch ${batchNumber})...`);
        const batchSize = 1000; // Batch size to prevent timeout

        for (let i = 0; i < duplicateIds.length; i += batchSize) {
            const batch = duplicateIds.slice(i, i + batchSize);

            try {
                const { error } = await supabase
                    .from(TABLE_NAME)
                    .delete()
                    .in('id', batch);

                if (error) {
                    console.error(`⚠️ Error deleting batch ${i / batchSize + 1}:`, error.message);
                } else {
                    console.log(`✅ Successfully deleted ${batch.length} records (Batch ${i / batchSize + 1})`);
                }
            } catch (error) {
                console.error(`❌ Unexpected error in batch ${i / batchSize + 1}:`, error.message);
            }
        }

        batchNumber++;
    }
};

// Run the delete process
deleteDuplicateRecords();
