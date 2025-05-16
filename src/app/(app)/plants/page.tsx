import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function PlantsPage() {
  return (
    <PageContainer>
      <PageHeader title="Plant Management" description="Track and manage plants from seed to harvest.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Plant Batch
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Plant Batches Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Detailed table or list of plant batches will be displayed here. Including stages (Germination, Vegetative, Flowering), strains, quantities, and locations.</p>
          {/* Placeholder for table or plant cards */}
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            Plant data visualization or table will appear here.
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
