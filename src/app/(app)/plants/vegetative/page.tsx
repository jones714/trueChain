import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardHat } from "lucide-react"; // Using HardHat as a placeholder icon

export default function VegetativePage() {
  return (
    <PageContainer>
      <PageHeader title="Vegetative Stage" description="Manage plants in their vegetative growth phase.">
        <Button>
          <HardHat className="mr-2 h-4 w-4" /> Update Veg Room Conditions
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Plants in Vegetative Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Overview of all plants currently in the vegetative stage, including strain, age, health status, and location.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            Vegetative plant data will appear here.
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
