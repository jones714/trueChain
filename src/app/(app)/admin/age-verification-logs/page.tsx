
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
import { Fingerprint, Download, Filter, CalendarDays, Search, User, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ageVerificationLogData = [
  { id: "AGE001", timestamp: "2023-11-15 10:01:34 AM", method: "ID Scan", age_confirmed: true, id_type: "Driver's License", source: "POS", staff_id: "USR003", staff_name: "Charlie C." },
  { id: "AGE002", timestamp: "2023-11-15 09:55:12 AM", method: "Manual DOB Entry", age_confirmed: true, id_type: "Passport", source: "POS", staff_id: "USR003", staff_name: "Charlie C." },
  { id: "AGE003", timestamp: "2023-11-14 05:20:00 PM", method: "3rd-Party KYC", age_confirmed: true, id_type: "State ID", source: "Online", staff_id: "SYSTEM", staff_name: "Online Order System" },
  { id: "AGE004", timestamp: "2023-11-14 02:10:05 PM", method: "ID Scan", age_confirmed: false, id_type: "Driver's License", source: "Delivery", staff_id: "USR001", staff_name: "John D.", notes: "ID expired" },
  { id: "AGE005", timestamp: "2023-11-13 11:45:30 AM", method: "Facial Recognition", age_confirmed: true, id_type: "N/A", source: "Mobile App", staff_id: "SYSTEM", staff_name: "Mobile App" },
];


export default function AgeVerificationLogsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
    <PageContainer>
        <PageHeader 
            title="Age Verification Logs" 
            description="A centralized, immutable log of all age verification events for legal and compliance audits."
        >
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
        </PageHeader>
        <Card>
            <CardHeader>
                <CardTitle>Global Age Verification Log</CardTitle>
                <CardDescription>
                    Search and filter every age check from POS, delivery, or online channels.
                </CardDescription>
                 <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-2">
                    <Input 
                        placeholder="Search by Staff, Source, Notes..." 
                        className="max-w-xs" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Methods</SelectItem>
                            <SelectItem value="id_scan">ID Scan</SelectItem>
                            <SelectItem value="manual">Manual DOB Entry</SelectItem>
                            <SelectItem value="kyc">3rd-Party KYC</SelectItem>
                            <SelectItem value="facial">Facial Recognition</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            <SelectItem value="pos">POS</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="mobile">Mobile App</SelectItem>
                             <SelectItem value="delivery">Delivery</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full sm:w-auto"><CalendarDays className="mr-2 h-4 w-4"/>Date Range</Button>
                    <Button className="w-full sm:w-auto"><Filter className="mr-2 h-4 w-4"/>Apply Filters</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>ID Type</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Staff</TableHead>
                            <TableHead>Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ageVerificationLogData.map((log) => (
                            <TableRow key={log.id} className={cn(!log.age_confirmed && "bg-destructive/10")}>
                                <TableCell className="text-xs">{log.timestamp}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{log.method}</Badge>
                                </TableCell>
                                <TableCell className="text-xs">{log.id_type}</TableCell>
                                <TableCell>
                                    <Badge variant={log.age_confirmed ? "default" : "destructive"} 
                                       className={cn(log.age_confirmed ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300")}>
                                        {log.age_confirmed ? <CheckCircle className="inline h-3 w-3 mr-1"/> : <AlertTriangle className="inline h-3 w-3 mr-1"/>}
                                        {log.age_confirmed ? "Confirmed" : "Failed"}
                                    </Badge>
                                </TableCell>
                                 <TableCell className="text-xs">{log.source}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground"/>
                                        <p className="text-sm font-medium">{log.staff_name}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs font-medium">{log.notes}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {ageVerificationLogData.length === 0 && (
                    <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                        <Fingerprint className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-2">No age verification events found for the selected criteria.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </PageContainer>
    );
}
