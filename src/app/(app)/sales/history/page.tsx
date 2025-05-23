
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { History, UserSearch, FileText, HeartPulse, AlertTriangle, CalendarClock, ShoppingBag, Percent, BarChart2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface PurchaseItem {
    id: string;
    productName: string;
    strain?: string;
    quantity: number;
    price: number;
    date: string;
}

interface Customer {
    id: string;
    name: string;
    type: "Recreational" | "Medical";
    avatarUrl?: string;
    dataAiHint?: string;
    email?: string;
    phone?: string;
    medicalInfo?: {
        patientId: string;
        condition: string;
        recommendationExpiry?: string;
    };
    purchaseHistory: PurchaseItem[];
    preferences?: {
        strains: string[];
        productTypes: string[];
    };
    visitFrequency?: string; // e.g., "Approx. 2 times/month"
    purchaseLimit?: { current: number; max: number; unit: string };
}

const dummyCustomer: Customer = {
    id: "CUSTPAT001",
    name: "Alex Johnson",
    type: "Medical",
    avatarUrl: "https://placehold.co/80x80.png",
    dataAiHint: "person friendly",
    email: "alex.j@example.com",
    medicalInfo: { patientId: "MNMED12345", condition: "Chronic Pain, Anxiety", recommendationExpiry: "2024-12-31" },
    purchaseHistory: [
        { id: "S001P01", productName: "CBD Tincture 1000mg", quantity: 1, price: 70.00, date: "2023-10-15" },
        { id: "S001P02", productName: "Indica Flower 'NLC'", strain: "Northern Lights", quantity: 3.5, price: 40.00, date: "2023-10-15" },
        { id: "S002P01", productName: "Pain Relief Balm", quantity: 1, price: 55.00, date: "2023-09-20" },
    ],
    preferences: { strains: ["Northern Lights", "Blue Dream"], productTypes: ["Tincture", "Flower", "Topical"] },
    visitFrequency: "Weekly",
    purchaseLimit: { current: 15, max: 60, unit: "grams flower equivalent" }
};

export default function CustomerPurchaseHistoryPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // In a real app, this would fetch customer data
    if (searchTerm) setCustomer(dummyCustomer);
    else setCustomer(null);
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Customer & Patient Purchase History" 
        description="View detailed purchase history, preferences, and compliance data for individual customers and medical patients."
      />
      <Card>
        <CardHeader>
          <CardTitle>Search Customer/Patient</CardTitle>
          <div className="flex gap-2 mt-2">
            <Input 
              placeholder="Enter Customer/Patient ID, Name, or Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleSearch}><UserSearch className="mr-2 h-4 w-4"/>Search</Button>
          </div>
        </CardHeader>
        {customer && (
            <CardContent>
                <Separator className="my-4" />
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <Card className="shadow-md">
                            <CardHeader className="items-center text-center bg-muted/30">
                                <Avatar className="h-24 w-24 mb-3 border-2 border-primary">
                                    <AvatarImage src={customer.avatarUrl} alt={customer.name} data-ai-hint={customer.dataAiHint} />
                                    <AvatarFallback>{customer.name.substring(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-xl">{customer.name}</CardTitle>
                                <Badge variant={customer.type === "Medical" ? "secondary" : "outline"} className={cn(customer.type === "Medical" && "text-primary border-primary")}>
                                    {customer.type === "Medical" && <HeartPulse className="h-3.5 w-3.5 mr-1.5"/>}
                                    {customer.type}
                                </Badge>
                                {customer.email && <p className="text-xs text-muted-foreground pt-1">{customer.email}</p>}
                            </CardHeader>
                            <CardContent className="text-sm space-y-2 p-4">
                                {customer.medicalInfo && (
                                    <>
                                        <p><strong>Patient ID:</strong> {customer.medicalInfo.patientId}</p>
                                        <p><strong>Condition(s):</strong> {customer.medicalInfo.condition}</p>
                                        {customer.medicalInfo.recommendationExpiry && <p><strong>Rec. Expiry:</strong> {customer.medicalInfo.recommendationExpiry}</p>}
                                    </>
                                )}
                                {customer.visitFrequency && <p><strong>Visit Frequency:</strong> {customer.visitFrequency}</p>}
                                {customer.purchaseLimit && (
                                    <div className="pt-1">
                                        <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                                            <span>Purchase Limit</span>
                                            <span>{customer.purchaseLimit.current} / {customer.purchaseLimit.max} {customer.purchaseLimit.unit}</span>
                                        </div>
                                        {/* Basic progress bar representation */}
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(customer.purchaseLimit.current / customer.purchaseLimit.max) * 100}%` }}></div>
                                        </div>
                                         {customer.purchaseLimit.current / customer.purchaseLimit.max > 0.8 && 
                                            <p className="text-xs text-destructive mt-1 flex items-center"><AlertTriangle className="h-3.5 w-3.5 mr-1"/>Nearing purchase limit!</p>}
                                    </div>
                                )}
                            </CardContent>
                             <CardFooter className="p-4 border-t">
                                <Button variant="outline" size="sm" className="w-full text-xs"><FileText className="mr-1.5 h-3.5 w-3.5"/>View Full Profile</Button>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold mb-2 flex items-center"><History className="h-5 w-5 mr-2 text-primary"/>Purchase History</h3>
                        {customer.purchaseHistory.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customer.purchaseHistory.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="text-xs">{item.date}</TableCell>
                                            <TableCell className="text-sm font-medium">{item.productName} {item.strain && <span className="text-xs text-muted-foreground">({item.strain})</span>}</TableCell>
                                            <TableCell className="text-center text-sm">{item.quantity}{item.strain ? 'g' : ''}</TableCell>
                                            <TableCell className="text-right text-sm">${item.price.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-sm text-muted-foreground">No purchase history found.</p>
                        )}
                        
                        <Separator className="my-4"/>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-sm mb-1 flex items-center"><ShoppingBag className="h-4 w-4 mr-1.5 text-primary"/>Product Preferences</h4>
                                {customer.preferences ? (
                                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                                        {customer.preferences.productTypes.map(pt => <li key={pt}>{pt}</li>)}
                                        {customer.preferences.strains.map(s => <li key={s}>Strain: {s}</li>)}
                                    </ul>
                                ) : <p className="text-xs text-muted-foreground italic">No preferences logged.</p>}
                            </div>
                             <div>
                                <h4 className="font-semibold text-sm mb-1 flex items-center"><Percent className="h-4 w-4 mr-1.5 text-primary"/>Potential Actions</h4>
                                 <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary flex items-center">
                                    <CalendarClock className="h-3.5 w-3.5 mr-1"/>Enable prescription/refill reminders
                                </Button>
                                 <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary flex items-center mt-1">
                                    <BarChart2 className="h-3.5 w-3.5 mr-1"/>View Detailed Analytics
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        )}
         {!customer && searchTerm && (
            <CardContent className="text-center text-muted-foreground py-8">
                <p>No customer/patient found for "{searchTerm}".</p>
            </CardContent>
        )}
      </Card>
    </PageContainer>
  );
}
