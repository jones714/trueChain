
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, History, PackageSearch, ScanLine, Download, Boxes, BarChartBig, BellRing, Zap, Link2, CheckSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function InventoryPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Comprehensive Inventory Management" 
        description="Track cannabis products (bulk, packaged, sold), operational hardware, and ensure full traceability across multiple facilities and licenses. Includes tracking for non-METRC/sample batches.">
        <div className="flex flex-wrap gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
          </Button>
           <Button variant="outline">
            <ScanLine className="mr-2 h-4 w-4" /> Scan Item
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </div>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulk Cannabis Stock</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M15 11h.01"></path><path d="M9 11h.01"></path></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">500 kg</div>
            <p className="text-xs text-muted-foreground">Tracked by strain, batch, location</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Packaged Cannabis Units</CardTitle>
            <PackageSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,500 Units</div>
            <p className="text-xs text-muted-foreground">METRC tagged, ready for sale/transfer</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational Hardware</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,200 Items</div>
            <p className="text-xs text-muted-foreground">Jars, labels, cones, packaging</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold Inventory (30d)</CardTitle>
             <BarChartBig className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,200 Units</div>
            <p className="text-xs text-muted-foreground">Auto-reconciled with sales data</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <CardTitle>Detailed Inventory List</CardTitle>
                    <CardDescription>Comprehensive view of all items (cannabis & hardware) with METRC tags, quantities, locations, batch data (test results, waste logs, source), and status. Supports multi-location, multi-license views, and tracking of non-METRC/sample batches.</CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Input placeholder="Search inventory (tag, name, batch...)" className="max-w-xs" />
                    <Button variant="outline">Filters</Button>
                 </div>
            </div>
        </CardHeader>
        <CardContent>
           <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-base">Detailed Inventory Table Will Appear Here</p>
            <p className="text-xs">Includes columns for: Item ID, Name/Strain, METRC Tag, Product Type, Batch No., Quantity, Unit, Location (Facility & Room), Status, Expiry Date, Source Material, Last Test Result, etc.</p>
            <p className="text-xs mt-1">Hardware: Item Name, SKU, Quantity, Location, Reorder Point.</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg"><BellRing className="mr-2 h-5 w-5 text-primary"/>Automated Alerts & Notifications</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Receive real-time alerts for low stock levels, upcoming product expirations, and custom reorder thresholds to optimize inventory flow.</p>
                <Button variant="link" size="sm" className="p-0 h-auto text-primary mt-2">Configure Alerts</Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg"><Zap className="mr-2 h-5 w-5 text-primary"/>Inventory Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Leverage harvest schedules and sales data to predict future inventory needs, helping to prevent stockouts and overstock situations.</p>
                 <Button variant="link" size="sm" className="p-0 h-auto text-primary mt-2">View Forecast Models</Button>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg"><Link2 className="mr-2 h-5 w-5 text-primary"/>Key Integrations</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">METRC/BioTrack:</strong> Full state traceability sync.</li>
                    <li><strong className="text-foreground">LeafLink:</strong> Sync B2B wholesale orders.</li>
                </ul>
                 <Button variant="link" size="sm" className="p-0 h-auto text-primary mt-2">Manage Integrations</Button>
            </CardContent>
        </Card>
      </div>
       <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center text-lg"><CheckSquare className="mr-2 h-5 w-5 text-primary"/>Reconciliation & Audit Trails</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold">Inventory Reconciliation</h4>
                        <p className="text-sm text-muted-foreground mt-1">Streamlined workflows for periodic inventory counts and variance reporting. Easily identify discrepancies and adjust stock levels with full audit logs.</p>
                        <Button variant="outline" className="mt-3">Start New Reconciliation</Button>
                    </div>
                    <div>
                        <h4 className="font-semibold">Detailed Audit Logs</h4>
                        <p className="text-sm text-muted-foreground mt-1">Track all inventory movements, adjustments, and user actions with timestamps. Ensure accountability and compliance.</p>
                        <Button variant="outline" className="mt-3"><History className="mr-2 h-4 w-4"/> View Full Audit Log</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </PageContainer>
  );
}
