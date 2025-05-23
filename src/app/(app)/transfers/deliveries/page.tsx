
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    PlusCircle, 
    MapPinned, 
    Car, 
    FileText, 
    Fingerprint, 
    Clock, 
    Thermometer, 
    MessageCircleWarning, 
    BellDot, 
    ListFilter, 
    TruckIcon,
    User,
    BadgeInfo,
    ShieldCheck,
    Edit,
    PackageCheck,
    DollarSign,
    Route,
    HistoryIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const deliveryQueueData = [
  { id: "DEL001", customer: "Jane Doe (Medical)", address: "123 Main St, Anytown", timeWindow: "2:00 PM - 4:00 PM", driver: "John D.", vehicle: "VAN-01", status: "Scheduled", items: 3, manifestId: "MFT-CUST-001" },
  { id: "DEL002", customer: "Mike Smith (Adult-Use)", address: "456 Oak Ave, Anytown", timeWindow: "3:00 PM - 5:00 PM", driver: "Sarah K.", vehicle: "CAR-02", status: "En Route", items: 2, manifestId: "MFT-CUST-002" },
  { id: "DEL003", customer: "Carlos R. (Medical)", address: "789 Pine Rd, Anytown", timeWindow: "10:00 AM - 12:00 PM", driver: "John D.", vehicle: "VAN-01", status: "Delivered", items: 5, manifestId: "MFT-CUST-003" },
  { id: "DEL004", customer: "Emily B. (Adult-Use)", address: "101 River Rd, Anytown", timeWindow: "ASAP", driver: "Pending", vehicle: "Pending", status: "Failed Attempt", items: 1, manifestId: "MFT-CUST-004" },
];

export default function CustomerDeliveriesPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Customer Delivery Management" 
        description="Oversee and manage direct-to-customer deliveries for both medical and adult-use cannabis. Includes route optimization, driver assignment, manifest generation, ID verification, and compliance logging."
      >
        <div className="flex flex-wrap gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Schedule New Delivery
          </Button>
          <Button variant="outline">
            <Route className="mr-2 h-4 w-4" /> Optimize Routes
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="queue">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-4">
          <TabsTrigger value="queue"><TruckIcon className="mr-1 h-4 w-4 hidden sm:inline-block"/>Delivery Queue</TabsTrigger>
          <TabsTrigger value="workflow"><Fingerprint className="mr-1 h-4 w-4 hidden sm:inline-block"/>Delivery Workflow</TabsTrigger>
          <TabsTrigger value="reports"><HistoryIcon className="mr-1 h-4 w-4 hidden sm:inline-block"/>Reports & KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <CardTitle>Real-Time Delivery Queue</CardTitle>
                            <CardDescription>View, sort, and manage all scheduled and active customer deliveries. Click a delivery for detailed actions.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Input placeholder="Filter by Customer, Address, Driver..." className="max-w-xs" />
                            <Button variant="outline"><ListFilter className="mr-2 h-4 w-4"/>Filters</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Delivery ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Time Window</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Manifest</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {deliveryQueueData.map((delivery) => (
                        <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.id}</TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate" title={delivery.customer}>{delivery.customer}</TableCell>
                        <TableCell className="text-xs">{delivery.timeWindow}</TableCell>
                        <TableCell>{delivery.driver}</TableCell>
                        <TableCell className="text-xs">{delivery.vehicle}</TableCell>
                        <TableCell className="text-xs">{delivery.manifestId}</TableCell>
                        <TableCell>
                            <Badge variant={
                                delivery.status === "Scheduled" ? "secondary" :
                                delivery.status === "En Route" ? "default" : // Consider primary for active
                                delivery.status === "Delivered" ? "outline" :
                                "destructive"
                            } className={cn(
                                delivery.status === "Scheduled" && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                                delivery.status === "En Route" && "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
                                delivery.status === "Delivered" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                                delivery.status === "Failed Attempt" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            )}>{delivery.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" title="View Details"><PackageCheck className="h-4 w-4"/></Button>
                            <Button variant="ghost" size="icon" title="Edit Delivery"><Edit className="h-4 w-4"/></Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                {deliveryQueueData.length === 0 && (
                    <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                    <TruckIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2">No deliveries currently in the queue.</p>
                    </div>
                )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="workflow">
            <Card>
                <CardHeader>
                    <CardTitle>Delivery Workflow & Compliance</CardTitle>
                    <CardDescription>Key steps and features for managing a compliant delivery from dispatch to drop-off.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-md flex items-center mb-2"><Car className="mr-2 h-5 w-5 text-primary"/>Driver & Vehicle Assignment</h3>
                        <p className="text-sm text-muted-foreground">Assign specific, compliant drivers and vehicles from the registry to each delivery. System validates licenses and vehicle status before dispatch.</p>
                        <Button variant="outline" size="sm" className="mt-2">View Driver/Vehicle Registry</Button>
                    </div>
                     <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-md flex items-center mb-2"><FileText className="mr-2 h-5 w-5 text-primary"/>Manifest Sync & Generation</h3>
                        <p className="text-sm text-muted-foreground">Compliant delivery manifests are auto-generated pulling necessary data from inventory (METRC tags, product details) and customer order. PDFs available for driver.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-md flex items-center mb-2"><Fingerprint className="mr-2 h-5 w-5 text-primary"/>ID Verification & Signature Capture</h3>
                        <p className="text-sm text-muted-foreground">Workflow for age and patient ID verification at drop-off (e.g., scanner integration or manual check). Capture digital signatures for proof of delivery. All attempts logged.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-md flex items-center mb-2"><Clock className="mr-2 h-5 w-5 text-primary"/>Timestamped & GPS Logs</h3>
                        <p className="text-sm text-muted-foreground">Record departure, arrival, and handoff times. GPS location data logged for full traceability, supplementing the chain of custody for the transfer.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold text-md flex items-center mb-2"><MessageCircleWarning className="mr-2 h-5 w-5 text-orange-500"/>Failed Delivery Workflow</h3>
                            <p className="text-sm text-muted-foreground">Options to reschedule, return items to facility inventory (with compliance checks), or quarantine product. Flags non-compliant actions.</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold text-md flex items-center mb-2"><BellDot className="mr-2 h-5 w-5 text-blue-500"/>Customer Notifications</h3>
                            <p className="text-sm text-muted-foreground">Automated SMS/email updates for customers: ETA, driver information, delivery confirmation. (Requires integration)</p>
                        </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-md flex items-center mb-2"><Thermometer className="mr-2 h-5 w-5 text-teal-500"/>Cold Chain Logging (Optional)</h3>
                        <p className="text-sm text-muted-foreground">For temperature-sensitive products, drivers can log temperature/humidity. System can validate against acceptable ranges. (Requires appropriate hardware/manual input)</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="reports">
             <Card>
                <CardHeader>
                    <CardTitle>Delivery Reporting & KPIs</CardTitle>
                    <CardDescription>Track key performance indicators and generate exportable reports for customer deliveries.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle></CardHeader>
                            <CardContent><p className="text-2xl font-bold">45 mins</p></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Success Rate</CardTitle></CardHeader>
                            <CardContent><p className="text-2xl font-bold">98%</p></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Compliance Issues (Last 30d)</CardTitle></CardHeader>
                            <CardContent><p className="text-2xl font-bold text-destructive">2</p></CardContent>
                        </Card>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold mb-2">Exportable Reports</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Daily/Weekly Delivery Summaries (CSV, PDF)</li>
                            <li>Driver Performance Reports</li>
                            <li>Compliance & ID Verification Logs</li>
                            <li>Failed Delivery Analysis</li>
                        </ul>
                        <Button variant="outline" className="mt-3">Download Reports</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">All delivery actions are logged and auditable. Role-based access controls apply.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

    </PageContainer>
  );
}
