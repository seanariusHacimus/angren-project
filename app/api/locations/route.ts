import { NextResponse } from 'next/server';
import { getLocations, addLocation } from '@/lib/storage';

export async function GET() {
    const locations = getLocations();
    return NextResponse.json(locations);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { lat, lng, name, category, type } = body;

    if (!lat || !lng || !name) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newLocation = addLocation({
        lat,
        lng,
        name,
        category: category || '',
        type: type || '',
        bank: '',
        branch: '',
        mfo: '',
        city: '',
        neighborhood: '',
        address: '',
        status: '1',
        model: ''
    });
    return NextResponse.json(newLocation);
}
