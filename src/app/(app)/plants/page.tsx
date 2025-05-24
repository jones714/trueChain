
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  Sprout, 
  Droplets, 
  Flower2, 
  Scissors, 
  Trash2, 
  Printer, 
  Thermometer, 
  Cloud, 
  Bug, 
  PieChart,
  BarChart2,
  Activity, 
  Tag, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Archive, 
  CalendarDays,
  MapPin,
  ListFilter,
  FileEdit, 
  CameraIcon, 
  MoreHorizontal,
  Move, 
  GitFork, 
  MessageSquare, 
  ShieldQuestion, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  UploadCloud, 
  BookOpen, 
  Wrench, 
  ClipboardList,
  Clock 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { format, parseISO, isPast, differenceInDays } from 'date-fns';

type PlantStage = "Germination" | "Vegetative" | "Flowering" | "Harvested" | "Destroyed";
type QAStatus = "Untested" | "Pass" | "Fail";
type OnTrackStatus = "On Track" | "At Risk" | "Needs Review";
type MetrcSyncStatus = "synced" | "error" | "pending";

interface PlantBatch {
  id: string;
  metrcTagId: string; // This can represent RFID or other compliance tags
  strain: string;
  quantity: number;
  currentPhase: PlantStage;
  roomLocation: string;
  phaseStartDate: string; // ISO Date string
  estimatedStageCompletionDate: string; // ISO Date string
  qaStatus: QAStatus;
  hasNotes: boolean;
  onTrackStatus: OnTrackStatus;
  status: "Active" | "Transferred" | "Destroyed" | "On Hold" | "Harvested"; // Overall batch status
  metrcSync: MetrcSyncStatus;
  stageProgress: number; // Percentage
  expectedHarvestDate: string; // ISO Date string
  dateCreated: string; // ISO Date string for initial creation
}

const initialPlantBatches: PlantBatch[] = [
  {
    id: "PB2024-001",
    metrcTagId: "1A4060300000E0E000000234",
    strain: "Blue Dream",
    currentPhase: "Flowering",
    quantity: 50,
    roomLocation: "Flower Room 1A",
    dateCreated: "2023-09-15",
    phaseStartDate: "2023-10-20",
    estimatedStageCompletionDate: "2023-11-20",
    expectedHarvestDate: "2023-11-20",
    status: "Active",
    metrcSync: "synced",
    stageProgress: 75,
    qaStatus: "Untested",
    hasNotes: true,
    onTrackStatus: "On Track",
  },
  {
    id: "PB2024-002",
    metrcTagId: "1A4060300000E0E000000235",
    strain: "OG Kush",
    currentPhase: "Vegetative",
    quantity: 120,
    roomLocation: "Veg Room 2B",
    dateCreated: "2023-10-01",
    phaseStartDate: "2023-10-10",
    estimatedStageCompletionDate: "2023-11-05",
    expectedHarvestDate: "2023-12-15",
    status: "Active",
    metrcSync: "error",
    stageProgress: 40,
    qaStatus: "Untested",
    hasNotes: false,
    onTrackStatus: "At Risk",
  },
  {
    id: "PB2024-003",
    metrcTagId: "1A4060300000E0E000000236",
    strain: "Sour Diesel",
    currentPhase: "Germination",
    quantity: 200,
    roomLocation: "Propagation Area",
    dateCreated: "2023-10-25",
    phaseStartDate: "2023-10-25",
    estimatedStageCompletionDate: "2023-11-05",
    expectedHarvestDate: "2024-02-01",
    status: "Active",
    metrcSync: "pending",
    stageProgress: 10,
    qaStatus: "Untested",
    hasNotes: true,
    onTrackStatus: "Needs Review",
  },
  {
    id: "PB2023-004",
    metrcTagId: "1A4060300000E0E000000230",
    strain: "Girl Scout Cookies",
    currentPhase: "Harvested",
    quantity: 45,
    roomLocation: "Drying Room 1",
    dateCreated: "2023-08-01",
    phaseStartDate: "2023-10-05", // Date of harvest
    estimatedStageCompletionDate: "2023-10-10", // End of drying/curing
    expectedHarvestDate: "2023-10-05",
    status: "Harvested",
    metrcSync: "synced",
    stageProgress: 100,
    qaStatus: "Pass",
    hasNotes: true,
    onTrackStatus: "On Track",
  },
   {
    id: "PB2023-005",
    metrcTagId: "1A4060300000E0E000000250",
    strain: "Pineapple Express",
    currentPhase: "Flowering",
    quantity: 70,
    roomLocation: "Flower Room 2A",
    dateCreated: "2023-07-15",
    phaseStartDate: "2023-09-01",
    estimatedStageCompletionDate: "2023-10-20", // This date is in the past
    expectedHarvestDate: "2023-10-20", // This date is in the past
    status: "Active", // Still active but harvest overdue
    metrcSync: "synced",
    stageProgress: 95,
    qaStatus: "Untested",
    hasNotes: false,
    onTrackStatus: "At Risk",
  },
];

const stageIcons: Record<PlantStage, React.ElementType> = {
  Germination: Droplets,
  Vegetative: Sprout,
  Flowering: Flower2,
  Harvested: Scissors,
  Destroyed: Trash2,
};

const qaStatusIcons: Record<QAStatus, React.ElementType> = {
  Untested: ShieldQuestion,
  Pass: ShieldCheck,
  Fail: ShieldAlert,
};

const onTrackStatusColors: Record<OnTrackStatus, string> = {
  "On Track": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "At Risk": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400",
  "Needs Review": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};


export default function PlantsLifecycleDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all_stages');
  const [strainFilter, setStrainFilter] = useState('all_strains');
  const [locationFilter, setLocationFilter] = useState('all_locations');
  const [qaStatusFilter, setQaStatusFilter] = useState('all_qa');
  const [activeFilter, setActiveFilter] = useState('all_activity'); // 'active', 'harvested', 'all_activity'

  const uniqueStrains = useMemo(() => Array.from(new Set(initialPlantBatches.map(b => b.strain))), []);
  const uniqueLocations = useMemo(() => Array.from(new Set(initialPlantBatches.map(b => b.roomLocation))), []);

  const filteredPlantBatches = useMemo(() => {
    return initialPlantBatches.filter(batch => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        batch.id.toLowerCase().includes(searchLower) ||
        batch.metrcTagId.toLowerCase().includes(searchLower) ||
        batch.strain.toLowerCase().includes(searchLower) ||
        batch.roomLocation.toLowerCase().includes(searchLower);
      
      const matchesStage = (stageFilter === 'all_stages') ? true : batch.currentPhase === stageFilter;
      const matchesStrain = (strainFilter === 'all_strains') ? true : batch.strain === strainFilter;
      const matchesLocation = (locationFilter === 'all_locations') ? true : batch.roomLocation === locationFilter;
      const matchesQA = (qaStatusFilter === 'all_qa') ? true : batch.qaStatus === qaStatusFilter;
      
      const matchesActivity = 
        (activeFilter === 'all_activity') ? true :
        (activeFilter === 'active' && batch.status !== 'Harvested' && batch.status !== 'Destroyed') ? true :
        (activeFilter === 'harvested' && batch.status === 'Harvested') ? true : false;
      
      return matchesSearch && matchesStage && matchesStrain && matchesLocation && matchesQA && matchesActivity;
    });
  }, [searchTerm, stageFilter, strainFilter, locationFilter, qaStatusFilter, activeFilter]);
  
  const getDaysInStage = (phaseStartDate: string): number => {
    return differenceInDays(new Date(), parseISO(phaseStartDate));
  };

  const isHarvestDateOverdue = (batch: PlantBatch): boolean => {
    return batch.currentPhase !== 'Harvested' && batch.currentPhase !== 'Destroyed' && isPast(parseISO(batch.expectedHarvestDate));
  };


  return (
    <PageContainer>
      <PageHeader
        title="Plant Lifecycle Dashboard"
        description="Monitor, log, and manage all cannabis plant batches from seed to post-harvest. Click 'Create Plant Batch' to start a new batch (select strain, quantity/batch size, origin batch if clones, room/location, starting stage, start date, and notes; option for 'Sample Batch' to exclude from METRC, and to print METRC/RFID tags or QR codes).">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Plant Batch
        </Button>
      </PageHeader>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center"><ListFilter className="mr-2 h-5 w-5"/>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input 
            placeholder="Search Batch ID, METRC/RFID Tag, Strain, Room..." 
            className="lg:col-span-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger><SelectValue placeholder="Filter by Stage" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_stages">All Stages</SelectItem>
              <SelectItem value="Germination">Germination</SelectItem>
              <SelectItem value="Vegetative">Vegetative</SelectItem>
              <SelectItem value="Flowering">Flowering</SelectItem>
              <SelectItem value="Harvested">Harvested</SelectItem>
              <SelectItem value="Destroyed">Destroyed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={strainFilter} onValueChange={setStrainFilter}>
            <SelectTrigger><SelectValue placeholder="Filter by Strain" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_strains">All Strains</SelectItem>
              {uniqueStrains.map(strain => <SelectItem key={strain} value={strain}>{strain}</SelectItem>)}
            </SelectContent>
          </Select>
           <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger><SelectValue placeholder="Filter by Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_locations">All Locations</SelectItem>
              {uniqueLocations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={qaStatusFilter} onValueChange={setQaStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Filter by QA Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_qa">All QA Statuses</SelectItem>
              <SelectItem value="Untested">Untested</SelectItem>
              <SelectItem value="Pass">Pass</SelectItem>
              <SelectItem value="Fail">Fail</SelectItem>
            </SelectContent>
          </Select>
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger><SelectValue placeholder="Filter by Activity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_activity">All (Active & Harvested)</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="harvested">Harvested Only</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plant Batches Overview</CardTitle>
          <CardDescription>
            Comprehensive list of all plant batches. Click Batch ID for detailed view including logs (feeding, watering, health, environment, clone source), compliance metadata (METRC tag, license, origin, action history), photo uploads, and notes. Actions menu provides tools for lifecycle management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID / Tag</TableHead>
                <TableHead>Strain</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Days in Phase</TableHead>
                <TableHead>Est. Completion</TableHead>
                <TableHead>QA Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>METRC Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlantBatches.map((batch) => {
                const StageIcon = stageIcons[batch.currentPhase] || Sprout;
                const QAIcon = qaStatusIcons[batch.qaStatus] || ShieldQuestion;
                const isOverdue = isHarvestDateOverdue(batch);
                const daysInCurrentStage = getDaysInStage(batch.phaseStartDate);

                return (
                <TableRow key={batch.id} className={cn(isOverdue && "bg-amber-50 dark:bg-amber-900/30")}>
                  <TableCell className="font-medium hover:underline cursor-pointer" title={`METRC Tag: ${batch.metrcTagId}`}>
                    {batch.id} {batch.hasNotes && <MessageSquare className="inline h-3 w-3 ml-1 text-blue-500"/>}
                  </TableCell>
                  <TableCell>{batch.strain}</TableCell>
                  <TableCell>{batch.quantity}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                        <StageIcon className="h-3.5 w-3.5" /> 
                        {batch.currentPhase}
                    </Badge>
                    <Progress value={batch.stageProgress} className="h-1.5 mt-1" />
                  </TableCell>
                  <TableCell>{batch.roomLocation}</TableCell>
                  <TableCell>{daysInCurrentStage}d</TableCell>
                  <TableCell>
                    {format(parseISO(batch.estimatedStageCompletionDate), "MM/dd/yy")}
                    {isOverdue && <AlertTriangle className="inline h-4 w-4 ml-1 text-amber-500" title="Harvest Overdue!" />}
                  </TableCell>
                  <TableCell>
                    <Badge variant={batch.qaStatus === 'Pass' ? 'default' : batch.qaStatus === 'Fail' ? 'destructive' : 'secondary'} 
                           className={cn(
                            batch.qaStatus === 'Pass' && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                            batch.qaStatus === 'Untested' && "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300", 
                            batch.qaStatus === 'Fail' && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" 
                           )}
                    >
                        <QAIcon className="h-3.5 w-3.5 mr-1"/>{batch.qaStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                        variant="outline" 
                        className={cn("whitespace-nowrap", onTrackStatusColors[batch.onTrackStatus])}
                    >
                        {batch.onTrackStatus === "On Track" && <TrendingUp className="h-3.5 w-3.5 mr-1"/>}
                        {batch.onTrackStatus === "At Risk" && <TrendingDown className="h-3.5 w-3.5 mr-1"/>}
                        {batch.onTrackStatus === "Needs Review" && <Eye className="h-3.5 w-3.5 mr-1"/>}
                        {batch.onTrackStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {batch.metrcSync === "synced" ? <CheckCircle2 className="h-5 w-5 text-green-500" title="Synced"/> : 
                     batch.metrcSync === "error" ? <AlertTriangle className="h-5 w-5 text-destructive" title="Sync Error"/> :
                     <Clock className="h-5 w-5 text-yellow-500" title="Sync Pending"/>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Details / Logs</DropdownMenuItem>
                        <DropdownMenuItem><Sprout className="mr-2 h-4 w-4" />Advance Stage</DropdownMenuItem>
                        <DropdownMenuItem><FileEdit className="mr-2 h-4 w-4" />Log Activity/Observation</DropdownMenuItem>
                        <DropdownMenuItem><Wrench className="mr-2 h-4 w-4" />Log Nutrients/Watering</DropdownMenuItem>
                        <DropdownMenuItem><Bug className="mr-2 h-4 w-4" />Flag Health Concern</DropdownMenuItem>
                        <DropdownMenuItem><UploadCloud className="mr-2 h-4 w-4" />Upload Lab QA Results</DropdownMenuItem>
                        <DropdownMenuItem><ClipboardList className="mr-2 h-4 w-4" />Log Harvest & Yield</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><GitFork className="mr-2 h-4 w-4" />Clone Batch</DropdownMenuItem>
                        <DropdownMenuItem><Move className="mr-2 h-4 w-4" />Move Plants</DropdownMenuItem>
                        <DropdownMenuItem><Printer className="mr-2 h-4 w-4" />Print Tags</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Archive className="mr-2 h-4 w-4" />Archive Batch</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive hover:!text-destructive focus:!text-destructive focus:!bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" />Destroy Batch
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )})}
              {filteredPlantBatches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    No plant batches found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg flex items-center"><PieChart className="mr-2 h-5 w-5"/>Key Metrics & Activity</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Active Plants</CardTitle><Sprout className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{initialPlantBatches.filter(b => b.status === 'Active').reduce((sum, b) => sum + b.quantity, 0) }</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Batches Awaiting QA</CardTitle><ShieldQuestion className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{initialPlantBatches.filter(b => b.qaStatus === 'Untested' && b.status === 'Active').length}</div></CardContent>
            </Card>
             <Card className="sm:col-span-2">
                 <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Stage Distribution (Active Batches)</CardTitle></CardHeader>
                 <CardContent className="text-center text-muted-foreground py-4">[Pie Chart: Germ: X%, Veg: Y%, Flower: Z%]</CardContent>
            </Card>
            <Card className="sm:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center"><Activity className="mr-2 h-4 w-4"/>Recent Plant Activity</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1 pt-0">
                <p>Batch PB2024-001 entered Flowering.</p>
                <p>Batch PB2024-002: Pest alert logged.</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center"><Thermometer className="mr-2 h-5 w-5"/>Environmental Metrics</CardTitle><CardDescription>Real-time sensor data summary for selected batch/room.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded-md"><div className="flex items-center"><Thermometer className="h-4 w-4 mr-2 text-red-500"/><span className="text-sm">Avg. Temp</span></div><span className="text-sm font-semibold">75°F</span></div>
            <div className="flex items-center justify-between p-2 border rounded-md"><div className="flex items-center"><Droplets className="h-4 w-4 mr-2 text-blue-500"/><span className="text-sm">Avg. Humidity</span></div><span className="text-sm font-semibold">55%</span></div>
            <div className="flex items-center justify-between p-2 border rounded-md"><div className="flex items-center"><Cloud className="h-4 w-4 mr-2 text-gray-500"/><span className="text-sm">Avg. CO2</span></div><span className="text-sm font-semibold">800 ppm</span></div>
            <Button variant="link" size="sm" className="p-0 h-auto text-primary">View Sensor Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
