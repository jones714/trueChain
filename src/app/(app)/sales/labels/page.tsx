import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScanBarcode, Printer, Settings2, Download } from "lucide-react";
import Image from "next/image";

export default function LabelGenerationPage() {
  return (
    <PageContainer>
      <PageHeader title="Product Label Generation" description="Generate compliant product labels with QR codes, barcodes, and warnings.">
        <Button>
          <Printer className="mr-2 h-4 w-4" /> Print Selected Labels
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Label Preview</CardTitle>
              <CardDescription>Select a product or batch to generate and preview its label.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 bg-muted/30 min-h-[300px] rounded-md">
                <Image src="https://placehold.co/300x180.png" alt="Label Preview" width={300} height={180} className="border rounded-sm shadow-md" data-ai-hint="product label" />
                <p className="text-sm text-muted-foreground mt-4">Select product and options to see preview.</p>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Label Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="product-search">Product/Batch ID</Label>
                <Input id="product-search" placeholder="Search by ID or name..." />
              </div>
              <div>
                <Label htmlFor="label-template">Label Template</Label>
                {/* Replace with Select component when available or needed */}
                <Input id="label-template" placeholder="Default Template" />
              </div>
              <div className="space-y-2">
                <Label>Include:</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-qr" defaultChecked />
                  <Label htmlFor="include-qr" className="font-normal">QR Code</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-barcode" defaultChecked />
                  <Label htmlFor="include-barcode" className="font-normal">Barcode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-warnings" defaultChecked />
                  <Label htmlFor="include-warnings" className="font-normal">Health Warnings</Label>
                </div>
                 <div className="flex items-center space-x-2">
                  <Checkbox id="include-thc-cbd" />
                  <Label htmlFor="include-thc-cbd" className="font-normal">THC/CBD Content</Label>
                </div>
              </div>
              <Button className="w-full">
                <ScanBarcode className="mr-2 h-4 w-4" /> Generate Label
              </Button>
               <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
