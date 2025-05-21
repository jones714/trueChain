
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, FileText, Search, Stethoscope, Pill, History, Fingerprint } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function PatientProfilesPage() {
  // Dummy data for illustration
  const patients = [
    { 
      id: "PAT001", 
      name: "John Doe", 
      registryId: "MEDID12345", 
      lastConsultation: "2023-10-15", 
      dataAiHint: "man casual",
      conditions: ["Chronic Pain", "Insomnia"],
      approvedProducts: ["CBD Tincture 500mg", "Indica Flower XYZ"],
      refillCount: 3,
      providerNotesAvailable: true,
      stateIdSynced: true,
    },
    { 
      id: "PAT002", 
      name: "Jane Smith", 
      registryId: "MEDID67890", 
      lastConsultation: "2023-11-01", 
      dataAiHint: "woman professional",
      conditions: ["Anxiety"],
      approvedProducts: ["Hybrid Vape Cartridge ABC"],
      refillCount: 1,
      providerNotesAvailable: false,
      stateIdSynced: true,
    },
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Patient Profiles" 
        description="Manage patient information, medical conditions, approved products, refill history, and provider integrations."
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
              <CardDescription>View, edit, or add new patient profiles. Includes state ID sync and doctor's notes access where available.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Search patients by name or ID..." className="max-w-xs" />
              <Button variant="outline" size="icon"><Search className="h-4 w-4"/></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <div className="space-y-4">
              {patients.map(patient => (
                <Card key={patient.id} className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                      <AvatarImage src={`https://placehold.co/80x80.png?text=${patient.name.substring(0,1)}`} alt={patient.name} data-ai-hint={patient.dataAiHint} />
                      <AvatarFallback>{patient.name.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">Registry ID: {patient.registryId}</p>
                      <p className="text-xs text-muted-foreground">Last Consultation: {patient.lastConsultation}</p>
                       <div className="mt-1 flex items-center gap-1">
                        {patient.stateIdSynced && <Badge variant="outline" className="text-xs border-green-500 text-green-600"><Fingerprint className="h-3 w-3 mr-1"/>State ID Synced</Badge>}
                        {patient.providerNotesAvailable && <Badge variant="outline" className="text-xs"><FileText className="h-3 w-3 mr-1"/>Provider Notes</Badge>}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 self-start sm:self-center">
                      <Button variant="outline" size="sm"><FileText className="mr-1 h-4 w-4"/>View Details</Button>
                      <Button variant="outline" size="sm">New Consultation</Button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center"><Stethoscope className="h-3 w-3 mr-1"/>Conditions</h4>
                            {patient.conditions.length > 0 ? patient.conditions.join(', ') : <span className="text-muted-foreground italic">No conditions listed.</span>}
                        </div>
                        <div>
                            <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center"><Pill className="h-3 w-3 mr-1"/>Approved Products</h4>
                            {patient.approvedProducts.length > 0 ? patient.approvedProducts.join(', ') : <span className="text-muted-foreground italic">No specific products approved.</span>}
                        </div>
                        <div>
                            <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center"><History className="h-3 w-3 mr-1"/>Refill History</h4>
                            <p>Total Refills: {patient.refillCount} <Button variant="link" size="sm" className="p-0 h-auto text-xs ml-1">View Logs</Button></p>
                        </div>
                     </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2">No patient profiles found. Click "Add New Patient" to get started.</p>
              <p className="text-xs mt-1">Patient profiles will include registry information, contact details, consultation history, prescribed products, purchase limits/history, conditions, approved products, and refill logs.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
