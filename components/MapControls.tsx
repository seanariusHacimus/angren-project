'use client';

import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ZoomIn, ZoomOut, Crosshair, Layers, MapPin } from 'lucide-react';

interface MapControlsProps {
    userLocation: { lat: number; lng: number } | null;
}

export function MapControls({ userLocation }: MapControlsProps) {
    const map = useMap();
    const [selectedLayer, setSelectedLayer] = useState('OpenStreetMap');

    const handleZoomIn = () => {
        map.zoomIn();
    };

    const handleZoomOut = () => {
        map.zoomOut();
    };

    const handleLocate = () => {
        if (userLocation) {
            map.flyTo([userLocation.lat, userLocation.lng], 15, {
                duration: 1.5
            });
        } else {
            alert("Location not found yet. Please allow location access.");
        }
    };

    const layers = [
        {
            name: 'OpenStreetMap',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        {
            name: 'OSM Humanitarian',
            url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">HOT</a>'
        },
        {
            name: 'CartoDB Light',
            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        },
        {
            name: 'CartoDB Dark',
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }
    ];

    const handleLayerChange = (layerName: string) => {
        setSelectedLayer(layerName);
        const layer = layers.find(l => l.name === layerName);
        if (layer) {
            map.eachLayer((l) => {
                if ((l as any)._url) {
                    map.removeLayer(l);
                }
            });
            const L = require('leaflet');
            L.tileLayer(layer.url, {
                attribution: layer.attribution
            }).addTo(map);
        }
    };

    return (
        <div className="absolute top-20 right-4 z-[400] flex flex-col gap-2">
            {/* Zoom Controls */}
            <div className="bg-background border rounded-lg shadow-lg overflow-hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none hover:bg-primary/10"
                    onClick={handleZoomIn}
                    title="Zoom in"
                >
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="border-t" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none hover:bg-primary/10"
                    onClick={handleZoomOut}
                    title="Zoom out"
                >
                    <ZoomOut className="h-4 w-4" />
                </Button>
            </div>

            {/* Layers Control */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 bg-background shadow-lg hover:bg-primary/10"
                        title="Change map layer"
                    >
                        <Layers className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    {layers.map((layer) => (
                        <DropdownMenuItem
                            key={layer.name}
                            onClick={() => handleLayerChange(layer.name)}
                            className={selectedLayer === layer.name ? 'bg-primary/10' : ''}
                        >
                            {selectedLayer === layer.name && <MapPin className="mr-2 h-4 w-4" />}
                            {layer.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Locate Me Button */}
            <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 bg-background shadow-lg hover:bg-primary/10"
                onClick={handleLocate}
                title="Show my location"
            >
                <Crosshair className={userLocation ? "h-4 w-4 text-blue-600 animate-pulse" : "h-4 w-4"} />
            </Button>
        </div>
    );
}
