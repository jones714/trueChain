
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, PackageSearch } from "lucide-react";

export default function ProcessingPage() {
  return (
    <PageContainer>
      <PageHeader title="Processing Workflows" description="Manage batch processing, drying, curing, packaging, and recipe-based manufacturing.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Start New Processing Batch
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Active Processing Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Overview of all batches currently in various processing stages (e.g., extraction, drying, curing, trimming, packaging). Includes input-to-output tracking from raw material to finished product.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2">Processing batch data and status will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
