
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Archive, Filter, MoreHorizontal, Eye, ArrowRightCircle, Recycle, Printer, CookingPot, ChevronDown, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';


type ProcessingStage = "Drying" | "Curing" | "Trimming" | "Extraction" | "Winterization" | "Distillation" | "Infusion" | "Packaging Input" | "Packaged" | "QA Testing";
type BatchStatus = "Active" | "Completed" | "Failed QA" | "On Hold" | "Awaiting Transfer" | "Awaiting Packaging";

type ProductType = "Flower" | "Trim" | "Fresh Frozen" | "Crude Extract" | "Distillate" | "Isolate" | "Edible Base" | "Tincture Base" | "Topical Base" | "Finished Edible" | "Finished Tincture" | "Finished Topical";

interface ProcessingBatch {
  id: string;
  harvestSource: string; // e.g., HVT-001 or another PROC-ID
  productType: ProductType;
  weightIn: number; // grams
  weightOut?: number; // grams
  currentStage: ProcessingStage;
  status: BatchStatus;
  assignedStaff?: string;
  lastUpdated: string; // ISO Date
}

const initialBatches: ProcessingBatch[] = [
  { id: "PROC-2024-001", harvestSource: "HVT-001", productType: "Flower", weightIn: 5200, currentStage: "Drying", status: "Active", assignedStaff: "Alice W.", lastUpdated: "2023-10-28" },
  { id: "PROC-2024-002", harvestSource: "HVT-002", productType: "Trim", weightIn: 1500, currentStage: "Extraction", status: "Active", assignedStaff: "Bob B.", lastUpdated: "2023-10-29" },
  { id: "PROC-2024-003", harvestSource: "PROC-2024-002 (Extract)", productType: "Edible Base", weightIn: 300, currentStage: "Awaiting Packaging", status: "Awaiting Packaging", weightOut: 280 , assignedStaff: "Charlie C.", lastUpdated: "2023-10-25" }, // Changed stage and status
  { id: "PROC-2024-004", harvestSource: "HVT-003", productType: "Flower", weightIn: 3000, currentStage: "Curing", status: "Failed QA", assignedStaff: "Alice W.", lastUpdated: "2023-10-22" },
  { id: "PROC-2024-005", harvestSource: "PROC-2024-003 (Edible Base)", productType: "Finished Edible", weightIn: 280, currentStage: "Packaged", status: "Completed", weightOut: 1000 , assignedStaff: "Charlie C.", lastUpdated: "2023-10-26" }, // Example of packaged goods in units
];

export default function ProcessingBatchesPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<ProcessingBatch | null>(null);

  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
  const [showAdvanceStageModal, setShowAdvanceStageModal] = useState(false);
  const [showLogWasteModal, setShowLogWasteModal] = useState(false);
  const [showAssignMetrcModal, setShowAssignMetrcModal] = useState(false);
  const [showAssignRecipeModal, setShowAssignRecipeModal] = useState(false);
  

  useEffect(() => {
    if (searchParams?.get('action') === 'create_batch') {
      setShowCreateBatchModal(true);
    }
  }, [searchParams]);

  const filteredBatches = useMemo(() => {
    return initialBatches.filter(batch => 
      batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.harvestSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.productType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getStatusColor = (status: BatchStatus) => {
    switch (status) {
      case "Active": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "Completed": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Failed QA": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "On Hold": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400";
      case "Awaiting Packaging": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handleCreateBatch = () => {
    // TODO: Call createProcessingBatch(data)
    toast({ title: "Success", description: "New processing batch created." });
    setShowCreateBatchModal(false);
  };

  const handleRowAction = (action: string, batch: ProcessingBatch) => {
    setSelectedBatch(batch);
    if (action === "advanceStage") setShowAdvanceStageModal(true);
    else if (action === "logWaste") setShowLogWasteModal(true);
    else if (action === "assignMetrc") setShowAssignMetrcModal(true);
    else if (action === "assignRecipe") setShowAssignRecipeModal(true);
    else if (action === "printLabels") toast({ title: "Action", description: `Printing labels for Batch ID: ${batch.id}` });

  };

  const handleSubmitModal = (modalType: string) => {
    if (modalType === "advanceStage") {
      // TODO: Call advanceProcessingStage(selectedBatch.id, nextStage)
      toast({ title: "Success", description: `Batch ${selectedBatch?.id} stage advanced.` });
      setShowAdvanceStageModal(false);
    } else if (modalType === "logWaste") {
      // TODO: Call logProcessingWaste(selectedBatch.id, wasteData)
      toast({ title: "Success", description: `Waste logged for Batch ${selectedBatch?.id}.` });
      setShowLogWasteModal(false);
    } else if (modalType === "assignMetrc") {
       toast({ title: "Success", description: `METRC tag assigned for Batch ${selectedBatch?.id}.` });
       setShowAssignMetrcModal(false);
    } else if (modalType === "assignRecipe") {
       toast({ title: "Success", description: `Recipe assigned to Batch ${selectedBatch?.id}.` });
       setShowAssignRecipeModal(false);
    }
    setSelectedBatch(null);
  };


  return (
    <PageContainer>
      <PageHeader 
        title="Processing Batches" 
        description="Manage all processing batches, from raw material input to finished products. Track stages, weights, staff assignments, and link to source harvests/batches. Click 'Create New Batch' to initiate a new processing workflow (e.g., from harvest to drying, or from extract to infusion)."
      >
        <Button onClick={() => setShowCreateBatchModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Batch
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
                <CardTitle>All Processing Batches</CardTitle>
                <CardDescription>Filterable list of batches. Includes raw materials, output products, and links to source materials.</CardDescription>
            </div>
             <div className="flex items-center gap-2">
                <Input 
                    placeholder="Search ID, Source, Type..." 
                    className="max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filters</Button>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Source Material</TableHead>
                <TableHead>Product Type</TableHead>
                <TableHead>Weight In (g)</TableHead>
                <TableHead>Weight Out (g/units)</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Staff</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.id}</TableCell>
                  <TableCell>{batch.harvestSource}</TableCell>
                  <TableCell>{batch.productType}</TableCell>
                  <TableCell>{batch.weightIn.toLocaleString()}</TableCell>
                  <TableCell>{batch.weightOut ? batch.weightOut.toLocaleString() : "N/A"}</TableCell>
                  <TableCell><Badge variant="secondary">{batch.currentStage}</Badge></TableCell>
                  <TableCell>
                    <Badge className={cn("whitespace-nowrap", getStatusColor(batch.status))}>
                      {batch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{batch.assignedStaff || "N/A"}</TableCell>
                  <TableCell>{batch.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions for {batch.id}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => { /* TODO: Route to detail page or open detail modal */ toast({title: "Info", description: "Viewing details..."})}}><Eye className="mr-2 h-4 w-4" />View Details & Logs</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRowAction("advanceStage", batch)}><ArrowRightCircle className="mr-2 h-4 w-4" />Move to Next Stage</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleRowAction("logWaste", batch)}><Recycle className="mr-2 h-4 w-4" />Log Waste</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleRowAction("assignMetrc", batch)}><Tag className="mr-2 h-4 w-4" />Assign METRC Tag (Packaging)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRowAction("printLabels", batch)}><Printer className="mr-2 h-4 w-4" />Print Packaging Labels</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRowAction("assignRecipe", batch)}><CookingPot className="mr-2 h-4 w-4" />Assign to Recipe</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive hover:!text-destructive focus:!text-destructive focus:!bg-destructive/10" onClick={() => toast({title: "Archived", description: `Batch ${batch.id} archived.`, variant: "destructive"})}>
                          <Archive className="mr-2 h-4 w-4" />Archive Batch
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBatches.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                        No processing batches found matching your criteria.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create New Batch Modal */}
      <Dialog open={showCreateBatchModal} onOpenChange={setShowCreateBatchModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Processing Batch</DialogTitle>
            <DialogDescription>Initiate a new processing workflow.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div><Label htmlFor="source-material-id">Source Material ID (Harvest/Batch)</Label><Input id="source-material-id" placeholder="e.g., HVT-001"/></div>
            <div><Label htmlFor="product-type">Product Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select product type..."/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Flower">Flower</SelectItem>
                    <SelectItem value="Trim">Trim</SelectItem>
                    <SelectItem value="Crude Extract">Crude Extract</SelectItem>
                </SelectContent></Select>
            </div>
            <div><Label htmlFor="weight-in">Weight In (g)</Label><Input id="weight-in" type="number" placeholder="e.g., 5000"/></div>
            <div><Label htmlFor="assigned-staff-proc">Assigned Staff</Label><Input id="assigned-staff-proc" placeholder="e.g., John Doe"/></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateBatchModal(false)}>Cancel</Button>
            <Button onClick={handleCreateBatch}>Create Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advance Stage Modal */}
      <Dialog open={showAdvanceStageModal} onOpenChange={setShowAdvanceStageModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Advance Stage for Batch {selectedBatch?.id}</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label htmlFor="next-stage">Next Stage</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select next stage..."/></SelectTrigger>
            <SelectContent>
                <SelectItem value="Curing">Curing</SelectItem>
                <SelectItem value="Trimming">Trimming</SelectItem>
                <SelectItem value="Extraction">Extraction</SelectItem>
                <SelectItem value="Awaiting Packaging">Awaiting Packaging</SelectItem>
            </SelectContent></Select>
            <Label htmlFor="weight-out-stage" className="mt-2">Weight Out (g) (Optional)</Label>
            <Input id="weight-out-stage" type="number" placeholder="If applicable"/>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdvanceStageModal(false)}>Cancel</Button>
            <Button onClick={() => handleSubmitModal("advanceStage")}>Confirm Next Stage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Log Waste Modal */}
      <Dialog open={showLogWasteModal} onOpenChange={setShowLogWasteModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Log Waste for Batch {selectedBatch?.id}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="waste-weight">Waste Weight (g)</Label><Input id="waste-weight" type="number" placeholder="e.g., 50"/>
            <Label htmlFor="waste-reason">Reason for Waste</Label><Textarea id="waste-reason" placeholder="Describe waste reason"/>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogWasteModal(false)}>Cancel</Button>
            <Button onClick={() => handleSubmitModal("logWaste")}>Log Waste</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign METRC Modal */}
       <Dialog open={showAssignMetrcModal} onOpenChange={setShowAssignMetrcModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign METRC Tag for {selectedBatch?.productType} from Batch {selectedBatch?.id}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="metrc-tag-input">New METRC Package Tag</Label><Input id="metrc-tag-input" placeholder="Scan or enter METRC Tag"/>
            <Label htmlFor="package-weight">Package Weight (g)</Label><Input id="package-weight" type="number" placeholder="e.g., 3.5"/>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignMetrcModal(false)}>Cancel</Button>
            <Button onClick={() => handleSubmitModal("assignMetrc")}>Assign Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Recipe Modal */}
      <Dialog open={showAssignRecipeModal} onOpenChange={setShowAssignRecipeModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Recipe to Batch {selectedBatch?.id}</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label htmlFor="recipe-select">Select Recipe</Label>
            <Select><SelectTrigger><SelectValue placeholder="Choose a recipe..."/></SelectTrigger>
            <SelectContent>
                <SelectItem value="REC001">REC001 - CBD Tincture - 500mg Peppermint</SelectItem>
                <SelectItem value="REC002">REC002 - Gummy Bears - 10mg THC Strawberry</SelectItem>
            </SelectContent></Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignRecipeModal(false)}>Cancel</Button>
            <Button onClick={() => handleSubmitModal("assignRecipe")}>Assign Recipe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageContainer>
  );
}
