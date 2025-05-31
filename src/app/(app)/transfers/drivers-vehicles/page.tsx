
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Added Label
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Added Dialog components
import { UserPlus, Car, PlusCircle, Edit, AlertTriangle, ShieldCheck, Search } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react"; // Added useState
import { useToast } from "@/hooks/use-toast"; // Added useToast

// Dummy data
const drivers = [
  { id: "DRV001", name: "John Doe", licenseExpiry: "2024-12-31", backgroundCheck: "Pass", status: "Active", insuranceExpiry: "2024-11-30" },
  { id: "DRV002", name: "Jane Smith", licenseExpiry: "2023-06-15", backgroundCheck: "Pass", status: "Expired License", insuranceExpiry: "2024-05-01" },
  { id: "DRV003", name: "Mike R.", licenseExpiry: "2025-02-28", backgroundCheck: "Pending", status: "Pending Documents", insuranceExpiry: "2025-01-15"},
];

const vehicles = [
  { id: "VEH001", plate: "XYZ 123", type: "Van", inspectionDate: "2024-08-01", status: "Operational", insuranceExpiry: "2024-10-01", metrcCompliant: true },
  { id: "VEH002", plate: "ABC 789", type: "Armored Truck", inspectionDate: "2023-01-10", status: "Maintenance Required", insuranceExpiry: "2023-05-20", metrcCompliant: true },
  { id: "VEH003", plate: "TRK 003", type: "Refrigerated Trailer", inspectionDate: "2024-09-15", status: "Operational", insuranceExpiry: "2025-03-01", metrcCompliant: false },
];

export default function DriversVehiclesPage() {
  const { toast } = useToast();
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  // Add state for edit modals if needed
  // const [editingDriver, setEditingDriver] = useState<typeof drivers[0] | null>(null);
  // const [editingVehicle, setEditingVehicle] = useState<typeof vehicles[0] | null>(null);

  const handleAddDriver = () => {
    // TODO: Call addDriver(data)
    toast({ title: "Driver Added", description: "New driver has been added to the registry." });
    setShowAddDriverModal(false);
  };

  const handleAddVehicle = () => {
    // TODO: Call addVehicle(data)
    toast({ title: "Vehicle Added", description: "New vehicle has been added to the registry." });
    setShowAddVehicleModal(false);
  };

  const handleEditDriver = (driverId: string) => {
    // TODO: Open modal with driver data pre-filled, then call updateDriver(driverId, data)
    toast({ title: "Edit Driver", description: `Opening edit form for driver ${driverId}.` });
  };
  
  const handleEditVehicle = (vehicleId: string) => {
    // TODO: Open modal with vehicle data pre-filled, then call updateVehicle(vehicleId, data)
    toast({ title: "Edit Vehicle", description: `Opening edit form for vehicle ${vehicleId}.` });
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Drivers & Vehicles Registry" 
        description="Manage approved transport personnel and vehicles. Track licenses, insurance, inspections, and compliance status. System flags expired documents or non-compliant assets before dispatch."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Driver Registry</CardTitle>
                <Button size="sm" onClick={() => setShowAddDriverModal(true)}><UserPlus className="mr-2 h-4 w-4"/>Add New Driver</Button>
            </div>
            <CardDescription>Maintain records of all transport drivers, including contact info, license details, background check status, and insurance. Alerts for expired documents.</CardDescription>
            <Input placeholder="Search drivers..." className="mt-2 max-w-sm" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>License Expiry</TableHead>
                  <TableHead>Insurance Expiry</TableHead>
                  <TableHead>Background</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id} className={cn((driver.status.includes("Expired") || driver.status.includes("Pending")) && "bg-yellow-50 dark:bg-yellow-900/30")}>
                    <TableCell className="font-medium">{driver.id}</TableCell>
                    <TableCell>{driver.name}</TableCell>
                    <TableCell className={cn(new Date(driver.licenseExpiry) < new Date() && "text-destructive font-semibold")}>{driver.licenseExpiry}</TableCell>
                     <TableCell className={cn(new Date(driver.insuranceExpiry) < new Date() && "text-destructive font-semibold")}>{driver.insuranceExpiry}</TableCell>
                    <TableCell>
                        <Badge variant={driver.backgroundCheck === "Pass" ? "default" : "secondary"}
                               className={cn(driver.backgroundCheck === "Pass" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300")}>
                            {driver.backgroundCheck}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={driver.status === "Active" ? "default" : "destructive"}
                             className={cn(
                                driver.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : 
                                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400"
                            )}>
                        {driver.status.includes("Expired") && <AlertTriangle className="inline h-3 w-3 mr-1"/>}
                        {driver.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditDriver(driver.id)}><Edit className="h-4 w-4"/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Vehicle Registry</CardTitle>
                <Button size="sm" onClick={() => setShowAddVehicleModal(true)}><Car className="mr-2 h-4 w-4"/>Add New Vehicle</Button>
            </div>
            <CardDescription>Maintain records of all transport vehicles, including VIN, plate, type, compliance status, last inspection, and insurance. Alerts for non-compliant vehicles.</CardDescription>
            <Input placeholder="Search vehicles by plate, VIN, type..." className="mt-2 max-w-sm" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle ID</TableHead>
                  <TableHead>Plate</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last Inspection</TableHead>
                  <TableHead>Insurance Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className={cn(vehicle.status !== "Operational" && "bg-orange-50 dark:bg-orange-900/30", !vehicle.metrcCompliant && "border-l-4 border-destructive")}>
                    <TableCell className="font-medium">{vehicle.id}</TableCell>
                    <TableCell>{vehicle.plate}</TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>{vehicle.inspectionDate}</TableCell>
                    <TableCell className={cn(new Date(vehicle.insuranceExpiry) < new Date() && "text-destructive font-semibold")}>{vehicle.insuranceExpiry}</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.status === "Operational" ? "default" : "destructive"}
                            className={cn(
                                vehicle.status === "Operational" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : 
                                "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-400"
                            )}
                      >
                        {vehicle.status !== "Operational" && <AlertTriangle className="inline h-3 w-3 mr-1"/>}
                        {vehicle.status}
                      </Badge>
                      {!vehicle.metrcCompliant && <Badge variant="destructive" className="ml-1">Not METRC Compliant</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditVehicle(vehicle.id)}><Edit className="h-4 w-4"/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Driver Modal */}
      <Dialog open={showAddDriverModal} onOpenChange={setShowAddDriverModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>Enter driver details and upload relevant documents.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <div><Label htmlFor="driver-name">Full Name</Label><Input id="driver-name" placeholder="John Doe"/></div>
            <div><Label htmlFor="driver-license">License Number</Label><Input id="driver-license" placeholder="S12345678"/></div>
            <div><Label htmlFor="driver-license-expiry">License Expiry Date</Label><Input id="driver-license-expiry" type="date"/></div>
            <div><Label htmlFor="driver-insurance-expiry">Insurance Expiry Date</Label><Input id="driver-insurance-expiry" type="date"/></div>
            <div><Label htmlFor="driver-contact">Contact Info</Label><Input id="driver-contact" placeholder="Phone or Email"/></div>
            {/* Add fields for background check status, document uploads */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDriverModal(false)}>Cancel</Button>
            <Button onClick={handleAddDriver}>Add Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Vehicle Modal */}
      <Dialog open={showAddVehicleModal} onOpenChange={setShowAddVehicleModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>Enter vehicle details and compliance information.</DialogDescription>
          </DialogHeader>
           <div className="grid gap-3 py-4">
            <div><Label htmlFor="vehicle-plate">License Plate</Label><Input id="vehicle-plate" placeholder="XYZ 123"/></div>
            <div><Label htmlFor="vehicle-vin">VIN</Label><Input id="vehicle-vin" placeholder="17-character VIN"/></div>
            <div><Label htmlFor="vehicle-type">Vehicle Type</Label><Input id="vehicle-type" placeholder="e.g., Van, Armored Truck, Refrigerated"/></div>
            <div><Label htmlFor="vehicle-inspection-date">Last Inspection Date</Label><Input id="vehicle-inspection-date" type="date"/></div>
            <div><Label htmlFor="vehicle-insurance-expiry">Insurance Expiry Date</Label><Input id="vehicle-insurance-expiry" type="date"/></div>
            <div className="flex items-center space-x-2"><Input type="checkbox" id="vehicle-metrc-compliant"/><Label htmlFor="vehicle-metrc-compliant">METRC Compliant</Label></div>
            {/* Add fields for registration, document uploads */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddVehicleModal(false)}>Cancel</Button>
            <Button onClick={handleAddVehicle}>Add Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageContainer>
  );
}
