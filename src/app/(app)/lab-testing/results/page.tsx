import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Upload, FileWarning } from "lucide-react";

export default function LabTestResultsPage() {
  return (
    <PageContainer>
      <PageHeader title="Test Results &amp; COAs" description="Record, associate, and view lab test results and Certificates of Analysis.">
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload New COA
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>All Test Results</CardTitle>
          <CardDescription>Filter by batch, status, or test type. Non-compliant results are flagged.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A comprehensive table of test results including THC%, CBD%, pesticides, moisture, etc. Links to view/download COAs. Non-compliance flagging and quarantine actions.</p>
          <div className="mt-4 p-4 border border-dashed rounded-md">
            <div className="flex items-center p-3 mb-2 bg-destructive/10 text-destructive rounded-md">
                <FileWarning className="h-5 w-5 mr-2"/>
                <span>Batch B-042: Failed pesticide test. <Button variant="link" className="p-0 h-auto text-destructive hover:underline">Quarantine</Button></span>
            </div>
             <div className="flex items-center p-3 bg-primary/10 text-primary rounded-md">
                <BadgeCheck className="h-5 w-5 mr-2"/>
                <span>Batch C-105: All tests passed. <Button variant="link" className="p-0 h-auto text-primary hover:underline">View COA</Button></span>
            </div>
            <div className="mt-4 p-8 text-center text-muted-foreground">
                <p>More test results will be listed here.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
