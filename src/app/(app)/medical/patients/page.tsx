
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, FileText, Search, Stethoscope, Pill, History, Fingerprint, TrendingUp, CalendarClock, Share2, Scan, ShieldCheck, FileArchive, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";


export default function PatientProfilesPage() {
  const [patients, setPatients] = useState([
    { 
      id: "PAT001", 
      name: "John Doe", 
      registryId: "MEDID12345", 
      lastConsultation: "2023-10-15", 
      dataAiHint: "man casual",
      conditions: ["Chronic Pain (since 2022-01-10 by Dr. Smith)", "Insomnia (since 2023-03-05 by Dr. Jones)"],
      recommendations: [
        {product: "CBD Tincture 500mg", dosage: "1ml twice daily", forCondition: "Chronic Pain", startDate: "2023-10-15", endDate: "2024-04-15"},
        {product: "Indica Flower XYZ", dosage: "0.5g as needed for sleep", forCondition: "Insomnia", startDate: "2023-10-15", endDate: "2024-01-15"}
      ],
      refillCount: 3,
      nextRefillDue: "2024-01-15",
      purchaseLimit: { current: 15, max: 30, unit: "g flower equivalent" },
      stateIdSynced: true,
      providerNotesAvailable: true,
    },
    { 
      id: "PAT002", 
      name: "Jane Smith", 
      registryId: "MEDID67890", 
      lastConsultation: "2023-11-01", 
      dataAiHint: "woman professional",
      conditions: ["Anxiety (since 2021-07-20 by Dr. Alpha)"],
      recommendations: [
         {product: "Hybrid Vape Cartridge ABC", dosage: "1-2 puffs as needed", forCondition: "Anxiety", startDate: "2023-11-01", endDate: "2024-05-01"}
      ],
      refillCount: 1,
      nextRefillDue: "2024-02-01",
      purchaseLimit: { current: 5, max: 10, unit: "ml oil equivalent" },
      stateIdSynced: true,
      providerNotesAvailable: false,
    },
     { 
      id: "PAT003", 
      name: "Carlos Ray", 
      registryId: "MEDID24680", 
      lastConsultation: "2023-09-20", 
      dataAiHint: "man glasses",
      conditions: ["Epilepsy (Low-THC) (since 2020-05-01 by Dr. Beta)"],
      recommendations: [
        {product: "Low-THC Oil (1:20)", dosage: "0.5ml three times daily", forCondition: "Epilepsy", startDate: "2023-09-20", endDate: "2024-03-20"},
        {product: "CBD Capsules 25mg", dosage: "1 capsule daily", forCondition: "Epilepsy", startDate: "2023-09-20", endDate: "2024-03-20"}
      ],
      refillCount: 5,
      nextRefillDue: "2024-01-25",
      purchaseLimit: { current: 2, max: 5, unit: "ml low-THC oil equivalent" },
      stateIdSynced: false,
      providerNotesAvailable: true,
    },
  ]);

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
        title="Patient Profile Management" 
        description="Manage patient information, medical conditions & timelines, prescriptions/recommendations, track dosage limits, refill history, and provider integrations (state ID sync, doctor's notes)."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Patient
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle>Registered Patients</CardTitle>
              <CardDescription>View, edit, or add patient profiles. Includes State ID validation and HIPAA-compliant access logs.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Search by name or ID..." 
                className="max-w-xs" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
               <Button variant="outline"><Scan className="mr-2 h-4 w-4"/>Verify State ID (Future)</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <div className="space-y-6">
              {filteredPatients.map(patient => (
                <Card key={patient.id} className="shadow-lg rounded-lg overflow-hidden">
                  <CardHeader className="bg-muted/50 p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Avatar className="h-20 w-20 border-2 border-primary">
                        <AvatarImage src={`https://placehold.co/80x80.png?text=${patient.name.substring(0,1)}`} alt={patient.name} data-ai-hint={patient.dataAiHint} />
                        <AvatarFallback>{patient.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                        <h3 className="text-xl font-semibold text-primary">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">Registry ID: {patient.registryId}</p>
                        <p className="text-xs text-muted-foreground">Last Consultation: {patient.lastConsultation}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            {patient.stateIdSynced ? 
                                <Badge variant="outline" className="text-xs border-green-500 text-green-700 dark:text-green-300 dark:border-green-700"><Fingerprint className="h-3 w-3 mr-1"/>State ID Synced (Future)</Badge> 
                                : <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700 dark:text-yellow-400 dark:border-yellow-600"><Fingerprint className="h-3 w-3 mr-1"/>State ID Sync Pending (Future)</Badge>}
                            {patient.providerNotesAvailable && <Button variant="link" size="sm" className="p-0 h-auto text-xs"><FileText className="h-3 w-3 mr-1"/>View Provider Notes</Button>}
                             <Button variant="link" size="sm" className="p-0 h-auto text-xs"><Share2 className="h-3 w-3 mr-1"/>Telemed Sync (Future)</Button>
                        </div>
                        </div>
                         <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 self-start sm:self-center">
                            <Button variant="outline" size="sm"><FileText className="mr-1 h-4 w-4"/>View Full Profile</Button>
                            <Button variant="default" size="sm">New Consultation Note</Button>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 text-sm">
                        <div className="lg:col-span-1">
                            <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center"><Stethoscope className="h-4 w-4 mr-1 text-primary"/>Qualifying Conditions & Timeline</h4>
                            {patient.conditions.length > 0 ? 
                                <ul className="list-disc list-inside text-foreground space-y-0.5 text-xs">
                                    {patient.conditions.map(c => <li key={c}>{c}</li>)}
                                </ul>
                                : <p className="text-muted-foreground italic text-xs">No conditions listed.</p>}
                             <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1"><TrendingUp className="h-3 w-3 mr-1"/>View Condition Treatment Timeline</Button>
                        </div>
                        <div className="lg:col-span-1">
                            <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center"><Pill className="h-4 w-4 mr-1 text-primary"/>Prescriptions / Recommendations</h4>
                            {patient.recommendations.length > 0 ? 
                                 <ul className="list-disc list-inside text-foreground space-y-0.5 text-xs">
                                    {patient.recommendations.map(p => <li key={p.product}>{p.product} ({p.dosage}) - For: {p.forCondition} (Until: {p.endDate})</li>)}
                                </ul>
                                : <p className="text-muted-foreground italic text-xs">No active recommendations.</p>}
                             <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1 text-primary"><Brain className="h-3 w-3 mr-1"/>Suggest Products</Button>
                        </div>
                        <div className="lg:col-span-1">
                            <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center"><History className="h-4 w-4 mr-1 text-primary"/>Refill History &amp; Dosage</h4>
                            <p className="text-foreground text-xs">Total Refills This Period: {patient.refillCount}</p>
                            <p className="text-xs text-muted-foreground">Next Estimated Refill Due: {patient.nextRefillDue}</p>
                             <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1"><CalendarClock className="h-3 w-3 mr-1"/>View Refill History / Schedule Next</Button>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 mt-2">
                            <h4 className="font-medium text-xs text-muted-foreground mb-1">Purchase Limit Meter ({patient.purchaseLimit.unit})</h4>
                            <Progress value={(patient.purchaseLimit.current / patient.purchaseLimit.max) * 100} className="h-3" />
                            <p className="text-xs text-muted-foreground text-right mt-0.5">{patient.purchaseLimit.current} / {patient.purchaseLimit.max} {patient.purchaseLimit.unit} used</p>
                        </div>
                     </div>
                  </CardContent>
                   <CardFooter className="p-4 border-t flex justify-between items-center">
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary"><ShieldCheck className="h-3 w-3 mr-1"/>View HIPAA Access Log</Button>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary"><FileArchive className="h-3 w-3 mr-1"/>Export Patient Data</Button>
                   </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2">No patient profiles found matching your search, or no patients added yet.</p>
              <p className="text-xs mt-1">Patient profiles include registry info, contact details, consultation history, conditions, recommendations, purchase limits/history, and refill logs. Integrations allow for state ID sync, provider notes access, and telemed capabilities (future).</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
