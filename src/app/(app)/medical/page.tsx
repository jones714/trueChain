
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Users, HeartPulse, BarChart2, ShieldCheck, AlertTriangle, FileWarning, CalendarOff, PlusCircle, ClipboardEdit, Flag, MessageSquare, Handshake, Activity } from "lucide-react";
import Link from "next/link";

export default function MedicalOverviewPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Medical Module Dashboard" 
        description="Oversee medical cannabis operations including patient management, specialized inventory, consultations, analytics, provider network, and compliance." 
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Link href="/medical/inventory" passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer rounded-lg xl:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Medical Inventory</CardTitle>
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground">
                Track med-only products, condition eligibility, and manage access.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/medical/patients" passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer rounded-lg xl:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Patient Profiles</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground">
                Manage patient registry, conditions, prescriptions, provider notes, state ID sync, and purchase/refill history.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/medical/consultations" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer rounded-lg xl:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">Consultation Management</CardTitle>
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <CardDescription className="text-sm text-muted-foreground">
                    Schedule, document consultations, manage intake forms and note templates.
                </CardDescription>
                </CardContent>
            </Card>
        </Link>
         <Card className="rounded-lg xl:col-span-1"> {/* Quick Actions Panel */}
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm"><PlusCircle className="mr-1 h-3 w-3"/>Register Patient</Button>
                <Button variant="outline" size="sm"><ClipboardEdit className="mr-1 h-3 w-3"/>Add Prescription</Button>
                <Button variant="outline" size="sm"><Flag className="mr-1 h-3 w-3"/>Flag Issue</Button>
                <Button variant="outline" size="sm"><MessageSquare className="mr-1 h-3 w-3"/>New Consultation</Button>
            </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patient & Medical Sales Analytics</CardTitle>
            <CardDescription>Key metrics for your medical patient base and sales performance.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="p-3 bg-muted/50 rounded-lg">
                <Users className="h-5 w-5 text-primary mb-1" />
                <h4 className="font-semibold text-sm">Total Active Patients</h4>
                <p className="text-2xl font-bold">123</p>
            </div>
             <div className="p-3 bg-muted/50 rounded-lg">
                <HeartPulse className="h-5 w-5 text-primary mb-1" />
                <h4 className="font-semibold text-sm">Top Conditions Treated</h4>
                <p className="text-lg font-bold">Chronic Pain, Anxiety</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
                <ClipboardList className="h-5 w-5 text-primary mb-1" />
                <h4 className="font-semibold text-sm">Top Dispensed Product Types</h4>
                <p className="text-lg font-bold">CBD Tinctures, Low-THC Flower</p>
            </div>
             <div className="p-3 bg-muted/50 rounded-lg">
                <BarChart2 className="h-5 w-5 text-primary mb-1" />
                <h4 className="font-semibold text-sm">Med-Only Revenue (Month)</h4>
                <p className="text-2xl font-bold">$12,345</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
                <Activity className="h-5 w-5 text-primary mb-1" />
                <h4 className="font-semibold text-sm">Product Efficacy Insights</h4>
                <p className="text-xs text-muted-foreground">Strain XYZ effective for 80% of pain patients (Conceptual).</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive mb-1" />
                <h4 className="font-semibold text-sm">Refill Eligibility Alerts</h4>
                <p className="text-2xl font-bold">5 <span className="text-xs text-muted-foreground">patients due</span></p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Compliance Snapshot</CardTitle>
            <CardDescription>Real-time medical compliance indicators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-500"/>
                    <span className="text-sm">Patients Near Purchase Limit</span>
                </div>
                <span className="text-sm font-semibold">2</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                    <CalendarOff className="h-4 w-4 mr-2 text-red-500"/>
                    <span className="text-sm">Expired Recommendations</span>
                </div>
                <span className="text-sm font-semibold">1</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                    <FileWarning className="h-4 w-4 mr-2 text-yellow-500"/>
                    <span className="text-sm">Missing COAs (Med Inventory)</span>
                </div>
                <span className="text-sm font-semibold">3</span>
            </div>
             <Button variant="link" size="sm" className="p-0 h-auto text-primary">View Full Compliance Report</Button>
          </CardContent>
        </Card>
      </div>
       <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Additional Compliance Features</CardTitle>
                <CardDescription>Enhance regulatory adherence for medical operations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">State ID Verification Tool:</strong> (Future API Hook for Registry Sync) Scan or input MN medical ID for auto-validation against the state registry.</p>
                <p><strong className="text-foreground">HIPAA Log Access:</strong> Track and audit access to patient files, showing who accessed what and when.</p>
                <p><strong className="text-foreground">Automated Reporting:</strong> Generate daily/weekly exports of patient activity, refills, and flagged conditions for regulators.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Provider Network Management</CardTitle>
                <CardDescription>Manage relationships and data sharing with referring physicians and clinics (Optional Feature).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Maintain a registry of medical providers. Securely share (with consent) consultation notes or patient progress. Essential for multi-doctor clinics.</p>
                 <Button variant="outline" disabled><Handshake className="mr-2 h-4 w-4"/>Manage Provider Registry</Button>
            </CardContent>
        </Card>
       </div>
    </PageContainer>
  );
}
