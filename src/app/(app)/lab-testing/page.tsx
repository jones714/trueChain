
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, UploadCloud, AlertTriangle, BarChart3, ClipboardCheck, Clock, ListChecks } from "lucide-react";
import Link from "next/link";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

// Dummy data for charts
const passFailData = [
  { type: "Flower", pass: 90, fail: 10 },
  { type: "Edible", pass: 85, fail: 15 },
  { type: "Extract", pass: 95, fail: 5 },
];

const chartConfig = {
  pass: { label: "Pass", color: "hsl(var(--chart-2))" },
  fail: { label: "Fail", color: "hsl(var(--destructive))" },
};


export default function LabTestingOverviewPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Lab Testing Dashboard" 
        description="Monitor testing workflows, track results, manage COAs, and ensure compliance."
      >
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/lab-testing/requests"><PlusCircle className="mr-2 h-4 w-4" /> Create Test Request</Link>
          </Button>
          <Button variant="outline" asChild>
             <Link href="/lab-testing/results#upload"><UploadCloud className="mr-2 h-4 w-4" /> Upload COA</Link>
          </Button>
           <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive">
            <AlertTriangle className="mr-2 h-4 w-4" /> Flag Failed Batch
          </Button>
        </div>
      </PageHeader>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Pending</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">3 new requests today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Tests Failed (Last 30d)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Result Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5 Days</div>
            <p className="text-xs text-muted-foreground">From sample sent to result</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">COAs Uploaded (Month)</CardTitle>
            <UploadCloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Pass/Fail Trends by Product Type</CardTitle>
            <CardDescription>Monthly overview of test outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={passFailData} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" tickLine={false} axisLine={false} width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="pass" stackId="a" fill="var(--color-pass)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="fail" stackId="a" fill="var(--color-fail)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Recent Test Activity</CardTitle>
                <CardDescription>Latest updates in the testing workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="p-2 border rounded-md bg-muted/50">
                    <p><strong className="text-primary">Request REQ-001:</strong> Sample sent to Lab XYZ.</p>
                    <p className="text-xs text-muted-foreground">10/28/2023 02:00 PM</p>
                </div>
                <div className="p-2 border rounded-md bg-destructive/10">
                    <p><strong className="text-destructive">Batch B-042:</strong> Pesticide test FAILED.</p>
                    <p className="text-xs text-muted-foreground">10/28/2023 11:30 AM - Action: Quarantine</p>
                </div>
                 <div className="p-2 border rounded-md bg-green-600/10">
                    <p><strong className="text-green-700">Batch C-105:</strong> All tests PASSED. COA uploaded.</p>
                    <p className="text-xs text-muted-foreground">10/27/2023 04:15 PM</p>
                </div>
                <Button variant="link" size="sm" className="p-0 h-auto">View All Activity</Button>
            </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Compliance & Reporting</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The system automatically flags failed batches for quarantine or destruction and can notify relevant QA staff and Administrators. 
            Testing templates can be configured by product type (e.g., "Standard Flower Test Panel") to streamline request creation.
            All test requests, results, and staff interactions are logged for a complete audit trail, exportable in CSV/PDF formats.
            Future-ready for state lab reporting (e.g., METRC) and direct API integration with licensed external labs.
          </p>
           <Button variant="outline" className="mt-3">Export Audit Log</Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
