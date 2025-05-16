import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Send } from "lucide-react";

export default function LabTestRequestsPage() {
  return (
    <PageContainer>
      <PageHeader title="Lab Testing Requests" description="Generate and dispatch lab testing requests.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Test Request
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Outgoing Test Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">List of all generated lab testing requests, their status (e.g., pending dispatch, submitted, results received), and associated batches.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            <Send className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2">Lab test request list and dispatch notices will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
