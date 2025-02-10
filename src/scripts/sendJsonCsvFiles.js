const fs = require('fs');
const path = require('path');
const supabase = require('../config/config'); // Import Supabase client

const JSON_FILE_PATH = path.join(__dirname, '../files/jsons/leads.json'); // Update file path
const TABLE_NAME = 'leads_collection'; // Supabase table name

// 🚀 Function to Read JSON and Insert into Supabase
const uploadJsonToSupabase = async () => {
	try {
		console.log(`📂 Reading JSON file: ${JSON_FILE_PATH}`);
		const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf8');
		const records = JSON.parse(fileContent);

		if (!Array.isArray(records) || records.length === 0) {
			console.log('⚠️ No valid data to upload.');
			return;
		}

		console.log(`✅ Parsed ${records.length} records.`);

		// 🚀 Insert records in batches
		const batchSize = 50;
		for (let i = 0; i < records.length; i += batchSize) {
			const batch = records.slice(i, i + batchSize);

			const { error } = await supabase.from(TABLE_NAME).insert(batch);
			if (error) {
				console.error(`⚠️ Error inserting batch ${i / batchSize + 1}:`, error.message);
			} else {
				console.log(`✅ Inserted ${batch.length} records (Batch ${i / batchSize + 1})`);
			}
		}
	} catch (error) {
		console.error('❌ Error processing JSON file:', error.message);
	}
};

// Run the upload process
uploadJsonToSupabase();
