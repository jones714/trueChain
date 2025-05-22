
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ClipboardList, Filter, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';


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
        title="Medical Inventory" 
        description="Manage cannabis products specifically for medical patients. Includes med-only product tagging, condition-based product eligibility, and supports access restrictions."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Medical Product
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle>All Medical Products</CardTitle>
              <CardDescription>View, edit, or add new medical cannabis products. Tag products for medical use only and manage condition-based eligibility.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Search medical products..." 
                className="max-w-xs" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Placeholder for medical inventory table */}
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2">Medical inventory table will appear here. It will include details like product name, strain, cannabinoid profile, batch number, quantity, patient-specific allocation if applicable, <strong className="inline-flex items-center"><Tag className="h-3 w-3 mr-1"/>med-only tags</strong>, and information regarding <strong className="text-primary">condition-based product eligibility</strong>.</p>
            <p className="text-xs mt-1">Access to certain products may be restricted based on user role, patient profile, and specific qualifying conditions.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
