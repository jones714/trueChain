"use client";

import * as React from "react";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle,
  Package, Sprout, Truck, ShoppingCart, Database, Activity,
  Download, Settings, ChevronRight, Zap, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types for sync status
interface SyncStatus {
  dataType: string;
  lastSyncAt: Date | null;
  status: 'success' | 'error' | 'pending' | 'running';
  count: number;
  syncType?: 'incremental' | 'full';
  error?: string;
}

interface SyncLog {
  id: string;
  type: string;
  timestamp: Date;
  status: 'success' | 'error';
  facilitiesCount?: number;
  packagesCount?: number;
  plantsCount?: number;
  transfersCount?: number;
  receiptsCount?: number;
  error?: string;
}

export default function MetrcSyncPage() {
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [selectedFacility, setSelectedFacility] = React.useState("facility-123");

  // Mock data - replace with real Firebase queries
  const syncStatuses: SyncStatus[] = [
    {
      dataType: "packages",
      lastSyncAt: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
      status: "success",
      count: 150,
      syncType: "incremental"
    },
    {
      dataType: "plants_vegetative",
      lastSyncAt: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
      status: "success",
      count: 245,
      syncType: "incremental"
    },
    {
      dataType: "plants_flowering",
      lastSyncAt: new Date(Date.now() - 5 * 60 * 1000),
      status: "success",
      count: 180,
      syncType: "incremental"
    },
    {
      dataType: "transfers_incoming",
      lastSyncAt: new Date(Date.now() - 8 * 60 * 1000),
      status: "success",
      count: 12,
      syncType: "incremental"
    },
    {
      dataType: "transfers_outgoing",
      lastSyncAt: new Date(Date.now() - 8 * 60 * 1000),
      status: "success",
      count: 8,
      syncType: "incremental"
    },
    {
      dataType: "salesReceipts",
      lastSyncAt: new Date(Date.now() - 3 * 60 * 1000),
      status: "success",
      count: 67,
      syncType: "incremental"
    },
  ];

  const syncLogs: SyncLog[] = [
    {
      id: "log1",
      type: "hourly_incremental",
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      status: "success",
      facilitiesCount: 3,
      packagesCount: 45,
      plantsCount: 120,
      transfersCount: 5,
      receiptsCount: 23
    },
    {
      id: "log2",
      type: "hourly_incremental",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "success",
      facilitiesCount: 3,
      packagesCount: 38,
      plantsCount: 95,
      transfersCount: 3,
      receiptsCount: 19
    },
    {
      id: "log3",
      type: "daily_full",
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), // Yesterday 2 AM
      status: "success",
      facilitiesCount: 3,
      packagesCount: 450,
      plantsCount: 1250,
      transfersCount: 42,
      receiptsCount: 234
    },
  ];

  const handleSyncNow = async (dataType: string) => {
    setIsSyncing(true);
    try {
      // Call Cloud Function
      // const functions = getFunctions();
      // const syncFn = httpsCallable(functions, `sync${dataType}`);
      // await syncFn({ facilityId: selectedFacility });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Syncing ${dataType} for facility ${selectedFacility}`);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      success: "default",
      error: "destructive",
      running: "secondary",
      pending: "outline"
    };
    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "Never";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const dataTypeIcons: Record<string, any> = {
    packages: Package,
    plants_vegetative: Sprout,
    plants_flowering: Sprout,
    plantBatches: Sprout,
    transfers_incoming: Truck,
    transfers_outgoing: Truck,
    salesReceipts: ShoppingCart,
    salesDeliveries: Truck,
  };

  const dataTypeLabels: Record<string, string> = {
    packages: "Packages",
    plants_vegetative: "Vegetative Plants",
    plants_flowering: "Flowering Plants",
    plantBatches: "Plant Batches",
    transfers_incoming: "Incoming Transfers",
    transfers_outgoing: "Outgoing Transfers",
    salesReceipts: "Sales Receipts",
    salesDeliveries: "Sales Deliveries",
  };

  return (
    <PageContainer>
      <PageHeader
        title="Metrc Sync Management"
        description="Monitor and control real-time synchronization between TruChain and Metrc Minnesota"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
          <Button
            size="sm"
            onClick={() => handleSyncNow("All")}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Sync All Now
          </Button>
        </div>
      </PageHeader>

      {/* Overall Status Summary */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="text-2xl font-bold">Operational</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems syncing normally
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 min ago</div>
            <p className="text-xs text-muted-foreground mt-1">
              Packages (Incremental)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Synced</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">662</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all data types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              In last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Sync Status</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        {/* Sync Status Tab */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Sync Status</CardTitle>
              <CardDescription>
                Current synchronization status for all Metrc data types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncStatuses.map((sync) => {
                  const Icon = dataTypeIcons[sync.dataType];
                  return (
                    <div
                      key={sync.dataType}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              {dataTypeLabels[sync.dataType] || sync.dataType}
                            </h4>
                            {getStatusBadge(sync.status)}
                            {sync.syncType && (
                              <Badge variant="outline" className="text-xs">
                                {sync.syncType}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{sync.count} items</span>
                            <span>•</span>
                            <span>{formatTimeAgo(sync.lastSyncAt)}</span>
                          </div>
                          {sync.error && (
                            <p className="text-xs text-destructive mt-1">
                              Error: {sync.error}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSyncNow(sync.dataType)}
                        disabled={isSyncing || sync.status === 'running'}
                      >
                        {sync.status === 'running' ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Sync Now
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Logs</CardTitle>
              <CardDescription>
                History of scheduled and manual sync operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Facilities</TableHead>
                    <TableHead>Packages</TableHead>
                    <TableHead>Plants</TableHead>
                    <TableHead>Transfers</TableHead>
                    <TableHead>Sales</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {log.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusIcon(log.status)}</TableCell>
                      <TableCell>{log.facilitiesCount || '-'}</TableCell>
                      <TableCell>{log.packagesCount || '-'}</TableCell>
                      <TableCell>{log.plantsCount || '-'}</TableCell>
                      <TableCell>{log.transfersCount || '-'}</TableCell>
                      <TableCell>{log.receiptsCount || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Hourly Incremental
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="font-medium">Every hour at :00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Run:</span>
                    <span className="font-medium">1 hour ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next Run:</span>
                    <span className="font-medium">In 58 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Daily Full Sync
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="font-medium">Daily at 2:00 AM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Run:</span>
                    <span className="font-medium">22 hours ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next Run:</span>
                    <span className="font-medium">In 2 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Retry Failed Syncs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="font-medium">Every 6 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Run:</span>
                    <span className="font-medium">4 hours ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next Run:</span>
                    <span className="font-medium">In 2 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Configuration</CardTitle>
              <CardDescription>
                Automatic sync jobs are configured in Firebase Cloud Functions.
                Contact your administrator to modify schedules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Enable/Disable Sync for This Facility</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Toggle automatic background syncing for this facility
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Automatic Sync Enabled</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
