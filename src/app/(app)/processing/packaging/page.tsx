
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
import { PackagePlus, ScanBarcode, Printer, Tag, Users, Scale, Trash2, PlusCircle, Archive, ClipboardList } from "lucide-react";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';


interface ReadyToPackItem {
  id: string; 
  type: "Cured Flower" | "Trim" | "Extract" | "Infused Product Base";
  strainOrProductName: string;
  availableWeightOrUnits: number; 
  unitType: "g" | "units";
}

interface PackagingRun {
  id: string;
  sourceMaterialId: string;
  productSku: string; 
  packagingMaterialsUsed: { name: string; quantity: number }[];
  unitsCreated: number;
  finalBatchWeight?: number; 
  metrcPackageTag?: string;
  staff: string;
  rejectsWaste: number; 
  dateStarted: string;
  dateCompleted?: string;
  status: "Active" | "Completed" | "On Hold";
}

export default function PackagingPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [readyItems, setReadyItems] = useState<ReadyToPackItem[]>([
    { id: "CUR-001", type: "Cured Flower", strainOrProductName: "Blue Dream", availableWeightOrUnits: 1100, unitType: "g" },
    { id: "EXT-005", type: "Extract", strainOrProductName: "OG Kush Distillate", availableWeightOrUnits: 250, unitType: "g" },
    { id: "PROC-2024-003", type: "Infused Product Base", strainOrProductName: "Gummy Base", availableWeightOrUnits: 280, unitType: "g" },
  ]);

  const [activeRuns, setActiveRuns] = useState<PackagingRun[]>([]);
  const [showStartPackagingRunModal, setShowStartPackagingRunModal] = useState(false);
  const [selectedSourceMaterial, setSelectedSourceMaterial] = useState<ReadyToPackItem | null>(null);

  useEffect(() => {
    if (searchParams?.get('action') === 'start_packaging_run') {
      setShowStartPackagingRunModal(true);
    }
  }, [searchParams]);
  
  const handleStartPackagingForItem = (item: ReadyToPackItem) => {
    setSelectedSourceMaterial(item);
    setShowStartPackagingRunModal(true);
  };

  const handleInitiatePackagingRun = () => {
    // TODO: Call startPackagingRun(data)
    toast({ title: "Success", description: "Packaging run initiated."});
    setShowStartPackagingRunModal(false);
    setSelectedSourceMaterial(null);
  };
  
  const handlePrintLabels = () => {
    // TODO: Logic to select labels and trigger printing
    toast({ title: "Info", description: "Label printing process would start here." });
  };


  return (
    <PageContainer>
      <PageHeader 
        title="Packaging & Labeling" 
        description="Manage packaging of processed and manufactured products, assign METRC tags, and generate compliant labels. Track material usage, yields, and mark packages as 'ready' for inventory/transfer."
      >
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { setSelectedSourceMaterial(null); setShowStartPackagingRunModal(true); }}><PlusCircle className="mr-2 h-4 w-4" /> Start New Packaging Run</Button>
          <Button variant="outline" onClick={handlePrintLabels}><Printer className="mr-2 h-4 w-4" /> Print Labels</Button>
        </div>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Materials Ready for Packaging</CardTitle>
                    <CardDescription>Select source material to begin a packaging run. Status changes to 'Packaged' upon completion.</CardDescription>
                </CardHeader>
                <CardContent>
                    {readyItems.length === 0 && <p className="text-muted-foreground text-center py-4">No materials currently marked ready for packaging.</p>}
                    <div className="space-y-3">
                        {readyItems.map(item => (
                            <Card key={item.id} className="p-3 bg-muted/30">
                                <h4 className="font-semibold">{item.strainOrProductName} ({item.type})</h4>
                                <p className="text-xs text-muted-foreground">ID: {item.id} | Available: {item.availableWeightOrUnits}{item.unitType}</p>
                                <Button size="sm" className="w-full mt-2" onClick={() => handleStartPackagingForItem(item)}>Start Packaging</Button>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Packaging Material Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Track stock of jars, labels, cones, child-resistant packaging, etc. Alerts for low stock. (Integration with main Inventory Module)</p>
                    <Button variant="link" size="sm" className="p-0 mt-2 h-auto">View Packaging Supplies</Button>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Packaging Runs</CardTitle>
              <CardDescription>Manage ongoing packaging activities. Finalized packages are marked 'ready' for sale/transfer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeRuns.length === 0 && 
                <div className="p-3 border rounded-md text-center text-sm text-muted-foreground">
                  <p className="mb-2">No active packaging runs.</p>
                  <p className="text-xs">Start a new run by clicking "Start New Packaging Run" or selecting a material from the left.</p>
                </div>
              }
              {/* Placeholder for list of active runs */}
              {activeRuns.map(run => (
                <Card key={run.id} className="p-3">
                    <CardTitle className="text-md">Run ID: {run.id}</CardTitle>
                    <CardDescription>Source: {run.sourceMaterialId} | SKU: {run.productSku} | Status: {run.status}</CardDescription>
                    {/* Add more run details and actions here */}
                </Card>
              ))}
              
              <Separator className="my-6"/>

              <div className="mt-4 p-4 border-dashed border rounded-md">
                <h4 className="font-semibold text-sm mb-2 flex items-center"><ClipboardList className="mr-2 h-4 w-4 text-primary"/> Post-Packaging Actions</h4>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                    <li>Log final batch weight (if applicable) and units created.</li>
                    <li>Confirm METRC tag association per package/case.</li>
                    <li>Generate and print compliant labels (barcodes, warnings, CoA QR codes).</li>
                    <li>Update inventory for finished goods (status: Packaged / Ready for Sale).</li>
                    <li>Create reconciliation report (expected vs actual yield, material usage).</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Start New Packaging Run Modal */}
      <Dialog open={showStartPackagingRunModal} onOpenChange={(isOpen) => { setShowStartPackagingRunModal(isOpen); if (!isOpen) setSelectedSourceMaterial(null); }}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Start New Packaging Run</DialogTitle>
                <DialogDescription>Define parameters for the packaging run.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <Label htmlFor="source-material">Source Material ID</Label>
                <Input id="source-material" defaultValue={selectedSourceMaterial?.id || ""} placeholder="e.g., CUR-001 or PROC-2024-003" />
              </div>
              {selectedSourceMaterial && <p className="text-xs text-muted-foreground">Selected: {selectedSourceMaterial.strainOrProductName} ({selectedSourceMaterial.type}) - Available: {selectedSourceMaterial.availableWeightOrUnits}{selectedSourceMaterial.unitType}</p>}
              
              <div>
                <Label htmlFor="product-sku">Product SKU / Name (Finished Good)</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select finished product SKU" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sku-flwr-bc-3.5g">Flower - Blue Dream 3.5g Jar</SelectItem>
                    <SelectItem value="sku-cart-ogk-1g">Vape Cart - OG Kush 1g</SelectItem>
                    <SelectItem value="sku-edbl-choc-100mg">Edible - Chocolate Bar 100mg (10x10mg)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="units-to-create">Target Units to Create</Label>
                    <Input id="units-to-create" type="number" placeholder="e.g., 300" />
                </div>
                 <div>
                    <Label htmlFor="metrc-package-tag">METRC Package Tag (Auto-assign available)</Label>
                    <Input id="metrc-package-tag" placeholder="1A40603..." />
                </div>
              </div>

              <div>
                <Label>Packaging Materials Used (Deducted from Inventory)</Label>
                <div className="p-3 border rounded-md bg-muted/20 space-y-2">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Label htmlFor="material-name" className="text-xs">Material</Label>
                            <Select>
                                <SelectTrigger id="material-name"><SelectValue placeholder="Select Material" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="jar-3.5g">3.5g Glass Jar</SelectItem>
                                    <SelectItem value="label-mj">Compliance Label Lrg</SelectItem>
                                    <SelectItem value="cone-1g">1g Pre-roll Cone</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-24">
                             <Label htmlFor="material-qty" className="text-xs">Quantity</Label>
                            <Input id="material-qty" type="number" placeholder="Qty"/>
                        </div>
                        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0"><PlusCircle className="h-4 w-4"/></Button>
                    </div>
                    {/* Placeholder for list of added materials */}
                </div>
              </div>

              <div>
                <Label htmlFor="assigned-staff-pkg">Assigned Staff</Label>
                <Input id="assigned-staff-pkg" placeholder="Staff names" />
              </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => { setShowStartPackagingRunModal(false); setSelectedSourceMaterial(null); }}>Cancel</Button>
                <Button onClick={handleInitiatePackagingRun}><Archive className="mr-2 h-4 w-4"/>Initiate Packaging Run</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageContainer>
  );
}
