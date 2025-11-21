'use client';

import { Location } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { getDistance } from 'geolib';
import { Search, MapPin } from 'lucide-react';

interface LocationListProps {
    locations: Location[];
    userLocation: { lat: number; lng: number } | null;
    onSelectLocation: (loc: Location) => void;
}

export function LocationList({ locations, userLocation, onSelectLocation }: LocationListProps) {
    const [search, setSearch] = useState('');

    const sortedLocations = useMemo(() => {
        let filtered = locations.filter(l =>
            l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.bank.toLowerCase().includes(search.toLowerCase())
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
            <div className="flex-1 overflow-auto p-4 space-y-3">
                {sortedLocations.map(loc => (
                    <Card
                        key={loc.id}
                        className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 overflow-hidden group"
                        onClick={() => onSelectLocation(loc)}
                    >
                        <div className="relative">
                            {/* Colored accent bar */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50" />

                            <CardHeader className="p-4 pb-2 pl-5">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-base font-semibold leading-tight mb-1 group-hover:text-primary transition-colors">
                                            {loc.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                                <line x1="2" x2="22" y1="10" y2="10" />
                                            </svg>
                                            <span className="truncate">{loc.bank}</span>
                                        </div>
                                    </div>
                                    {userLocation && (
                                        <div className="flex flex-col items-end shrink-0">
                                            <div className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                    <circle cx="12" cy="10" r="3" />
                                                </svg>
                                                {(getDistance(userLocation, { latitude: loc.lat, longitude: loc.lng }) / 1000).toFixed(1)} km
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 pt-2 pl-5 space-y-1.5">
                                {loc.branch && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                        <span className="truncate">{loc.branch}</span>
                                    </div>
                                )}
                                {loc.address && (
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                                            <line x1="2" x2="5" y1="12" y2="12" />
                                            <line x1="19" x2="22" y1="12" y2="12" />
                                            <line x1="12" x2="12" y1="2" y2="5" />
                                            <line x1="12" x2="12" y1="19" y2="22" />
                                            <circle cx="12" cy="12" r="7" />
                                        </svg>
                                        <span className="line-clamp-2 flex-1">{loc.address}</span>
                                    </div>
                                )}

                                {/* Quick action indicator */}
                                <div className="flex items-center gap-1 text-xs text-muted-foreground/60 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                    <span>Click to view on map</span>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
