import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, UploadCloud } from "lucide-react";

export default function LabTestingPage() {
  return (
    <PageContainer>
      <PageHeader title="Lab Testing Management" description="Track test requests, results, and Certificates of Analysis (COAs).">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Test Request
        </Button>
      </PageHeader>
       <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Tests</CardTitle>
            <CardDescription>Batches awaiting lab results.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">3 new requests today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Non-Compliant Batches</CardTitle>
            <CardDescription>Batches flagged for quarantine or destruction.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Test Results &amp; COAs</CardTitle>
            <Button variant="outline">
              <UploadCloud className="mr-2 h-4 w-4" /> Upload COA
            </Button>
          </div>
          <CardDescription>View and manage all lab test results and associated COAs.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A table listing all lab tests, results (THC%, CBD%, pesticides, moisture), status (pass/fail), and links to COA documents. Non-compliant batches will be highlighted.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2">Lab test results and COA management interface will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
