
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  PlusCircle, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  ArrowLeftRight, 
  Timer, 
  MapIcon, 
  BarChart3,
  Flag
} from "lucide-react";
import Link from "next/link";

// Dummy data for KPIs and transfer list
const kpiData = {
  transfersToday: 12,
  incoming: 5,
  outgoing: 7,
  failedPercentage: 8, // as a percentage
  avgDeliveryTime: "4h 15m",
};

const activeTransfers = [
  { id: "MFT-00123", to: "Happy Valley Dispensary", status: "In Transit", type: "Outgoing", expected: "2023-11-15 02:00 PM" },
  { id: "MFT-IN-0078", from: "Green Fields Cultivation", status: "Pending Acceptance", type: "Incoming", expected: "2023-11-15 10:00 AM" },
  { id: "MFT-00124", to: "City Processing Co.", status: "Delivered", type: "Outgoing", expected: "2023-11-14 05:00 PM" },
  { id: "MFT-00125", to: "Test Lab Alpha", status: "Rejected", type: "Outgoing", expected: "2023-11-14 01:00 PM" },
];

export default function TransfersPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Transfers & Logistics Dashboard" 
        description="Oversee all cannabis product movements, manage manifests, track chain-of-custody, and ensure transportation compliance."
      >
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/transfers/manifests?action=create"><PlusCircle className="mr-2 h-4 w-4" /> Create Manifest</Link>
          </Button>
           <Button variant="outline" asChild>
            <Link href="/transfers/incoming"><CheckCircle className="mr-2 h-4 w-4" /> Accept Incoming</Link>
          </Button>
          <Button variant="destructive" className="bg-amber-500 hover:bg-amber-600 border-amber-500 text-white">
            <Flag className="mr-2 h-4 w-4" /> Flag Issue
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transfers Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.transfersToday}</div>
            <p className="text-xs text-muted-foreground">{kpiData.incoming} Incoming / {kpiData.outgoing} Outgoing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed / Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.failedPercentage}%</div>
            <p className="text-xs text-muted-foreground">Past 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.avgDeliveryTime}</div>
            <p className="text-xs text-muted-foreground">For completed transfers</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Non-compliant vehicle, Missing log</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-5">
        <Card className="md:col-span-3">
            <CardHeader>
                <CardTitle>Active & Recent Transfers</CardTitle>
                <CardDescription>Monitor ongoing transfers and manage incoming/outgoing manifests. METRC synced.</CardDescription>
            </CardHeader>
            <CardContent>
                {activeTransfers.map(transfer => (
                     <div key={transfer.id} className="flex items-center justify-between p-3 mb-2 bg-muted/50 rounded-md">
                        <div>
                            <p className="font-semibold">{transfer.id} <span className="text-xs text-muted-foreground">({transfer.type})</span></p>
                            <p className="text-xs text-muted-foreground">
                                {transfer.type === "Incoming" ? `From: ${transfer.from}` : `To: ${transfer.to}`} | Expected: {transfer.expected}
                            </p>
                             <p className={`text-xs font-medium ${
                                transfer.status === "In Transit" ? "text-blue-600" :
                                transfer.status === "Pending Acceptance" ? "text-orange-600" :
                                transfer.status === "Delivered" ? "text-green-600" :
                                transfer.status === "Rejected" ? "text-red-600" : ""
                             }`}>
                                Status: {transfer.status}
                            </p>
                        </div>
                        <div className="space-x-2">
                            <Button variant="outline" size="sm" asChild><Link href={`/transfers/manifests/${transfer.id}`}><FileText className="mr-1 h-3 w-3"/> View Manifest</Link></Button>
                            {transfer.status === "In Transit" && <Button variant="outline" size="sm">Track</Button>}
                            {transfer.status === "Pending Acceptance" && (
                                <>
                                <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50" asChild><Link href={`/transfers/incoming?manifestId=${transfer.id}`}><CheckCircle className="mr-1 h-3 w-3"/> Process</Link></Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                 {activeTransfers.length === 0 && (
                    <div className="mt-4 p-8 text-center text-muted-foreground">
                        <p>No active transfers matching criteria.</p>
                    </div>
                 )}
            </CardContent>
        </Card>
         <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Transfer Status Overview</CardTitle>
                <CardDescription>Visual breakdown of all transfer statuses.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
                <BarChart3 className="h-16 w-16 opacity-50" />
                <p className="ml-2">Interactive Status Chart Placeholder</p>
            </CardContent>
        </Card>
      </div>
       <Card className="mt-6">
            <CardHeader>
                <CardTitle>Route Management & Dispatch</CardTitle>
                 <CardDescription>Plan delivery routes, assign manifests, and export dispatch sheets. (Placeholder for future integration)</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
                <MapIcon className="h-12 w-12 mx-auto mb-2 opacity-50"/>
                <p>Route optimization and multi-stop delivery planning features will be available here.</p>
                 <Button variant="outline" className="mt-3" disabled>Plan New Route</Button>
            </CardContent>
        </Card>
    </PageContainer>
  );
}
