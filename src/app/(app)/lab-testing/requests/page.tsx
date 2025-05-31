
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircle, Send, Upload, FileText, Users, Edit, Clock, Package, Sprout, TestTubeDiagonal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';


const testRequests = [
  { id: "REQ-001", sourceBatch: "HVT-001", lab: "Anresco Labs", status: "Sample Sent", dateCreated: "2023-10-28", qaStaff: "Diana P." },
  { id: "REQ-002", sourceBatch: "EXT-005", lab: "Steep Hill", status: "In Progress", dateCreated: "2023-10-27", qaStaff: "Diana P." },
  { id: "REQ-003", sourceBatch: "EDBL-012", lab: "SC Labs", status: "Created", dateCreated: "2023-10-29", qaStaff: "Clark K." },
];

const testTypes = [
  { id: "thc_cbd", label: "THC/CBD Potency" },
  { id: "pesticides", label: "Pesticides Screen" },
  { id: "heavy_metals", label: "Heavy Metals Screen" },
  { id: "mold_mildew", label: "Mold/Mildew Screen" },
  { id: "moisture", label: "Moisture Content" },
  { id: "terpenes", label: "Terpene Profile" },
  { id: "residual_solvents", label: "Residual Solvents" },
  { id: "mycotoxins", label: "Mycotoxins" },
  { id: "foreign_material", label: "Foreign Material Inspection" },
];


export default function LabTestRequestsPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);

  useState(() => {
    if (searchParams?.get('action') === 'create') {
      setShowCreateRequestModal(true);
    }
  });

  const handleSubmitTestRequest = () => {
    // TODO: Call createTestRequest(data)
    toast({ title: "Success", description: "Lab test request submitted." });
    setShowCreateRequestModal(false);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Lab Testing Requests" 
        description="Create, manage, and track lab test requests. Testing templates can be predefined for different product types to streamline this process."
      >
        <Button onClick={() => setShowCreateRequestModal(true)}> 
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Test Request
        </Button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create New Test Request (Form)</CardTitle>
              <CardDescription>Use the button above or this form to create requests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="form-source-type">Source Type</Label>
                <Select>
                  <SelectTrigger id="form-source-type"><SelectValue placeholder="Select source type..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plant_batch"><Sprout className="inline h-4 w-4 mr-2" />Plant Batch</SelectItem>
                    <SelectItem value="extract"><TestTubeDiagonal className="inline h-4 w-4 mr-2" />Extract/Concentrate</SelectItem>
                    <SelectItem value="edible"><Package className="inline h-4 w-4 mr-2" />Edible/Infused Product</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="form-source-id">Source Batch/Product ID</Label>
                <Input id="form-source-id" placeholder="e.g., HVT-001, BATCH-EXT-005" />
              </div>
              <div>
                <Label>Requested Tests</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                  {testTypes.map(type => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox id={`form-test-${type.id}`} />
                      <Label htmlFor={`form-test-${type.id}`} className="font-normal text-sm">{type.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="form-lab-partner">Lab Partner</Label>
                <Select>
                  <SelectTrigger id="form-lab-partner"><SelectValue placeholder="Select lab..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab_xyz">Lab XYZ (Default)</SelectItem>
                    <SelectItem value="anresco">Anresco Laboratories</SelectItem>
                    <SelectItem value="steep_hill">Steep Hill Labs</SelectItem>
                    <SelectItem value="sc_labs">SC Labs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="form-qa-staff">Assigned Internal QA Staff</Label>
                <Input id="form-qa-staff" placeholder="e.g., Diana Prince" />
              </div>
              <div>
                <Label htmlFor="form-lab-contact">Lab Contact Person (Optional)</Label>
                <Input id="form-lab-contact" placeholder="e.g., Dr. Egon Spengler" />
              </div>
              <div>
                <Label htmlFor="form-sample-photo">Attach Photo (Sample Label/CoC)</Label>
                <Input id="form-sample-photo" type="file" />
              </div>
              <div>
                <Label htmlFor="form-notes">Notes</Label>
                <Textarea id="form-notes" placeholder="Any specific instructions or notes for the lab or internal team." />
              </div>
              <Button className="w-full" onClick={handleSubmitTestRequest}><Send className="mr-2 h-4 w-4"/>Submit Test Request</Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Outgoing Test Requests</CardTitle>
              <CardDescription>List of all generated lab testing requests and their current status.</CardDescription>
            </CardHeader>
            <CardContent>
              {testRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Source Batch</TableHead>
                      <TableHead>Lab</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead>QA Staff</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.id}</TableCell>
                        <TableCell>{req.sourceBatch}</TableCell>
                        <TableCell>{req.lab}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            req.status === "Created" ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200" :
                            req.status === "Sample Sent" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
                            req.status === "In Progress" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400" :
                            "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          }`}>
                            {req.status}
                          </span>
                        </TableCell>
                        <TableCell>{req.dateCreated}</TableCell>
                        <TableCell>{req.qaStaff}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" title="View Details" onClick={() => toast({ title: "Info", description: `Viewing details for ${req.id}`})}><FileText className="h-4 w-4"/></Button>
                          <Button variant="ghost" size="icon" title="Update Status" onClick={() => toast({ title: "Info", description: `Updating status for ${req.id}`})}><Edit className="h-4 w-4"/></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 border border-dashed rounded-md text-center text-muted-foreground">
                  <Send className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">No outgoing test requests found.</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
                <CardTitle>Chain of Custody Log</CardTitle>
                <CardDescription>Timestamped handoffs, driver, vehicle, and signature capture for sample integrity.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">For a selected test request, its chain of custody log will appear here. This includes actions like "Sample Picked Up by [Driver Name], Vehicle [ID], Date/Time" and "Sample Received by [Lab Staff], Date/Time, Signature".</p>
                <div className="mt-2 p-4 border border-dashed rounded-md text-center text-muted-foreground">
                    <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-1 text-xs">Chain of Custody details for a selected request.</p>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create New Test Request Modal (triggered by header button) */}
      <Dialog open={showCreateRequestModal} onOpenChange={setShowCreateRequestModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Lab Test Request</DialogTitle>
            <DialogDescription>Fill in the details for the new test request.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
             <div>
                <Label htmlFor="modal-source-type">Source Type</Label>
                <Select>
                  <SelectTrigger id="modal-source-type"><SelectValue placeholder="Select source type..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plant_batch"><Sprout className="inline h-4 w-4 mr-2" />Plant Batch</SelectItem>
                    <SelectItem value="extract"><TestTubeDiagonal className="inline h-4 w-4 mr-2" />Extract/Concentrate</SelectItem>
                    <SelectItem value="edible"><Package className="inline h-4 w-4 mr-2" />Edible/Infused Product</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="modal-source-id">Source Batch/Product ID</Label>
                <Input id="modal-source-id" placeholder="e.g., HVT-001" />
              </div>
              <div>
                <Label>Requested Tests</Label>
                <div className="space-y-1 max-h-32 overflow-y-auto p-1 border rounded-md">
                  {testTypes.map(type => (
                    <div key={`modal-${type.id}`} className="flex items-center space-x-2">
                      <Checkbox id={`modal-test-${type.id}`} />
                      <Label htmlFor={`modal-test-${type.id}`} className="font-normal text-sm">{type.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="modal-lab-partner">Lab Partner</Label>
                <Select>
                  <SelectTrigger id="modal-lab-partner"><SelectValue placeholder="Select lab..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab_xyz">Lab XYZ (Default)</SelectItem>
                    {/* Add other labs */}
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="modal-qa-staff">Assigned Internal QA Staff</Label>
                <Input id="modal-qa-staff" placeholder="e.g., Diana Prince" />
              </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateRequestModal(false)}>Cancel</Button>
            <Button onClick={handleSubmitTestRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageContainer>
  );
}
    
