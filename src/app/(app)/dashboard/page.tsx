
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle, BarChart3, Bell, BriefcaseMedical, CalendarClock, CheckCircle2, Cog,
  DollarSign, FileText, Filter, GaugeCircle, Leaf, ListChecks, LucideIcon, Package,
  Palette, Route, Settings2, ShieldAlert, ShoppingCart, Sprout, Star, Sun,
  Thermometer, Users, Workflow, TrendingUp, Clock, Lightbulb, Truck, PackageSearch, Archive, NotebookText, FlaskConical, UserPlus, ListFilter as ListFilterIcon, Activity, Info
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

const timelineEvents = [
  { id: "T001", time: "Now", event: "Delivery DEL-007 to 'Main St Dispensary' en route.", icon: Truck, iconColor: "text-blue-500" },
  { id: "T002", time: "In 2 Hours", event: "Drying cycle for batch DRY-034 completes.", icon: Clock, iconColor: "text-green-500" },
  { id: "T003", time: "Tomorrow 9 AM", event: "Scheduled destruction event WST-EVT-012.", icon: Archive, iconColor: "text-gray-500" },
  { id: "T004", time: "Yesterday 3 PM", event: "Harvest HVT-105 completed. Yield: 2.5kg.", icon: Sprout, iconColor: "text-primary" },
  { id: "T005", time: "Next Week", event: "Patient Appointment: John D. - Follow-up.", icon: BriefcaseMedical, iconColor: "text-purple-500"},
];

const quickActions = [
  { title: "Create Plant Batch", icon: Sprout, href: "/plants?action=create" },
  { title: "Start Packaging Run", icon: Package, href: "/processing/packaging?action=create" },
  { title: "Request Lab Test", icon: FlaskConical, href: "/lab-testing/requests?action=create" },
  { title: "Create Manifest", icon: FileText, href: "/transfers/manifests?action=create" },
  { title: "New Sale (POS)", icon: ShoppingCart, href: "/sales/pos" },
  { title: "Register Patient", icon: UserPlus, href: "/medical/patients?action=create"},
];

const aiInsights = [
    { id: "I001", insight: "Strain 'OG Kush' sales are 20% above average this week. Consider re-stocking.", type: "Sales" },
    { id: "I002", insight: "Batch 'FLW-051' (Blue Dream) is nearing its expiration date (7 days). Consider converting to extract or offering a promotion.", type: "Inventory"},
    { id: "I003", insight: "Humidity levels in Flower Room 2A have been consistently high for 3 days. Investigate for potential mold risk.", type: "Cultivation" },
];

const upcomingAppointments = [
    { id: "APP001", patient: "John Doe", time: "Today, 2:00 PM", type: "Follow-up Consultation"},
    { id: "APP002", patient: "Jane Smith", time: "Tomorrow, 10:30 AM", type: "Initial Medical Assessment"},
];

const productSpotlight = {
    name: "Sunset Sherbet Flower",
    salesIncrease: "+15% this week",
    image: "/poo2.webp",
    dataAiHint: "cannabis flower"
};


export default function DashboardPageV2() {
  const userRole = "Admin"; // Example role for demo purposes

  return (
    <PageContainer>
      <PageHeader
        title="TruCanalytix Command Center"
        description={`Welcome back! This is your dynamic, real-time overview. Widgets are role-aware (Cultivator, Processor, Retail Clerk, etc.) and can be customized (drag-and-drop, hide/show - conceptual) to display relevant KPIs and tools based on your responsibilities.`}
      >
        <Button variant="outline" size="sm">
          <Settings2 className="mr-2 h-4 w-4" /> Customize Dashboard
        </Button>
      </PageHeader>

      {/* KPI Summary Bar - Aligned with Demo Requirements */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plant Batches</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiSummary.activePlantBatches}</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Snapshot</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${kpiSummary.inventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Value by category (conceptual)</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status (METRC)</CardTitle>
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
            <p className="text-xs text-muted-foreground">Upcoming deliveries/pickups</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area (Widgets) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-Time Alerts Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive" />Real-Time Alerts (Compliance Warnings)</CardTitle>
              <CardDescription>Critical compliance violations, operational issues, lab result failures, overdue transfers, low inventory, or expiring licenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                {alertsData.map(alert => (
                  <div key={alert.id} className="mb-3 p-2 border-l-4 rounded-r-md border-destructive/70 bg-destructive/5 dark:bg-destructive/10 last:mb-0">
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
          
          {/* Recent Activity Feed & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><CalendarClock className="mr-2 h-5 w-5 text-primary" />Recent Activity Feed & Timeline</CardTitle>
              <CardDescription>Visual schedule of upcoming and recent key events: drying cycles, lab pickups, manifest deliveries, patient appointments, system logs.</CardDescription>
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

          {/* Optional Widgets based on role (Conceptual) */}
           {userRole === "Admin" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-primary" />Mini Analytics</CardTitle>
                <CardDescription>Quick insights into key performance areas. (Sparkline charts for sales, strain yield, lab pass/fail etc.)</CardDescription>
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

           {userRole === "Admin" || userRole === "Medical Provider" && (
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
        </div>

        {/* Right Sidebar Area (AI Insights, Quick Actions, etc.) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Cog className="mr-2 h-5 w-5 text-primary" />Quick Actions</CardTitle>
              <CardDescription className="text-xs">Common tasks. (Customizable by user role - conceptual)</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {quickActions.map(action => (
                <Button key={action.title} variant="outline" size="sm" className="text-xs h-auto py-1.5 justify-start" asChild>
                  <Link href={action.href}>
                    <action.icon className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                    {action.title}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

           {/* AI Insights Sidebar (Conceptual) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-40">
                {aiInsights.map(insight => (
                  <div key={insight.id} className="text-xs mb-2 p-1.5 border-l-2 border-primary/50 bg-primary/5 rounded-r-sm">
                    <p className="font-medium text-foreground/90">{insight.insight}</p>
                    <p className="text-muted-foreground">Type: {insight.type}</p>
                  </div>
                ))}
                 {aiInsights.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No AI insights available.</p>}
              </ScrollArea>
               <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-2">View More Insights</Button>
            </CardContent>
          </Card>
          
          {/* Notification Center Widget */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center text-base font-semibold"><Bell className="mr-2 h-5 w-5 text-primary"/>Notification Center</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7"><ListFilterIcon className="h-4 w-4"/></Button>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-xs mb-2">Centralized inbox for system alerts, compliance flags, event reminders, and team messages. Filter by severity or type.</CardDescription>
                <ScrollArea className="h-32">
                    {/* Conceptual notification items */}
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

          {userRole === "Admin" || userRole === "Retail Clerk" && (
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

          {userRole === "Admin" || userRole === "Cultivator" && (
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
    </PageContainer>
  );
}
