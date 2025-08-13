
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Map, Edit, Eye, Droplets, Sprout, Flower2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const growRooms = [
    { id: "ROOM001", name: "Propagation Area", facilityId: "FAC001", capacity: 500, plantCount: 200, status: "Operational", lightSchedule: "18/6", tempRange: "72-78°F" },
    { id: "ROOM002", name: "Veg Room 2B", facilityId: "FAC001", capacity: 200, plantCount: 120, status: "Operational", lightSchedule: "18/6", tempRange: "70-76°F" },
    { id: "ROOM003", name: "Flower Room 1A", facilityId: "FAC001", capacity: 100, plantCount: 50, status: "Operational", lightSchedule: "12/12", tempRange: "68-75°F" },
    { id: "ROOM004", name: "Flower Room 2A", facilityId: "FAC001", capacity: 100, plantCount: 85, status: "Humidity Alert", lightSchedule: "12/12", tempRange: "68-75°F" },
];

const GrowRoomHeatmap = () => {
    // This is a placeholder component. A real implementation would use a library like D3, or divs with grid layout.
    return (
        <Card>
            <CardHeader>
                <CardTitle>Grow Room Visual Layout & Heatmap</CardTitle>
                <CardDescription>
                    This is a conceptual placeholder for a visual floor plan. Color-coding could represent growth phase, health status, or yield predictions.
                    Clicking a section would show details for that plant/batch.
                </CardDescription>
            </CardHeader>
            <CardContent className="bg-muted/20 p-4 rounded-lg min-h-[300px] flex items-center justify-center">
                 <div className="grid grid-cols-5 gap-2 w-full h-full">
                    {Array.from({ length: 25 }).map((_, i) => {
                        const colors = ["bg-blue-200", "bg-green-300", "bg-yellow-300", "bg-red-300"];
                        const icons = [<Droplets key="d"/>, <Sprout key="s"/>, <Flower2 key="f"/>, <AlertTriangle key="a"/>];
                        const randomState = Math.floor(Math.random() * 4);
                        return (
                            <div key={i} className={`h-16 rounded-md flex items-center justify-center text-gray-600 text-xs cursor-pointer hover:ring-2 ring-primary ${colors[randomState]}`}>
                                {icons[randomState]}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
};


export default function GrowRoomsPage() {
  const { toast } = useToast();
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  const handleAddRoom = () => {
    // TODO: Call createGrowRoom(data)
    toast({ title: "Success", description: "New grow room has been created." });
    setShowAddRoomModal(false);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Grow Room Management"
        description="Define, manage, and visualize your cultivation spaces. Associate rooms with facilities and track capacity."
      >
        <Button onClick={() => setShowAddRoomModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Room
        </Button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <GrowRoomHeatmap />
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Room Registry</CardTitle>
                    <CardDescription>List of all defined cultivation rooms.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Plants</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {growRooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell className="font-medium">{room.name}</TableCell>
                                    <TableCell>{room.plantCount} / {room.capacity}</TableCell>
                                    <TableCell>{room.status}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" title="View Room Details"><Link href="#"><Eye className="h-4 w-4"/></Link></Button>
                                        <Button variant="ghost" size="icon" title="Edit Room"><Edit className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Add New Room Modal */}
      <Dialog open={showAddRoomModal} onOpenChange={setShowAddRoomModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Grow Room</DialogTitle>
            <DialogDescription>Define a new cultivation space and its properties.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div><Label htmlFor="room-name">Room Name / ID</Label><Input id="room-name" placeholder="e.g., Flower Room 3A"/></div>
            <div>
              <Label htmlFor="facility-select">Associated Facility</Label>
              <Select>
                <SelectTrigger id="facility-select"><SelectValue placeholder="Select facility..."/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="FAC001">Downtown Cultivation Center</SelectItem>
                    <SelectItem value="FAC002">Westside Processing Plant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label htmlFor="room-capacity">Max Plant Capacity</Label><Input id="room-capacity" type="number" placeholder="e.g., 100"/></div>
            <div><Label htmlFor="room-size">Room Size (sq ft)</Label><Input id="room-size" type="number" placeholder="e.g., 500"/></div>
             <div><Label htmlFor="light-schedule">Default Light Schedule</Label><Input id="light-schedule" placeholder="e.g., 12/12 or 18/6"/></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRoomModal(false)}>Cancel</Button>
            <Button onClick={handleAddRoom}>Add Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
