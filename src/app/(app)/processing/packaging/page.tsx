
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackagePlus, ScanBarcode, Printer, Tag, Users, Scale, Trash2, PlusCircle, Archive, ClipboardList } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface ReadyToPackItem {
  id: string; // Source batch ID (e.g., CUR-001, EXT-005, PROC-2024-003)
  type: "Cured Flower" | "Trim" | "Extract" | "Infused Product Base";
  strainOrProductName: string;
  availableWeightOrUnits: number; // grams or base units
  unitType: "g" | "units";
}

interface PackagingRun {
  id: string;
  sourceMaterialId: string;
  productSku: string; // e.g., SKU-FLWR-BC-3.5G
  packagingMaterialsUsed: { name: string; quantity: number }[];
  unitsCreated: number;
  finalBatchWeight?: number; // grams (optional, relevant for bulk flower)
  metrcPackageTag?: string;
  staff: string;
  rejectsWaste: number; // grams or units
  dateStarted: string;
  dateCompleted?: string;
  status: "Active" | "Completed" | "On Hold";
}

export default function PackagingPage() {
  const [readyItems, setReadyItems] = useState<ReadyToPackItem[]>([
    { id: "CUR-001", type: "Cured Flower", strainOrProductName: "Blue Dream", availableWeightOrUnits: 1100, unitType: "g" },
    { id: "EXT-005", type: "Extract", strainOrProductName: "OG Kush Distillate", availableWeightOrUnits: 250, unitType: "g" },
    { id: "PROC-2024-003", type: "Infused Product Base", strainOrProductName: "Gummy Base", availableWeightOrUnits: 280, unitType: "g" },
  ]);

  const [activeRuns, setActiveRuns] = useState<PackagingRun[]>([]);

  return (
    <PageContainer>
      <PageHeader 
        title="Packaging & Labeling" 
        description="Manage packaging of processed and manufactured products, assign METRC tags, and generate compliant labels. Track material usage, yields, and mark packages as 'ready' for inventory/transfer."
      >
        <div className="flex flex-wrap gap-2">
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Start New Packaging Run</Button>
          <Button variant="outline"><Printer className="mr-2 h-4 w-4" /> Print Labels</Button>
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
                                <Button size="sm" className="w-full mt-2">Start Packaging</Button>
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
              <CardTitle>Start/Manage Packaging Run</CardTitle>
              <CardDescription>Define parameters for a new packaging run or manage an active one. Finalized packages are marked 'ready' for sale/transfer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* This would be a more complex form, simplified here */}
              <div>
                <Label htmlFor="source-material">Source Material ID</Label>
                <Input id="source-material" placeholder="e.g., CUR-001 or PROC-2024-003" />
              </div>
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
              
              <Button className="w-full"><Archive className="mr-2 h-4 w-4"/>Initiate Packaging Run</Button>
              
              <Separator className="my-6"/>

              <h3 className="text-md font-semibold">Active Packaging Runs</h3>
              {activeRuns.length === 0 && <p className="text-muted-foreground text-center py-4 text-sm">No active packaging runs.</p>}
              {/* Placeholder for list of active runs */}
              <div className="p-3 border rounded-md text-center text-sm text-muted-foreground">
                  <p>List of active packaging runs will appear here, with options to log progress (units packaged, weight used), assign METRC tags, log rejects/waste, and complete the run. Completed runs update inventory status to 'Packaged' or 'Ready for Sale'.</p>
              </div>
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
    </PageContainer>
  );
}
