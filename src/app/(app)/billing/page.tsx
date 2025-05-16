
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, PlusCircle, Package, Users, CalendarDays } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoiceHistory = [
  { id: "INV-2023-001", date: "2023-10-01", amount: 299.00, status: "Paid", dueDate: "2023-10-15" },
  { id: "INV-2023-002", date: "2023-11-01", amount: 299.00, status: "Paid", dueDate: "2023-11-15" },
  { id: "INV-2023-003", date: "2023-12-01", amount: 349.00, status: "Pending", dueDate: "2023-12-15" },
];

export default function BillingPage() {
  return (
    <PageContainer>
      <PageHeader title="Billing &amp; Subscription" description="Manage your subscription, payment methods, and view invoice history." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the <span className="font-semibold text-primary">Pro Plan</span>.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Package className="h-6 w-6 text-primary mb-2" />
                <h4 className="font-semibold">Pro Plan Features</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                  <li>Unlimited Users</li>
                  <li>Full METRC Compliance Suite</li>
                  <li>Advanced Reporting</li>
                  <li>Priority Support</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Users className="h-6 w-6 text-primary mb-2" />
                <h4 className="font-semibold">Usage</h4>
                <p className="text-sm text-muted-foreground mt-1">Active Users: 5 / Unlimited</p>
                <p className="text-sm text-muted-foreground">Facilities: 2 / 5 Included</p>
                <p className="text-sm text-muted-foreground">Data Storage: 15GB / 50GB</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Upgrade Plan</Button>
              <Button variant="link" className="ml-auto text-destructive">Cancel Subscription</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>Review your past payments and download invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceHistory.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'}`}>
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Your primary payment method.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-md">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <p className="font-medium">Visa ending in 1234</p>
                        <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                    </div>
                </div>
                 <Button variant="outline" className="w-full">Update Payment Method</Button>
                 <Button variant="link" className="w-full text-primary"><PlusCircle className="mr-2 h-4 w-4"/>Add New Payment Method</Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Next Billing Date</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <CalendarDays className="h-10 w-10 text-primary mx-auto mb-2"/>
                <p className="text-2xl font-bold">January 1, 2024</p>
                <p className="text-sm text-muted-foreground">Your plan will renew for $349.00.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
