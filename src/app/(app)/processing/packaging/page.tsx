import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackagePlus, ScanBarcode } from "lucide-react";

export default function PackagingPage() {
  return (
    <PageContainer>
      <PageHeader title="Packaging" description="Manage packaging of processed products and assign RFID tags.">
        <Button>
          <PackagePlus className="mr-2 h-4 w-4" /> Create New Packaged Product
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Products Ready for Packaging</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">List of processed batches ready to be packaged, with options to assign METRC tags and generate labels.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            <ScanBarcode className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2">Packaging workflow and RFID assignment will be managed here.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
