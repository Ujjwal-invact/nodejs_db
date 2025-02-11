require('dotenv').config();
const { Pool } = require('pg');
const axios = require('axios');
const fs = require('fs');
const IHDEmailTemplate = require('../constants/IHDemail');

// Database connection using pg Pool
const pool = new Pool({
	user: process.env.PG_USER_1, // Use this as variables below
	host: process.env.PG_HOST_1,
	database: process.env.PG_DATABASE_1,
	password: process.env.PG_PASSWORD_1,
	port: process.env.PG_PORT_1, // Change if your PostgreSQL runs on a different port
});

// Global Variables

// const WHERE_CLAUSE = `SELECT DISTINCT ON (email_id) id, name, email_id, phone_number
// 						FROM leads_collection
// 						WHERE email_id = 'ujjwaltandon50@gmail.com'`;



const WHERE_CLAUSE = `SELECT DISTINCT ON (email_id) id, name, email_id, phone_number
						FROM leads_collection
						WHERE is_converted = false 
						AND nudge_1 IS NULL AND gender = 'Female'
						ORDER BY email_id, id`;

const LIMIT = 500;
const sendWATI = false; // Flag to control WATI sending
const registrationLink = 'https://event.webinarjam.com/channel/ihd?utm_source=IHD_Email&utm_medium=IHD_Email&utm_campaign=IHD_Email&utm_content=IHD_Email';
const sessionTime = '3:00 PM';
const dynamicDate = new Date().toISOString().split('T')[0];

// SendGrid API Configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_URL = 'https://api.sendgrid.com/v3/mail/send';
const SENDER_EMAIL = 'admission@invact.com';

// WATI API Configuration
const WATI_API_KEY = process.env.WATI_API_KEY;
const WATI_URL = 'https://live-mt-server.wati.io/115361/api/v1/sendTemplateMessage';

// Fetch leads
async function fetchLeads() {
	try {
		const query = `${WHERE_CLAUSE} LIMIT $1`;
		const { rows } = await pool.query(query, [LIMIT]);
        console.log(rows)
		return rows;
	} catch (error) {
		console.error('Error fetching leads:', error);
		return [];
	}
}

// Send Email
async function sendEmail(lead) {
	const emailData = {
		personalizations: [{ to: [{ email: lead.email_id }] }],
		from: { email: SENDER_EMAIL },
		subject: 'You have been selected for Invact Hiring Drive',
		content: [
			{
				type: 'text/html',
				value: IHDEmailTemplate(lead.name,sessionTime, registrationLink,dynamicDate)
                // const IHDEmail =(name="", wj_time= "3:00 PM", wj_rej_link="https://event.webinarjam.com/channel/ihd",dynamicDate="Today") =>
                    

			},
		],
		categories : ['IHD']

	};

	try {
		await axios.post(SENDGRID_URL, emailData, {
			headers: {
				Authorization: `Bearer ${SENDGRID_API_KEY}`,
				'Content-Type': 'application/json',
			},
		});
		console.log(`Email sent to ${lead.email_id}`);
		return true;
	} catch (error) {
		logFailure(lead, 'Email Failed');
		return false;
	}
}

// Send WhatsApp Message
async function sendWhatsApp(lead) {
	if (!sendWATI) return true; // Skip if disabled

	const payload = {
		template_name: '_karmanx_data_session',
		broadcast_name: 'kxDA EmailList',
		parameters: [
			{ name: 'name', value: lead.name },
			{ name: 'time', value: sessionTime },
			{ name: 'date', value: dynamicDate },
			{ name: 'link', value: registrationLink },
		],
	};

	try {
		await axios.post(`${WATI_URL}?whatsappNumber=${lead.phone_number}`, payload, {
			headers: {
				Authorization: `Bearer ${WATI_API_KEY}`,
				'Content-Type': 'application/json',
			},
		});
		console.log(`WhatsApp message sent to ${lead.phone_number}`);
		return true;
	} catch (error) {
		logFailure(lead, 'WATI Failed');
		return false;
	}
}

// Update `nudge_1` after successful email
async function updateNudge(email) {
	try {
		await pool.query(`UPDATE leads_collection SET nudge_1 = NOW() WHERE email_id = $1`, [email]);
		console.log(`Updated nudge_1 for ID: ${email}`);
	} catch (error) {
		console.error(`Error updating nudge_1 for ID ${email}:`, error);
	}
}

// Log failures
function logFailure(lead, reason) {
	const logEntry = `${lead.id}, ${lead.name}, ${lead.email_id}, ${lead.phone_number}, ${dynamicDate}, ${reason}\n`;
	fs.appendFileSync(path.resolve(process.cwd(), './logs/failed_logs.txt'), logEntry);
	console.error(`Failed: ${reason} for ${lead.email_id}`);
}

// Execute
(async () => {
    
  const leads = await fetchLeads();
  
//   fs.writeFileSync('../files/jsons/leadsSelectData.json', JSON.stringify(leads, null, 2), 'utf-8')

	for (const lead of leads) {
		const emailSuccess = await sendEmail(lead);
		if (emailSuccess) {
			await updateNudge(lead.email_id);
			const watiSuccess = await sendWhatsApp(lead);
			if (!watiSuccess) logFailure(lead, 'WATI Failed');
		}
	}

	// Close DB connection
	await pool.end();
})();
