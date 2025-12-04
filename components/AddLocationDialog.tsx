'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Tag, Info, Navigation } from 'lucide-react';

interface AddLocationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    lat: number;
    lng: number;
}

export function AddLocationDialog({ isOpen, onClose, onSave, lat, lng }: AddLocationDialogProps) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');

    const handleSave = () => {
        onSave({ name, category, type, lat, lng });
        onClose();
        setName('');
        setCategory('');
        setType('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border bg-card text-card-foreground shadow-lg rounded-xl">
                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/5 rounded-full text-primary">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold tracking-tight">
                                    Add New Location
                                </DialogTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Enter the details for this spot.
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-5 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                                <Navigation className="w-4 h-4 text-muted-foreground" />
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Central Bank"
                                className="bg-background border-input focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category" className="flex items-center gap-2 text-sm font-medium">
                                <Tag className="w-4 h-4 text-muted-foreground" />
                                Category
                            </Label>
                            <Input
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Bank"
                                className="bg-background border-input focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type" className="flex items-center gap-2 text-sm font-medium">
                                <Info className="w-4 h-4 text-muted-foreground" />
                                Type (Optional)
                            </Label>
                            <Input
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder="e.g. Main Branch"
                                className="bg-background border-input focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-border/50 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">Coordinates:</span>
                            <code className="bg-background px-2 py-1 rounded border text-xs font-mono text-foreground">
                                {lat.toFixed(5)}, {lng.toFixed(5)}
                            </code>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={onClose} className="hover:bg-muted">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                            Save Location
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
