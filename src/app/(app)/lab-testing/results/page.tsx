
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Upload, FileWarning, FileText, Search, Edit, MessageSquare, AlertOctagon, RotateCcw, Brain, Download, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; // Added import

const completedTests = [
    { id: "TEST-001", requestId: "REQ-001", sourceBatch: "HVT-001", lab: "Anresco Labs", thc: "22.5%", cbd: "0.8%", contaminants: "None Detected", status: "Pass", dateCompleted: "2023-11-02", coaUrl: "#", comments: ""},
    { id: "TEST-002", requestId: "REQ-000", sourceBatch: "B-042", lab: "Steep Hill", thc: "18.2%", cbd: "1.1%", contaminants: "Pesticide XYZ (0.5ppm > 0.1ppm limit)", status: "Fail", dateCompleted: "2023-10-28", coaUrl: "#", comments: "Batch quarantined. Follow-up scheduled."},
    { id: "TEST-003", requestId: "REQ-000", sourceBatch: "C-105", lab: "SC Labs", thc: "N/A", cbd: "10.2%", contaminants: "None Detected", status: "Pass", dateCompleted: "2023-10-27", coaUrl: "#", comments: "CBD Isolate. CoA attached."},
];

export default function LabTestResultsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Test Results & COAs" 
        description="Record, associate, and view lab test results and Certificates of Analysis (COAs). Automatically flags non-compliant batches and facilitates result review."
      >
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export Results
        </Button>
      </PageHeader>
      
      <Card id="upload">
        <CardHeader>
            <CardTitle>COA Upload Assistant (AI Enhanced)</CardTitle>
            <CardDescription>
                Upload a COA (PDF, JPG, CSV) and our AI will attempt to pre-fill key test results like THC/CBD percentages and contaminant levels, speeding up data entry. Manually verify before saving.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Brain className="h-16 w-16 text-primary hidden sm:block" />
            <div className="flex-1 space-y-2">
                <Input type="file" className="max-w-md" accept=".pdf,.jpg,.jpeg,.png,.csv" />
                <p className="text-xs text-muted-foreground">Select the COA file. The system will process it and suggest values for the result entry form below or allow direct creation of a new test result record. Stored in Firestore.</p>
            </div>
            <Button><Upload className="mr-2 h-4 w-4"/>Process COA &amp; Enter Results</Button>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <CardTitle>All Test Results</CardTitle>
                    <CardDescription>Filter by batch, status, or test type. Non-compliant results are automatically flagged. Pass/Fail status clearly indicated.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Input placeholder="Search by Batch ID, Strain, Lab..." className="max-w-xs" />
                    <Button variant="outline"><ListFilter className="mr-2 h-4 w-4"/>Filters</Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          {completedTests.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Test ID</TableHead>
                        <TableHead>Source Batch</TableHead>
                        <TableHead>Lab</TableHead>
                        <TableHead>THC%</TableHead>
                        <TableHead>CBD%</TableHead>
                        <TableHead>Contaminants</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {completedTests.map(test => (
                        <TableRow key={test.id} className={test.status === "Fail" ? "bg-destructive/10 hover:bg-destructive/20" : ""}>
                            <TableCell className="font-medium">{test.id}</TableCell>
                            <TableCell>{test.sourceBatch}</TableCell>
                            <TableCell>{test.lab}</TableCell>
                            <TableCell>{test.thc}</TableCell>
                            <TableCell>{test.cbd}</TableCell>
                            <TableCell className="max-w-xs truncate">
                                {test.contaminants.includes("limit") && <FileWarning className="inline h-4 w-4 mr-1 text-destructive"/>}
                                {test.contaminants}
                            </TableCell>
                            <TableCell>
                                <Badge variant={test.status === "Pass" ? "default" : "destructive"} 
                                       className={cn(
                                           test.status === "Pass" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                                           test.status === "Fail" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                        )}>
                                    {test.status === "Pass" && <BadgeCheck className="inline h-3 w-3 mr-1"/>}
                                    {test.status === "Fail" && <FileWarning className="inline h-3 w-3 mr-1"/>}
                                    {test.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{test.dateCompleted}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" title="View/Upload COA"><FileText className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" title="Add Comments/Resolution"><MessageSquare className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" title="Assign Follow-up"><Edit className="h-4 w-4"/></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          ) : (
             <div className="p-8 border border-dashed rounded-md text-center text-muted-foreground">
                <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No completed test results found.</p>
              </div>
          )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">
                Compliance Alerts: Failed batches automatically notify QA and Administrators. Follow-up actions (Quarantine, Destroy, Retest) can be assigned here. Results are stored in Firestore.
            </p>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
