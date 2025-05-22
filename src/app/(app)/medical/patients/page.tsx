
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, FileText, Search, Stethoscope, Pill, History, Fingerprint } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';


export default function PatientProfilesPage() {
  // Dummy data for illustration
  const [patients, setPatients] = useState([
    { 
      id: "PAT001", 
      name: "John Doe", 
      registryId: "MEDID12345", 
      lastConsultation: "2023-10-15", 
      dataAiHint: "man casual",
      conditions: ["Chronic Pain", "Insomnia"],
      approvedProducts: ["CBD Tincture 500mg", "Indica Flower XYZ"],
      refillCount: 3,
      nextRefillDue: "2024-01-15",
      dosageLimits: "30g flower/month",
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
      nextRefillDue: "2024-02-01",
      dosageLimits: "10ml oil/month",
      providerNotesAvailable: false,
      stateIdSynced: true,
    },
     { 
      id: "PAT003", 
      name: "Carlos Ray", 
      registryId: "MEDID24680", 
      lastConsultation: "2023-09-20", 
      dataAiHint: "man glasses",
      conditions: ["Epilepsy"],
      approvedProducts: ["Low-THC Oil", "CBD Capsules"],
      refillCount: 5,
      nextRefillDue: "2024-01-25",
      dosageLimits: "5ml low-THC oil/month",
      providerNotesAvailable: true,
      stateIdSynced: false,
    },
  ]);

  // Client-side state for search term to avoid hydration errors
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter(patient =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.registryId.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, patients]);


  return (
    <PageContainer>
      <PageHeader 
        title="Patient Profiles" 
        description="Manage patient information, medical conditions, approved products, refill history, provider integrations (including state ID sync and doctor's notes access where available), and track medical recommendations against dosage limits."
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
              <Input 
                placeholder="Search patients by name or ID..." 
                className="max-w-xs" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" size="icon" aria-label="Search Patients">
                <Search className="h-4 w-4"/>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.map(patient => (
                <Card key={patient.id} className="p-4 shadow-md rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border">
                      <AvatarImage src={`https://placehold.co/80x80.png?text=${patient.name.substring(0,1)}`} alt={patient.name} data-ai-hint={patient.dataAiHint} />
                      <AvatarFallback>{patient.name.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">Registry ID: {patient.registryId}</p>
                      <p className="text-xs text-muted-foreground">Last Consultation: {patient.lastConsultation}</p>
                       <div className="mt-2 flex flex-wrap items-center gap-2">
                        {patient.stateIdSynced ? 
                            <Badge variant="outline" className="text-xs border-green-500 text-green-700 dark:text-green-300 dark:border-green-700"><Fingerprint className="h-3 w-3 mr-1"/>State ID Synced</Badge> 
                            : <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700 dark:text-yellow-400 dark:border-yellow-600"><Fingerprint className="h-3 w-3 mr-1"/>State ID Pending</Badge>}
                        {patient.providerNotesAvailable && <Button variant="link" size="sm" className="p-0 h-auto text-xs"><FileText className="h-3 w-3 mr-1"/>View Provider Notes</Button>}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 self-start sm:self-center">
                      <Button variant="outline" size="sm"><FileText className="mr-1 h-4 w-4"/>View Full Profile</Button>
                      <Button variant="default" size="sm">New Consultation Note</Button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        <div>
                            <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center"><Stethoscope className="h-4 w-4 mr-1 text-primary"/>Qualifying Conditions</h4>
                            {patient.conditions.length > 0 ? 
                                <p className="text-foreground">{patient.conditions.join(', ')}</p> 
                                : <p className="text-muted-foreground italic">No conditions listed.</p>}
                        </div>
                        <div>
                            <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center"><Pill className="h-4 w-4 mr-1 text-primary"/>Approved Products/Recommendations</h4>
                            {patient.approvedProducts.length > 0 ? 
                                <p className="text-foreground">{patient.approvedProducts.join(', ')}</p> 
                                : <p className="text-muted-foreground italic">No specific products listed.</p>}
                        </div>
                        <div>
                            <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center"><History className="h-4 w-4 mr-1 text-primary"/>Refill &amp; Dosage</h4>
                            <p className="text-foreground">Total Refills: {patient.refillCount} <Button variant="link" size="sm" className="p-0 h-auto text-xs ml-1">View Refill Log</Button></p>
                            <p className="text-xs text-muted-foreground">Next Refill Due: {patient.nextRefillDue}</p>
                            <p className="text-xs text-muted-foreground">Dosage Limits: {patient.dosageLimits}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Button variant="link" className="p-0 h-auto text-primary text-xs mt-1">Manage Recommendations & Dosage</Button>
                        </div>
                     </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2">No patient profiles found matching your search, or no patients added yet.</p>
              <p className="text-xs mt-1">Patient profiles will include registry information, contact details, consultation history, medical conditions, prescribed/approved products, purchase limits/history, and refill logs. Integrations allow for state ID sync and access to provider notes.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
