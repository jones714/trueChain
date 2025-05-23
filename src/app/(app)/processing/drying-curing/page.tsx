
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Thermometer, Wind, PlusCircle, Hourglass, ArrowRightCircle, Bell, Users, Edit } from "lucide-react"; // Using Wind as a proxy for drying/curing
import { useState } from "react";

interface DryingBatch {
  id: string;
  sourceHarvest: string;
  startDate: string;
  room: string;
  method: string; // Rack, Hang, Tray
  targetDryWeight?: number; // grams
  currentWeight?: number; // grams
  staff: string;
  notes?: string;
  timerDays: number; // conceptual timer
}

interface CuringBatch {
  id: string;
  sourceDryingBatch: string;
  startDate: string;
  containerType: string;
  targetDurationDays: number;
  targetRH?: number; // percentage
  currentRH?: number; // percentage
  staff: string;
  notes?: string;
  timerDays: number; // conceptual timer
}


export default function DryingCuringPage() {
  const [dryingBatches, setDryingBatches] = useState<DryingBatch[]>([
    {id: "DRY-001", sourceHarvest: "HVT-001", startDate: "2023-10-25", room: "Dry Room A", method: "Hang", targetDryWeight: 1200, staff: "Alice W.", timerDays: 3, currentWeight: 1800 },
  ]);
  const [curingBatches, setCuringBatches] = useState<CuringBatch[]>([
    {id: "CUR-001", sourceDryingBatch: "DRY-001", startDate: "2023-10-28", containerType: "Glass Jar", targetDurationDays: 14, targetRH: 62, staff: "Bob B.", timerDays: 1 },
  ]);

  // TODO: Add forms for starting new drying/curing cycles

  return (
    <PageContainer>
      <PageHeader 
        title="Drying & Curing Management" 
        description="Monitor and manage drying and curing environments, track batch progress, and log critical data points."
      >
        <div className="flex flex-wrap gap-2">
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Start New Drying Cycle</Button>
          <Button variant="outline"><Thermometer className="mr-2 h-4 w-4" /> Log Environment Readings</Button>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4"/></Button>
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
                    <Button size="sm" className="mt-2 w-full"><ArrowRightCircle className="mr-2 h-4 w-4"/>Transition to Curing</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Form to start new drying cycle would go here */}
             <div className="mt-6 p-4 border border-dashed rounded-md text-center">
                <p className="text-muted-foreground text-sm">Form to start a new drying cycle (select harvested batch, room, method, staff, log start date, target weight, notes).</p>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4"/></Button>
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
                     <Button size="sm" className="mt-2 w-full"><ArrowRightCircle className="mr-2 h-4 w-4"/>Move to Packaging/Storage</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Form to start new curing cycle would go here */}
            <div className="mt-6 p-4 border border-dashed rounded-md text-center">
                <p className="text-muted-foreground text-sm">Form to start new curing (select dried batch, container, target duration, target RH, staff, notes).</p>
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
                <p className="text-muted-foreground text-sm">Placeholder for manual environmental data entry form (select batch, date/time, temp, RH, notes). Automated sensor integration would display real-time data here.</p>
            </CardContent>
        </Card>
    </PageContainer>
  );
}

    