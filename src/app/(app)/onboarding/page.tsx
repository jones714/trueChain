"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { CheckCircle2, Building2, User, Key, Shield, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingPage() {
  const router = useRouter();
  const { userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  // Step 1: Profile
  const [displayName, setDisplayName] = React.useState(userProfile?.displayName || "");
  const [role, setRole] = React.useState<string>(userProfile?.role || "retail_clerk");

  // Step 2: Facility (for now, we'll create a default one)
  const [facilityName, setFacilityName] = React.useState("");
  const [facilityAddress, setFacilityAddress] = React.useState("");

  // Step 3: Metrc Configuration (pre-filled with sandbox credentials)
  const [metrcVendorKey, setMetrcVendorKey] = React.useState(
    userProfile?.metrcVendorKey || process.env.NEXT_PUBLIC_METRC_VENDOR_KEY || "XItraf18q0ymn8ctOGra7rUQb6CD92uZRkXER0pWfMk3gSRA"
  );
  const [metrcUserKey, setMetrcUserKey] = React.useState(
    userProfile?.metrcUserKey || process.env.NEXT_PUBLIC_METRC_USER_KEY || "XQoO79iI9-YlmVBhm3kyI7o-EXb0-Ps9L7HU0nINgNeh8WZv"
  );
  const [metrcLicenseNumber, setMetrcLicenseNumber] = React.useState(
    userProfile?.metrcLicenseNumber || process.env.NEXT_PUBLIC_METRC_LICENSE_NUMBER || "C0001"
  );
  const [metrcSandbox, setMetrcSandbox] = React.useState(userProfile?.metrcSandbox ?? true);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      // Update user profile with onboarding data
      await updateUserProfile({
        displayName,
        role: role as any,
        metrcVendorKey,
        metrcUserKey,
        metrcLicenseNumber,
        metrcSandbox,
        onboardingCompleted: true,
      });

      toast({
        title: "Welcome to TruChain!",
        description: "Your Metrc sandbox account is ready. You can now sync inventory from Metrc!",
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Skip onboarding if already completed
  React.useEffect(() => {
    if (userProfile?.onboardingCompleted) {
      router.push('/dashboard');
    }
  }, [userProfile, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to TruChain</h1>
          <p className="text-muted-foreground">
            Let's get your account set up in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
            <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {step === 1 && <User className="h-5 w-5 text-primary" />}
              {step === 2 && <Building2 className="h-5 w-5 text-primary" />}
              {step === 3 && <Key className="h-5 w-5 text-primary" />}

              <CardTitle>
                {step === 1 && "Profile Information"}
                {step === 2 && "Facility Setup"}
                {step === 3 && "Metrc API Configuration"}
              </CardTitle>
            </div>
            <CardDescription>
              {step === 1 && "Tell us a bit about yourself"}
              {step === 2 && "Set up your primary facility"}
              {step === 3 && "Connect to Minnesota Metrc (optional - can be done later)"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Profile */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="cultivator">Cultivator</SelectItem>
                      <SelectItem value="retail_clerk">Retail Clerk</SelectItem>
                      <SelectItem value="medical_provider">Medical Provider</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This determines what features you have access to
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Facility */}
            {step === 2 && (
              <div className="space-y-4">
                <Alert>
                  <Building2 className="h-4 w-4" />
                  <AlertTitle>Facility Setup</AlertTitle>
                  <AlertDescription>
                    Your facility information will be created automatically. You can add more facilities later in Settings.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="facilityName">Facility Name</Label>
                  <Input
                    id="facilityName"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="Main Cultivation Facility"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilityAddress">Address (Optional)</Label>
                  <Input
                    id="facilityAddress"
                    value={facilityAddress}
                    onChange={(e) => setFacilityAddress(e.target.value)}
                    placeholder="123 Main St, Minneapolis, MN 55401"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Metrc */}
            {step === 3 && (
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Metrc Integration (Optional)</AlertTitle>
                  <AlertDescription>
                    Connect your Metrc API to enable automatic sync. You can skip this and configure it later in Settings.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Environment</Label>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Use Sandbox</p>
                      <p className="text-sm text-muted-foreground">
                        Test with Metrc sandbox environment
                      </p>
                    </div>
                    <Switch
                      checked={metrcSandbox}
                      onCheckedChange={setMetrcSandbox}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metrcVendorKey">Metrc Vendor Key (Username)</Label>
                  <Input
                    id="metrcVendorKey"
                    type="password"
                    value={metrcVendorKey}
                    onChange={(e) => setMetrcVendorKey(e.target.value)}
                    placeholder="Vendor/Integrator API Key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Pre-filled with sandbox vendor key (used as Basic Auth username)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metrcUserKey">Metrc User Key (Password)</Label>
                  <Input
                    id="metrcUserKey"
                    type="password"
                    value={metrcUserKey}
                    onChange={(e) => setMetrcUserKey(e.target.value)}
                    placeholder="User API Key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Pre-filled with sandbox user key (used as Basic Auth password). Get your keys from{" "}
                    <a
                      href={metrcSandbox ? "https://sandbox-api-mn.metrc.com" : "https://api-mn.metrc.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Metrc API
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metrcLicenseNumber">License Number</Label>
                  <Input
                    id="metrcLicenseNumber"
                    value={metrcLicenseNumber}
                    onChange={(e) => setMetrcLicenseNumber(e.target.value)}
                    placeholder="C0001"
                  />
                  <p className="text-xs text-muted-foreground">
                    Pre-filled with sandbox license (C0001)
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-2 pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Back
                </Button>
              )}

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !displayName) ||
                    loading
                  }
                  className="ml-auto"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={loading}
                  className="ml-auto"
                >
                  {loading ? (
                    "Setting up..."
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Complete Setup
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Skip Option for Metrc Step */}
            {step === 3 && (
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleComplete}
                  disabled={loading}
                >
                  Skip Metrc Setup (Configure Later)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-muted/50">
            <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Plant Tracking</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Metrc Sync</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Compliance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
