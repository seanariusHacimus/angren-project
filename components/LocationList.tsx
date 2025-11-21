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
            <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                {sortedLocations.map(loc => (
                    <Card
                        key={loc.id}
                        className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-none bg-gradient-to-br from-card to-card/80 active:scale-[0.98] sm:hover:scale-[1.02]"
                        onClick={() => onSelectLocation(loc)}
                    >
                        <CardHeader className="p-4 sm:p-5 pb-2 sm:pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                            <div className="flex items-start justify-between gap-2 sm:gap-3">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-foreground">
                                        {loc.name}
                                    </CardTitle>
                                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-primary/10 rounded-full">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse" />
                                        <span className="text-xs sm:text-sm font-semibold text-primary truncate">{loc.bank}</span>
                                    </div>
                                </div>
                                {userLocation && (
                                    <div className="shrink-0 text-right">
                                        <div className="text-xl sm:text-2xl font-bold text-primary">
                                            {(getDistance(userLocation, { latitude: loc.lat, longitude: loc.lng }) / 1000).toFixed(1)}
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">km away</div>
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 sm:p-5 pt-2 sm:pt-3 space-y-2 sm:space-y-2.5">
                            {loc.branch && (
                                <div className="flex items-center gap-2 sm:gap-2.5 text-sm">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary sm:w-4 sm:h-4">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                    </div>
                                    <span className="text-foreground font-medium text-xs sm:text-sm truncate">{loc.branch}</span>
                                </div>
                            )}
                            {loc.address && (
                                <div className="flex items-start gap-2 sm:gap-2.5 text-sm">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary sm:w-4 sm:h-4">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="2" x2="22" y1="12" y2="12" />
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                        </svg>
                                    </div>
                                    <span className="text-muted-foreground line-clamp-2 flex-1 pt-0.5 sm:pt-1.5 text-xs sm:text-sm">{loc.address}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
