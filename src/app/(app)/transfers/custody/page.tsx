import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock } from "lucide-react";

export default function ChainOfCustodyPage() {
  return (
    <PageContainer>
      <PageHeader title="Chain of Custody Tracking" description="View detailed audit trails for transfers.">
        {/* Add actions if needed, e.g., Filter by Manifest ID */}
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Transfer Audit Log</CardTitle>
          <CardDescription>Track timestamps, vehicle IDs, drivers, and locations for all transfers.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A detailed log displaying the chain of custody for each transfer. This section ensures full traceability.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md">
            <div className="p-3 mb-2 bg-secondary rounded-md">
                <p className="font-semibold">Manifest #MFT-00123 - Event: Departure</p>
                <div className="flex items-center text-xs text-muted-foreground gap-4 mt-1">
                    <span><Clock className="inline h-3 w-3 mr-1"/> Timestamp: 2023-10-26 10:00 AM</span>
                    <span><Users className="inline h-3 w-3 mr-1"/> Driver: John Doe</span>
                    <span><MapPin className="inline h-3 w-3 mr-1"/> Location: Warehouse A</span>
                </div>
            </div>
             <div className="p-3 mb-2 bg-secondary rounded-md">
                <p className="font-semibold">Manifest #MFT-00123 - Event: Arrival</p>
                <div className="flex items-center text-xs text-muted-foreground gap-4 mt-1">
                    <span><Clock className="inline h-3 w-3 mr-1"/> Timestamp: 2023-10-26 02:30 PM</span>
                    <span><Users className="inline h-3 w-3 mr-1"/> Received by: Jane Smith</span>
                    <span><MapPin className="inline h-3 w-3 mr-1"/> Location: Dispensary X</span>
                </div>
            </div>
            <div className="mt-4 text-center text-muted-foreground">
                <p>More chain of custody records will be listed here.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
