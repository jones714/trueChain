
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RotateCcw, Search, FileText, AlertTriangle, PackageCheck, DollarSign, Edit, PlusCircle, ListFilter, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const recentReturns = [
    { id: "RET001", saleId: "SALE003", date: "2023-10-28", customer: "CUST080", reason: "Defective Product", status: "Pending Inventory", staff: "Bob B.", total: 45.20 },
    { id: "RET002", saleId: "SALE001", date: "2023-10-29", customer: "CUST078", reason: "Incorrect Item", status: "Refunded", staff: "Alice W.", total: 15.00 },
];

export default function ReturnsAndRefundsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Returns & Refunds Management" 
        description="Process customer returns, manage refunds or store credit, and handle inventory reintegration according to compliance rules. All actions are logged."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Initiate New Return
        </Button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Process New Return</CardTitle>
              <CardDescription>Find the original sale and select items for return.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search-sale">Search Original Sale (ID, Customer, Date)</Label>
                <div className="flex gap-2">
                  <Input id="search-sale" placeholder="e.g., SALE003" />
                  <Button variant="outline" size="icon"><Search className="h-4 w-4"/></Button>
                </div>
              </div>
              <Separator />
              <div className="p-3 border rounded-md bg-muted/30 min-h-[100px]">
                <p className="text-xs text-muted-foreground text-center">Sale details and items will appear here once a sale is found. Select items to return.</p>
              </div>
              <div>
                <Label htmlFor="return-reason">Reason for Return</Label>
                <Select>
                  <SelectTrigger id="return-reason">
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defective">Defective Product</SelectItem>
                    <SelectItem value="incorrect">Incorrect Item Received</SelectItem>
                    <SelectItem value="damaged">Damaged in Transit (if applicable)</SelectItem>
                    <SelectItem value="expired">Expired Product</SelectItem>
                    <SelectItem value="other">Other (Specify)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="return-notes">Notes / Details</Label>
                <Textarea id="return-notes" placeholder="Additional details about the return..." rows={2} />
              </div>
              <div>
                <Label htmlFor="refund-method">Refund Method</Label>
                <Select>
                  <SelectTrigger id="refund-method">
                    <SelectValue placeholder="Select refund method..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original_payment">Original Payment Method</SelectItem>
                    <SelectItem value="store_credit">Store Credit</SelectItem>
                    <SelectItem value="exchange">Exchange (Process as new sale)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inventory-action">Inventory Reintegration</Label>
                <Select>
                  <SelectTrigger id="inventory-action">
                    <SelectValue placeholder="Select inventory action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quarantine"><AlertTriangle className="h-4 w-4 mr-2 inline-block text-orange-500"/>Quarantine for Inspection</SelectItem>
                    <SelectItem value="resale"><PackageCheck className="h-4 w-4 mr-2 inline-block text-green-500"/>Return to Resalable Inventory (if sealed)</SelectItem>
                    <SelectItem value="destroy">Mark for Destruction (Waste Log)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full"><RotateCcw className="mr-2 h-4 w-4"/>Process Return</Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <CardTitle>Recent Return Requests</CardTitle>
                        <CardDescription>View and manage ongoing and completed returns. All actions are logged with staff ID and timestamp.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm"><ListFilter className="mr-2 h-4 w-4"/>Filters</Button>
                </div>
            </CardHeader>
            <CardContent>
              {recentReturns.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Return ID</TableHead>
                      <TableHead>Sale ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReturns.map((ret) => (
                      <TableRow key={ret.id}>
                        <TableCell className="font-medium">{ret.id}</TableCell>
                        <TableCell>{ret.saleId}</TableCell>
                        <TableCell>{ret.date}</TableCell>
                        <TableCell>{ret.customer}</TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate">{ret.reason}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={ret.status === "Refunded" ? "default" : "secondary"}
                            className={cn(
                                ret.status === "Refunded" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                                ret.status === "Pending Inventory" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400"
                            )}
                          >{ret.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" title="View Details"><FileText className="h-4 w-4"/></Button>
                          <Button variant="ghost" size="icon" title="Edit Return"><Edit className="h-4 w-4"/></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 border border-dashed rounded-md text-center text-muted-foreground">
                  <RotateCcw className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">No recent return requests found.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
                 <p className="text-xs text-muted-foreground">Compliance logs are maintained for each return, detailing staff involved, timestamps, reasons, and inventory actions.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
