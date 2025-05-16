import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, PlusCircle } from "lucide-react";

export default function HarvestsPage() {
  return (
    <PageContainer>
      <PageHeader title="Harvest Management" description="Record and manage harvested plant material.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Record New Harvest
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Recent Harvests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Log of all harvests, including wet weight, dry weight (once available), strain, harvest date, and associated plant batches.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
             <Scissors className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2">Harvest data and yield reports will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
