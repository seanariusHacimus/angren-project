import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'locations.json');
const CSV_FILE = path.join(process.cwd(), 'something.csv');

export interface Location {
    id: string;
    lat: number;
    lng: number;
    name: string;
    category: string;
    type: string;
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
        seedFromCsv();
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

function seedFromCsv() {
    if (!fs.existsSync(CSV_FILE)) {
        console.warn('CSV file not found:', CSV_FILE);
        return;
    }

    try {
        const fileContent = fs.readFileSync(CSV_FILE, 'utf-8');
        const lines = fileContent.split('\n');
        const locations: Location[] = [];

        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const parts = line.split(';');

            // Expected format based on something.csv:
            // Number;Category;Name;Details_type;Details_2;Details_working_hours;Latitude;Longitude
            // 0      1        2    3            4         5                     6        7

            if (parts.length >= 8) {
                const latStr = parts[6].replace(',', '.').trim();
                const lngStr = parts[7].replace(',', '.').trim();

                const lat = parseFloat(latStr);
                const lng = parseFloat(lngStr);

                if (!isNaN(lat) && !isNaN(lng)) {
                    locations.push({
                        id: `seed-${i}`,
                        lat,
                        lng,
                        name: parts[2]?.trim() || 'Unknown Location',
                        category: parts[1]?.trim() || 'Unknown Category',
                        type: parts[3]?.trim() || '',
                        bank: '',
                        branch: '',
                        mfo: '',
                        city: '',
                        neighborhood: '',
                        address: '',
                        status: parts[5]?.trim() || '',
                        model: parts[4]?.trim() || ''
                    });
                }
            }
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(locations, null, 2));
        console.log(`Seeded ${locations.length} locations from CSV.`);
    } catch (error) {
        console.error('Error seeding from CSV:', error);
    }
}
