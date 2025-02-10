// /**
//  * This script transfers data from db1.leads_collection_2 to db2.leads_collection using the pg package.
//  */

const { Client } = require('pg');
const fs = require('fs')
const path = require('path')

// Database connection configurations
const db1Config = {
  user: 'postgres.oemyktdkqsrsuuudswog',
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  database: 'postgres',
  password: '-5YLkD.ERRzp7Bv',
  port: 5432, // Change if needed
};

const db2Config = {
  user: 'postgres.bbtywinqgjripmjsgcjp',
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  database: 'postgres',
  password: 'IqwVdXGb6JhHMiK',
  port: 5432, // Change if needed
};

// Function to transfer data
const transferData = async () => {
  const clientDB1 = new Client({
		...db1Config,
		query_timeout: 3000000, // 5 minutes
        statement_timeout: 3000000, // 5 minutes
        connectionTimeoutMillis: 300000 // 30 seconds
	});
  const clientDB2 = new Client(db2Config);

  try {
    // Connect to both databases
    await clientDB1.connect();
    console.log('✅ Connected to Source DB (db1).');

    await clientDB2.connect();
    console.log('✅ Connected to Destination DB (db2).');

    // Fetch data from leads_collection_2
    const query = `SELECT * FROM leads_collection_2 `;
    const { rows } = await clientDB1.query(query);

    if (rows.length === 0) {
      console.log('⚠️ No records found in leads_collection_2.');
      return;
    }

    console.log(`📊 Found ${rows.length} records. Transferring now...`);

    // Insert data into leads_collection in db2
    const insertQuery = `
      INSERT INTO leads_collections (
        job_title, date_of_application, name, email_id, phone_number, current_location, 
        preferred_locations, total_experience, curr_company_name, curr_company_designation, 
        department, role, industry, key_skills, annual_salary, notice_period, resume_headline, 
        summary, ug_degree, ug_specialization, ug_university, ug_graduation_year, 
        pg_degree, pg_specialization, pg_university, pg_graduation_year, 
        doctorate_degree, doctorate_specialization, doctorate_university, doctorate_graduation_year, 
        gender, marital_status, home_town, pin_code, work_permit_usa, date_of_birth, 
        permanent_address, is_converted
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
        $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, 
        $33, $34, $35, $36, $37, $38
      ) ON CONFLICT (id) DO NOTHING;
    `;

    
    fs.writeFileSync(path.resolve(process.cwd(), './dummy.json'), JSON.stringify(rows,null, 2), 'utf-8')
    for await (let row of rows) {
      await clientDB2.query(insertQuery, [
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
    }

    console.log(`✅ Successfully transferred ${rows.length} records.`);
  } catch (error) {
    console.error('❌ Error transferring data:', error);
  } finally {
    // Close connections
    await clientDB1.end();
    await clientDB2.end();
    console.log('🔌 Database connections closed.');
  }
};

// Execute the transfer function
transferData();
