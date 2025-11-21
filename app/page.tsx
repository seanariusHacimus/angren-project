'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Location } from '@/lib/storage';
import { LocationList } from '@/components/LocationList';
import { AddLocationDialog } from '@/components/AddLocationDialog';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Preloader } from '@/components/Preloader';

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100">Loading Map...</div>
});

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLocationCoords, setNewLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addLocationMode, setAddLocationMode] = useState(false);

  useEffect(() => {
    fetchLocations();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations');
      const data = await res.json();
      setLocations(data);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  const handleAddLocationClick = (lat: number, lng: number) => {
    setNewLocationCoords({ lat, lng });
    setIsAddDialogOpen(true);
    setAddLocationMode(false); // Turn off mode after selecting location
  };

  const handleSaveLocation = async (data: any) => {
    try {
      await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchLocations();
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-background">
      <Preloader onFinish={() => setIsLoading(false)} />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-full sm:w-96 md:w-80 bg-background shadow-xl transform transition-transform duration-300 ease-in-out border-r",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <LocationList
          locations={locations}
          userLocation={userLocation}
          onSelectLocation={(loc) => {
            setSelectedLocation(loc);
            if (window.innerWidth < 768) {
              setIsSidebarOpen(false);
            }
          }}
        />
      </div>

      {/* Toggle Sidebar Button - Mobile */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed top-4 left-4 z-50 shadow-lg md:hidden h-12 w-12 bg-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Map Area */}
      <div
        className={cn(
          "flex-1 h-full transition-all duration-300 ease-in-out relative",
          isSidebarOpen ? "md:ml-80" : "ml-0"
        )}
      >
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 z-[400] shadow-lg hidden md:flex h-12 w-12"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <Map
          locations={locations}
          onAddLocation={handleAddLocationClick}
          userLocation={userLocation}
          selectedLocation={selectedLocation}
          addLocationMode={addLocationMode}
        />
      </div>

      {/* Add Location Mode Indicator */}
      {addLocationMode && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg text-xs sm:text-sm font-medium animate-pulse max-w-[90vw] text-center">
          Click on map to add location
        </div>
      )}

      {/* Add Location Toggle Button */}
      <Button
        variant={addLocationMode ? "default" : "secondary"}
        size="icon"
        className={cn(
          "fixed bottom-20 sm:bottom-24 right-4 z-[1000] shadow-lg w-14 h-14 sm:w-16 sm:h-16 rounded-full",
          addLocationMode && "bg-blue-500 hover:bg-blue-600"
        )}
        onClick={() => setAddLocationMode(!addLocationMode)}
        title={addLocationMode ? "Cancel add location" : "Add new location"}
      >
        <Plus className={cn("w-6 h-6 sm:w-7 sm:h-7", addLocationMode && "rotate-45 transition-transform")} />
      </Button>

      <AddLocationDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleSaveLocation}
        lat={newLocationCoords?.lat || 0}
        lng={newLocationCoords?.lng || 0}
      />
    </main>
  );
}
