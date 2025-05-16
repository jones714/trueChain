import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ScanBarcode, ShoppingCart, Trash2, UserPlus, Percent, DollarSign } from "lucide-react";
import Image from "next/image";

export default function RetailPOSPage() {
  // Dummy data
  const cartItems = [
    { id: 1, name: "Green Crack 3.5g", price: 45.00, quantity: 1, image: "https://placehold.co/64x64.png", dataAiHint: "cannabis flower" },
    { id: 2, name: "OG Kush Pre-roll", price: 12.00, quantity: 2, image: "https://placehold.co/64x64.png", dataAiHint: "cannabis pre-roll" },
  ];
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.15; // Example tax
  const total = subtotal + tax;

  return (
    <PageContainer className="p-0 md:p-0">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]"> {/* Adjust height based on header */}
        {/* Product Selection & Search Area */}
        <div className="flex-1 p-4 lg:p-6 bg-muted/30">
          <PageHeader title="Retail Point of Sale" />
          <div className="mt-4 flex gap-2">
            <Input placeholder="Scan METRC Tag or Search Product..." className="flex-1" />
            <Button variant="outline" size="icon" aria-label="Scan Barcode">
              <ScanBarcode className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="mt-4 h-[calc(100%-180px)] lg:h-[calc(100%-150px)]"> {/* Adjust height */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                  <Image src={`https://placehold.co/300x200.png`} alt={`Product ${i + 1}`} width={300} height={200} className="w-full h-32 object-cover" data-ai-hint="cannabis product" />
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm truncate">Product Name {i+1}</h3>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-bold mt-1">$25.00</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Cart & Checkout Area */}
        <div className="lg:w-96 border-l bg-background p-4 lg:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" /> Cart
            </h3>
            <Button variant="outline" size="icon" aria-label="Add Customer">
                <UserPlus className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="flex-1 -mx-4 px-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-b last:border-b-0">
                <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md object-cover" data-ai-hint={item.dataAiHint} />
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {cartItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-10">Your cart is empty.</p>
            )}
          </ScrollArea>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (15%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
             <div className="flex justify-between items-center">
                <Button variant="link" className="p-0 h-auto text-primary text-xs"><Percent className="inline h-3 w-3 mr-1"/>Apply Discount</Button>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button size="lg" className="w-full mt-6 text-base py-6">
            <DollarSign className="mr-2 h-5 w-5"/> Checkout
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
