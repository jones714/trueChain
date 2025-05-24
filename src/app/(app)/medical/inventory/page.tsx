
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ClipboardList, Filter, Tag, Info, AlertCircle, ListFilter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 

export default function MedicalInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // Placeholder for actual inventory data and filtering logic
  // const [inventory, setInventory] = useState([]); 
  // const [filteredInventory, setFilteredInventory] = useState([]);

  // useEffect(() => {
  //   // Fetch or set inventory data
  //   // Filter logic based on searchTerm
  // }, [searchTerm]);

  return (
    <PageContainer>
      <PageHeader 
        title="Medical Inventory Management" 
        description="Manage cannabis products specifically for medical patients. Includes med-only tagging, condition-based eligibility filtering via a suitability matrix, access restrictions, and detailed product suitability data (THC/CBD, terpenes, effects)."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Medical Product
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Medical Product Stock</CardTitle>
              <CardDescription>View, edit, or add medical cannabis products. Apply med-only tags, manage condition eligibility using a product-condition matrix, and check prescription compatibility. Product suitability data displayed.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Input 
                placeholder="Search medical products (name, strain, SKU)..." 
                className="sm:max-w-xs w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" className="w-full sm:w-auto"><Filter className="mr-2 h-4 w-4"/>Advanced Filters</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                <h3 className="text-lg font-semibold mb-2 flex items-center"><SlidersHorizontal className="mr-2 h-5 w-5 text-primary"/>Filtering & Suitability</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="condition-filter" className="text-sm font-medium">Filter by Patient-Eligible Condition</Label>
                        <Select>
                            <SelectTrigger id="condition-filter" className="mt-1">
                                <SelectValue placeholder="e.g., PTSD, Chronic Pain" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ptsd">PTSD</SelectItem>
                                <SelectItem value="chronic-pain">Chronic Pain</SelectItem>
                                <SelectItem value="cancer">Cancer</SelectItem>
                                <SelectItem value="epilepsy">Epilepsy (Low-THC)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">View products suitable for specific qualifying conditions. Inventory can be tagged with eligible conditions, potentially automated based on COA data and a configurable Condition-Product Suitability Matrix.</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium mb-1 flex items-center"><AlertCircle className="mr-1 h-4 w-4 text-orange-500"/>Prescription Compatibility Checker</h4>
                        <p className="text-xs text-muted-foreground">System will alert if selected inventory does not match any currently active patient recommendations, dosage limits, or condition eligibility via the suitability matrix. (Placeholder)</p>
                    </div>
                </div>
            </div>
            
          {/* Placeholder for medical inventory table */}
          <div className="mt-4 p-6 border border-dashed rounded-md text-center text-muted-foreground">
            <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-base mb-1">Medical Inventory Table Placeholder</p>
            <p className="text-sm">Detailed table will display here, including:</p>
            <ul className="list-disc list-inside text-xs text-left mx-auto max-w-md mt-2">
                <li>Product Name, Strain, Batch Number, Quantity, METRC Tag</li>
                <li className="flex items-center"><Tag className="h-3 w-3 mr-1 text-primary"/>Med-Only Tags & Access Restrictions</li>
                <li>Patient-Specific Allocations (if applicable)</li>
                <li><Info className="h-3 w-3 mr-1 text-blue-500"/>Auto-displayed Suitability Data: THC%, CBD%, Terpene Profile, Strain Type, Intended Effects</li>
                <li><ListFilter className="h-3 w-3 mr-1 text-green-500"/>Condition-Based Product Eligibility Tags (derived from matrix)</li>
            </ul>
             <p className="text-xs mt-2">Access to certain products may be restricted based on user role, patient profile, and specific qualifying conditions defined in the suitability matrix.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

// Add Label component if not already globally available
const Label = ({ htmlFor, className, children }: { htmlFor?: string, className?: string, children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-foreground ${className || ''}`}>
    {children}
  </label>
);
