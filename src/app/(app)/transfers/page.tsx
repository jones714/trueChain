import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, CheckCircle, XCircle } from "lucide-react";

export default function TransfersPage() {
  return (
    <PageContainer>
      <PageHeader title="Transfer Management" description="Generate METRC-compliant manifests and track chain-of-custody.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Manifest
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Active Transfers</CardTitle>
          <CardDescription>Monitor ongoing transfers and manage incoming/outgoing manifests.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A list of all transfers, including status (e.g., pending, in transit, delivered, rejected), manifest details, timestamps, vehicle IDs, and driver information. Options to accept or reject incoming transfers with an audit trail.</p>
          <div className="mt-4 p-4 border border-dashed rounded-md">
            <div className="flex items-center justify-between p-3 mb-2 bg-secondary rounded-md">
                <div>
                    <p className="font-semibold">Manifest #MFT-00123</p>
                    <p className="text-xs text-muted-foreground">To: Happy Valley Dispensary | Status: In Transit</p>
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm"><FileText className="mr-1 h-3 w-3"/> View</Button>
                </div>
            </div>
            <div className="flex items-center justify-between p-3 mb-2 bg-secondary rounded-md">
                <div>
                    <p className="font-semibold">Incoming Manifest #MFT-IN-0078</p>
                    <p className="text-xs text-muted-foreground">From: Green Fields Cultivation | Status: Pending Acceptance</p>
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50"><CheckCircle className="mr-1 h-3 w-3"/> Accept</Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50"><XCircle className="mr-1 h-3 w-3"/> Reject</Button>
                </div>
            </div>
            <div className="mt-4 p-8 text-center text-muted-foreground">
                <p>More transfer records will be listed here.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
