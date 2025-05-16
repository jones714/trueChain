import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Printer, Edit3 } from "lucide-react";

export default function ManifestsPage() {
  return (
    <PageContainer>
      <PageHeader title="METRC Manifests" description="Generate, view, print, and digitally sign METRC-compliant manifests.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Manifest
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>All Manifests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A comprehensive list of all generated manifests, with options for printing, digital signing, and viewing details.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
             <div className="mt-4 space-x-2">
                <Button variant="outline"><Printer className="mr-2 h-4 w-4"/>Print Selected</Button>
                <Button variant="outline"><Edit3 className="mr-2 h-4 w-4"/>Sign Selected</Button>
            </div>
            <p className="mt-2">Manifest list and management tools will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
