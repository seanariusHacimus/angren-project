import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const DATA_FILE = path.join(process.cwd(), 'locations.json');
const EXCEL_FILE = path.join(process.cwd(), 'Angren bankomatlari koordinatalari.xlsx');

export interface Location {
    id: string;
    lat: number;
    lng: number;
    name: string;
    bank: string;
    branch: string;
    mfo: string;
    city: string;
    neighborhood: string;
    address: string;
    status: string;
    model: string;
}

export function getLocations(): Location[] {
    if (!fs.existsSync(DATA_FILE)) {
        seedFromExcel();
    }
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    }
    return [];
}

export function addLocation(location: Omit<Location, 'id'>): Location {
    const locations = getLocations();
    const newLocation = { ...location, id: Math.random().toString(36).substr(2, 9) };
    locations.push(newLocation);
    fs.writeFileSync(DATA_FILE, JSON.stringify(locations, null, 2));
    return newLocation;
}

function seedFromExcel() {
    if (!fs.existsSync(EXCEL_FILE)) {
        console.warn('Excel file not found:', EXCEL_FILE);
        return;
    }

    try {
        const workbook = XLSX.readFile(EXCEL_FILE);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        // Skip first 4 rows
        const rows = data.slice(4);
        const locations: Location[] = [];

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
                            branch: row[2] || '',
                            mfo: row[3] ? String(row[3]) : '',
                            city: row[4] || '',
                            neighborhood: row[5] || '',
                            address: row[7] || '',
                            status: row[8] !== undefined ? String(row[8]) : '',
                            model: row[9] || ''
                        });
                    }
                }
            }
        });

        fs.writeFileSync(DATA_FILE, JSON.stringify(locations, null, 2));
        console.log(`Seeded ${locations.length} locations from Excel.`);
    } catch (error) {
        console.error('Error seeding from Excel:', error);
    }
}
