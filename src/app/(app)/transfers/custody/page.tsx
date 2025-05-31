
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock, Compass, Edit, FileText, Download, Filter, AlertTriangle, Camera, ShieldCheck, Signature, PlusCircle } from "lucide-react"; // Added PlusCircle
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Added Label
import { Textarea } from "@/components/ui/textarea"; // Added Textarea
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Added Dialog components
import { useState } from "react"; // Added useState
import { useToast } from "@/hooks/use-toast"; // Added useToast

const custodyLogData = [
    { manifestId: "MFT-00123", event: "Departure", timestamp: "2023-11-15 10:00 AM", actor: "John D. (Driver)", vehicle: "VAN-01 (PLATE-ABC)", location: "Main Cultivation - Dock A", geo: "34.0522° N, 118.2437° W", notes: "All packages verified.", signature: true, photo: false, isComplete: true },
    { manifestId: "MFT-00123", event: "Handoff Attempt", timestamp: "2023-11-15 01:50 PM", actor: "John D. (Driver)", vehicle: "VAN-01", location: "Downtown Dispensary", geo: "34.0588° N, 118.2399° W", notes: "Recipient unavailable.", signature: false, photo: false, isComplete: false },
    { manifestId: "MFT-00123", event: "Arrival & Recipient Signature", timestamp: "2023-11-15 02:30 PM", actor: "Jane S. (Receiving Clerk)", vehicle: "VAN-01", location: "Downtown Dispensary - Receiving", geo: "34.0588° N, 118.2399° W", notes: "All items received in good condition.", signature: true, photo: true, isComplete: true },
    { manifestId: "MFT-00124", event: "Departure", timestamp: "2023-11-14 09:00 AM", actor: "Jane S. (Driver)", vehicle: "TRUCK-02 (PLATE-XYZ)", location: "Processing Center - Bay 3", geo: "34.0011° N, 118.0022° W", notes: "Sample transfer for testing.", signature: true, photo: false, isComplete: true },
    { manifestId: "MFT-00124", event: "Arrival & Lab Intake", timestamp: "2023-11-14 10:15 AM", actor: "Dr. Labcoat (Lab Tech)", vehicle: "TRUCK-02", location: "Test Lab Alpha - Intake", geo: "34.0055° N, 118.0088° W", notes: "Samples intact.", signature: true, photo: false, isComplete: true },
];


export default function ChainOfCustodyPage() {
  const { toast } = useToast();
  const [showLogCheckpointModal, setShowLogCheckpointModal] = useState(false);
  const [selectedManifestForLog, setSelectedManifestForLog] = useState<string | null>(null);

  const handleOpenLogCheckpointModal = (manifestId?: string) => {
    setSelectedManifestForLog(manifestId || null);
    setShowLogCheckpointModal(true);
  };

  const handleSaveLogCheckpoint = () => {
    // TODO: Call backend function addCustodyLogEntry(manifestId, logData)
    toast({ title: "Log Entry Saved", description: `New CoC entry for manifest ${selectedManifestForLog || 'N/A'} saved.` });
    setShowLogCheckpointModal(false);
    setSelectedManifestForLog(null);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Chain of Custody Tracking" 
        description="View immutable, detailed audit trails for all transfers, including timestamps, personnel, vehicle details, GPS locations, digital signatures, and photo evidence. Essential for compliance and traceability."
      >
         <div className="flex items-center space-x-2">
            <Input placeholder="Filter by Manifest ID, Driver, Date..." className="max-w-xs" />
            <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Apply Filters</Button>
            <Button onClick={() => handleOpenLogCheckpointModal()}><PlusCircle className="mr-2 h-4 w-4"/>Log New Checkpoint</Button>
            <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export Log</Button>
        </div>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Transfer Audit Logs</CardTitle>
          <CardDescription>
            Track every step of a transfer. Incomplete logs or deviations trigger compliance alerts. 
            System supports linking test results for sample transfers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {custodyLogData.length > 0 ? (
            <div className="space-y-4">
                {custodyLogData.map((log, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${log.isComplete ? 'border-green-200 dark:border-green-800' : 'border-orange-200 dark:border-orange-800'} bg-muted/30 hover:shadow-md transition-shadow`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold text-md">Manifest #{log.manifestId} - <span className="text-primary">{log.event}</span></h4>
                                <p className="text-xs text-muted-foreground"><Clock className="inline h-3 w-3 mr-0.5"/> {log.timestamp}</p>
                            </div>
                            {log.isComplete ? 
                                <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"><ShieldCheck className="inline h-3 w-3 mr-1"/>Log Complete</Badge> :
                                <Badge variant="destructive" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"><AlertTriangle className="inline h-3 w-3 mr-1"/>Incomplete/Issue</Badge>
                            }
                        </div>
                        <div className="mt-2 text-sm space-y-1">
                            <p><strong className="w-24 inline-block">Actor:</strong> {log.actor}</p>
                            <p><strong className="w-24 inline-block">Vehicle:</strong> {log.vehicle}</p>
                            <p><strong className="w-24 inline-block">Location:</strong> <MapPin className="inline h-3.5 w-3.5 mr-1 text-muted-foreground"/>{log.location}</p>
                            {log.geo && <p><strong className="w-24 inline-block">GPS:</strong> <Compass className="inline h-3.5 w-3.5 mr-1 text-blue-500"/>{log.geo}</p>}
                            {log.notes && <p><strong className="w-24 inline-block">Notes:</strong> {log.notes}</p>}
                             <div className="flex items-center gap-4 text-xs mt-1">
                                {log.signature && <span className="flex items-center text-green-600"><Signature className="inline h-3.5 w-3.5 mr-1"/>Signature Captured</span>}
                                {log.photo && <span className="flex items-center text-blue-600"><Camera className="inline h-3.5 w-3.5 mr-1"/>Photo Attached</span>}
                            </div>
                        </div>
                        <div className="text-right mt-2">
                             <Button variant="ghost" size="sm" onClick={() => toast({title:"Info", description:`Viewing details for manifest ${log.manifestId}`})}><FileText className="mr-1 h-3 w-3"/>View Full Manifest</Button>
                             <Button variant="ghost" size="sm" className="ml-1" onClick={() => handleOpenLogCheckpointModal(log.manifestId)}><Edit className="mr-1 h-3 w-3"/>Add/Edit Log Entry</Button>
                        </div>
                    </div>
                ))}
            </div>
          ) : (
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No chain of custody records found for the selected criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Checkpoint Modal */}
      <Dialog open={showLogCheckpointModal} onOpenChange={setShowLogCheckpointModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Chain of Custody Checkpoint</DialogTitle>
            <DialogDescription>Record a new event for manifest {selectedManifestForLog || "(New Manifest)"}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <div><Label htmlFor="coc-manifest-id">Manifest ID</Label><Input id="coc-manifest-id" defaultValue={selectedManifestForLog || ""} placeholder="e.g., MFT-00123"/></div>
            <div><Label htmlFor="coc-event-type">Event Type</Label><Input id="coc-event-type" placeholder="e.g., Departure, Arrival, Handoff, Checkpoint"/></div>
            <div><Label htmlFor="coc-actor">Actor (Driver/Staff Name)</Label><Input id="coc-actor" placeholder="e.g., John D."/></div>
            <div><Label htmlFor="coc-location">Location (GPS or Manual)</Label><Input id="coc-location" placeholder="e.g., Facility Dock A or GPS Coordinates"/></div>
            <div><Label htmlFor="coc-notes">Notes</Label><Textarea id="coc-notes" placeholder="Details of the event..."/></div>
            <div className="flex items-center space-x-2"><Input type="checkbox" id="coc-signature"/><Label htmlFor="coc-signature">Capture Signature</Label></div>
            <div className="flex items-center space-x-2"><Input type="checkbox" id="coc-photo"/><Label htmlFor="coc-photo">Attach Photo</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogCheckpointModal(false)}>Cancel</Button>
            <Button onClick={handleSaveLogCheckpoint}>Save Log Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageContainer>
  );
}
