
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Printer, Edit3, Filter, DownloadCloud, Route, Tag, Package, User, Truck, CalendarClock, FileSymlink, Upload, AlertTriangle, CheckCircle2 } from "lucide-react"; // Changed TruckIcon to Truck
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

const manifestsData = [
  { id: "MFT-00123", origin: "Main Cultivation (LIC-CULT-001)", recipient: "Downtown Dispensary (LIC-RET-001)", driver: "John D.", vehicle: "VAN-01", items: 5, status: "In Transit", created: "2023-11-15", metrcPushed: true },
  { id: "MFT-00124", origin: "Processing Center (LIC-PROC-001)", recipient: "Test Lab Alpha (LIC-LAB-001)", driver: "Jane S.", vehicle: "TRUCK-02", items: 2, status: "Delivered", created: "2023-11-14", metrcPushed: true },
  { id: "MFT-00125", origin: "Main Cultivation (LIC-CULT-001)", recipient: "North End Retail (LIC-RET-002)", driver: "Mike R.", vehicle: "VAN-01", items: 10, status: "Draft", created: "2023-11-16", metrcPushed: false },
  { id: "MFT-00126", origin: "Main Cultivation (LIC-CULT-001)", recipient: "Downtown Dispensary (LIC-RET-001)", driver: "Sarah K.", vehicle: "VAN-03", items: 3, status: "Reconciled", created: "2023-11-10", metrcPushed: true },
];

export default function ManifestsPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [showCreateManifestModal, setShowCreateManifestModal] = useState(false);
  const [showEditManifestModal, setShowEditManifestModal] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<typeof manifestsData[0] | null>(null);


  useEffect(() => {
    if (searchParams?.get('action') === 'create') {
      setShowCreateManifestModal(true);
    }
    const manifestIdParam = searchParams?.get('manifestId');
    if (manifestIdParam) {
        const foundManifest = manifestsData.find(m => m.id === manifestIdParam);
        if (foundManifest) {
            setSelectedManifest(foundManifest);
            // Potentially open a detail view modal or pre-fill an edit form
            toast({title: "Manifest Loaded", description: `Details for ${manifestIdParam} would be shown here.`});
        }
    }
  }, [searchParams, toast]);

  const handleCreateManifest = () => {
    // TODO: Call createManifest(manifestData)
    toast({ title: "Success", description: "Manifest created successfully." });
    setShowCreateManifestModal(false);
  };
  
  const handleEditManifest = (manifest: typeof manifestsData[0]) => {
    setSelectedManifest(manifest);
    setShowEditManifestModal(true);
  };
  
  const handleSaveEditManifest = () => {
    // TODO: Call updateManifest(selectedManifest.id, updatedData)
    toast({ title: "Success", description: `Manifest ${selectedManifest?.id} updated.` });
    setShowEditManifestModal(false);
    setSelectedManifest(null);
  };

  const handlePrintManifest = (manifestId: string) => {
    // TODO: Generate PDF or open print dialog
    toast({ title: "Printing Manifest", description: `Generating PDF for ${manifestId}.` });
  };

  const handleMarkAsCompleted = (manifestId: string) => {
    // TODO: Call updateManifestStatus(manifestId, "Completed")
    toast({ title: "Manifest Completed", description: `${manifestId} marked as completed.` });
  };


  return (
    <PageContainer>
      <PageHeader 
        title="METRC-Compliant Manifests" 
        description="Create, manage, and track transfer manifests. Integrates with inventory for package selection (including METRC tags, quantities, weights), assigns driver & vehicle (from registry), sets estimated delivery windows, allows attachments, and can auto-push to METRC. Output includes printable PDFs with QR codes. Changes are synced with METRC."
      >
        <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowCreateManifestModal(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Manifest
            </Button>
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4"/> Filters
            </Button>
        </div>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Manifest Creation Details</CardTitle>
          <CardDescription>
            Manifests pull data directly from inventory. Key fields include: Origin/Recipient Licenses & Facilities, 
            Products (Packages with METRC tags, quantities, weights), assigned Driver & Vehicle, estimated delivery window, 
            and optional attachments (photos, documents). Output includes printable PDFs with QR codes for easy scanning. 
            Changes are synced with METRC. Manifest statuses: Draft → Dispatched → In Transit → Delivered → Reconciled.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">Click "Create New Manifest" to start. Details for a selected manifest would appear here or in a modal.</p>
            <div className="mt-4 p-4 border border-dashed rounded-md text-center text-muted-foreground">
                <FileSymlink className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
                <p>Manifest creation form / detailed view placeholder.</p>
                <p className="text-xs">Fields: Origin, Recipient, <User className="inline h-3 w-3"/>Driver, <Truck className="inline h-3 w-3"/>Vehicle, <Package className="inline h-3 w-3"/>Packages (Select from Inventory), <Tag className="inline h-3 w-3"/>METRC Tags (Auto-populated), <CalendarClock className="inline h-3 w-3"/>ETA, Notes, <Upload className="inline h-3 w-3"/>Attachments.</p>
            </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Manifests</CardTitle>
          <CardDescription>List of all generated manifests with their current status. Role-based access controls apply. Mock data used for demo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Manifest ID</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>METRC</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {manifestsData.map((manifest) => (
                    <TableRow key={manifest.id}>
                        <TableCell className="font-medium">{manifest.id}</TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate" title={manifest.origin}>{manifest.origin}</TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate" title={manifest.recipient}>{manifest.recipient}</TableCell>
                        <TableCell>{manifest.driver}</TableCell>
                        <TableCell>{manifest.items}</TableCell>
                        <TableCell>
                            <Badge variant={
                                manifest.status === "Draft" ? "secondary" :
                                manifest.status === "In Transit" ? "default" :
                                manifest.status === "Delivered" ? "outline" : 
                                manifest.status === "Reconciled" ? "default" : 
                                "destructive"
                            }
                            className={cn(
                                manifest.status === "Draft" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
                                manifest.status === "In Transit" && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                                manifest.status === "Delivered" && "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
                                manifest.status === "Reconciled" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            )}
                            >{manifest.status}</Badge>
                        </TableCell>
                        <TableCell>
                            {manifest.metrcPushed ? <CheckCircle2 className="h-5 w-5 text-green-500" title="Synced with METRC"/> : <AlertTriangle className="h-5 w-5 text-orange-500" title="Pending METRC Sync"/>}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" title="View Details" onClick={() => toast({title:"Info", description: `Viewing details for ${manifest.id}`})}><FileText className="h-4 w-4"/></Button>
                            <Button variant="ghost" size="icon" title="Print Manifest" onClick={() => handlePrintManifest(manifest.id)}><Printer className="h-4 w-4"/></Button>
                            <Button variant="ghost" size="icon" title="Edit/Dispatch Manifest" onClick={() => handleEditManifest(manifest)}><Edit3 className="h-4 w-4"/></Button>
                             {manifest.status === "Delivered" && <Button variant="ghost" size="icon" title="Mark as Reconciled/Completed" onClick={() => handleMarkAsCompleted(manifest.id)}><CheckCircle2 className="h-4 w-4 text-green-600"/></Button>}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
          {manifestsData.length === 0 && (
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No manifests found. Click "Create New Manifest" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
            <CardTitle>Route Management & Dispatch Sheets</CardTitle>
            <CardDescription>Define delivery routes, assign multiple manifests, estimate times, and export dispatch sheets for drivers. (Advanced Feature Placeholder)</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
            <Route className="h-12 w-12 mx-auto mb-2 opacity-50"/>
            <p>Optimized route planning and dispatch sheet generation tools will be accessible here.</p>
            <Button variant="outline" className="mt-3" disabled>Plan Multi-Stop Route</Button>
        </CardContent>
      </Card>

      {/* Create New Manifest Modal */}
      <Dialog open={showCreateManifestModal} onOpenChange={setShowCreateManifestModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Transfer Manifest</DialogTitle>
            <DialogDescription>Select packages, assign transport, and set details for the transfer.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div><Label htmlFor="origin-facility">Origin Facility/License</Label><Input id="origin-facility" placeholder="Select origin..." defaultValue="Main Cultivation (LIC-CULT-001)" /></div>
            <div><Label htmlFor="recipient-facility">Recipient Facility/License</Label><Input id="recipient-facility" placeholder="Select recipient..." /></div>
            <div><Label htmlFor="driver-select">Driver</Label><Input id="driver-select" placeholder="Select driver..." /></div>
            <div><Label htmlFor="vehicle-select">Vehicle</Label><Input id="vehicle-select" placeholder="Select vehicle..." /></div>
            <div><Label htmlFor="packages-select">Packages (Select from Inventory)</Label><Textarea id="packages-select" placeholder="Placeholder for package selection component. E.g., PKG001 (Flower, 100g), PKG002 (Extract, 50g)" rows={3}/></div>
            <div><Label htmlFor="eta-datetime">Estimated Time of Arrival</Label><Input id="eta-datetime" type="datetime-local" /></div>
            <div><Label htmlFor="manifest-notes">Notes (Optional)</Label><Textarea id="manifest-notes" placeholder="e.g., Handle with care, specific delivery instructions." rows={2}/></div>
            <div><Label htmlFor="manifest-attachments">Attachments (Optional)</Label><Input id="manifest-attachments" type="file" multiple /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateManifestModal(false)}>Cancel</Button>
            <Button onClick={handleCreateManifest}><FileSymlink className="mr-2 h-4 w-4"/>Generate Manifest</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Manifest Modal */}
      <Dialog open={showEditManifestModal} onOpenChange={setShowEditManifestModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Manifest: {selectedManifest?.id}</DialogTitle>
            <DialogDescription>Update details for the selected manifest. Some fields may be locked after dispatch.</DialogDescription>
          </DialogHeader>
           <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div><Label htmlFor="edit-origin-facility">Origin Facility/License</Label><Input id="edit-origin-facility" defaultValue={selectedManifest?.origin} /></div>
            <div><Label htmlFor="edit-recipient-facility">Recipient Facility/License</Label><Input id="edit-recipient-facility" defaultValue={selectedManifest?.recipient} /></div>
            <div><Label htmlFor="edit-driver-select">Driver</Label><Input id="edit-driver-select" defaultValue={selectedManifest?.driver} /></div>
            <div><Label htmlFor="edit-vehicle-select">Vehicle</Label><Input id="edit-vehicle-select" defaultValue={selectedManifest?.vehicle} /></div>
            <div><Label htmlFor="edit-packages-select">Packages</Label><Textarea id="edit-packages-select" placeholder="List of packages..." defaultValue={`Items: ${selectedManifest?.items}`} rows={2}/></div>
            <div><Label htmlFor="edit-eta-datetime">Estimated Time of Arrival</Label><Input id="edit-eta-datetime" type="datetime-local" /></div>
            <div><Label htmlFor="edit-status-select">Status</Label>
                <select className="w-full p-2 border rounded-md" defaultValue={selectedManifest?.status}>
                    <option>Draft</option>
                    <option>In Transit</option>
                    <option>Delivered</option>
                    <option>Reconciled</option>
                </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowEditManifestModal(false); setSelectedManifest(null);}}>Cancel</Button>
            <Button onClick={handleSaveEditManifest}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageContainer>
  );
}
