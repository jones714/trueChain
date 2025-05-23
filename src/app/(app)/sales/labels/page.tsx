
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScanBarcode, Printer, Settings2, Download, Package, Info, AlertTriangle, Calendar, Building, Weight } from "lucide-react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function LabelGenerationPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Compliant Product Label Generation" 
        description="Generate and print METRC-compliant product labels for individual items or bulk packaging runs. Customize templates and content."
      >
        <Button>
          <Printer className="mr-2 h-4 w-4" /> Print Selected Labels
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Label Preview</CardTitle>
              <CardDescription>Select a product/batch and template to generate and preview its label. Labels can be reprinted for packaging errors.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 bg-muted/30 min-h-[400px] rounded-md">
                <Image src="https://placehold.co/400x250.png" alt="Label Preview" width={400} height={250} className="border rounded-sm shadow-md" data-ai-hint="cannabis label design" />
                <p className="text-sm text-muted-foreground mt-4">Select product and options to see preview. Bulk-printing for packaging runs is also supported.</p>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Label Options &amp; Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="product-search">Product/Batch ID</Label>
                <Input id="product-search" placeholder="Search by ID or name..." />
              </div>
              <div>
                <Label htmlFor="label-template">Label Template</Label>
                <Select>
                  <SelectTrigger id="label-template">
                    <SelectValue placeholder="Default Retail Label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default_retail">Default Retail Label</SelectItem>
                    <SelectItem value="bulk_package">Bulk Package Label</SelectItem>
                    <SelectItem value="medical_patient">Medical Patient Label</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Include Content:</Label>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                    <div className="flex items-center space-x-2"> <Checkbox id="inc-metrc" defaultChecked /> <Label htmlFor="inc-metrc" className="font-normal flex items-center"><ScanBarcode className="h-3.5 w-3.5 mr-1"/>METRC Tag</Label> </div>
                    <div className="flex items-center space-x-2"> <Checkbox id="inc-batch" defaultChecked /> <Label htmlFor="inc-batch" className="font-normal flex items-center"><Package className="h-3.5 w-3.5 mr-1"/>Batch ID</Label> </div>
                    <div className="flex items-center space-x-2"> <Checkbox id="inc-thc-cbd" defaultChecked /> <Label htmlFor="inc-thc-cbd" className="font-normal flex items-center"><Info className="h-3.5 w-3.5 mr-1"/>THC/CBD %</Label> </div>
                    <div className="flex items-center space-x-2"> <Checkbox id="inc-warnings" defaultChecked /> <Label htmlFor="inc-warnings" className="font-normal flex items-center"><AlertTriangle className="h-3.5 w-3.5 mr-1"/>Warnings</Label> </div>
                    <div className="flex items-center space-x-2"> <Checkbox id="inc-store" defaultChecked /> <Label htmlFor="inc-store" className="font-normal flex items-center"><Building className="h-3.5 w-3.5 mr-1"/>Store/License</Label> </div>
                    <div className="flex items-center space-x-2"> <Checkbox id="inc-date" defaultChecked /> <Label htmlFor="inc-date" className="font-normal flex items-center"><Calendar className="h-3.5 w-3.5 mr-1"/>Sale/Pack Date</Label> </div>
                    <div className="flex items-center space-x-2"> <Checkbox id="inc-weight" defaultChecked /> <Label htmlFor="inc-weight" className="font-normal flex items-center"><Weight className="h-3.5 w-3.5 mr-1"/>Weight/Units</Label> </div>
                    <div className="flex items-center space-x-2"> <Checkbox id="inc-qr" /> <Label htmlFor="inc-qr" className="font-normal flex items-center"><ScanBarcode className="h-3.5 w-3.5 mr-1"/>QR Code</Label> </div>
                </div>
              </div>
              <div>
                <Label htmlFor="custom-text">Custom Text (Optional)</Label>
                <Textarea id="custom-text" placeholder="Add any additional text for the label" rows={2} className="text-xs"/>
              </div>
              <Button className="w-full">
                <ScanBarcode className="mr-2 h-4 w-4" /> Generate Preview
              </Button>
               <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
               <Button variant="secondary" className="w-full">
                <Settings2 className="mr-2 h-4 w-4" /> Manage Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
