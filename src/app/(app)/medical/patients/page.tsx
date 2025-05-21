
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PatientProfilesPage() {
  // Dummy data for illustration
  const patients = [
    { id: "PAT001", name: "John Doe", registryId: "MEDID12345", lastConsultation: "2023-10-15", dataAiHint: "man casual" },
    { id: "PAT002", name: "Jane Smith", registryId: "MEDID67890", lastConsultation: "2023-11-01", dataAiHint: "woman professional" },
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Patient Profiles" 
        description="Manage medical patient information, registry details, and consultation history."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Patient
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle>All Patients</CardTitle>
              <CardDescription>View, edit, or add new patient profiles.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Search patients by name or ID..." className="max-w-xs" />
              <Button variant="outline" size="icon"><Search className="h-4 w-4"/></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Placeholder for patient profiles list/table */}
          {patients.length > 0 ? (
            <div className="space-y-4">
              {patients.map(patient => (
                <Card key={patient.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://placehold.co/80x80.png?text=${patient.name.substring(0,1)}`} alt={patient.name} data-ai-hint={patient.dataAiHint} />
                    <AvatarFallback>{patient.name.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">Registry ID: {patient.registryId}</p>
                    <p className="text-xs text-muted-foreground">Last Consultation: {patient.lastConsultation}</p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button variant="outline" size="sm"><FileText className="mr-1 h-4 w-4"/>View Details</Button>
                    <Button variant="outline" size="sm">New Consultation</Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2">No patient profiles found. Click "Add New Patient" to get started.</p>
              <p className="text-xs mt-1">Patient profiles will include registry information, contact details, consultation history, prescribed products, and purchase limits/history.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
