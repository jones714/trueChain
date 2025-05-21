
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ClipboardList, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MedicalInventoryPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Medical Inventory" 
        description="Manage cannabis products specifically for medical patients."
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
              <CardDescription>View, edit, or add new medical cannabis products.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Search medical products..." className="max-w-xs" />
              <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Placeholder for medical inventory table */}
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2">Medical inventory table will appear here. It will include details like product name, strain, cannabinoid profile, batch number, quantity, and patient-specific allocation if applicable.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
