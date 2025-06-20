
"use client";

import * as React from "react";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle, BarChart3, Bell, BriefcaseMedical, CalendarClock, CheckCircle2, Cog,
  DollarSign, FileText, Filter, GaugeCircle, Leaf, ListChecks, LucideIcon, Package,
  Palette, Route, Settings2, ShieldAlert, ShoppingCart, Sprout, Star, Sun,
  Thermometer, Users, Workflow, TrendingUp, Clock, Lightbulb, Truck, PackageSearch, Archive, NotebookText, FlaskConical, UserPlus, ListFilter as ListFilterIcon, Activity, Info, Settings, Edit
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


// Dummy data for charts and KPIs
const kpiSummary = {
  activePlantBatches: 120,
  inventoryValue: 750000, // Representing total value or units
  metrcStatus: "Operational",
  pendingTransfers: 5,
};

const alertsData = [
  { id: "A001", severity: "high", message: "METRC Sync Failed: 3 packages pending.", timestamp: "2 min ago", icon: AlertTriangle, iconColor: "text-destructive" },
  { id: "A002", severity: "medium", message: "Batch FLW-045 failed pesticide test.", timestamp: "1 hour ago", icon: ShieldAlert, iconColor: "text-orange-500" },
  { id: "A003", severity: "low", message: "Facility A - License expiring in 15 days.", timestamp: "3 hours ago", icon: FileText, iconColor: "text-yellow-500" },
  { id: "A004", severity: "medium", message: "Low stock warning: Blue Dream 3.5g Jars (5 units left).", timestamp: "Yesterday", icon: PackageSearch, iconColor: "text-orange-500" },
];

const timelineEvents = [ // Represents data from /systemEvents
  { id: "T001", time: "Now", event: "Delivery DEL-007 to 'Main St Dispensary' en route.", icon: Truck, iconColor: "text-blue-500" },
  { id: "T002", time: "In 2 Hours", event: "Drying cycle for batch DRY-034 completes.", icon: Clock, iconColor: "text-green-500" },
  { id: "T003", time: "Tomorrow 9 AM", event: "Scheduled destruction event WST-EVT-012.", icon: Archive, iconColor: "text-gray-500" },
  { id: "T004", time: "Yesterday 3 PM", event: "Harvest HVT-105 completed. Yield: 2.5kg.", icon: Sprout, iconColor: "text-primary" },
];

const aiInsights = [
    { id: "I001", insight: "Strain 'OG Kush' sales are 20% above average this week. Consider re-stocking.", type: "Sales" },
    { id: "I002", insight: "Batch 'FLW-051' (Blue Dream) is nearing its expiration date (7 days). Consider converting to extract or offering a promotion.", type: "Inventory"},
    { id: "I003", insight: "Humidity levels in Flower Room 2A have been consistently high for 3 days. Investigate for potential mold risk.", type: "Cultivation" },
];

const productSpotlight = {
    name: "Sunset Sherbet Flower",
    salesIncrease: "+15% this week",
    image: "https://placehold.co/100x80.png", // Placeholder image
    dataAiHint: "cannabis flower"
};

const upcomingAppointments = [
    { id: "APP001", patient: "John Doe", time: "Today, 2:00 PM", type: "Follow-up Consultation"},
    { id: "APP002", patient: "Jane Smith", time: "Tomorrow, 10:30 AM", type: "Initial Medical Assessment"},
];


export default function DashboardPageV2() {
  const userRole = "Admin"; // Example role for demo purposes. Widget visibility would depend on this.
  const [showCreatePlantBatchModal, setShowCreatePlantBatchModal] = React.useState(false);
  const [showGenerateManifestModal, setShowGenerateManifestModal] = React.useState(false);

  // Placeholder for user's widget preferences (fetched from /users/{userId}/dashboardPreferences)
  // const [widgetPreferences, setWidgetPreferences] = React.useState({
  //   activePlants: { visible: true, order: 1 },
  //   inventoryValue: { visible: true, order: 2 },
  //   // ... other widgets
  // });
  // For demo, we'll imply this customization through descriptive text.

  const quickActions = [
    { title: "Create Plant Batch", icon: Sprout, action: () => setShowCreatePlantBatchModal(true) },
    { title: "Log Harvest / Update Stage", icon: Edit, href: "/plants" }, // Route to plants page, user selects batch for harvest/stage update
    { title: "Generate Manifest", icon: FileText, action: () => setShowGenerateManifestModal(true) },
    { title: "New Sale (POS)", icon: ShoppingCart, href: "/sales/pos" },
    { title: "Request Lab Test", icon: FlaskConical, href: "/lab-testing/requests?action=create" },
  ];


  return (
    <PageContainer>
      <PageHeader
        title="TruChain Command Center"
        description={`Welcome back, ${userRole}! This is your dynamic overview. Widgets are role-aware and can be customized (drag & drop, hide/show - preferences saved to /users/{userId}/dashboardPreferences) to display relevant KPIs and tools. Non-critical widgets are deferred for faster initial load.`}
      >
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" /> Customize Dashboard
        </Button>
      </PageHeader>

      {/* KPI Summary Bar */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plant Batches</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiSummary.activePlantBatches}</div>
            <p className="text-xs text-muted-foreground">Across all active facilities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Snapshot</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${kpiSummary.inventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total value by category (e.g. Flower, Edibles)</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                    <CardTitle className="text-sm font-medium">Compliance Status (METRC)</CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs">Real-time METRC sync status and error reporting.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <GaugeCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold flex items-center">
                {kpiSummary.metrcStatus} 
                <CheckCircle2 className="h-5 w-5 text-green-500 ml-2"/>
            </div>
            <p className="text-xs text-muted-foreground">Last sync: 2 min ago</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiSummary.pendingTransfers}</div>
            <p className="text-xs text-muted-foreground">Manifests with "In Transit" status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area (Primary Widgets) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
             <CardHeader>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CardTitle className="flex items-center cursor-default"><AlertTriangle className="mr-2 h-5 w-5 text-destructive" />Real-Time Alerts</CardTitle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Critical compliance violations, operational issues, overdue tasks, etc.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <CardDescription>Critical compliance warnings, operational issues, lab result failures, overdue transfers, low inventory, or expiring licenses. Click an alert for details.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                {alertsData.map(alert => (
                  <div key={alert.id} className="mb-3 p-2 border-l-4 rounded-r-md bg-muted/50 dark:bg-muted/20 hover:bg-muted/70 cursor-pointer transition-colors last:mb-0"
                       style={{ borderColor: alert.iconColor.includes('destructive') ? 'hsl(var(--destructive))' : alert.iconColor.includes('orange') ? 'hsl(var(--accent))' : 'hsl(var(--border))' }}>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <alert.icon className={cn("h-4 w-4 mr-2 shrink-0", alert.iconColor)} />
                            <p className="text-sm font-medium text-foreground">{alert.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.timestamp}</span>
                     </div>
                  </div>
                ))}
                {alertsData.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No active alerts.</p>}
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><CalendarClock className="mr-2 h-5 w-5 text-primary" />Recent Activity Feed & Timeline</CardTitle>
              <CardDescription>Visual schedule of upcoming and recent key events from /systemEvents: drying cycles, lab pickups, manifest deliveries, etc. Data loads on demand to improve initial render time.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                {timelineEvents.map(event => (
                  <div key={event.id} className="flex items-start mb-3 last:mb-0">
                    <event.icon className={cn("h-4 w-4 mr-3 mt-1 shrink-0", event.iconColor)} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{event.event}</p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                ))}
                {timelineEvents.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No events in timeline.</p>}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Mini Analytics - Example, could be customized by role */}
          {(userRole === "Admin" || userRole === "Retail Clerk") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-primary" />Mini Analytics</CardTitle>
                <CardDescription>Quick insights into key performance areas (e.g., sales, strain yield, lab pass/fail). Widgets may show loading skeletons while fetching data.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Sales Trend (7 Days)</h4>
                  <div className="h-20 bg-muted/50 rounded-md flex items-center justify-center text-xs text-muted-foreground p-2">
                    [Conceptual Sparkline: Sales Data]
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Top Strain Yield (Sample)</h4>
                  <div className="h-20 bg-muted/50 rounded-md flex items-center justify-center text-xs text-muted-foreground p-2">
                    [Conceptual Bar Chart: Strain Yields]
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar Area */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Cog className="mr-2 h-5 w-5 text-primary" />Quick Actions</CardTitle>
              <CardDescription className="text-xs">Common tasks. (Customizable by user role and preferences from /users/{'{userId}'}/dashboardPreferences)</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {quickActions.map(action => (
                <Button 
                    key={action.title} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-auto py-1.5 justify-start" 
                    onClick={action.action ? action.action : undefined}
                    asChild={!!action.href}
                >
                  {action.href ? (
                    <Link href={action.href}>
                        <action.icon className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                        {action.title}
                    </Link>
                  ) : (
                    <>
                        <action.icon className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                        {action.title}
                    </>
                  )}
                </Button>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center text-base font-semibold"><Bell className="mr-2 h-5 w-5 text-primary"/>Notification Center</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7"><ListFilterIcon className="h-4 w-4"/></Button>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-xs mb-2">Centralized inbox for system alerts, compliance flags, event reminders, and team messages. Filter by severity or type. (Conceptual - Full UI in /notifications)</CardDescription>
                <ScrollArea className="h-32">
                    <div className="text-xs mb-1.5 p-1.5 border-l-2 border-destructive/50 bg-destructive/5 rounded-r-sm">
                        <p className="font-medium">METRC Sync Failed (High)</p>
                        <p className="text-muted-foreground">3 packages unsynced. <Link href="#" className="text-primary hover:underline">Details</Link></p>
                    </div>
                     <div className="text-xs mb-1.5 p-1.5 border-l-2 border-yellow-500/50 bg-yellow-500/5 rounded-r-sm">
                        <p className="font-medium">License Expiry Reminder (Medium)</p>
                        <p className="text-muted-foreground">Facility A license expires in 15 days. <Link href="#" className="text-primary hover:underline">Renew</Link></p>
                    </div>
                </ScrollArea>
                <Button variant="outline" size="sm" className="w-full text-xs mt-3">View All Notifications</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />AI-Powered Insights</CardTitle>
               <CardDescription className="text-xs">Suggestions to optimize operations, based on data patterns.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-40">
                {aiInsights.map(insight => (
                  <div key={insight.id} className="text-xs mb-2 p-1.5 border-l-2 border-primary/50 bg-primary/5 dark:bg-primary/10 rounded-r-sm">
                    <p className="font-medium text-foreground/90">{insight.insight}</p>
                    <p className="text-muted-foreground">Type: {insight.type}</p>
                  </div>
                ))}
                 {aiInsights.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No AI insights available.</p>}
              </ScrollArea>
               <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-2">View More Insights</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Conceptual Section for More/Role-Specific Widgets */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-muted-foreground">More Insights / Role-Specific Widgets (Customizable Visibility)</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(userRole === "Admin" || userRole === "Medical Provider") && (
                <Card>
                <CardHeader><CardTitle className="flex items-center"><BriefcaseMedical className="mr-2 h-5 w-5 text-primary"/>Upcoming Appointments</CardTitle></CardHeader>
                <CardContent>
                    <ScrollArea className="h-32">
                    {upcomingAppointments.map(appt => (
                        <div key={appt.id} className="text-sm mb-1.5 pb-1.5 border-b last:border-b-0">
                        <p className="font-medium">{appt.patient} - <span className="text-muted-foreground">{appt.type}</span></p>
                        <p className="text-xs text-muted-foreground">{appt.time}</p>
                        </div>
                    ))}
                    {upcomingAppointments.length === 0 && <p className="text-xs text-muted-foreground text-center">No upcoming appointments.</p>}
                    </ScrollArea>
                </CardContent>
                </Card>
            )}
            {(userRole === "Admin" || userRole === "Retail Clerk") && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Star className="mr-2 h-5 w-5 text-amber-500"/>Product Spotlight</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3">
                        <img src={productSpotlight.image} alt={productSpotlight.name} width={80} height={64} className="rounded-md object-cover aspect-[5/4]" data-ai-hint={productSpotlight.dataAiHint} />
                        <div>
                            <h4 className="font-semibold text-sm">{productSpotlight.name}</h4>
                            <p className="text-xs text-green-600">{productSpotlight.salesIncrease}</p>
                            <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1">View Product</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
            {(userRole === "Admin" || userRole === "Cultivator") && (
                <Card>
                <CardHeader><CardTitle className="flex items-center"><Sun className="mr-2 h-5 w-5 text-orange-400"/>Weather Forecast</CardTitle></CardHeader>
                <CardContent className="text-center">
                    <p className="text-3xl font-bold">72°F <span className="text-lg text-muted-foreground">Sunny</span></p>
                    <p className="text-xs text-muted-foreground">Local conditions for Facility Zone A. (Conceptual)</p>
                </CardContent>
                </Card>
            )}
        </div>
      </div>


      {/* Modals for Quick Actions */}
      <Dialog open={showCreatePlantBatchModal} onOpenChange={setShowCreatePlantBatchModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Plant Batch</DialogTitle>
            <DialogDescription>
              Enter details for the new plant batch. Clicking 'Create Batch' will (conceptually) trigger the <code>createPlantBatch(data)</code> backend function.
              Refer to the Plants module for the full creation form.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modal-strain" className="text-right">Strain</Label>
              <Input id="modal-strain" defaultValue="OG Kush" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modal-quantity" className="text-right">Quantity</Label>
              <Input id="modal-quantity" type="number" defaultValue="100" className="col-span-3" />
            </div>
             <p className="text-xs text-muted-foreground text-center col-span-4">Additional fields like Origin, Room, Stage, METRC Tag option would be here.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCreatePlantBatchModal(false)}>Cancel</Button>
            <Button type="submit" onClick={() => {
                // Placeholder for actual API call: alert("Simulating createPlantBatch(data)...");
                setShowCreatePlantBatchModal(false); 
            }}>Create Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showGenerateManifestModal} onOpenChange={setShowGenerateManifestModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate New Manifest</DialogTitle>
            <DialogDescription>
              Configure manifest details. Clicking 'Generate Manifest' will (conceptually) trigger <code>createManifest(manifestData)</code>.
              The full manifest creation form is available in the Transfers module.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p className="text-sm text-muted-foreground p-4 text-center border rounded-md bg-muted/50">
                (A simplified manifest form or a link to the full manifest creation page at <code>/transfers/manifests</code> would be here.)
            </p>
            <Label htmlFor="modal-recipient">Recipient License (Example)</Label>
            <Input id="modal-recipient" defaultValue="RET-LIC-002" />
             <p className="text-xs text-muted-foreground text-center">Fields for selecting packages, driver, vehicle, ETA etc. would be included.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowGenerateManifestModal(false)}>Cancel</Button>
            <Button type="submit" onClick={() => {
                 // Placeholder for actual API call: alert("Simulating createManifest(data)...");
                setShowGenerateManifestModal(false);
            }}>Generate Manifest</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageContainer>
  );
}

