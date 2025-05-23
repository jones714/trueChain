
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, CalendarDays, Filter, BriefcaseMedical, UserCircle, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const salesData = [
  { id: "SALE001", date: "2023-10-26", customer: "CUST078", total: 75.50, items: 3, status: "Completed", type: "Recreational", budtender: "Alice W." , metrcPushed: true},
  { id: "SALE002", date: "2023-10-26", customer: "PAT001", total: 120.00, items: 5, status: "Completed", type: "Medical", budtender: "Bob B.", metrcPushed: true },
  { id: "SALE003", date: "2023-10-25", customer: "CUST080", total: 45.20, items: 2, status: "Refunded", type: "Recreational", budtender: "Alice W.", metrcPushed: true },
  { id: "SALE004", date: "2023-10-25", customer: "PAT002", total: 210.75, items: 8, status: "Completed", type: "Medical", budtender: "Charlie C.", metrcPushed: false, complianceIssue: "Over Purchase Limit (Potential)" },
];


export default function SalesRecordsPage() {
  return (
    <PageContainer>
      <PageHeader title="Sales Records & Compliance Audit" description="View and manage all sales transactions. Identify potential compliance violations and export reports.">
        <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
                <CalendarDays className="mr-2 h-4 w-4" /> Date Range
            </Button>
             <Select>
                <SelectTrigger className="h-9 w-auto text-xs">
                    <SelectValue placeholder="Filter by Sale Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Sale Types</SelectItem>
                    <SelectItem value="recreational">Recreational</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="h-9 w-auto text-xs">
                    <SelectValue placeholder="Filter by Budtender" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Budtenders</SelectItem>
                    <SelectItem value="alice">Alice W.</SelectItem>
                    <SelectItem value="bob">Bob B.</SelectItem>
                    <SelectItem value="charlie">Charlie C.</SelectItem>
                </SelectContent>
            </Select>
            <Button size="sm">
                <Download className="mr-2 h-4 w-4" /> Export Data (CSV/PDF)
            </Button>
        </div>
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Track sales by batch/package, enforce purchase limits, record sales for METRC, and identify compliance violations (e.g., over-purchasing, unverified patients).</CardDescription>
            </div>
            <Input placeholder="Search by Sale ID, Customer, Product..." className="max-w-xs mt-2 sm:mt-0" />
          </div>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer/Patient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Budtender</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>METRC Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((sale) => (
                <TableRow key={sale.id} className={cn(sale.complianceIssue && "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30")}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>
                    <Badge variant={sale.type === "Medical" ? "secondary" : "outline"} className={cn(sale.type === "Medical" && "border-blue-500 text-blue-600")}>
                        {sale.type === "Medical" && <BriefcaseMedical className="mr-1 h-3 w-3"/>}
                        {sale.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{sale.budtender}</TableCell>
                  <TableCell className="text-right">${sale.total.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{sale.items}</TableCell>
                  <TableCell>
                     <Badge variant={sale.status === 'Completed' ? 'default' : 'destructive'} 
                            className={cn(sale.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300')}>
                        {sale.status}
                    </Badge>
                  </TableCell>
                   <TableCell>
                    <Badge variant={sale.metrcPushed ? "default" : "outline"} className={cn(sale.metrcPushed ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "border-yellow-500 text-yellow-600")}>
                        {sale.metrcPushed ? "Synced" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {sale.complianceIssue && <Badge variant="destructive" title={sale.complianceIssue}><AlertTriangle className="h-3.5 w-3.5"/></Badge>}
                    <Button variant="ghost" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {salesData.length === 0 && (
             <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">Sales records and METRC reconciliation tools will appear here.</p>
            </div>
          )}
           <CardDescription className="text-xs mt-4">Daily Sales Summary Reports and exportable receipts by batch/strain are available. The system includes a METRC sales reconciliation tool to flag failed pushes. Role-based permissions apply.</CardDescription>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
