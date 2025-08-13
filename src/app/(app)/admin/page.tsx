

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, BadgeCheck, Settings, Activity, ShieldCheck, Workflow, MapPin, History, Fingerprint, Megaphone } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <PageContainer>
      <PageHeader title="Admin Dashboard" description="Manage system settings, users, facilities, and more." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/users" passHref>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">User Management</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage user accounts, roles, and permissions.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/facilities" passHref>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Facilities</CardTitle>
              <Building className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configure and manage business locations.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/licenses" passHref>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Licenses</CardTitle>
              <BadgeCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage facility licenses and METRC API keys.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/settings" passHref>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">System Settings</CardTitle>
              <Settings className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configure product types, pricing, testing, workflows & automations.</p>
            </CardContent>
          </Card>
        </Link>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Audit Logs</CardTitle>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View system-wide audit trails, METRC API activity, geo-tagged logs, and role-based action logs.</p>
               <Button variant="link" className="p-0 h-auto text-primary text-xs mt-2">View Logs</Button>
            </CardContent>
        </Card>
         <Link href="/admin/scan-logs" passHref>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Scan History</CardTitle>
              <History className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Review a complete audit trail of all scan events (METRC, QR, barcode).</p>
            </CardContent>
          </Card>
        </Link>
         <Link href="/admin/age-verification-logs" passHref>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Age Verification Logs</CardTitle>
              <Fingerprint className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Audit all age verification checks from POS, delivery, and online sales.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/recalls" passHref>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Recalls</CardTitle>
              <Megaphone className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage and track product recalls and notifications.</p>
            </CardContent>
          </Card>
        </Link>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Security &amp; Compliance</CardTitle>
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage security settings and compliance configurations.</p>
              <Button variant="link" className="p-0 h-auto text-primary text-xs mt-2">Configure</Button>
            </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
