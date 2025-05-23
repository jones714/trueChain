
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DownloadCloud, CheckCircle, XCircle, AlertTriangle, Filter, PackageCheck, Signature, Edit, History, TruckIcon } from "lucide-react"; // Changed Truck to TruckIcon
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Dummy data for incoming transfers
const incomingTransfersData = [
  { manifestId: "MFT-IN-0078", fromFacility: "Green Fields Cultivation (LIC-CULT-GF)", driver: "Mark P.", vehicle: "VAN-02 (PLATE-GHI)", eta: "2023-11-15 10:00 AM", itemCount: 12, status: "Pending Acceptance", discrepancy: false },
  { manifestId: "MFT-IN-0079", fromFacility: "Peak Extracts (LIC-PROC-PE)", driver: "Laura K.", vehicle: "TRUCK-01 (PLATE-JKL)", eta: "2023-11-16 02:30 PM", itemCount: 5, status: "Pending Acceptance", discrepancy: false },
  { manifestId: "MFT-IN-0070", fromFacility: "Old Time Harvests (LIC-CULT-OTH)", driver: "Tom B.", vehicle: "VAN-01 (PLATE-ABC)", eta: "2023-11-10 09:00 AM", itemCount: 8, status: "Accepted", discrepancy: true, notes: "1 package damaged" },
];


export default function IncomingTransfersPage() {
  // For a real app, manage selectedTransfer state for detailed view
  // const [selectedTransfer, setSelectedTransfer] = useState(null); 

  return (
    <PageContainer>
      <PageHeader 
        title="Incoming Transfers Management" 
        description="View, accept, or reject incoming cannabis product transfers. Reconcile with inventory and log any discrepancies or damages. All actions are audit logged with staff ID and timestamps."
      >
         <div className="flex items-center space-x-2">
            <Input placeholder="Filter by Manifest ID, Origin..." className="max-w-xs" />
            <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Apply Filters</Button>
        </div>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Pending & Recent Incoming Transfers</CardTitle>
          <CardDescription>Review details of inbound shipments. Inventory is updated upon acceptance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Manifest ID</TableHead>
                <TableHead>From Facility</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>ETA / Arrival</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomingTransfersData.map((transfer) => (
                <TableRow key={transfer.manifestId} className={cn(transfer.status === "Accepted" && transfer.discrepancy && "bg-yellow-50 dark:bg-yellow-900/30")}>
                  <TableCell className="font-medium">{transfer.manifestId}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate" title={transfer.fromFacility}>{transfer.fromFacility}</TableCell>
                  <TableCell>{transfer.driver}</TableCell>
                  <TableCell className="text-xs">{transfer.vehicle}</TableCell>
                  <TableCell>{transfer.eta}</TableCell>
                  <TableCell>{transfer.itemCount}</TableCell>
                  <TableCell>
                     <Badge variant={
                        transfer.status === "Pending Acceptance" ? "secondary" :
                        transfer.status === "Accepted" ? "default" : "destructive"
                     } className={cn(
                        transfer.status === "Pending Acceptance" && "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
                        transfer.status === "Accepted" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                        transfer.status === "Rejected" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                     )}>
                        {transfer.status}
                        {transfer.status === "Accepted" && transfer.discrepancy && <AlertTriangle className="ml-1 inline h-3 w-3"/>}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {transfer.status === "Pending Acceptance" ? (
                        <>
                        <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 focus:ring-green-500">
                            <CheckCircle className="mr-1 h-3.5 w-3.5" /> Accept
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 focus:ring-red-500">
                            <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                        </Button>
                        </>
                    ) : (
                        <Button variant="ghost" size="sm"><History className="mr-1 h-3.5 w-3.5"/>View Log</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {incomingTransfersData.length === 0 && (
                <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                    <DownloadCloud className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2">No incoming transfers found matching your criteria.</p>
                </div>
           )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
            <CardTitle>Process Selected Incoming Transfer (Example)</CardTitle>
            <CardDescription>
                When an incoming transfer is selected, its details would populate here for verification and processing. 
                This includes item-by-item reconciliation against the manifest, logging discrepancies, damage reports with photo uploads, 
                and capturing receiver signature.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {/* Placeholder for detailed processing form */}
            <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-semibold text-lg mb-2">Manifest ID: MFT-IN-0078 (Details)</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <p><strong>From:</strong> Green Fields Cultivation</p>
                    <p><strong>Driver:</strong> Mark P. <span className="text-xs text-muted-foreground">(Vehicle: VAN-02)</span></p>
                    <p><strong>Expected Items:</strong> 12 Packages</p>
                    <p><strong>Status:</strong> Pending Acceptance</p>
                </div>
                <Separator className="my-4" />
                <div>
                    <Label htmlFor="received-items" className="font-medium">Received Items Verification</Label>
                    <div className="mt-1 p-3 border rounded-md text-center text-xs text-muted-foreground">
                        <PackageCheck className="h-6 w-6 mx-auto mb-1 opacity-60"/>
                        Item-by-item checklist/scanner input placeholder. <br/> Verify quantities, METRC tags, product integrity.
                    </div>
                </div>
                 <div className="mt-3">
                    <Label htmlFor="discrepancy-notes">Discrepancy Notes / Damage Report</Label>
                    <Textarea id="discrepancy-notes" placeholder="Log any issues, e.g., 'Package #1A40... damaged, 1 unit short.'" rows={2}/>
                    <Button variant="outline" size="sm" className="mt-1 text-xs"><Edit className="mr-1 h-3 w-3"/>Upload Photos</Button>
                </div>
                <div className="mt-3">
                    <Label htmlFor="receiver-signature">Receiver Signature</Label>
                    <div className="mt-1 p-3 h-20 border rounded-md text-center text-xs text-muted-foreground flex items-center justify-center">
                       <Signature className="h-6 w-6 mr-2 opacity-60"/> Digital Signature Pad Placeholder
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">Reject Transfer</Button>
                    <Button className="bg-green-600 hover:bg-green-700">Accept & Reconcile Inventory</Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                All acceptance/rejection actions, discrepancies, and staff interactions are recorded in an immutable audit log.
                Accepted inventory is automatically added to the receiving facility's stock, linked to the original METRC tags and manifest.
            </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
