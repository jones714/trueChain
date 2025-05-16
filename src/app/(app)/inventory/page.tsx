import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, History, PackageSearch } from "lucide-react";

export default function InventoryPage() {
  return (
    <PageContainer>
      <PageHeader title="Inventory Management" description="Real-time overview of bulk, packaged, and sold products.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Inventory Item
        </Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Bulk Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Current stock of bulk cannabis material.</p>
            <div className="mt-2 text-2xl font-bold">500 kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Packaged Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Total units of packaged goods.</p>
            <div className="mt-2 text-2xl font-bold">12,500 Units</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sold Inventory (Last 30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Units sold in the past month.</p>
            <div className="mt-2 text-2xl font-bold">3,200 Units</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Detailed Inventory List</CardTitle>
                <Button variant="outline"><History className="mr-2 h-4 w-4" /> View Audit Log</Button>
            </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A comprehensive table of all inventory items, including METRC tags, quantities, locations, and status. Supports multi-location and multi-license views.</p>
           <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2">Detailed inventory table will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
