// /**
//  * This script transfers data from db1.leads_collection_2 to db2.leads_collection in batches using the pg package.
//  * Was used to transfer data from my personal db to data-mart db
//  */

const { Client } = require('pg');

// Database connection configurations
const db1Config = {
  user: 'postgres.oemyktdkqsrsuuudswog',
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  database: 'postgres',
  password: '-5YLkD.ERRzp7Bv',
  port: 5432,
};

const db2Config = {
  user: 'postgres.bbtywinqgjripmjsgcjp',
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  database: 'postgres',
  password: 'IqwVdXGb6JhHMiK',
  port: 5432,
};

const BATCH_SIZE = 50; // Define batch size

const transferData = async () => {
  const clientDB1 = new Client(db1Config);
  const clientDB2 = new Client(db2Config);

  try {
    await clientDB1.connect();
    console.log('✅ Connected to Source DB (db1).');

    await clientDB2.connect();
    console.log('✅ Connected to Destination DB (db2).');

    // Fetch total record count
    const countQuery = `SELECT COUNT(*) FROM leads_collection_2 WHERE id > 1281117;`;
    const countResult = await clientDB1.query(countQuery);
    const totalRecords = parseInt(countResult.rows[0].count, 10);

    if (totalRecords === 0) {
      console.log('⚠️ No records found in leads_collection_2.');
      return;
    }

    console.log(`📊 Found ${totalRecords} records. Transferring in batches of ${BATCH_SIZE}...`);

    let offset = 0;
    while (offset < totalRecords) {
      const query = `SELECT * FROM leads_collection_2 ORDER BY id LIMIT ${BATCH_SIZE} OFFSET ${offset};`;
      const { rows } = await clientDB1.query(query);

      if (rows.length === 0) break;

      console.log(`🚀 Transferring batch ${offset / BATCH_SIZE + 1}...`);

      const insertQuery = `
        INSERT INTO leads_collection (
          job_title, date_of_application, name, email_id, phone_number, current_location, 
          preferred_locations, total_experience, curr_company_name, curr_company_designation, 
          department, role, industry, key_skills, annual_salary, notice_period, resume_headline, 
          summary, ug_degree, ug_specialization, ug_university, ug_graduation_year, 
          pg_degree, pg_specialization, pg_university, pg_graduation_year, 
          doctorate_degree, doctorate_specialization, doctorate_university, doctorate_graduation_year, 
          gender, marital_status, home_town, pin_code, work_permit_usa, date_of_birth, 
          permanent_address, is_converted
        ) VALUES 
        ${rows.map((_, i) => `($${i * 38 + 1}, $${i * 38 + 2}, $${i * 38 + 3}, $${i * 38 + 4}, $${i * 38 + 5},
                           $${i * 38 + 6}, $${i * 38 + 7}, $${i * 38 + 8}, $${i * 38 + 9}, $${i * 38 + 10},
                           $${i * 38 + 11}, $${i * 38 + 12}, $${i * 38 + 13}, $${i * 38 + 14}, $${i * 38 + 15},
                           $${i * 38 + 16}, $${i * 38 + 17}, $${i * 38 + 18}, $${i * 38 + 19}, $${i * 38 + 20},
                           $${i * 38 + 21}, $${i * 38 + 22}, $${i * 38 + 23}, $${i * 38 + 24}, $${i * 38 + 25},
                           $${i * 38 + 26}, $${i * 38 + 27}, $${i * 38 + 28}, $${i * 38 + 29}, $${i * 38 + 30},
                           $${i * 38 + 31}, $${i * 38 + 32}, $${i * 38 + 33}, $${i * 38 + 34}, $${i * 38 + 35},
                           $${i * 38 + 36}, $${i * 38 + 37}, $${i * 38 + 38})
        `).join(', ')}
        ON CONFLICT (id) DO NOTHING;
      `;

      const values = rows.flatMap(row => [
        row.job_title, row.date_of_application, row.name, row.email_id, row.phone_number,
        row.current_location, row.preferred_locations, row.total_experience, row.curr_company_name,
        row.curr_company_designation, row.department, row.role, row.industry, row.key_skills,
        row.annual_salary, row.notice_period, row.resume_headline, row.summary, row.ug_degree,
        row.ug_specialization, row.ug_university, row.ug_graduation_year, row.pg_degree,
        row.pg_specialization, row.pg_university, row.pg_graduation_year, row.doctorate_degree,
        row.doctorate_specialization, row.doctorate_university, row.doctorate_graduation_year,
        row.gender, row.marital_status, row.home_town, row.pin_code, row.work_permit_usa,
        row.date_of_birth, row.permanent_address, row.is_converted
      ]);

      await clientDB2.query(insertQuery, values);

      console.log(`✅ Successfully transferred batch ${offset / BATCH_SIZE + 1}.`);
      offset += BATCH_SIZE;
    }

    console.log('🎉 All records transferred successfully!');
  } catch (error) {
    console.error('❌ Error transferring data:', error);
  } finally {
    await clientDB1.end();
    await clientDB2.end();
    console.log('🔌 Database connections closed.');
  }
};

transferData();
