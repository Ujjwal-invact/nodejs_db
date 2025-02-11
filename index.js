


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
