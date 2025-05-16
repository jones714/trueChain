import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function GerminationPage() {
  return (
    <PageContainer>
      <PageHeader title="Germination Stage" description="Manage plant batches in the germination phase.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Start New Germination
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Active Germination Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">List of plant batches currently in germination, with details like start date, strain, and expected sprout date.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            Germination batch data will appear here.
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
