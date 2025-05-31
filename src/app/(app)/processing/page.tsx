
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, PackageSearch, Hourglass, Thermometer, PercentCircle, BarChart2, Recycle, CookingPot, Archive } from "lucide-react";
import Link from "next/link";

export default function ProcessingOverviewPage() {
  // Dummy data for KPIs - in a real app, this would come from a backend
  const kpiData = {
    activeDrying: 5,
    activeCuring: 3,
    activePackaging: 2,
    totalGramsDrying: 25000,
    totalGramsCuring: 15000,
    totalGramsPackagingInput: 8000,
    wasteLoggedThisWeek: 1250, // grams
    avgTimeDrying: 7, // days
    avgTimeCuring: 14, // days
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Processing Dashboard & Workflows" 
        description="Manage post-harvest operations including batch creation, drying, curing, extraction, manufacturing, and packaging. Track KPIs and initiate workflows."
      >
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/processing/batches?action=create_batch">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Processing Batch
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/processing/drying-curing?action=start_drying">
              <Hourglass className="mr-2 h-4 w-4" /> Start Drying Cycle
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/processing/packaging?action=start_packaging_run">
               <Archive className="mr-2 h-4 w-4" /> Start Packaging Run
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <PackageSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.activeDrying + kpiData.activeCuring + kpiData.activePackaging}</div>
            <p className="text-xs text-muted-foreground">Drying: {kpiData.activeDrying}, Curing: {kpiData.activeCuring}, Packaging: {kpiData.activePackaging}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total in Processing (grams)</CardTitle>
            <PercentCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(kpiData.totalGramsDrying + kpiData.totalGramsCuring + kpiData.totalGramsPackagingInput).toLocaleString()} g</div>
            <p className="text-xs text-muted-foreground">Across all active stages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Logged (This Week)</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.wasteLoggedThisWeek.toLocaleString()} g</div>
            <p className="text-xs text-muted-foreground">Plant & Production Waste</p>
            {/* Placeholder for small graph */}
            <div className="h-10 w-full bg-muted rounded-sm mt-2 flex items-center justify-center text-xs text-muted-foreground">[Waste Trend Graph]</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time in Stage</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">Drying: {kpiData.avgTimeDrying} days</p>
            <p className="text-sm font-semibold">Curing: {kpiData.avgTimeCuring} days</p>
            <p className="text-xs text-muted-foreground">Based on completed batches</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Processing Workflow Links</CardTitle>
          <CardDescription>Navigate to specific processing stages and management areas.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/processing/batches" passHref>
            <Card className="hover:shadow-md transition-shadow cursor-pointer p-4">
              <div className="flex items-center mb-2">
                <Archive className="h-6 w-6 text-primary mr-2"/>
                <h3 className="font-semibold">Processing Batches</h3>
              </div>
              <p className="text-xs text-muted-foreground">Manage all processing batches, their stages, inputs, outputs, and related logs.</p>
            </Card>
          </Link>
          <Link href="/processing/drying-curing" passHref>
            <Card className="hover:shadow-md transition-shadow cursor-pointer p-4">
              <div className="flex items-center mb-2">
                <Thermometer className="h-6 w-6 text-primary mr-2"/>
                <h3 className="font-semibold">Drying & Curing</h3>
              </div>
              <p className="text-xs text-muted-foreground">Monitor and manage environmental conditions for drying and curing processes.</p>
            </Card>
          </Link>
          <Link href="/processing/packaging" passHref>
            <Card className="hover:shadow-md transition-shadow cursor-pointer p-4">
               <div className="flex items-center mb-2">
                <PackageSearch className="h-6 w-6 text-primary mr-2"/>
                <h3 className="font-semibold">Packaging & Labeling</h3>
              </div>
              <p className="text-xs text-muted-foreground">Package finished products, assign METRC tags, and print compliant labels.</p>
            </Card>
          </Link>
          <Link href="/processing/recipes" passHref>
             <Card className="hover:shadow-md transition-shadow cursor-pointer p-4">
               <div className="flex items-center mb-2">
                <CookingPot className="h-6 w-6 text-primary mr-2"/>
                <h3 className="font-semibold">Recipe Management</h3>
              </div>
              <p className="text-xs text-muted-foreground">Define, version, and manage product formulas for consistent manufacturing.</p>
            </Card>
          </Link>
           <Link href="/waste" passHref>
             <Card className="hover:shadow-md transition-shadow cursor-pointer p-4">
               <div className="flex items-center mb-2">
                <Recycle className="h-6 w-6 text-primary mr-2"/>
                <h3 className="font-semibold">Waste Management</h3>
              </div>
              <p className="text-xs text-muted-foreground">Log and track processing waste for compliance.</p>
            </Card>
          </Link>
           <Link href="/reports" passHref>
             <Card className="hover:shadow-md transition-shadow cursor-pointer p-4">
               <div className="flex items-center mb-2">
                <BarChart2 className="h-6 w-6 text-primary mr-2"/>
                <h3 className="font-semibold">Processing Reports</h3>
              </div>
              <p className="text-xs text-muted-foreground">View yield efficiency, reconciliation, and other processing analytics.</p>
            </Card>
          </Link>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

    
