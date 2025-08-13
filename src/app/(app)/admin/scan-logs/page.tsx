
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { History, Download, Filter, Calendar as CalendarIcon, Search, User, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";

const scanLogData = [
  { id: "SCAN001", timestamp: "2023-11-15 10:01:34 AM", scanned_value: "1A4060300000E0E000000777", scan_type: "metrc_tag", user_id: "USR003", user_name: "Charlie C.", user_role: "Retail Clerk", related_action: "POS_SALE_SCAN", linked_entity_id: "SALE005" },
  { id: "SCAN002", timestamp: "2023-11-15 10:00:05 AM", scanned_value: "MFT-00123", scan_type: "manifest_qr", user_id: "USR001", user_name: "John D.", user_role: "Driver", related_action: "TRANSFER_CONFIRMATION", linked_entity_id: "MFT-00123" },
  { id: "SCAN003", timestamp: "2023-11-14 02:20:11 PM", scanned_value: "PROD-FLOWER-OGK-3.5G", scan_type: "product_barcode", user_id: "USR005", user_name: "Eddie H.", user_role: "Inventory Clerk", related_action: "INVENTORY_INTAKE", linked_entity_id: "PKG-0987" },
  { id: "SCAN004", timestamp: "2023-11-14 09:05:00 AM", scanned_value: "MN-PAT-XYZ123", scan_type: "customer_id", user_id: "USR003", user_name: "Charlie C.", user_role: "Retail Clerk", related_action: "PATIENT_VERIFICATION_POS", linked_entity_id: "PAT007" },
  { id: "SCAN005", timestamp: "2023-11-13 04:55:19 PM", scanned_value: "BATCH-HVT-005", scan_type: "internal_qr", user_id: "USR002", user_name: "Bob B.", user_role: "Cultivator", related_action: "WASTE_LOG_SCAN", linked_entity_id: "WST001" },
];


export default function ScanHistoryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
    <PageContainer>
        <PageHeader 
            title="Scan History Logs" 
            description="A centralized, immutable log of all scan events across the platform for compliance and traceability."
        >
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
        </PageHeader>
        <Card>
            <CardHeader>
                <CardTitle>Global Scan Event Log</CardTitle>
                <CardDescription>
                    Search and filter every QR code, barcode, METRC tag, and ID scan. Logs include user, role, timestamp, action, and linked entity.
                </CardDescription>
                 <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-2">
                    <Input 
                        placeholder="Search by Scanned Value, User, Action..." 
                        className="max-w-xs" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Scan Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Scan Types</SelectItem>
                            <SelectItem value="metrc_tag">METRC Tag</SelectItem>
                            <SelectItem value="product_barcode">Product Barcode</SelectItem>
                            <SelectItem value="customer_id">Customer ID</SelectItem>
                            <SelectItem value="manifest_qr">Manifest QR</SelectItem>
                            <SelectItem value="internal_qr">Internal QR</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full sm:w-auto"><CalendarIcon className="mr-2 h-4 w-4"/>Date Range</Button>
                    <Button className="w-full sm:w-auto"><Filter className="mr-2 h-4 w-4"/>Apply Filters</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Scanned Value</TableHead>
                            <TableHead>Scan Type</TableHead>
                            <TableHead>User & Role</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Linked Entity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scanLogData.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="text-xs">{log.timestamp}</TableCell>
                                <TableCell className="font-mono text-xs">{log.scanned_value}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{log.scan_type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground"/>
                                        <div>
                                            <p className="text-sm font-medium">{log.user_name}</p>
                                            <p className="text-xs text-muted-foreground">{log.user_role}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs font-medium">{log.related_action}</TableCell>
                                <TableCell>
                                    <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                                        <Link href={`#`}>
                                            <Link2 className="mr-1 h-3 w-3" />
                                            {log.linked_entity_id}
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {scanLogData.length === 0 && (
                    <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                        <History className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-2">No scan events found for the selected criteria.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </PageContainer>
    );
}
