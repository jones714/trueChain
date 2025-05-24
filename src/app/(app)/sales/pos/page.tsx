
"use client";

import * as React from "react";
import { PageContainer } from "@/components/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ScanBarcode, ShoppingCart, Trash2, Users, Percent, DollarSign, Filter, Tags, CheckCircle2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function RetailPOSPage() {
  const cartItems = [
    { id: 1, name: "Green Crack 3.5g (Batch GC-001)", price: 45.00, quantity: 1, image: "https://placehold.co/64x64.png", dataAiHint: "cannabis flower", metrcTag: "1A4060300000E0E000000777" },
    { id: 2, name: "OG Kush Pre-roll (Batch OKP-003)", price: 12.00, quantity: 2, image: "https://placehold.co/64x64.png", dataAiHint: "cannabis preroll", metrcTag: "1A4060300000E0E000000888" },
  ];
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.15; // Example tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const [isMedicalMode, setIsMedicalMode] = React.useState(false);
  const [patientId, setPatientId] = React.useState("");
  const [patientVerified, setPatientVerified] = React.useState<boolean | null>(null);
  const [purchaseLimitExceeded, setPurchaseLimitExceeded] = React.useState(false);


  const handleVerifyPatient = () => {
    // Mock verification
    if (patientId === "PAT123") {
        setPatientVerified(true);
        setPurchaseLimitExceeded(false); // Reset for demo
    } else if (patientId === "PAT456") { // Demo for limit exceeded
        setPatientVerified(true);
        setPurchaseLimitExceeded(true);
    }
    else {
        setPatientVerified(false);
    }
  };

  return (
    <PageContainer className="p-0 md:p-0">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]"> {/* Adjust height based on header */}
        {/* Product Selection & Search Area */}
        <div className="flex-1 p-4 lg:p-6 bg-muted/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Retail Point of Sale</h2>
              <p className="text-sm text-muted-foreground">
                Unified POS with real-time inventory. Toggle for Recreational/Medical sales. METRC integrated for sales & package updates.
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Switch
                id="medical-mode-toggle"
                checked={isMedicalMode}
                onCheckedChange={(checked) => {
                    setIsMedicalMode(checked);
                    setPatientId("");
                    setPatientVerified(null);
                    setPurchaseLimitExceeded(false);
                }}
              />
              <Label htmlFor="medical-mode-toggle" className={cn(isMedicalMode ? "text-primary font-semibold" : "", "cursor-pointer")}>
                {isMedicalMode ? "Medical Mode Active" : "Recreational Mode"}
              </Label>
            </div>
          </div>

          {isMedicalMode && (
            <Card className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                Medical Mode: Enforces patient ID validation, condition-based product restrictions, purchase limits, and prescription association.
              </p>
              <div className="flex gap-2 items-center">
                <Input 
                    className="h-8 text-xs flex-1" 
                    placeholder="Enter Patient ID for Validation..." 
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                />
                <Button size="sm" className="h-8 text-xs" onClick={handleVerifyPatient}>Verify</Button>
                 {patientVerified === true && <CheckCircle2 className="h-5 w-5 text-green-500" title="Patient Verified"/>}
                 {patientVerified === false && <AlertTriangle className="h-5 w-5 text-destructive" title="Patient Not Found/Invalid ID"/>}
              </div>
              {purchaseLimitExceeded && (
                <p className="text-xs text-destructive mt-1 flex items-center"><AlertTriangle className="h-3.5 w-3.5 mr-1"/>Patient has exceeded purchase limits. Sale cannot proceed.</p>
              )}
            </Card>
          )}

          <div className="flex gap-2">
            <Input placeholder="Scan METRC Tag or Search Products (strain, form, potency, condition...)" className="flex-1" />
            <Button variant="outline" size="icon" aria-label="Scan Barcode">
              <ScanBarcode className="h-5 w-5" />
            </Button>
             <Button variant="outline" size="icon" aria-label="Filters">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="mt-4 h-[calc(100%-220px)] lg:h-[calc(100%-200px)]"> {/* Adjust height */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group">
                  <Image src={`https://placehold.co/300x200.png`} alt={`Product ${i + 1}`} width={300} height={200} className="w-full h-32 object-cover" data-ai-hint="cannabis product various" />
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm truncate">Product Name {i+1}</h3>
                    <p className="text-xs text-muted-foreground">StrainXYZ / Flower</p>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-sm font-bold">$25.00</p>
                        <Badge variant="outline" className="text-xs">THC: 22%</Badge>
                    </div>
                     <p className="text-xs text-muted-foreground mt-0.5">METRC: ...{i+1}23</p>
                     <Button size="sm" className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs h-7">Add to Cart</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
             <p className="text-xs text-muted-foreground mt-4 text-center">Product display includes filters for strain, form, potency, and condition eligibility (in Medical Mode). Batch traceability via METRC tags.</p>
          </ScrollArea>
        </div>

        {/* Cart & Checkout Area */}
        <div className="lg:w-96 border-l bg-background p-4 lg:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" /> Cart
            </h3>
            <Button variant="outline" size="sm" className="text-xs h-8">
                <Users className="mr-1.5 h-3.5 w-3.5" /> Select Customer/Patient
            </Button>
          </div>
          <ScrollArea className="flex-1 -mx-4 px-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-b last:border-b-0">
                <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md object-cover" data-ai-hint={item.dataAiHint} />
                <div className="flex-1">
                  <p className="text-sm font-medium truncate" title={item.name}>{item.name}</p>
                  <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} x {item.quantity}</p>
                  <p className="text-xs text-muted-foreground flex items-center"><Tags className="h-3 w-3 mr-1"/>METRC: ...{item.metrcTag.slice(-3)} (Batch)</p>
                </div>
                <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {cartItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-10">Your cart is empty. Scan or select products to add.</p>
            )}
          </ScrollArea>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({ (taxRate * 100).toFixed(0) }%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
             <div className="flex justify-between items-center">
                <Button variant="link" className="p-0 h-auto text-primary text-xs"><Percent className="inline h-3 w-3 mr-1"/>Apply Discount/Loyalty</Button>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button size="lg" className="w-full mt-6 text-base py-6" disabled={isMedicalMode && (!patientVerified || purchaseLimitExceeded)}>
            <DollarSign className="mr-2 h-5 w-5"/> Checkout
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">Sale completion triggers inventory decrement, METRC push, label printing, and optional receipt generation. Purchase limits enforced.</p>
        </div>
      </div>
    </PageContainer>
  );
}
