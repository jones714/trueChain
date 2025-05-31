
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Thermometer, Wind, PlusCircle, Hourglass, ArrowRightCircle, Bell, Users, Edit } from "lucide-react"; 
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

interface DryingBatch {
  id: string;
  sourceHarvest: string;
  startDate: string;
  room: string;
  method: string; 
  targetDryWeight?: number; 
  currentWeight?: number; 
  staff: string;
  notes?: string;
  timerDays: number; 
}

interface CuringBatch {
  id: string;
  sourceDryingBatch: string;
  startDate: string;
  containerType: string;
  targetDurationDays: number;
  targetRH?: number; 
  currentRH?: number; 
  staff: string;
  notes?: string;
  timerDays: number; 
}


export default function DryingCuringPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [dryingBatches, setDryingBatches] = useState<DryingBatch[]>([
    {id: "DRY-001", sourceHarvest: "HVT-001", startDate: "2023-10-25", room: "Dry Room A", method: "Hang", targetDryWeight: 1200, staff: "Alice W.", timerDays: 3, currentWeight: 1800 },
  ]);
  const [curingBatches, setCuringBatches] = useState<CuringBatch[]>([
    {id: "CUR-001", sourceDryingBatch: "DRY-001", startDate: "2023-10-28", containerType: "Glass Jar", targetDurationDays: 14, targetRH: 62, staff: "Bob B.", timerDays: 1 },
  ]);

  const [showStartDryingModal, setShowStartDryingModal] = useState(false);
  const [showLogEnvironmentModal, setShowLogEnvironmentModal] = useState(false);
  const [showTransitionToCuringModal, setShowTransitionToCuringModal] = useState(false);
  const [selectedDryingBatch, setSelectedDryingBatch] = useState<DryingBatch | null>(null);
  // Selected Curing batch for future edit modals
  const [selectedCuringBatch, setSelectedCuringBatch] = useState<CuringBatch | null>(null);


  useEffect(() => {
    if (searchParams?.get('action') === 'start_drying') {
      setShowStartDryingModal(true);
    }
  }, [searchParams]);

  const handleStartDryingCycle = () => {
    // TODO: Call startDryingCycle()
    toast({ title: "Success", description: "New drying cycle started." });
    setShowStartDryingModal(false);
  };

  const handleLogEnvironment = () => {
    // TODO: Logic to log environment readings
    toast({ title: "Success", description: "Environment readings logged." });
    setShowLogEnvironmentModal(false);
  };
  
  const handleTransitionToCuring = (batch: DryingBatch) => {
    setSelectedDryingBatch(batch);
    setShowTransitionToCuringModal(true);
  };

  const submitTransitionToCuring = () => {
     // TODO: Call backend function, e.g., startCuringCycle(selectedDryingBatch.id, curingData)
    toast({ title: "Success", description: `Batch ${selectedDryingBatch?.id} transitioned to curing.` });
    setShowTransitionToCuringModal(false);
    setSelectedDryingBatch(null);
  };
  
  const handleMoveToPackaging = (batch: CuringBatch) => {
    // TODO: Call backend function to update batch status and make available for packaging
    toast({ title: "Action", description: `Batch ${batch.id} marked ready for packaging/storage.` });
  };


  return (
    <PageContainer>
      <PageHeader 
        title="Drying & Curing Management" 
        description="Monitor and manage drying and curing environments, track batch progress, and log critical data points."
      >
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowStartDryingModal(true)}><PlusCircle className="mr-2 h-4 w-4" /> Start New Drying Cycle</Button>
          <Button variant="outline" onClick={() => setShowLogEnvironmentModal(true)}><Thermometer className="mr-2 h-4 w-4" /> Log Environment Readings</Button>
        </div>
      </PageHeader>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Batches in Drying</CardTitle>
            <CardDescription>Manage active drying cycles. Alerts for overdue batches.</CardDescription>
          </CardHeader>
          <CardContent>
            {dryingBatches.length === 0 && <p className="text-muted-foreground text-center py-4">No batches currently in drying.</p>}
            <div className="space-y-4">
              {dryingBatches.map(batch => (
                <Card key={batch.id} className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">Batch {batch.id}</CardTitle>
                            <CardDescription>Source: {batch.sourceHarvest} | Room: {batch.room} | Method: {batch.method}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { /* TODO: Open edit modal for this batch */ toast({title:"Info", description: `Editing ${batch.id}`})}}><Edit className="h-4 w-4"/></Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p><strong>Start Date:</strong> {batch.startDate}</p>
                    <p><strong>Current Weight:</strong> {batch.currentWeight?.toLocaleString() || 'N/A'} g (Target: {batch.targetDryWeight?.toLocaleString() || 'N/A'} g)</p>
                    <p><strong>Assigned Staff:</strong> {batch.staff}</p>
                    <p className="flex items-center"><Hourglass className="mr-1 h-4 w-4 text-primary"/> <strong>Drying Time:</strong> {batch.timerDays} days (Est. 7-10 days) 
                        {batch.timerDays > 10 && <Bell className="ml-2 h-4 w-4 text-destructive" title="Potentially overdue!" />}
                    </p>
                    {batch.notes && <p><strong>Notes:</strong> {batch.notes}</p>}
                    <Button size="sm" className="mt-2 w-full" onClick={() => handleTransitionToCuring(batch)}><ArrowRightCircle className="mr-2 h-4 w-4"/>Transition to Curing</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
             <div className="mt-6 p-4 border border-dashed rounded-md text-center">
                <p className="text-muted-foreground text-sm">Click "Start New Drying Cycle" to add a new batch to this list.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Batches in Curing</CardTitle>
            <CardDescription>Manage active curing cycles. Monitor RH and duration.</CardDescription>
          </CardHeader>
          <CardContent>
            {curingBatches.length === 0 && <p className="text-muted-foreground text-center py-4">No batches currently in curing.</p>}
             <div className="space-y-4">
              {curingBatches.map(batch => (
                <Card key={batch.id} className="bg-muted/30">
                  <CardHeader className="pb-2">
                     <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">Batch {batch.id}</CardTitle>
                            <CardDescription>Source: {batch.sourceDryingBatch} | Container: {batch.containerType}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { /* TODO: Open edit modal for this batch */ toast({title:"Info", description: `Editing ${batch.id}`})}}><Edit className="h-4 w-4"/></Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p><strong>Start Date:</strong> {batch.startDate}</p>
                    <p><strong>Target Duration:</strong> {batch.targetDurationDays} days</p>
                    <p><strong>Current RH:</strong> {batch.currentRH || 'N/A'}% (Target: {batch.targetRH || 'N/A'}%)</p>
                    <p><strong>Assigned Staff:</strong> {batch.staff}</p>
                     <p className="flex items-center"><Hourglass className="mr-1 h-4 w-4 text-primary"/> <strong>Curing Time:</strong> {batch.timerDays} days
                         {batch.timerDays > batch.targetDurationDays && <Bell className="ml-2 h-4 w-4 text-destructive" title="Curing duration met or exceeded!" />}
                    </p>
                    {batch.notes && <p><strong>Notes:</strong> {batch.notes}</p>}
                     <Button size="sm" className="mt-2 w-full" onClick={() => handleMoveToPackaging(batch)}><ArrowRightCircle className="mr-2 h-4 w-4"/>Move to Packaging/Storage</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 p-4 border border-dashed rounded-md text-center">
                <p className="text-muted-foreground text-sm">Batches are transitioned here after drying. Click "Move to Packaging" when ready.</p>
            </div>
          </CardContent>
        </Card>
      </div>
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Environmental Logging (Optional)</CardTitle>
                <CardDescription>Log temperature, humidity, and other environmental factors if not using automated sensors.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">Click "Log Environment Readings" to manually enter data for a specific room or batch. Automated sensor integration would display real-time data here.</p>
            </CardContent>
        </Card>

      {/* Start New Drying Cycle Modal */}
      <Dialog open={showStartDryingModal} onOpenChange={setShowStartDryingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start New Drying Cycle</DialogTitle>
            <DialogDescription>Select harvested batch and drying parameters.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div><Label htmlFor="harvest-batch-id">Source Harvest Batch ID</Label><Input id="harvest-batch-id" placeholder="e.g., HVT-001"/></div>
            <div><Label htmlFor="drying-room">Drying Room</Label><Input id="drying-room" placeholder="e.g., Dry Room A"/></div>
            <div><Label htmlFor="drying-method">Drying Method</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select method..."/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="hang">Hang Dry</SelectItem>
                    <SelectItem value="rack">Rack/Tray Dry</SelectItem>
                </SelectContent></Select>
            </div>
            <div><Label htmlFor="target-dry-weight">Target Dry Weight (g) (Optional)</Label><Input id="target-dry-weight" type="number" placeholder="e.g., 1200"/></div>
            <div><Label htmlFor="drying-staff">Assigned Staff</Label><Input id="drying-staff" placeholder="e.g., Alice W."/></div>
            <div><Label htmlFor="drying-notes">Notes</Label><Textarea id="drying-notes" placeholder="Optional notes..."/></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartDryingModal(false)}>Cancel</Button>
            <Button onClick={handleStartDryingCycle}>Start Drying</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Environment Readings Modal */}
      <Dialog open={showLogEnvironmentModal} onOpenChange={setShowLogEnvironmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Environment Readings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div><Label htmlFor="env-batch-room">Batch ID / Room</Label><Input id="env-batch-room" placeholder="e.g., DRY-001 or Dry Room A"/></div>
            <div><Label htmlFor="env-temp">Temperature (°F)</Label><Input id="env-temp" type="number" placeholder="e.g., 70"/></div>
            <div><Label htmlFor="env-rh">Humidity (%)</Label><Input id="env-rh" type="number" placeholder="e.g., 55"/></div>
            <div><Label htmlFor="env-notes">Notes</Label><Textarea id="env-notes" placeholder="Optional notes..."/></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogEnvironmentModal(false)}>Cancel</Button>
            <Button onClick={handleLogEnvironment}>Log Readings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transition to Curing Modal */}
      <Dialog open={showTransitionToCuringModal} onOpenChange={setShowTransitionToCuringModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transition Batch {selectedDryingBatch?.id} to Curing</DialogTitle>
            <DialogDescription>Enter details for the new curing cycle.</DialogDescription>
          </DialogHeader>
           <div className="grid gap-4 py-4">
            <div><Label>Source Drying Batch ID: {selectedDryingBatch?.id}</Label></div>
            <div><Label htmlFor="curing-container">Curing Container Type</Label><Input id="curing-container" placeholder="e.g., Glass Jar, Food-grade Bin"/></div>
            <div><Label htmlFor="curing-duration">Target Curing Duration (days)</Label><Input id="curing-duration" type="number" placeholder="e.g., 14"/></div>
            <div><Label htmlFor="curing-target-rh">Target RH (%) (Optional)</Label><Input id="curing-target-rh" type="number" placeholder="e.g., 62"/></div>
            <div><Label htmlFor="curing-staff">Assigned Staff</Label><Input id="curing-staff" placeholder="e.g., Bob B."/></div>
            <div><Label htmlFor="curing-notes">Notes</Label><Textarea id="curing-notes" placeholder="Optional notes for curing..."/></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowTransitionToCuringModal(false); setSelectedDryingBatch(null);}}>Cancel</Button>
            <Button onClick={submitTransitionToCuring}>Start Curing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageContainer>
  );
}
    
