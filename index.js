// const { createClient } = require('@supabase/supabase-js');

// // Replace with your Supabase details
// const SUPABASE_URL= 'https://bbtywinqgjripmjsgcjp.supabase.co'
// const SUPABASE_KEY= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidHl3aW5xZ2pyaXBtanNnY2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMzMyMTUsImV4cCI6MjA1MzgwOTIxNX0.ZrwybcnSZWhd-VjiJUzAV5vpX0KVGvWjSv0OrTYqznc'


// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// // Test connection
// (async () => {
//     const { data, error } = await supabase.from('leads_collection').select('*');
    
//     if (error) {
//         console.error('Error:', error);
//     } else {
//         console.log('Data:', data);
//     }
// })();



const pool = require('./pgConfig');

const fetchReadOnlyData = async () => {
    try {
        console.log('🔍 Fetching read-only data...');

        const result = await pool.query('SELECT email, phone FROM students LIMIT 10');
        console.log('✅ Read-Only Data:', result.rows);
    } catch (error) {
        console.error('❌ Read-Only DB Error:', error.message);
    } finally {
        pool.end(); // Close the connection
    }
};

fetchReadOnlyData();
