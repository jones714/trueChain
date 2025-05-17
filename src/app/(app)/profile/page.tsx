
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Shield, Bell } from "lucide-react";

export default function ProfilePage() {
  // Dummy user data
  const user = {
    name: "Admin User",
    email: "admin@trucanalytix.com",
    role: "Administrator",
    avatar: "https://placehold.co/128x128.png",
    dataAiHint: "person professional",
    joinedDate: "January 15, 2023",
  };

  return (
    <PageContainer>
      <PageHeader title="My Profile" description="Manage your personal information and account settings." />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.dataAiHint} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>{user.role}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground text-center">
              <p>Email: {user.email}</p>
              <p>Joined: {user.joinedDate}</p>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">Change Profile Picture</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user.name} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
              </div>
               <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button variant="outline"><Shield className="mr-2 h-4 w-4"/> Change Password</Button>
                <p className="text-sm text-muted-foreground">Multi-Factor Authentication (MFA) is currently <span className="font-semibold text-primary">Enabled</span>.</p>
                 <Button variant="outline">Manage MFA Settings</Button>
            </CardContent>
          </Card>

           <Card className="mt-6">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Button variant="outline" size="sm"><Bell className="mr-2 h-4 w-4"/>Configure</Button>
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="system-alerts">In-App System Alerts</Label>
                    <Button variant="outline" size="sm"><Bell className="mr-2 h-4 w-4"/>Configure</Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
