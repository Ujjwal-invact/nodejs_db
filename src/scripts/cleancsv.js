const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');

(async () => {
	const readCSV = fs.readFileSync('./leads_collection_2_rows.csv', 'utf-8');

	const parsedCSVData = Papa.parse(readCSV, {
		skipEmptyLines: true,
		header: true,
		transform: (value, header) => {
			if (header === 'date_of_application' || header === 'date_of_birth') {
				let [day, month, year] = new Date(value)
						.toLocaleString('en-IN', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							timeZone: 'Asia/Kolkata',
						})
						.split('/'),
					formattedDate = `${year}-${month}-${day}`;

				return formattedDate;
			}

			return value
				?.replace(/[\n\t]/g, ' ')
				?.replace(/\s+/g, ' ')
				?.trim();
		},
	});

	fs.writeFileSync(
		path.resolve(process.cwd(), './dummy.json'),
		JSON.stringify(parsedCSVData, null, 2),
		'utf-8',
	);
})();
