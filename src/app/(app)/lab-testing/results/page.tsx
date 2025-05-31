
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Upload, FileWarning, FileText, Search, Edit, MessageSquare, AlertOctagon, RotateCcw, Brain, Download, ListFilter, Link2, TestTubeDiagonal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; 
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const completedTests = [
    { id: "TEST-001", requestId: "REQ-001", sourceBatch: "HVT-001", lab: "Anresco Labs", thc: "22.5%", cbd: "0.8%", contaminants: "None Detected", status: "Pass", dateCompleted: "2023-11-02", coaUrl: "#", comments: ""},
    { id: "TEST-002", requestId: "REQ-000", sourceBatch: "B-042", lab: "Steep Hill", thc: "18.2%", cbd: "1.1%", contaminants: "Pesticide XYZ (0.5ppm > 0.1ppm limit)", status: "Fail", dateCompleted: "2023-10-28", coaUrl: "#", comments: "Batch quarantined. Follow-up scheduled."},
    { id: "TEST-003", requestId: "REQ-000", sourceBatch: "C-105", lab: "SC Labs", thc: "N/A", cbd: "10.2%", contaminants: "None Detected", status: "Pass", dateCompleted: "2023-10-27", coaUrl: "#", comments: "CBD Isolate. CoA attached."},
];

export default function LabTestResultsPage() {
  const { toast } = useToast();
  const [showUploadCoaModal, setShowUploadCoaModal] = useState(false);
  const [showEnterResultModal, setShowEnterResultModal] = useState(false);
  const [selectedTestForAction, setSelectedTestForAction] = useState<typeof completedTests[0] | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showAssignFollowUpModal, setShowAssignFollowUpModal] = useState(false);


  const handleProcessCoaAndEnter = () => {
    // Simulate COA upload and AI processing
    // TODO: Call uploadCOA(file) -> then processCOA_genkit(filePath)
    toast({ title: "COA Processing...", description: "AI is attempting to extract results. Please verify." });
    setShowEnterResultModal(true); // Open manual entry modal, potentially pre-filled
  };

  const handleSubmitResult = () => {
    // TODO: Call updateTestResult(testId, data)
    toast({ title: "Success", description: "Test result saved." });
    setShowEnterResultModal(false);
  };
  
  const handleRowAction = (action: string, test: typeof completedTests[0]) => {
    setSelectedTestForAction(test);
    if (action === "viewCoa") {
      // In a real app, this might open the COA PDF or navigate to a COA viewer
      toast({ title: "Info", description: `Viewing COA for ${test.id}. Mock: Opening ${test.coaUrl}` });
      if(test.coaUrl && test.coaUrl !== "#") window.open(test.coaUrl, "_blank");
      else setShowUploadCoaModal(true); // If no URL, prompt to upload
    } else if (action === "addComments") {
      setShowCommentsModal(true);
    } else if (action === "assignFollowUp") {
      setShowAssignFollowUpModal(true);
    } else if (action === "flagFailed") {
        // TODO: Call flagFailedBatch(test.id)
        toast({ variant: "destructive", title: "Batch Flagged", description: `${test.sourceBatch} flagged as FAILED.` });
    } else if (action === "requestRetest") {
        // TODO: Call createTestRequest(retestDataForBatch)
        toast({ title: "Retest Requested", description: `Retest initiated for ${test.sourceBatch}.` });
    } else if (action === "linkToBatch") {
        // TODO: Open modal to search and link this result to a plant/processing batch
        toast({ title: "Link to Batch", description: `Opening interface to link ${test.id} to a batch.`});
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Test Results & COAs" 
        description="Record, associate, and view lab test results and Certificates of Analysis (COAs). Automatically flags non-compliant batches and facilitates result review."
      >
        <Button onClick={() => setShowUploadCoaModal(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload COA Document
        </Button>
      </PageHeader>
      
      <Card id="upload">
        <CardHeader>
            <CardTitle>COA Upload Assistant (AI Enhanced)</CardTitle>
            <CardDescription>
                Upload a COA (PDF, JPG, CSV) and our AI will attempt to pre-fill key test results like THC/CBD percentages and contaminant levels, speeding up data entry. Manually verify before saving.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Brain className="h-16 w-16 text-primary hidden sm:block" />
            <div className="flex-1 space-y-2">
                <Input type="file" className="max-w-md" accept=".pdf,.jpg,.jpeg,.png,.csv" />
                <p className="text-xs text-muted-foreground">Select the COA file. The system will process it and suggest values for the result entry form below or allow direct creation of a new test result record. Stored in Firestore.</p>
            </div>
            <Button onClick={handleProcessCoaAndEnter}><TestTubeDiagonal className="mr-2 h-4 w-4"/>Process COA &amp; Enter Results</Button>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <CardTitle>All Test Results</CardTitle>
                    <CardDescription>Filter by batch, status, or test type. Non-compliant results are automatically flagged. Pass/Fail status clearly indicated.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Input placeholder="Search by Batch ID, Strain, Lab..." className="max-w-xs" />
                    <Button variant="outline"><ListFilter className="mr-2 h-4 w-4"/>Filters</Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          {completedTests.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Test ID</TableHead>
                        <TableHead>Source Batch</TableHead>
                        <TableHead>Lab</TableHead>
                        <TableHead>THC%</TableHead>
                        <TableHead>CBD%</TableHead>
                        <TableHead>Contaminants</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {completedTests.map(test => (
                        <TableRow key={test.id} className={test.status === "Fail" ? "bg-destructive/10 hover:bg-destructive/20" : ""}>
                            <TableCell className="font-medium">{test.id}</TableCell>
                            <TableCell>{test.sourceBatch}</TableCell>
                            <TableCell>{test.lab}</TableCell>
                            <TableCell>{test.thc}</TableCell>
                            <TableCell>{test.cbd}</TableCell>
                            <TableCell className="max-w-xs truncate">
                                {test.contaminants.includes("limit") && <FileWarning className="inline h-4 w-4 mr-1 text-destructive"/>}
                                {test.contaminants}
                            </TableCell>
                            <TableCell>
                                <Badge variant={test.status === "Pass" ? "default" : "destructive"} 
                                       className={cn(
                                           test.status === "Pass" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                                           test.status === "Fail" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                        )}>
                                    {test.status === "Pass" && <BadgeCheck className="inline h-3 w-3 mr-1"/>}
                                    {test.status === "Fail" && <FileWarning className="inline h-3 w-3 mr-1"/>}
                                    {test.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{test.dateCompleted}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" title="View/Upload COA" onClick={() => handleRowAction("viewCoa", test)}><FileText className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" title="Add Comments/Resolution" onClick={() => handleRowAction("addComments", test)}><MessageSquare className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" title="Assign Follow-up" onClick={() => handleRowAction("assignFollowUp", test)}><Edit className="h-4 w-4"/></Button>
                                {test.status === "Fail" && (
                                    <>
                                    <Button variant="ghost" size="icon" title="Flag as Failed (Verify)" className="text-destructive hover:text-destructive" onClick={() => handleRowAction("flagFailed", test)}><AlertOctagon className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" title="Request Retest" className="text-blue-500 hover:text-blue-600" onClick={() => handleRowAction("requestRetest", test)}><RotateCcw className="h-4 w-4"/></Button>
                                    </>
                                )}
                                <Button variant="ghost" size="icon" title="Link Result to Batch" className="text-purple-500 hover:text-purple-600" onClick={() => handleRowAction("linkToBatch", test)}><Link2 className="h-4 w-4"/></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          ) : (
             <div className="p-8 border border-dashed rounded-md text-center text-muted-foreground">
                <BadgeCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No completed test results found.</p>
              </div>
          )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">
                Compliance Alerts: Failed batches automatically notify QA and Administrators. Follow-up actions (Quarantine, Destroy, Retest) can be assigned here. Results are stored in Firestore.
            </p>
        </CardFooter>
      </Card>

    {/* Upload COA Modal */}
    <Dialog open={showUploadCoaModal} onOpenChange={setShowUploadCoaModal}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Upload COA for {selectedTestForAction?.sourceBatch || "Test"}</DialogTitle>
                <DialogDescription>Select the Certificate of Analysis file (PDF, JPG, CSV).</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.csv" />
                <p className="text-xs text-muted-foreground mt-1">This will associate the COA with Test ID: {selectedTestForAction?.id}</p>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadCoaModal(false)}>Cancel</Button>
                <Button onClick={() => { 
                    // TODO: Call uploadCOA(file, selectedTestForAction.id)
                    toast({ title: "Success", description: `COA uploaded for ${selectedTestForAction?.id}.` });
                    setShowUploadCoaModal(false); 
                }}>Upload & Attach COA</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    {/* Manually Enter Result Modal */}
    <Dialog open={showEnterResultModal} onOpenChange={setShowEnterResultModal}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Enter/Verify Test Results for {selectedTestForAction?.sourceBatch || "Selected Batch"}</DialogTitle>
                <DialogDescription>AI suggestions may appear here. Please verify all data.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="result-thc" className="text-right">THC (%)</Label>
                    <Input id="result-thc" type="number" placeholder="e.g., 21.5" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="result-cbd" className="text-right">CBD (%)</Label>
                    <Input id="result-cbd" type="number" placeholder="e.g., 0.8" className="col-span-3" />
                </div>
                {/* Add more fields for other analytes: pesticides, moisture, terpenes etc. */}
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="result-contaminants" className="text-right">Contaminants</Label>
                    <Input id="result-contaminants" placeholder="e.g., None Detected or Pesticide X (0.2ppm)" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="result-status" className="text-right">Overall Status</Label>
                    <select id="result-status" className="col-span-3 p-2 border rounded-md text-sm">
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                    </select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowEnterResultModal(false)}>Cancel</Button>
                <Button onClick={handleSubmitResult}>Save Test Results</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    {/* Comments/Resolution Modal */}
    <Dialog open={showCommentsModal} onOpenChange={setShowCommentsModal}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Comments/Resolution for Test {selectedTestForAction?.id}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="comments-input">Notes / Resolution Steps</Label>
                <Textarea id="comments-input" defaultValue={selectedTestForAction?.comments} placeholder="Enter any comments or resolution steps for this test result..." rows={4} />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowCommentsModal(false)}>Cancel</Button>
                <Button onClick={() => {
                    // TODO: Call updateTestResult(selectedTestForAction.id, { comments: newComments })
                    toast({ title: "Comments Saved", description: "Comments updated."});
                    setShowCommentsModal(false);
                }}>Save Comments</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    {/* Assign Follow Up Modal */}
    <Dialog open={showAssignFollowUpModal} onOpenChange={setShowAssignFollowUpModal}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Assign Follow-up for Test {selectedTestForAction?.id}</DialogTitle>
                <DialogDescription>Assign a QA staff member or task for this test result.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
                <div>
                    <Label htmlFor="followup-action">Action Required</Label>
                    <Input id="followup-action" placeholder="e.g., Quarantine Batch, Schedule Retest, Review COA" />
                </div>
                <div>
                    <Label htmlFor="followup-assignee">Assign to Staff</Label>
                    <Input id="followup-assignee" placeholder="e.g., Diana Prince" />
                </div>
                 <div>
                    <Label htmlFor="followup-due-date">Due Date (Optional)</Label>
                    <Input id="followup-due-date" type="date" />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowAssignFollowUpModal(false)}>Cancel</Button>
                <Button onClick={() => {
                    // TODO: Call assignTestFollowUp(selectedTestForAction.id, followUpData)
                    toast({ title: "Follow-up Assigned", description: "Follow-up action has been assigned."});
                    setShowAssignFollowUpModal(false);
                }}>Assign Follow-up</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    </PageContainer>
  );
}
