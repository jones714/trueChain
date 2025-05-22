
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added CardDescription
import { ClipboardList, Users, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function MedicalOverviewPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Medical Module Overview" 
        description="Manage medical cannabis inventory, patient profiles (including conditions, approved products, refill history, and state registry integrations), and consultations." 
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/medical/inventory" passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Medical Inventory</CardTitle>
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground"> {/* Changed to CardDescription */}
                Track and manage products for medical use, including med-only tagging and condition-based eligibility.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link href="/medical/patients" passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Patient Profiles</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground"> {/* Changed to CardDescription */}
                Manage patient registry, conditions, approved products, provider notes, state ID sync, and purchase/refill history.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Card className="rounded-lg"> {/* Added rounded-lg for consistency */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Consultation Management</CardTitle>
              <HeartPulse className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground"> {/* Changed to CardDescription */}
                Schedule and document patient consultations. (Coming Soon)
              </CardDescription>
            </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
