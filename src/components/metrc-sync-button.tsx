"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MetrcSyncButtonProps {
  dataType: 'packages' | 'plants' | 'transfers' | 'sales';
  facilityId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

const dataTypeConfig = {
  packages: {
    label: 'Sync Packages',
    functionName: 'syncActivePackages',
    description: 'Sync active packages from Metrc',
  },
  plants: {
    label: 'Sync Plants',
    functionName: 'syncVegetativePlants', // Could be extended to sync both veg and flowering
    description: 'Sync plants from Metrc',
  },
  transfers: {
    label: 'Sync Transfers',
    functionName: 'syncIncomingTransfers', // Could be extended to sync both incoming and outgoing
    description: 'Sync transfers from Metrc',
  },
  sales: {
    label: 'Sync Sales',
    functionName: 'syncSalesReceipts',
    description: 'Sync sales receipts from Metrc',
  },
};

export function MetrcSyncButton({
  dataType,
  facilityId = 'facility-123', // Default facility for demo
  variant = 'outline',
  size = 'sm',
  showLabel = true,
  className,
}: MetrcSyncButtonProps) {
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const config = dataTypeConfig[dataType];

  const handleSync = async () => {
    setIsSyncing(true);
    setStatus('idle');

    try {
      // Import Firebase functions dynamically
      const { getFunctions, httpsCallable } = await import('firebase/functions');
      const { functions } = await import('@/lib/firebase');

      const syncFn = httpsCallable(functions, config.functionName);
      const result = await syncFn({ facilityId });

      setStatus('success');
      toast({
        title: "Sync Successful",
        description: `Successfully synced ${dataType} from Metrc`,
      });

      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      setStatus('error');
      toast({
        title: "Sync Failed",
        description: error.message || `Failed to sync ${dataType} from Metrc`,
        variant: "destructive",
      });

      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  const getIcon = () => {
    if (isSyncing) {
      return <RefreshCw className={cn("h-4 w-4 animate-spin", showLabel && "mr-2")} />;
    }
    if (status === 'success') {
      return <CheckCircle2 className={cn("h-4 w-4 text-green-500", showLabel && "mr-2")} />;
    }
    if (status === 'error') {
      return <XCircle className={cn("h-4 w-4 text-destructive", showLabel && "mr-2")} />;
    }
    return <RefreshCw className={cn("h-4 w-4", showLabel && "mr-2")} />;
  };

  const getLabel = () => {
    if (isSyncing) return 'Syncing...';
    if (status === 'success') return 'Synced!';
    if (status === 'error') return 'Failed';
    return config.label;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleSync}
            disabled={isSyncing}
            className={className}
          >
            {getIcon()}
            {showLabel && getLabel()}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
