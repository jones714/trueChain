
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Users, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function MedicalOverviewPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Medical Module Overview" 
        description="Manage medical cannabis inventory, patient profiles, and consultations." 
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/medical/inventory" passHref>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Medical Inventory</CardTitle>
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track and manage cannabis products designated for medical use.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/medical/patients" passHref>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Patient Profiles</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage patient registry information, consultation notes, and purchase history.</p>
            </CardContent>
          </Card>
        </Link>
         {/* Placeholder for more medical-specific features */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Consultation Management</CardTitle>
              <HeartPulse className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Schedule and document patient consultations (Coming Soon).</p>
            </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
