
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
import { PlusCircle, Trash2, CalendarPlus, Download, UploadCloud, Edit, FileTextIcon, BarChartHorizontalBig, Filter, AlertTriangle, CheckCircle, Clock, CameraIcon, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Dummy data for waste logs
const wasteLogsData = [
  { id: "WST001", metrcTag: "1A4060300000E0E000000123", type: "Plant Material", source: "Harvest HVT-005", initialWeight: "5.2 kg", finalWeight: "5.15 kg", loggedBy: "Alice W.", dateLogged: "2023-10-25", status: "Awaiting Destruction", destructionMethod: "Grinding & Mixing", scheduledDestruction: "2023-11-01", proofAvailable: true, witness: "Security Guard #1" },
  { id: "WST002", metrcTag: "1A4060300000E0E000000124", type: "Expired Product", source: "Batch PRD-072", initialWeight: "0.8 kg", finalWeight: "0.78 kg", loggedBy: "Bob B.", dateLogged: "2023-10-26", status: "Destruction Overdue", destructionMethod: "Incineration", scheduledDestruction: "2023-10-28", proofAvailable: false, witness: "Jane D." },
  { id: "WST003", metrcTag: "1A4060300000E0E000000125", type: "Chemical Waste", source: "Lab Test LT-015", initialWeight: "0.1 L", finalWeight: "0.1 L", loggedBy: "Charlie C.", dateLogged: "2023-10-27", status: "Destroyed", destructionMethod: "Neutralization", scheduledDestruction: "2023-10-27", proofAvailable: true, witness: "Lab Supervisor" },
];

const scheduledDestructionsData = [
  { id: "DEVT001", scheduledDate: "2023-11-01 10:00 AM", location: "Destruction Area A", method: "Grinding & Mixing", totalWeight: "5.2 kg", assignedStaff: "Alice W., Security Guard #1", status: "Pending" },
  { id: "DEVT002", scheduledDate: "2023-11-05 02:00 PM", location: "Facility B - Incinerator", method: "Incineration", totalWeight: "10.5 kg", assignedStaff: "Bob B., Compliance Officer", status: "Pending" },
];


export default function WasteManagementPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Waste Management & METRC Compliance" 
        description="Track, manage, and report cannabis waste (plant, product, chemical) from seed-to-sale. Ensure full regulatory compliance with METRC tag association, destruction method tracking, before/after weights, chain-of-custody (staff, time, location), photo/video proof, and witness logs. Auto-generates destruction logs and supports audit exports."
      >
        <div className="flex flex-wrap gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Waste Record
          </Button>
          <Button variant="outline">
            <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Destruction Event
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Logs (CSV/PDF)
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waste Logged (Month)</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.7 kg</div>
            <p className="text-xs text-muted-foreground">+2.1 kg from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Pending Destruction</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.0 kg</div>
            <p className="text-xs text-muted-foreground">2 active records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Overdue Destruction Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">1</div>
            <p className="text-xs text-muted-foreground">0.8 kg (WST002)</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Trends</CardTitle>
             <BarChartHorizontalBig className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Visualization of waste by type, method, facility. Anomaly detection (e.g. excessive waste per batch) highlighted.</div>
             <p className="text-xs text-muted-foreground mt-2">Dashboard will show trends and flag anomalies.</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="log">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mt-4 mb-4">
          <TabsTrigger value="log"><Trash2 className="mr-1 h-4 w-4 hidden sm:inline-block"/>Active Waste Log</TabsTrigger>
          <TabsTrigger value="scheduled"><CalendarPlus className="mr-1 h-4 w-4 hidden sm:inline-block"/>Scheduled Destructions</TabsTrigger>
          <TabsTrigger value="compliance"><FileTextIcon className="mr-1 h-4 w-4 hidden sm:inline-block"/>Compliance & Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <CardTitle>Active Waste Log</CardTitle>
                    <CardDescription>Real-time log of all waste items, with METRC tag association. Mobile logging support for on-site entries. Log includes initial/final weights, destruction method, witness, and photo/video proof.</CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Input placeholder="Filter by METRC Tag, Type, Witness..." className="max-w-xs" />
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filters</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>METRC Tag</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Weight (Initial/Final)</TableHead>
                    <TableHead>Witness</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Proof</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wasteLogsData.map((log) => (
                    <TableRow key={log.id} className={cn(log.status === "Destruction Overdue" && "bg-destructive/10 hover:bg-destructive/20")}>
                      <TableCell className="font-medium">{log.metrcTag}</TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{log.initialWeight} / {log.finalWeight || 'N/A'}</TableCell>
                      <TableCell><UserCheck className="inline h-3.5 w-3.5 mr-1 text-muted-foreground"/>{log.witness || 'N/A'}</TableCell>
                      <TableCell>{log.dateLogged}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={log.status === "Destroyed" ? "default" : log.status === "Awaiting Destruction" ? "secondary" : "destructive"}
                          className={cn(
                            log.status === "Destroyed" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                            log.status === "Awaiting Destruction" && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                            log.status === "Destruction Overdue" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400"
                          )}
                        >
                          {log.status === "Destruction Overdue" && <AlertTriangle className="inline h-3 w-3 mr-1"/>}
                          {log.status === "Destroyed" && <CheckCircle className="inline h-3 w-3 mr-1"/>}
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.proofAvailable ? <CameraIcon className="h-5 w-5 text-primary" title="Proof Available"/> : <CameraIcon className="h-5 w-5 text-muted-foreground opacity-50" title="No Proof Uploaded"/>}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" title="Upload Proof/Photo/Video">
                          <UploadCloud className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" title="Record Destruction Details">
                          <Edit className="h-4 w-4" />
                        </Button>
                         <Button variant="ghost" size="icon" title="View Details">
                          <FileTextIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {wasteLogsData.length === 0 && (
                <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                  <Trash2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">No waste records found. Click "Add New Waste Record" to get started.</p>
                  <p className="text-xs mt-1">Waste is categorized (plant, product, chemical), logged with METRC tags, and tracks destruction method, weight (before/after), chain-of-custody (staff, time, location), witness, and photo/video proof.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Destruction Events</CardTitle>
              <CardDescription>Manage and track upcoming and ongoing waste destruction events. Alerts for approaching deadlines and requires witness logs for completion.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event ID</TableHead>
                    <TableHead>Scheduled Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Total Weight</TableHead>
                    <TableHead>Assigned Staff/Witnesses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledDestructionsData.map((event) => (
                     <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.id}</TableCell>
                        <TableCell>{event.scheduledDate}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.method}</TableCell>
                        <TableCell>{event.totalWeight}</TableCell>
                        <TableCell>{event.assignedStaff}</TableCell>
                        <TableCell>
                           <Badge variant={event.status === "Completed" ? "default" : "secondary"}>{event.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm">Start Event / Log Details</Button>
                            <Button variant="ghost" size="sm" className="ml-2">View Details</Button>
                        </TableCell>
                     </TableRow>
                  ))}
                </TableBody>
              </Table>
               {scheduledDestructionsData.length === 0 && (
                <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                  <CalendarPlus className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">No destruction events scheduled.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
            <Card>
                <CardHeader>
                    <CardTitle>Compliance & Reporting</CardTitle>
                    <CardDescription>Generate destruction logs, view audit trails, and manage state reporting integration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-md">Destruction Logs & Audit Trails</h3>
                        <p className="text-sm text-muted-foreground mt-1">Auto-generate compliant destruction logs. Maintain a full audit trail for all waste activities, including chain-of-custody (staff, time, location, witness, photo/video proof).</p>
                        <Button variant="default" className="mt-3">Generate Destruction Log (PDF/CSV)</Button>
                        <Button variant="outline" className="mt-3 ml-2">View Full Audit Trail</Button>
                    </div>
                     <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-md">State Reporting Integration</h3>
                        <p className="text-sm text-muted-foreground mt-1">Configure and manage integration with state waste reporting systems (e.g., METRC) for automated data submission where applicable.</p>
                        <Button variant="outline" className="mt-3" disabled>Configure State Integration (Future)</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Role-based access controls ensure data integrity and security for all waste management operations.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
