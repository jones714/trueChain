import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, PlusCircle } from "lucide-react";

export default function ProcessingBatchesPage() {
  return (
    <PageContainer>
      <PageHeader title="Processing Batches" description="Manage all created processing batches.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Batch
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>All Processing Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A comprehensive list of all processing batches, filterable by status, type, and date.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            <Archive className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2">Batch list and details will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
