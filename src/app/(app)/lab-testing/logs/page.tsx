
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
import { History, Download, Filter, FileText, CheckCircle, AlertTriangle, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const labTestingLogData = [
  { log_id: "LTL001", batch_id: "HVT-001", lab_name: "Anresco Labs", test_type: ["Potency", "Pesticides"], sample_collected_date: "2023-11-10", test_submission_date: "2023-11-11", results_received_date: "2023-11-14", passed_compliance: true, coaUrl: "#" },
  { log_id: "LTL002", batch_id: "B-042", lab_name: "Steep Hill", test_type: ["Potency", "Pesticides", "Heavy Metals"], sample_collected_date: "2023-11-09", test_submission_date: "2023-11-10", results_received_date: "2023-11-13", passed_compliance: false, coaUrl: "#" },
  { log_id: "LTL003", batch_id: "C-105", lab_name: "SC Labs", test_type: ["Potency"], sample_collected_date: "2023-11-08", test_submission_date: "2023-11-08", results_received_date: "2023-11-11", passed_compliance: true, coaUrl: "#" },
  { log_id: "LTL004", batch_id: "EXT-005", lab_name: "Anresco Labs", test_type: ["Potency", "Residual Solvents"], sample_collected_date: "2023-11-12", test_submission_date: "2023-11-13", results_received_date: "", passed_compliance: null, coaUrl: "" },
];


export default function LabTestingLogsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
    <PageContainer>
        <PageHeader 
            title="Lab Testing Logs" 
            description="A detailed audit trail for all lab testing activities, from sample collection to result receipt."
        >
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export Logs
            </Button>
        </PageHeader>
        <Card>
            <CardHeader>
                <CardTitle>Global Lab Test Log</CardTitle>
                <CardDescription>
                    Search and filter every test request. Track timelines and compliance status.
                </CardDescription>
                 <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-2">
                    <Input 
                        placeholder="Search by Batch ID, Lab Name..." 
                        className="max-w-xs" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Test Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Test Types</SelectItem>
                            <SelectItem value="potency">Potency</SelectItem>
                            <SelectItem value="pesticides">Pesticides</SelectItem>
                            <SelectItem value="heavy_metals">Heavy Metals</SelectItem>
                            <SelectItem value="microbial">Microbial</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="passed">Passed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="w-full sm:w-auto"><Filter className="mr-2 h-4 w-4"/>Apply Filters</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch ID</TableHead>
                            <TableHead>Lab</TableHead>
                            <TableHead>Tests</TableHead>
                            <TableHead>Sample Collected</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Results Received</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">CoA</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {labTestingLogData.map((log) => (
                            <TableRow key={log.log_id} className={cn(log.passed_compliance === false && "bg-destructive/10")}>
                                <TableCell className="font-medium">{log.batch_id}</TableCell>
                                <TableCell className="text-xs">{log.lab_name}</TableCell>
                                <TableCell className="text-xs">
                                    {log.test_type.join(', ')}
                                </TableCell>
                                <TableCell className="text-xs">{log.sample_collected_date}</TableCell>
                                <TableCell className="text-xs">{log.test_submission_date}</TableCell>
                                <TableCell className="text-xs">{log.results_received_date || 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant={log.passed_compliance === null ? "secondary" : log.passed_compliance ? "default" : "destructive"} 
                                       className={cn(
                                        log.passed_compliance === true && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                                        log.passed_compliance === false && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
                                        log.passed_compliance === null && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400"
                                        )}>
                                        {log.passed_compliance === null ? "Pending" : log.passed_compliance ? <CheckCircle className="inline h-3 w-3 mr-1"/> : <AlertTriangle className="inline h-3 w-3 mr-1"/>}
                                        {log.passed_compliance === null ? "Pending" : log.passed_compliance ? "Passed" : "Failed"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {log.coaUrl ? (
                                    <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                                        <Link href={log.coaUrl} target="_blank">
                                            <Link2 className="mr-1 h-3 w-3" />
                                            View CoA
                                        </Link>
                                    </Button>
                                    ) : 'N/A' }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {labTestingLogData.length === 0 && (
                    <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                        <History className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-2">No lab testing events found for the selected criteria.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </PageContainer>
    );
}
