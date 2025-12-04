'use client';

import { useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Location } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import {
    Navigation,
    Landmark,
    Percent,
    Gem,
    Shield,
    CreditCard,
    Banknote,
    RefreshCcw,
    Building2,
    Factory,
    Car,
    Fuel,
    ShoppingBag,
    ShoppingCart,
    Activity,
    Hotel,
    Trees,
    Train,
    Bus,
    MapPin,
    GraduationCap,
    Tag,
    Info,
    Layers,
    Clock
} from 'lucide-react';
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
            const targetZoom = Math.max(map.getZoom(), 16);
            map.flyTo([location.lat, location.lng], targetZoom, {
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

const categoryColors: Record<string, string> = {
    'Bank': 'hsl(var(--chart-1))',
    'Microfinance organizations': 'hsl(var(--chart-2))',
    'Pawnshop': 'hsl(var(--chart-3))',
    'Insurance': 'hsl(var(--chart-4))',
    'Installment': 'hsl(var(--chart-5))',
    'ATM': 'hsl(var(--chart-6))',
    'Currency exchange': 'hsl(var(--chart-7))',
    'Currency exchange ATM': 'hsl(var(--chart-8))',
    'Governance': 'hsl(var(--chart-9))',
    'Production': 'hsl(var(--chart-10))',
    'Car dealership': 'hsl(var(--chart-1))',
    'Petrol station': 'hsl(var(--chart-2))',
    'Shopping center': 'hsl(var(--chart-3))',
    'Supermarket': 'hsl(var(--chart-4))',
    'Hospital': 'hsl(var(--chart-5))',
    'Hotel': 'hsl(var(--chart-6))',
    'Park': 'hsl(var(--chart-7))',
    'Railway station': 'hsl(var(--chart-8))',
    'Bus station': 'hsl(var(--chart-9))',
    'Street 24/7': 'hsl(var(--chart-10))',
    'University': 'hsl(var(--chart-1))',
};

function getCategoryColor(category: string) {
    return categoryColors[category] || 'hsl(var(--primary))';
}

function getCategoryIcon(category: string, color: string) {
    const props = { size: 12, color: color, strokeWidth: 3 };
    let icon;

    switch (category) {
        case 'Bank': icon = <Landmark {...props} />; break;
        case 'Microfinance organizations': icon = <Percent {...props} />; break;
        case 'Pawnshop': icon = <Gem {...props} />; break;
        case 'Insurance': icon = <Shield {...props} />; break;
        case 'Installment': icon = <CreditCard {...props} />; break;
        case 'ATM': icon = <Banknote {...props} />; break;
        case 'Currency exchange': icon = <RefreshCcw {...props} />; break;
        case 'Currency exchange ATM': icon = <RefreshCcw {...props} />; break;
        case 'Governance': icon = <Building2 {...props} />; break;
        case 'Production': icon = <Factory {...props} />; break;
        case 'Car dealership': icon = <Car {...props} />; break;
        case 'Petrol station': icon = <Fuel {...props} />; break;
        case 'Shopping center': icon = <ShoppingBag {...props} />; break;
        case 'Supermarket': icon = <ShoppingCart {...props} />; break;
        case 'Hospital': icon = <Activity {...props} />; break;
        case 'Hotel': icon = <Hotel {...props} />; break;
        case 'Park': icon = <Trees {...props} />; break;
        case 'Railway station': icon = <Train {...props} />; break;
        case 'Bus station': icon = <Bus {...props} />; break;
        case 'Street 24/7': icon = <MapPin {...props} />; break;
        case 'University': icon = <GraduationCap {...props} />; break;
        default: icon = <MapPin {...props} />;
    }

    return renderToString(icon);
}

export default function Map({ locations, onAddLocation, userLocation, selectedLocation, addLocationMode, onSelectLocation }: MapProps) {
    const defaultCenter: [number, number] = [41.0058, 70.1438]; // Angren coordinates

    return (
        <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
            <MapControls userLocation={userLocation} />

            <LocationMarker onAddLocation={onAddLocation} enabled={addLocationMode} />
            <FlyToLocation location={selectedLocation} />
            {userLocation && <UserLocationMarker location={userLocation} />}

            {/* @ts-ignore */}
            <MarkerClusterGroup
                chunkedLoading
                disableClusteringAtZoom={16}
                iconCreateFunction={(cluster: any) => {
                    return L.divIcon({
                        html: `<div class="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-md border-4 border-background font-bold text-sm transition-transform hover:scale-110">
                                 ${cluster.getChildCount()}
                               </div>`,
                        className: 'custom-cluster-icon',
                        iconSize: L.point(40, 40, true),
                    });
                }}
            >
                {locations.map((loc) => {
                    const color = getCategoryColor(loc.category);
                    const iconHtml = getCategoryIcon(loc.category, color);

                    return (
                        <Marker
                            key={loc.id}
                            position={[loc.lat, loc.lng]}
                            icon={L.divIcon({
                                className: 'custom-marker',
                                html: `<div class="pin-3d">
                                 <div class="pin-head" style="background: ${color}">
                                    <div class="pin-inner">
                                        <div class="pin-icon">${iconHtml}</div>
                                    </div>
                                 </div>
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
                                <div className="p-0 min-w-[280px] max-w-[320px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg">
                                    <div className="p-4">
                                        <div className="flex items-start gap-3 mb-4 pb-3 border-b">
                                            <div className="p-2.5 bg-primary/5 rounded-full shrink-0 text-primary">
                                                <Navigation className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight tracking-tight">
                                                    {loc.name}
                                                </h3>
                                                <p className="text-xs text-muted-foreground mt-1 font-medium">Location Details</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 text-sm">
                                            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border/50">
                                                <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Category</span>
                                                    <span className="font-medium">{loc.category}</span>
                                                </div>
                                            </div>

                                            {loc.type && (
                                                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border/50">
                                                    <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Type</span>
                                                        <span>{loc.type}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {loc.model && (
                                                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border/50">
                                                    <Layers className="w-4 h-4 text-muted-foreground shrink-0" />
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Model</span>
                                                        <span>{loc.model}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {loc.status && (
                                                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border/50">
                                                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Status</span>
                                                        <span>{loc.status}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            className="w-full mt-5 h-9 text-xs font-semibold shadow-sm"
                                            onClick={() => {
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`, '_blank');
                                            }}
                                        >
                                            Open in Google Maps
                                        </Button>
                                    </div>
                                </div>
                            </Popup>

                        </Marker >
                    )
                })}
            </MarkerClusterGroup >
        </MapContainer >
    );
}
