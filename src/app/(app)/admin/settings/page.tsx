
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, TestTubeDiagonal, ShoppingBag, DollarSign, ShieldAlert, Workflow, Bell, LinkIcon, ShoppingCartIcon, BookOpen, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function SystemSettingsPage() {
  return (
    <PageContainer>
      <PageHeader title="System Settings" description="Manage product types, retail pricing, testing protocols, partner labs, workflow templates (SOPs), automated reminders & tasks, integrations, and other global configurations.">
        <Button>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </PageHeader>
      
      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-4">
          <TabsTrigger value="products"><ShoppingBag className="mr-1 h-4 w-4 hidden sm:inline-block"/>Products</TabsTrigger>
          <TabsTrigger value="pricing"><DollarSign className="mr-1 h-4 w-4 hidden sm:inline-block"/>Pricing</TabsTrigger>
          <TabsTrigger value="testing"><TestTubeDiagonal className="mr-1 h-4 w-4 hidden sm:inline-block"/>Testing</TabsTrigger>
          <TabsTrigger value="compliance"><ShieldAlert className="mr-1 h-4 w-4 hidden sm:inline-block"/>Compliance &amp; Automation</TabsTrigger>
          <TabsTrigger value="integrations"><LinkIcon className="mr-1 h-4 w-4"/>Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Type Management</CardTitle>
              <CardDescription>Define and manage various cannabis product types (e.g., Flower, Edible, Concentrate).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="new-product-type">Add New Product Type</Label>
                <div className="flex gap-2">
                  <Input id="new-product-type" placeholder="e.g., Tincture" />
                  <Button>Add Type</Button>
                </div>
              </div>
              <p className="text-muted-foreground">List of existing product types with edit/delete options will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Retail Pricing &amp; Tax</CardTitle>
              <CardDescription>Configure default pricing tiers, discounts, loyalty programs, and tax rates per jurisdiction.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tax-rate">Default Sales Tax Rate (%)</Label>
                <Input id="tax-rate" type="number" placeholder="15" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="loyalty-program" />
                <Label htmlFor="loyalty-program">Enable Loyalty Program</Label>
              </div>
               <p className="text-muted-foreground">More pricing and discount configuration options will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
            <Card>
                <CardHeader>
                <CardTitle>Testing Protocols &amp; Partner Labs</CardTitle>
                <CardDescription>Define standard testing panels and manage information for partner laboratories.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="default-panel">Default Testing Panel</Label>
                    <Input id="default-panel" placeholder="e.g., Full Spectrum Compliance Panel" />
                </div>
                <div>
                    <Label htmlFor="partner-lab">Add Partner Lab</Label>
                    <div className="flex gap-2">
                        <Input id="partner-lab-name" placeholder="Lab Name" />
                        <Input id="partner-lab-contact" placeholder="Contact Email" />
                        <Button>Add Lab</Button>
                    </div>
                </div>
                <p className="text-muted-foreground">List of partner labs and configurable testing protocols will appear here.</p>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="compliance">
            <Card>
                <CardHeader>
                <CardTitle>Compliance &amp; Automation Settings</CardTitle>
                <CardDescription>Configure purchase limits, METRC sync, workflow templates (SOPs), automated reminders/tasks for cultivation and retail, and other compliance features.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                        <Label htmlFor="purchase-limit-flower">Daily Purchase Limit (Flower, grams)</Label>
                        <Input id="purchase-limit-flower" type="number" placeholder="28" />
                    </div>
                    <div>
                        <Label htmlFor="purchase-limit-concentrate">Daily Purchase Limit (Concentrate, grams)</Label>
                        <Input id="purchase-limit-concentrate" type="number" placeholder="8" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="auto-metrc-sync" defaultChecked />
                        <Label htmlFor="auto-metrc-sync">Enable Automatic METRC Sync</Label>
                    </div>
                     <p className="text-xs text-muted-foreground">More jurisdictional compliance settings will appear here.</p>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="text-md font-medium flex items-center"><Workflow className="mr-2 h-5 w-5 text-primary"/>Workflow Automation & SOPs</h4>
                     <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                        <Label htmlFor="workflow-templates" className="font-normal">Manage Workflow Templates (SOPs)</Label>
                        <Button variant="outline" size="sm"><FileText className="mr-1 h-4 w-4"/>Configure Templates</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Define pre-built Standard Operating Procedures (e.g., for new cultivators, packaging checklists, destruction witness logs). 
                        These can be previewed, downloaded, and assigned to tasks.
                    </p>
                     <div className="flex items-center justify-between space-x-2 p-3 border rounded-md mt-2">
                        <Label htmlFor="automated-reminders" className="font-normal">Setup Automated Reminders &amp; Tasks</Label>
                        <Button variant="outline" size="sm"><Bell className="mr-1 h-4 w-4"/>Configure Reminders</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Set up automated tasks and reminders like watering schedules, drying cycle notifications, packaging reorder points, or compliance filing deadlines.</p>
                  </div>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="integrations">
            <Card>
                <CardHeader>
                <CardTitle>API Integrations</CardTitle>
                <CardDescription>Manage integrations with METRC, BioTrack, state-level APIs, labs, eCommerce, and accounting software.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 border rounded-lg shadow-sm">
                        <h4 className="font-semibold flex items-center"><LinkIcon className="mr-2 h-5 w-5 text-primary"/>State Compliance APIs</h4>
                        <div className="p-3 border rounded-md mt-2">
                            <h5 className="font-medium">METRC API</h5>
                            <p className="text-xs text-muted-foreground mb-2">Real-time data sync for Plants, Harvests, Waste, etc.</p>
                            <div className="flex items-center space-x-2">
                                <Switch id="metrc-enabled" defaultChecked />
                                <Label htmlFor="metrc-enabled">Enable METRC Integration</Label>
                            </div>
                            <Button variant="outline" size="sm" className="mt-2">Configure Keys</Button>
                        </div>
                         <div className="p-3 border rounded-md mt-3">
                            <h5 className="font-medium">BioTrack API (Future)</h5>
                            <p className="text-xs text-muted-foreground mb-2">Integration planned for future system extensibility.</p>
                            <div className="flex items-center space-x-2">
                                <Switch id="biotrack-enabled" disabled />
                                <Label htmlFor="biotrack-enabled" className="text-muted-foreground">Enable BioTrack Integration</Label>
                            </div>
                             <Button variant="outline" size="sm" className="mt-2" disabled>Configure Keys</Button>
                        </div>
                    </div>

                    <Separator />

                     <div className="p-4 border rounded-lg shadow-sm">
                        <h4 className="font-semibold flex items-center"><TestTubeDiagonal className="mr-2 h-5 w-5 text-primary"/>Third-Party Lab API Sync</h4>
                        <p className="text-xs text-muted-foreground mb-2">Automatically pull test results and Certificates of Analysis (COAs) from connected labs.</p>
                        <div className="flex items-center space-x-2">
                            <Switch id="lab-api-enabled" />
                            <Label htmlFor="lab-api-enabled">Enable Lab API Sync</Label>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">Configure Lab APIs</Button>
                    </div>
                    
                    <Separator />

                     <div className="p-4 border rounded-lg shadow-sm">
                        <h4 className="font-semibold flex items-center"><ShoppingCartIcon className="mr-2 h-5 w-5 text-primary"/>eCommerce Sync (Recreational)</h4>
                        <p className="text-xs text-muted-foreground mb-2">Connect with Shopify or a native store builder for online ordering (where regulations allow).</p>
                        <div className="flex items-center space-x-2">
                            <Switch id="ecommerce-enabled" />
                            <Label htmlFor="ecommerce-enabled">Enable eCommerce Sync</Label>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">Configure eCommerce</Button>
                    </div>

                    <Separator />

                    <div className="p-4 border rounded-lg shadow-sm">
                        <h4 className="font-semibold flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary"/>Accounting Integration</h4>
                        <p className="text-xs text-muted-foreground mb-2">Automatically reconcile sales data with QuickBooks or Xero.</p>
                        <div className="flex items-center space-x-2">
                            <Switch id="accounting-enabled" />
                            <Label htmlFor="accounting-enabled">Enable Accounting Sync</Label>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">Configure Accounting</Button>
                    </div>

                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
