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
                html: `<div class="user-pin">
                         <div class="user-pulse"></div>
                       </div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [0, -10]
            })}
        >
            <Popup>You are here</Popup>
        </Marker>
    );
}

export default function Map({ locations, onAddLocation, userLocation, selectedLocation, addLocationMode, onSelectLocation }: MapProps) {
    const defaultCenter: [number, number] = [41.0058, 70.1438]; // Angren coordinates

    return (
        <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
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
                        html: `<div class="pin-3d">
                                 <div class="pin-head"></div>
                                 <div class="pin-shadow"></div>
                               </div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        popupAnchor: [0, -30]
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
