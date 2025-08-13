
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Filter, MoreHorizontal, Eye, Edit, Trash2, Megaphone, Send, BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface Recall {
    id: string;
    type: "Voluntary" | "Mandatory" | "Internal QA Flag";
    issuedBy: "TruChain" | "METRC" | "State Health Dept";
    createdAt: string;
    status: "Pending" | "In Progress" | "Resolved" | "Canceled";
    reason: string;
    affectedBatches: string[];
}

const recallsData: Recall[] = [
    { id: "REC-2024-001", type: "Internal QA Flag", issuedBy: "TruChain", createdAt: "2023-11-10", status: "In Progress", reason: "Failed pesticide test", affectedBatches: ["B-042"] },
    { id: "REC-2024-002", type: "Voluntary", issuedBy: "TruChain", createdAt: "2023-10-15", status: "Resolved", reason: "Mislabeled potency", affectedBatches: ["FLW-033", "FLW-034"] },
    { id: "REC-2024-003", type: "Mandatory", issuedBy: "State Health Dept", createdAt: "2023-09-01", status: "Resolved", reason: "Undeclared allergen", affectedBatches: ["EDBL-GUM-010"] },
];

const notificationsData = [
    { id: "NOTIF-001", recallId: "REC-2024-001", recipient: "Retail Partners", method: "Email", status: "Sent", sentOn: "2023-11-10 10:05 AM" },
    { id: "NOTIF-002", recallId: "REC-2024-002", recipient: "All affected customers", method: "Email", status: "Sent", sentOn: "2023-10-15 02:00 PM" },
];


export default function RecallsManagementPage() {
  const { toast } = useToast();
  const [showCreateRecallModal, setShowCreateRecallModal] = useState(false);
  
  const handleCreateRecall = () => {
    // TODO: Call createRecall(data)
    toast({ title: "Success", description: "New recall initiated and affected inventory has been flagged." });
    setShowCreateRecallModal(false);
  };
  
  const handleRowAction = (action: string, recall: Recall) => {
    if (action === "view") toast({ title: "Info", description: `Viewing details for ${recall.id}` });
    else if (action === "edit") toast({ title: "Info", description: `Editing recall ${recall.id}` });
    else if (action === "cancel") toast({ title: "Info", description: `Canceling recall ${recall.id}`, variant: "destructive" });
  };


  return (
    <PageContainer>
      <PageHeader 
        title="Recall Management" 
        description="Initiate, manage, and track product recalls. Notify downstream contacts and maintain a compliant audit trail."
      >
        <Button onClick={() => setShowCreateRecallModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Recall
        </Button>
      </PageHeader>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="overview"><Megaphone className="mr-2 h-4 w-4"/>Recalls Overview</TabsTrigger>
            <TabsTrigger value="notifications"><BellRing className="mr-2 h-4 w-4"/>Notification Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
            <Card>
                <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <CardTitle>All Recall Events</CardTitle>
                        <CardDescription>Filterable list of all internal, voluntary, and mandatory recalls.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input placeholder="Search by ID, Reason, Batch..." className="max-w-xs" />
                        <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filters</Button>
                    </div>
                </div>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Recall ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Issued</TableHead>
                        <TableHead>Affected Batches</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recallsData.map((recall) => (
                        <TableRow key={recall.id}>
                        <TableCell className="font-medium">{recall.id}</TableCell>
                        <TableCell>{recall.type}</TableCell>
                        <TableCell className="text-xs">{recall.reason}</TableCell>
                        <TableCell>
                            <Badge className={cn(
                                recall.status === "In Progress" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400",
                                recall.status === "Resolved" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                                recall.status === "Canceled" && "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            )}>{recall.status}</Badge>
                        </TableCell>
                        <TableCell>{recall.createdAt}</TableCell>
                        <TableCell className="text-xs">{recall.affectedBatches.join(', ')}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleRowAction("view", recall)}><Eye className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRowAction("edit", recall)}><Edit className="mr-2 h-4 w-4" />Edit/Update Recall</DropdownMenuItem>
                                <DropdownMenuItem><Send className="mr-2 h-4 w-4" />Manage Notifications</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => handleRowAction("cancel", recall)}><Trash2 className="mr-2 h-4 w-4" />Cancel Recall</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="notifications">
            <Card>
                <CardHeader>
                    <CardTitle>Downstream Notification Logs</CardTitle>
                    <CardDescription>Audit trail of all notifications sent to customers, retailers, and distributors regarding recalls.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Recall ID</TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Sent On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {notificationsData.map((notif) => (
                               <TableRow key={notif.id}>
                                   <TableCell>{notif.recallId}</TableCell>
                                   <TableCell>{notif.recipient}</TableCell>
                                   <TableCell>{notif.method}</TableCell>
                                   <TableCell>{notif.status}</TableCell>
                                   <TableCell>{notif.sentOn}</TableCell>
                               </TableRow>
                           ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>


      {/* Create New Recall Modal */}
      <Dialog open={showCreateRecallModal} onOpenChange={setShowCreateRecallModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Initiate New Product Recall</DialogTitle>
            <DialogDescription>
              Fill in the details to start a new recall. This will flag affected inventory and prepare for notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <Label htmlFor="recall-type">Recall Type</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select recall type..."/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal QA Flag</SelectItem>
                  <SelectItem value="voluntary">Voluntary Recall</SelectItem>
                  <SelectItem value="mandatory">Mandatory Recall</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="recall-reason">Reason for Recall</Label>
              <Input id="recall-reason" placeholder="e.g., Mislabeled potency, failed microbial test" />
            </div>
             <div>
              <Label htmlFor="recall-batches">Affected Batch or Product IDs</Label>
              <Textarea id="recall-batches" placeholder="Enter comma-separated IDs, e.g., B-042, B-043" />
            </div>
            <div>
              <Label htmlFor="recall-scope">Notification Scope</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select who to notify..."/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal Only</SelectItem>
                  <SelectItem value="distributors">Distributors</SelectItem>
                  <SelectItem value="retailers">Retail Partners</SelectItem>
                  <SelectItem value="public">Public / All Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="recall-actions">Corrective Actions</Label>
              <Textarea id="recall-actions" placeholder="e.g., Return product to point of purchase, Dispose of product safely." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateRecallModal(false)}>Cancel</Button>
            <Button onClick={handleCreateRecall}>Initiate Recall</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
