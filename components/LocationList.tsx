'use client';

import { Location } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState, useMemo, useEffect, useRef } from 'react';
import { getDistance } from 'geolib';
import { Search } from 'lucide-react';

interface LocationListProps {
    locations: Location[];
    userLocation: { lat: number; lng: number } | null;
    onSelectLocation: (loc: Location) => void;
    selectedLocation?: Location | null;
}

export function LocationList({ locations, userLocation, onSelectLocation, selectedLocation }: LocationListProps) {
    const [search, setSearch] = useState('');
    const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const sortedLocations = useMemo(() => {
        let filtered = locations.filter(l =>
            l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.category.toLowerCase().includes(search.toLowerCase())
        );

        if (userLocation) {
            filtered = filtered.sort((a, b) => {
                const distA = getDistance(userLocation, { latitude: a.lat, longitude: a.lng });
                const distB = getDistance(userLocation, { latitude: b.lat, longitude: b.lng });
                return distA - distB;
            });
        }

        return filtered;
    }, [locations, search, userLocation]);

    // Scroll to selected location
    useEffect(() => {
        if (selectedLocation && cardRefs.current[selectedLocation.id]) {
            cardRefs.current[selectedLocation.id]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [selectedLocation]);

    return (
        <div className="h-full flex flex-col bg-background border-r">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold mb-4">Locations</h2>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search locations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-auto p-2 sm:p-3 space-y-2">
                {sortedLocations.map(loc => (
                    <Card
                        key={loc.id}
                        ref={(el) => { cardRefs.current[loc.id] = el; }}
                        className={`cursor-pointer transition-all duration-200 overflow-hidden border bg-card active:scale-[0.98] ${selectedLocation?.id === loc.id
                            ? 'ring-2 ring-primary shadow-lg border-primary'
                            : 'hover:shadow-md hover:border-primary/30'
                            }`}
                        onClick={() => onSelectLocation(loc)}
                    >
                        <div className="p-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-sm leading-tight flex-1">{loc.name}</h3>
                                {userLocation && (
                                    <div className="shrink-0 flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                                        <span className="text-xs font-bold text-primary">
                                            {(getDistance(userLocation, { latitude: loc.lat, longitude: loc.lng }) / 1000).toFixed(1)} km
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                            <rect width="20" height="14" x="2" y="5" rx="2" />
                                            <line x1="2" x2="22" y1="10" y2="10" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-medium text-primary">{loc.category}</span>
                                </div>

                                {loc.branch && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-muted rounded flex items-center justify-center shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                                <polyline points="9 22 9 12 15 12 15 22" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-muted-foreground truncate">{loc.branch}</span>
                                    </div>
                                )}

                                {loc.type && (
                                    <div className="flex items-start gap-2">
                                        <div className="w-5 h-5 bg-muted rounded flex items-center justify-center shrink-0 mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-muted-foreground line-clamp-2 flex-1">{loc.type}</span>
                                    </div>
                                )}

                                {loc.status && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-muted rounded flex items-center justify-center shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-muted-foreground truncate">{loc.status}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
