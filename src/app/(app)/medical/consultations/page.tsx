
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, FilePenLine, FileTextIcon, LinkIcon, PlusCircle, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const upcomingConsultations = [
  { id: "CON001", patientName: "John Doe", date: "2024-08-15 10:00 AM", type: "Follow-up", status: "Scheduled" },
  { id: "CON002", patientName: "Jane Smith", date: "2024-08-16 02:00 PM", type: "Initial", status: "Scheduled" },
];

export default function ConsultationManagementPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Consultation Management" 
        description="Schedule and document patient consultations, manage pre-consult intake forms, use consult note templates, and streamline the consult-to-prescription flow."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Consultation
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming & Recent Consultations</CardTitle>
            <CardDescription>View scheduled consultations and access past notes.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingConsultations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Consultation ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingConsultations.map((consult) => (
                    <TableRow key={consult.id}>
                      <TableCell className="font-medium">{consult.id}</TableCell>
                      <TableCell>{consult.patientName}</TableCell>
                      <TableCell>{consult.date}</TableCell>
                      <TableCell>{consult.type}</TableCell>
                      <TableCell>
                         <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {consult.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 border border-dashed rounded-md text-center text-muted-foreground">
                <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No upcoming consultations scheduled.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pre-Consult Intake Forms</CardTitle>
            <CardDescription>Allow patients to provide information before their consultation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Manage and send intake forms. Patients can fill out symptoms, medical history, previous experiences, or product preferences in advance.</p>
            <Button variant="outline">Manage Intake Forms</Button>
            <Button>Send New Intake Form</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consult Note Templates</CardTitle>
            <CardDescription>Standardize consultation documentation with pre-defined templates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Auto-fill structured notes: condition discussed, product recommended, treatment duration, follow-up actions.</p>
            <Button variant="outline">Manage Templates</Button>
            <Button>Create New Template</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Consult-to-Prescription Flow</CardTitle>
            <CardDescription>Streamline product recommendations post-consultation.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">After a consultation, easily and instantly recommend and assign specific products to a patient's profile with one click, linking the consultation notes to the recommendation.</p>
            <Button disabled><LinkIcon className="mr-2 h-4 w-4"/> Link to Patient Profile (Action Placeholder)</Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
