import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";

export default function FloweringPage() {
  return (
    <PageContainer>
      <PageHeader title="Flowering Stage" description="Monitor and manage plants during their flowering cycle.">
        <Button>
          <CalendarClock className="mr-2 h-4 w-4" /> Schedule Nutrient Change
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Plants in Flowering</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Detailed list of plants in the flowering stage, showing days into flower, strain, expected harvest date, and environmental conditions.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            Flowering plant data will appear here.
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
