import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Sprout } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader title="Dashboard" description="Welcome back! Here's an overview of your operations.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Batch
        </Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plants</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+5 since yesterday</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234,567</div>
            <p className="text-xs text-muted-foreground">Based on current wholesale prices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Excellent</div>
            <p className="text-xs text-muted-foreground">No issues reported</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent system events and actions.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Placeholder for recent activity feed or chart */}
            <p className="text-sm text-muted-foreground">Harvest HVT-001 completed.</p>
            <p className="text-sm text-muted-foreground">Package PKG-089 transferred to Dispensary X.</p>
            <p className="text-sm text-muted-foreground">Lab results received for Batch B-045.</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
             <CardDescription>Common tasks at your fingertips.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline">Create Plant Batch</Button>
            <Button variant="outline">New Harvest</Button>
            <Button variant="outline">Generate Manifest</Button>
            <Button variant="outline">Record Sale</Button>
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Featured Guide: METRC Compliance</CardTitle>
          <CardDescription>Learn best practices for staying compliant with METRC regulations.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-4">
          <Image src="https://placehold.co/600x400.png" alt="Compliance Guide" width={200} height={120} className="rounded-md object-cover" data-ai-hint="compliance regulations" />
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Navigating the complexities of METRC can be challenging. This guide provides step-by-step instructions and tips to ensure your operations meet all regulatory requirements.
            </p>
            <Button variant="default">Read Guide</Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
