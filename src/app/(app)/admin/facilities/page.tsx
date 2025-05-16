import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building, Edit, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const facilities = [
  { id: "FAC001", name: "Downtown Cultivation Center", address: "123 Main St, Anytown, USA", type: "Cultivation", status: "Active" },
  { id: "FAC002", name: "Westside Processing Plant", address: "456 Oak Ave, Anytown, USA", type: "Processing", status: "Active" },
  { id: "FAC003", name: "North End Dispensary", address: "789 Pine Rd, Anytown, USA", type: "Retail", status: "Maintenance" },
];

export default function FacilitiesManagementPage() {
  return (
    <PageContainer>
      <PageHeader title="Facility Management" description="Manage all business locations and facilities.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Facility
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>All Facilities</CardTitle>
            <CardDescription>View, edit, or add new facilities to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facility ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground"/>
                        {facility.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <MapPin className="inline h-3 w-3 mr-1 text-muted-foreground"/>
                    {facility.address}
                  </TableCell>
                  <TableCell>{facility.type}</TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-1 text-xs rounded-full",
                        facility.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300')}>
                        {facility.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                       <span className="sr-only">Edit Facility</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {facilities.length === 0 && (
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                <Building className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No facilities found. Click "Add New Facility" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
