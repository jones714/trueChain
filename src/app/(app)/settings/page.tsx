
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, UserCircle, Bell, Palette, Lock } from "lucide-react";

export default function UserSettingsPage() {
  return (
    <PageContainer>
      <PageHeader title="Settings" description="Personalize your TruChain experience." />

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
          <TabsTrigger value="account"><UserCircle className="mr-1 h-4 w-4 hidden sm:inline-block"/>Account</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1 h-4 w-4 hidden sm:inline-block"/>Notifications</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-1 h-4 w-4 hidden sm:inline-block"/>Appearance</TabsTrigger>
          <TabsTrigger value="security"><Lock className="mr-1 h-4 w-4 hidden sm:inline-block"/>Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Preferences</CardTitle>
              <CardDescription>Manage your account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" defaultValue="Admin User" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="timezone">Timezone</Label>
                {/* Replace with Select component */}
                <Input id="timezone" defaultValue="(GMT-08:00) Pacific Time" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="language">Language</Label>
                 {/* Replace with Select component */}
                <Input id="language" defaultValue="English (United States)" />
              </div>
            </CardContent>
            <CardFooter>
              <Button><Save className="mr-2 h-4 w-4" /> Save Account Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Choose how you receive notifications from the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Email Notifications</h4>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                  <Label htmlFor="email-summary" className="font-normal">Daily Summary Emails</Label>
                  <Switch id="email-summary" defaultChecked />
                </div>
                 <div className="flex items-center justify-between space-x-2 p-3 border rounded-md mt-2">
                  <Label htmlFor="email-alerts" className="font-normal">Critical Alerts via Email</Label>
                  <Switch id="email-alerts" defaultChecked />
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">In-App Notifications</h4>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                  <Label htmlFor="app-transfers" className="font-normal">Transfer Updates</Label>
                  <Switch id="app-transfers" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-md mt-2">
                  <Label htmlFor="app-compliance" className="font-normal">Compliance Warnings</Label>
                  <Switch id="app-compliance" />
                </div>
              </div>
            </CardContent>
             <CardFooter>
              <Button><Save className="mr-2 h-4 w-4" /> Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                        The theme toggle is available in the main header.
                    </p>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="fontSize">Font Size</Label>
                    {/* Replace with Select or Slider */}
                    <Input id="fontSize" defaultValue="Default" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="compact-mode" />
                  <Label htmlFor="compact-mode" className="font-normal">Enable Compact Mode</Label>
                </div>
            </CardContent>
            <CardFooter>
              <Button><Save className="mr-2 h-4 w-4" /> Save Appearance Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
            <Card>
                <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="font-medium">Password</Label>
                        <Button variant="outline" className="w-full mt-1 sm:w-auto sm:ml-4">Change Password</Button>
                    </div>
                    <div>
                        <Label className="font-medium">Multi-Factor Authentication (MFA)</Label>
                        <p className="text-sm text-muted-foreground">
                            Secure your account with an extra layer of protection.
                        </p>
                         <Button variant="outline" className="w-full mt-1 sm:w-auto">Configure MFA</Button>
                    </div>
                     <div>
                        <Label className="font-medium">Active Sessions</Label>
                        <p className="text-sm text-muted-foreground">
                            View and manage devices logged into your account.
                        </p>
                         <Button variant="outline" className="w-full mt-1 sm:w-auto">View Active Sessions</Button>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button><Save className="mr-2 h-4 w-4" /> Save Security Settings</Button>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
