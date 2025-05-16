import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, CalendarDays } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const salesData = [
  { id: "SALE001", date: "2023-10-26", customer: "CUST078", total: 75.50, items: 3, status: "Completed" },
  { id: "SALE002", date: "2023-10-26", customer: "CUST079", total: 120.00, items: 5, status: "Completed" },
  { id: "SALE003", date: "2023-10-25", customer: "CUST080", total: 45.20, items: 2, status: "Refunded" },
  { id: "SALE004", date: "2023-10-25", customer: "CUST081", total: 210.75, items: 8, status: "Completed" },
];


export default function SalesRecordsPage() {
  return (
    <PageContainer>
      <PageHeader title="Sales Records" description="View and manage all sales transactions.">
        <div className="flex items-center space-x-2">
            <Button variant="outline">
                <CalendarDays className="mr-2 h-4 w-4" /> Date Range
            </Button>
            <Button>
                <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
        </div>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Track sales by batch/package, enforce purchase limits, and record sales for METRC.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell className="text-right">${sale.total.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{sale.items}</TableCell>
                  <TableCell>
                     <span className={`px-2 py-1 text-xs rounded-full ${sale.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                        {sale.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {salesData.length === 0 && (
             <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">Sales records and reconciliation reports will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
