'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Location } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { MapControls } from './MapControls';

// Fix for default marker icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
    locations: Location[];
    onAddLocation: (lat: number, lng: number) => void;
    userLocation: { lat: number; lng: number } | null;
    selectedLocation: Location | null;
    addLocationMode: boolean;
    onSelectLocation: (location: Location) => void;
}

function LocationMarker({ onAddLocation, enabled }: { onAddLocation: (lat: number, lng: number) => void; enabled: boolean }) {
    const map = useMap();

    useMapEvents({
        click(e: L.LeafletMouseEvent) {
            if (enabled) {
                onAddLocation(e.latlng.lat, e.latlng.lng);
            }
        },
    });

    // Change cursor when in add location mode
    useEffect(() => {
        if (map) {
            const container = map.getContainer();
            if (enabled) {
                container.style.cursor = 'crosshair';
            } else {
                container.style.cursor = '';
            }
        }
    }, [enabled, map]);

    return null;
}

function FlyToLocation({ location }: { location: Location | null }) {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.flyTo([location.lat, location.lng], 16, {
                duration: 1.5
            });
        }
    }, [location, map]);
    return null;
}

function UserLocationMarker({ location }: { location: { lat: number; lng: number } | null }) {
    return location === null ? null : (
        <Marker
            position={[location.lat, location.lng]}
            icon={L.divIcon({
                className: 'custom-user-marker',
                html: `<div class="relative">
                         <div class="absolute inset-0 w-10 h-10 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                         <div class="relative w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                             <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                             <circle cx="12" cy="10" r="3"/>
                           </svg>
                         </div>
                       </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            })}
        >
            <Popup>You are here</Popup>
        </Marker>
    );
}

export default function Map({ locations, onAddLocation, userLocation, selectedLocation, addLocationMode, onSelectLocation }: MapProps) {
    const defaultCenter: [number, number] = [41.0058, 70.1438]; // Angren coordinates

    return (
        <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <MapControls userLocation={userLocation} />

            <LocationMarker onAddLocation={onAddLocation} enabled={addLocationMode} />
            <FlyToLocation location={selectedLocation} />
            {userLocation && <UserLocationMarker location={userLocation} />}

            {locations.map((loc) => (
                <Marker
                    key={loc.id}
                    position={[loc.lat, loc.lng]}
                    icon={L.divIcon({
                        className: 'custom-marker',
                        html: `<div class="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                               </div>`,
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32]
                    })}
                    eventHandlers={{
                        click: () => {
                            if (selectedLocation?.id !== loc.id) {
                                onSelectLocation(loc);
                            }
                        }
                    }}
                >
                    <Popup className="custom-popup">
                        <div className="p-1 min-w-[250px] max-w-[300px]">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                                    <Navigation className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="font-bold text-base leading-tight">{loc.name}</h3>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-3 gap-1">
                                    <span className="text-muted-foreground font-medium text-xs">Bank:</span>
                                    <span className="col-span-2 font-medium">{loc.bank}</span>
                                </div>
                                {loc.branch && (
                                    <div className="grid grid-cols-3 gap-1">
                                        <span className="text-muted-foreground font-medium text-xs">Branch:</span>
                                        <span className="col-span-2">{loc.branch}</span>
                                    </div>
                                )}
                                {loc.model && (
                                    <div className="grid grid-cols-3 gap-1">
                                        <span className="text-muted-foreground font-medium text-xs">Model:</span>
                                        <span className="col-span-2">{loc.model}</span>
                                    </div>
                                )}
                                {loc.city && (
                                    <div className="grid grid-cols-3 gap-1">
                                        <span className="text-muted-foreground font-medium text-xs">City:</span>
                                        <span className="col-span-2">{loc.city}</span>
                                    </div>
                                )}
                                {loc.neighborhood && (
                                    <div className="grid grid-cols-3 gap-1">
                                        <span className="text-muted-foreground font-medium text-xs">Area:</span>
                                        <span className="col-span-2">{loc.neighborhood}</span>
                                    </div>
                                )}
                                {loc.address && (
                                    <div className="grid grid-cols-3 gap-1">
                                        <span className="text-muted-foreground font-medium text-xs">Address:</span>
                                        <span className="col-span-2">{loc.address}</span>
                                    </div>
                                )}
                                {loc.status && (
                                    <div className="grid grid-cols-3 gap-1">
                                        <span className="text-muted-foreground font-medium text-xs">Status:</span>
                                        <span className="col-span-2">{loc.status === '1' ? 'Active' : 'Inactive'}</span>
                                    </div>
                                )}
                            </div>

                            <Button className="w-full mt-4 h-8 text-xs" onClick={() => {
                                window.open(`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`, '_blank');
                            }}>
                                Open in Google Maps
                            </Button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
