'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PreloaderProps {
    onFinish: () => void;
}

export function Preloader({ onFinish }: PreloaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [opacity, setOpacity] = useState(100);

    useEffect(() => {
        // Show for at least 2 seconds
        const timer = setTimeout(() => {
            setOpacity(0);
            setTimeout(() => {
                setIsVisible(false);
                onFinish();
            }, 500); // Wait for fade out transition
        }, 2000);

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out",
                opacity === 0 ? "opacity-0" : "opacity-100"
            )}
        >
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
                <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter">
                    Angren Map
                </h1>
                <p className="text-muted-foreground text-lg animate-pulse">
                    Loading locations...
                </p>
            </div>
        </div>
    );
}
