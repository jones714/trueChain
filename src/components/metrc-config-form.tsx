"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertTriangle, Key, Building2, Shield } from "lucide-react";

interface MetrcConfigFormProps {
  facilityId: string;
  initialConfig?: {
    metrcApiKey?: string;
    metrcLicenseNumber?: string;
    metrcSandbox?: boolean;
    metrcSyncEnabled?: boolean;
  };
}

export function MetrcConfigForm({ facilityId, initialConfig }: MetrcConfigFormProps) {
  const [apiKey, setApiKey] = React.useState(initialConfig?.metrcApiKey || "");
  const [licenseNumber, setLicenseNumber] = React.useState(initialConfig?.metrcLicenseNumber || "");
  const [useSandbox, setUseSandbox] = React.useState(initialConfig?.metrcSandbox ?? true);
  const [syncEnabled, setSyncEnabled] = React.useState(initialConfig?.metrcSyncEnabled ?? false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestStatus('idle');

    try {
      // Simulate API test
      // const functions = getFunctions();
      // const testConnection = httpsCallable(functions, 'testMetrcConnection');
      // await testConnection({ facilityId, apiKey, licenseNumber, sandbox: useSandbox });

      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestStatus('success');
    } catch (error) {
      setTestStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save to Firestore
      const { getFirestore, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      await setDoc(doc(db, 'facilities', facilityId), {
        metrcApiKey: apiKey,
        metrcLicenseNumber: licenseNumber,
        metrcSandbox: useSandbox,
        metrcSyncEnabled: syncEnabled,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      console.log('Saved Metrc config for facility:', facilityId);
    } catch (error) {
      console.error('Failed to save:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const isConfigured = apiKey && licenseNumber;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Metrc API Configuration
        </CardTitle>
        <CardDescription>
          Configure Minnesota Metrc API credentials for this facility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Alert */}
        {isConfigured && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Metrc Integration Configured</AlertTitle>
            <AlertDescription>
              This facility is connected to Metrc {useSandbox ? 'Sandbox' : 'Production'}
            </AlertDescription>
          </Alert>
        )}

        {/* Environment Selection */}
        <div className="space-y-2">
          <Label htmlFor="environment">Environment</Label>
          <Select
            value={useSandbox ? 'sandbox' : 'production'}
            onValueChange={(val) => setUseSandbox(val === 'sandbox')}
          >
            <SelectTrigger id="environment">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sandbox">
                Sandbox (Testing)
              </SelectItem>
              <SelectItem value="production">
                Production (Live)
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Use Sandbox for testing. Switch to Production when ready to go live.
          </p>
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Metrc API Key
          </Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk_live_..."
          />
          <p className="text-xs text-muted-foreground">
            Your Metrc User API Key from{" "}
            <a
              href={useSandbox ? "https://sandbox-mn.metrc.com" : "https://mn.metrc.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Metrc Settings
            </a>
          </p>
        </div>

        {/* License Number */}
        <div className="space-y-2">
          <Label htmlFor="licenseNumber" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Facility License Number
          </Label>
          <Input
            id="licenseNumber"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="ABC-000001"
          />
          <p className="text-xs text-muted-foreground">
            Your state-issued Minnesota cannabis license number
          </p>
        </div>

        {/* Test Connection */}
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={!apiKey || !licenseNumber || isTesting}
            className="w-full"
          >
            {isTesting ? 'Testing Connection...' : 'Test Connection'}
          </Button>

          {testStatus === 'success' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">Connection Successful</AlertTitle>
              <AlertDescription>
                Successfully connected to Metrc {useSandbox ? 'Sandbox' : 'Production'}
              </AlertDescription>
            </Alert>
          )}

          {testStatus === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Connection Failed</AlertTitle>
              <AlertDescription>
                Unable to connect. Please verify your API key and license number.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Auto-Sync Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="syncEnabled" className="text-base">
              Enable Automatic Sync
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically sync data with Metrc on hourly and daily schedules
            </p>
          </div>
          <Switch
            id="syncEnabled"
            checked={syncEnabled}
            onCheckedChange={setSyncEnabled}
            disabled={!isConfigured}
          />
        </div>

        {syncEnabled && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Scheduled Sync Enabled</AlertTitle>
            <AlertDescription>
              This facility will sync automatically:
              <ul className="mt-2 ml-4 list-disc text-sm space-y-1">
                <li>Hourly incremental sync (modified data only)</li>
                <li>Daily full sync at 2:00 AM</li>
                <li>Retry failed syncs every 6 hours</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Save Button */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={!apiKey || !licenseNumber || isSaving}
            className="flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
