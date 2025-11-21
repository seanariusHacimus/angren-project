const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const EXCEL_FILE = path.join(process.cwd(), 'Angren bankomatlari koordinatalari.xlsx');

function seedFromExcel() {
    console.log('Checking file:', EXCEL_FILE);
    if (!fs.existsSync(EXCEL_FILE)) {
        console.error('Excel file not found:', EXCEL_FILE);
        return;
    }

    try {
        const workbook = XLSX.readFile(EXCEL_FILE);
        const sheetName = workbook.SheetNames[0];
        console.log('Sheet Name:', sheetName);
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log('Total rows:', data.length);
        // Skip first 4 rows
        const rows = data.slice(4);
        console.log('Rows to process:', rows.length);

        const locations = [];

        rows.forEach((row, index) => {
            // Log first few rows to verify structure
            if (index < 3) {
                console.log(`Row ${index}:`, JSON.stringify(row));
            }

            // Coordinates: Column 10 (index 10) -> "lat; lng"
            const coordsRaw = row[10];
            if (typeof coordsRaw === 'string' && coordsRaw.includes(';')) {
                const parts = coordsRaw.split(';');
                const latStr = parts[0].trim();
                const lngStr = parts[1].trim();
                const lat = parseFloat(latStr);
                const lng = parseFloat(lngStr);

                if (!isNaN(lat) && !isNaN(lng)) {
                    locations.push({
                        id: `seed-${index}`,
                        lat,
                        lng,
                        name: row[6] || 'Unknown Location', // Column 6
                        bank: row[1] || 'Unknown Bank', // Column 1
                        details: `${row[2] || ''} - ${row[9] || ''}` // Column 2 + 9
                    });
                } else {
                    if (index < 10) console.log(`Row ${index}: Invalid coords parsed: ${lat}, ${lng}`);
                }
            } else {
                if (index < 10) console.log(`Row ${index}: Invalid coords raw: ${coordsRaw}`);
            }
        });

        console.log(`Seeded ${locations.length} locations.`);
        console.log('Sample location:', locations[0]);
    } catch (error) {
        console.error('Error seeding from Excel:', error);
    }
}

seedFromExcel();
