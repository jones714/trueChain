
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Percent, PlusCircle, CalendarDays, Tag, Users, Edit, Trash2, ListFilter, BriefcaseMedical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Promotion {
    id: string;
    name: string;
    type: "Percentage" | "Fixed Amount" | "Loyalty Rule" | "Medical Tier";
    value: string; // e.g., "15%" or "$5.00" or "5th Visit"
    appliesTo: "All Products" | "Category" | "Specific Product(s)";
    categoryOrProducts?: string; // e.g., "Edibles" or "SKU123, SKU456"
    startDate?: string;
    endDate?: string;
    status: "Active" | "Scheduled" | "Expired" | "Draft";
}

const initialPromotions: Promotion[] = [
    { id: "PROMO001", name: "Friday Edibles 15% Off", type: "Percentage", value: "15%", appliesTo: "Category", categoryOrProducts: "Edibles", startDate: "2023-11-01", endDate: "2023-12-31", status: "Active" },
    { id: "PROMO002", name: "Loyalty: $5 off 5th Visit", type: "Loyalty Rule", value: "$5.00", appliesTo: "All Products", status: "Active" },
    { id: "PROMO003", name: "Medical Patient Discount", type: "Medical Tier", value: "10%", appliesTo: "All Products", status: "Active" },
    { id: "PROMO004", name: "New Product Launch: Strain X", type: "Fixed Amount", value: "$10 Off", appliesTo: "Specific Product(s)", categoryOrProducts: "SKU-StrainX-Flower", startDate: "2023-12-01", endDate: "2023-12-07", status: "Scheduled" },
];


export default function DiscountsAndPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  // Add state for form inputs if building interactive form

  return (
    <PageContainer>
      <PageHeader 
        title="Discounts & Promotions Management" 
        description="Create and manage scheduled promotions, loyalty programs, and medical-only pricing tiers. Discounts can be applied automatically in the POS."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Promotion
        </Button>
      </PageHeader>

    <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Create/Edit Promotion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="promo-name">Promotion Name</Label>
                        <Input id="promo-name" placeholder="e.g., Weekend Special" />
                    </div>
                    <div>
                        <Label htmlFor="promo-type">Promotion Type</Label>
                        <Select>
                            <SelectTrigger id="promo-type"><SelectValue placeholder="Select type..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">Percentage Off</SelectItem>
                                <SelectItem value="fixed_amount">Fixed Amount Off</SelectItem>
                                <SelectItem value="loyalty_rule">Loyalty Rule (e.g., X off on Y visit)</SelectItem>
                                <SelectItem value="medical_tier"><BriefcaseMedical className="h-4 w-4 mr-2 inline-block"/>Medical Patient Tier</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="promo-value">Value (e.g., 15% or $5.00)</Label>
                        <Input id="promo-value" placeholder="15% or 5.00" />
                    </div>
                    <div>
                        <Label htmlFor="promo-applies-to">Applies To</Label>
                        <Select>
                            <SelectTrigger id="promo-applies-to"><SelectValue placeholder="Select applicability..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Products</SelectItem>
                                <SelectItem value="category">Specific Category</SelectItem>
                                <SelectItem value="products">Specific Product(s)</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input id="promo-category-products" className="mt-1 text-xs h-8" placeholder="If category/products, enter here (e.g., Edibles or SKU123, SKU456)" />
                    </div>
                     <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label htmlFor="promo-start-date">Start Date (Optional)</Label>
                            <Input id="promo-start-date" type="date" />
                        </div>
                        <div>
                            <Label htmlFor="promo-end-date">End Date (Optional)</Label>
                            <Input id="promo-end-date" type="date" />
                        </div>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="promo-auto-apply" defaultChecked/>
                        <Label htmlFor="promo-auto-apply" className="font-normal text-sm">Auto-apply in POS if conditions met</Label>
                    </div>
                    <Button className="w-full">Save Promotion</Button>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <CardTitle>Active & Scheduled Promotions</CardTitle>
                            <CardDescription>Manage all defined discounts, loyalty rules, and special pricing tiers.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm"><ListFilter className="mr-2 h-4 w-4"/>Filters</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {promotions.length > 0 ? (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Applies To</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {promotions.map((promo) => (
                            <TableRow key={promo.id}>
                            <TableCell className="font-medium text-sm">{promo.name}</TableCell>
                            <TableCell className="text-xs">{promo.type}</TableCell>
                            <TableCell className="text-xs">{promo.value}</TableCell>
                            <TableCell className="text-xs max-w-[150px] truncate" title={promo.categoryOrProducts}>
                                {promo.appliesTo}
                                {promo.categoryOrProducts && ` (${promo.categoryOrProducts})`}
                            </TableCell>
                            <TableCell className="text-xs">
                                {promo.startDate || "N/A"} - {promo.endDate || "Ongoing"}
                            </TableCell>
                            <TableCell>
                                <Badge variant={
                                    promo.status === "Active" ? "default" :
                                    promo.status === "Scheduled" ? "secondary" :
                                    promo.status === "Expired" ? "outline" : "destructive"
                                } className={cn(
                                    promo.status === "Active" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                                    promo.status === "Scheduled" && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                                    promo.status === "Expired" && "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                )}>{promo.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" title="Edit"><Edit className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" title="Archive" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    ) : (
                    <div className="p-8 border border-dashed rounded-md text-center text-muted-foreground">
                        <Percent className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-2">No promotions defined yet.</p>
                    </div>
                    )}
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground">Promotions can be attached to product categories or specific items and set to apply automatically in the Point of Sale system.</p>
                </CardFooter>
            </Card>
        </div>
    </div>
    </PageContainer>
  );
}
