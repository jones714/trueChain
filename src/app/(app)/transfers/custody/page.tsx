
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock, Compass } from "lucide-react"; // Added Compass for geo-tagging

export default function ChainOfCustodyPage() {
  return (
    <PageContainer>
      <PageHeader title="Chain of Custody Tracking" description="View detailed audit trails for transfers.">
        {/* Add actions if needed, e.g., Filter by Manifest ID */}
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Transfer Audit Log</CardTitle>
          <CardDescription>Track timestamps, vehicle IDs, drivers, and geo-tagged locations for all transfers. Ensures full traceability.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A detailed log displaying the chain of custody for each transfer. This section ensures full traceability with optional geo-location data for key events.</p>
          <div className="mt-4 p-8 border border-dashed rounded-md">
            <div className="p-3 mb-2 bg-secondary rounded-md">
                <p className="font-semibold">Manifest #MFT-00123 - Event: Departure</p>
                <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-x-4 gap-y-1 mt-1">
                    <span><Clock className="inline h-3 w-3 mr-1"/> Timestamp: 2023-10-26 10:00 AM</span>
                    <span><Users className="inline h-3 w-3 mr-1"/> Driver: John Doe</span>
                    <span><MapPin className="inline h-3 w-3 mr-1"/> Location: Warehouse A</span>
                    <span className="text-blue-500"><Compass className="inline h-3 w-3 mr-1"/> Geo: 34.0522° N, 118.2437° W</span>
                </div>
            </div>
             <div className="p-3 mb-2 bg-secondary rounded-md">
                <p className="font-semibold">Manifest #MFT-00123 - Event: Arrival</p>
                <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-x-4 gap-y-1 mt-1">
                    <span><Clock className="inline h-3 w-3 mr-1"/> Timestamp: 2023-10-26 02:30 PM</span>
                    <span><Users className="inline h-3 w-3 mr-1"/> Received by: Jane Smith</span>
                    <span><MapPin className="inline h-3 w-3 mr-1"/> Location: Dispensary X</span>
                    <span className="text-blue-500"><Compass className="inline h-3 w-3 mr-1"/> Geo: 34.0588° N, 118.2399° W</span>
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
