const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const DATA_FILE = path.join(process.cwd(), 'locations.json');
const EXCEL_FILE = path.join(process.cwd(), 'Angren bankomatlari koordinatalari.xlsx');

function seedFromExcel() {
    if (!fs.existsSync(EXCEL_FILE)) {
        console.error('Excel file not found:', EXCEL_FILE);
        return;
    }

    try {
        const workbook = XLSX.readFile(EXCEL_FILE);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Skip first 4 rows
        const rows = data.slice(4);
        const locations = [];

        rows.forEach((row, index) => {
            const coordsRaw = row[10];
            if (typeof coordsRaw === 'string') {
                let latStr, lngStr;

                if (coordsRaw.includes(';')) {
                    [latStr, lngStr] = coordsRaw.split(';').map(s => s.trim());
                } else if (coordsRaw.includes(',')) {
                    [latStr, lngStr] = coordsRaw.split(',').map(s => s.trim());
                }

                if (latStr && lngStr) {
                    const lat = parseFloat(latStr);
                    const lng = parseFloat(lngStr);

                    if (!isNaN(lat) && !isNaN(lng)) {
                        locations.push({
                            id: `seed-${index}`,
                            lat,
                            lng,
                            name: row[6] || 'Unknown Location',
                            bank: row[1] || 'Unknown Bank',
                            details: `${row[2] || ''} - ${row[9] || ''}`
                        });
                    }
                }
            }
        });

        fs.writeFileSync(DATA_FILE, JSON.stringify(locations, null, 2));
        console.log(`Successfully seeded ${locations.length} locations to locations.json`);
    } catch (error) {
        console.error('Error seeding from Excel:', error);
    }
}

seedFromExcel();
