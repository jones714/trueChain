
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
import { PlusCircle, ArchiveBox, Filter, MoreHorizontal, Eye, ArrowRightCircle, Recycle, Printer, CookingPot, ChevronDown, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

type ProcessingStage = "Drying" | "Curing" | "Trimming" | "Extraction" | "Winterization" | "Distillation" | "Infusion" | "Packaging" | "QA Testing";
type BatchStatus = "Active" | "Completed" | "Failed QA" | "On Hold" | "Awaiting Transfer";
type ProductType = "Flower" | "Trim" | "Fresh Frozen" | "Crude Extract" | "Distillate" | "Isolate" | "Edible" | "Tincture" | "Topical";

interface ProcessingBatch {
  id: string;
  harvestSource: string; // e.g., HVT-001
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
  { id: "PROC-2024-003", harvestSource: "PROC-2024-002 (Extract)", productType: "Edible", weightIn: 300, currentStage: "Packaging", status: "Completed", weightOut: 2800 , assignedStaff: "Charlie C.", lastUpdated: "2023-10-25" },
  { id: "PROC-2024-004", harvestSource: "HVT-003", productType: "Flower", weightIn: 3000, currentStage: "Curing", status: "Failed QA", assignedStaff: "Alice W.", lastUpdated: "2023-10-22" },
];

export default function ProcessingBatchesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // Add more filters as needed: stageFilter, statusFilter, productTypeFilter

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
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Processing Batches" 
        description="Manage all processing batches, from raw material input to finished products. Track stages, weights, and staff assignments."
      >
        <Button>
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
                <TableHead>Weight Out (g)</TableHead>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Details & Logs</DropdownMenuItem>
                        <DropdownMenuItem><ArrowRightCircle className="mr-2 h-4 w-4" />Move to Next Stage</DropdownMenuItem>
                        <DropdownMenuItem><Recycle className="mr-2 h-4 w-4" />Log Waste</DropdownMenuItem>
                         <DropdownMenuItem><Tag className="mr-2 h-4 w-4" />Assign METRC Tag</DropdownMenuItem>
                        <DropdownMenuItem><Printer className="mr-2 h-4 w-4" />Print Packaging Labels</DropdownMenuItem>
                        <DropdownMenuItem><CookingPot className="mr-2 h-4 w-4" />Assign to Recipe</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive hover:!text-destructive focus:!text-destructive focus:!bg-destructive/10">
                          <ArchiveBox className="mr-2 h-4 w-4" />Archive Batch
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
    </PageContainer>
  );
}

    