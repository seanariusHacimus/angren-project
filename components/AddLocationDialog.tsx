'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AddLocationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    lat: number;
    lng: number;
}

export function AddLocationDialog({ isOpen, onClose, onSave, lat, lng }: AddLocationDialogProps) {
    const [name, setName] = useState('');
    const [bank, setBank] = useState('');
    const [details, setDetails] = useState('');

    const handleSave = () => {
        onSave({ name, bank, details, lat, lng });
        onClose();
        setName('');
        setBank('');
        setDetails('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Location</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bank" className="text-right">
                            Bank
                        </Label>
                        <Input id="bank" value={bank} onChange={(e) => setBank(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="details" className="text-right">
                            Details
                        </Label>
                        <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="text-sm text-gray-500">
                        Coordinates: {lat.toFixed(5)}, {lng.toFixed(5)}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save Location</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
