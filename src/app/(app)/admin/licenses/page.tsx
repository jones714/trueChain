import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, BadgeCheck, Edit, KeyRound } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const licenses = [
  { id: "LIC001", facilityId: "FAC001", licenseNumber: "CULT-12345", type: "Cultivation", expiryDate: "2024-12-31", metrcApiKeyStatus: "Configured" },
  { id: "LIC002", facilityId: "FAC002", licenseNumber: "PROC-67890", type: "Processing", expiryDate: "2025-06-30", metrcApiKeyStatus: "Pending" },
  { id: "LIC003", facilityId: "FAC003", licenseNumber: "RETL-13579", type: "Retail", expiryDate: "2024-08-15", metrcApiKeyStatus: "Configured" },
];

export default function LicenseManagementPage() {
  return (
    <PageContainer>
      <PageHeader title="License Management" description="Manage facility licenses and METRC API key configurations.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New License
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>All Licenses</CardTitle>
            <CardDescription>View, edit, or add new licenses and configure METRC API keys per license.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License ID</TableHead>
                <TableHead>Facility ID</TableHead>
                <TableHead>License #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>METRC API</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell className="font-medium">{license.id}</TableCell>
                  <TableCell>{license.facilityId}</TableCell>
                  <TableCell>{license.licenseNumber}</TableCell>
                  <TableCell>{license.type}</TableCell>
                  <TableCell>{license.expiryDate}</TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-1 text-xs rounded-full",
                        license.metrcApiKeyStatus === 'Configured' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300')}>
                        {license.metrcApiKeyStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                      <KeyRound className="h-4 w-4" />
                       <span className="sr-only">Configure API Key</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                       <span className="sr-only">Edit License</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {licenses.length === 0 && (
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                <BadgeCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No licenses found. Click "Add New License" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
