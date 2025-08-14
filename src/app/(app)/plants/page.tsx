
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Clock,
  Wind,
  Sun,
  Beaker,
  Droplet,
  Gauge,
  Calendar,
  Download
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
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format, parseISO, isPast, differenceInDays } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

type PlantStage = "Germination" | "Vegetative" | "Flowering" | "Harvested" | "Destroyed";
type QAStatus = "Untested" | "Pass" | "Fail";
type OnTrackStatus = "On Track" | "At Risk" | "Needs Review";
type MetrcSyncStatus = "synced" | "error" | "pending";

interface PlantLocation {
  room_id: string,
  row_number?: string,
  shelf_level?: string,
  quadrant?: string,
}

interface PlantBatch {
  id: string;
  metrcTagId: string; 
  strain: string;
  quantity: number;
  currentPhase: PlantStage;
  roomLocation: string; // Simplified for display, full object stored
  location?: PlantLocation; // New detailed location
  dateCreated: string; 
  phaseStartDate: string; 
  estimatedStageCompletionDate: string; 
  qaStatus: QAStatus;
  hasNotes: boolean;
  onTrackStatus: OnTrackStatus;
  status: "Active" | "Transferred" | "Destroyed" | "On Hold" | "Harvested"; 
  metrcSync: MetrcSyncStatus;
  stageProgress: number; 
  expectedHarvestDate: string; 
}

const initialPlantBatches: PlantBatch[] = [
  {
    id: "PB2024-001",
    metrcTagId: "1A4060300000E0E000000234",
    strain: "Blue Dream",
    currentPhase: "Flowering",
    quantity: 50,
    roomLocation: "Flower Room 1A",
    location: { room_id: "Flower Room 1A", row_number: "Row 3", shelf_level: "Top"},
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
    location: { room_id: "Veg Room 2B", row_number: "Row 1" },
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
    phaseStartDate: "2023-10-05", 
    estimatedStageCompletionDate: "2023-10-10", 
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
    location: { room_id: "Flower Room 2A", row_number: "Row 5"},
    dateCreated: "2023-07-15",
    phaseStartDate: "2023-09-01",
    estimatedStageCompletionDate: "2023-10-20", 
    expectedHarvestDate: "2023-10-20", 
    status: "Active", 
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

// Component for rendering a single table row to handle client-side state
function PlantBatchRow({ batch }: { batch: PlantBatch }) {
  const [daysInCurrentStage, setDaysInCurrentStage] = useState<number | null>(null);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    setDaysInCurrentStage(differenceInDays(new Date(), parseISO(batch.phaseStartDate)));
  }, [batch.phaseStartDate]);

  const StageIcon = stageIcons[batch.currentPhase] || Sprout;
  const QAIcon = qaStatusIcons[batch.qaStatus] || ShieldQuestion;
  const isOverdue = batch.currentPhase !== 'Harvested' && batch.currentPhase !== 'Destroyed' && isPast(parseISO(batch.expectedHarvestDate));

  // These actions would be passed down as props or handled by context in a real app
  const { toast } = useToast();
  const [showAdvanceStageModal, setShowAdvanceStageModal] = useState(false);
  const [showLogActivityModal, setShowLogActivityModal] = useState(false);
  const [showLogNutrientModal, setShowLogNutrientModal] = useState(false);
  const [showFlagHealthModal, setShowFlagHealthModal] = useState(false);
  const [showUploadQAModal, setShowUploadQAModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDestroyModal, setShowDestroyModal] = useState(false);
  
  const handleRowAction = (action: string) => {
    if (action === "advanceStage") setShowAdvanceStageModal(true);
    else if (action === "logActivity") setShowLogActivityModal(true);
    else if (action === "logNutrient") setShowLogNutrientModal(true);
    else if (action === "flagHealth") setShowFlagHealthModal(true);
    else if (action === "uploadQA") setShowUploadQAModal(true);
    else if (action === "harvest") setShowHarvestModal(true);
    else if (action === "clone") setShowCloneModal(true);
    else if (action === "move") setShowMoveModal(true);
    else if (action === "archive") setShowArchiveModal(true);
    else if (action === "destroy") setShowDestroyModal(true);
    else if (action === "printTags") {
         toast({ title: "Action", description: `Printing tags for Batch ID: ${batch.id}` });
    }
  };
  
  const handleSubmitModal = (modalType: string) => {
    toast({ title: "Success", description: `${modalType} action for ${batch.id} completed.` });
    setShowAdvanceStageModal(false);
    setShowLogActivityModal(false);
    setShowHarvestModal(false);
    setShowDestroyModal(false);
    setShowArchiveModal(false);
    setShowMoveModal(false);
  };


  return (
    <>
    <TableRow className={cn(isOverdue && "bg-amber-50 dark:bg-amber-900/30")}>
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
      <TableCell>{daysInCurrentStage !== null ? `${daysInCurrentStage}d` : '...'}</TableCell>
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
            <DropdownMenuLabel>Actions for {batch.id}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleRowAction("viewDetails")}><Eye className="mr-2 h-4 w-4" />View Details / Logs</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRowAction("advanceStage")}><Sprout className="mr-2 h-4 w-4" />Advance Stage</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRowAction("logActivity")}><FileEdit className="mr-2 h-4 w-4" />Log Activity/Observation</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRowAction("logNutrient")}><Wrench className="mr-2 h-4 w-4" />Log Nutrients/Watering</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRowAction("flagHealth")}><Bug className="mr-2 h-4 w-4" />Flag Health Concern</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRowAction("uploadQA")}><UploadCloud className="mr-2 h-4 w-4" />Upload Lab QA Results</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRowAction("harvest")}><ClipboardList className="mr-2 h-4 w-4" />Log Harvest & Yield</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleRowAction("clone")}><GitFork className="mr-2 h-4 w-4" />Clone Batch</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRowAction("move")}><Move className="mr-2 h-4 w-4" />Move Plants</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRowAction("printTags")}><Printer className="mr-2 h-4 w-4" />Print Tags</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleRowAction("archive")}><Archive className="mr-2 h-4 w-4" />Archive Batch</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive hover:!text-destructive focus:!text-destructive focus:!bg-destructive/10" onClick={() => handleRowAction("destroy")}>
              <Trash2 className="mr-2 h-4 w-4" />Destroy Batch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
    <Dialog open={showAdvanceStageModal} onOpenChange={setShowAdvanceStageModal}><DialogContent><DialogHeader><DialogTitle>Advance Stage</DialogTitle></DialogHeader><DialogFooter><Button onClick={() => handleSubmitModal('advanceStage')}>Confirm</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={showLogActivityModal} onOpenChange={setShowLogActivityModal}><DialogContent><DialogHeader><DialogTitle>Log Activity</DialogTitle></DialogHeader><DialogFooter><Button onClick={() => handleSubmitModal('logActivity')}>Save</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={showHarvestModal} onOpenChange={setShowHarvestModal}><DialogContent><DialogHeader><DialogTitle>Log Harvest</DialogTitle></DialogHeader><DialogFooter><Button onClick={() => handleSubmitModal('harvest')}>Save</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={showDestroyModal} onOpenChange={setShowDestroyModal}><DialogContent><DialogHeader><DialogTitle>Destroy Batch</DialogTitle></DialogHeader><DialogFooter><Button onClick={() => handleSubmitModal('destroy')}>Confirm</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={showArchiveModal} onOpenChange={setShowArchiveModal}><DialogContent><DialogHeader><DialogTitle>Archive Batch</DialogTitle></DialogHeader><DialogFooter><Button onClick={() => handleSubmitModal('archive')}>Confirm</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={showMoveModal} onOpenChange={setShowMoveModal}><DialogContent><DialogHeader><DialogTitle>Move Plants</DialogTitle></DialogHeader><DialogFooter><Button onClick={() => handleSubmitModal('move')}>Confirm</Button></DialogFooter></DialogContent></Dialog>
    {/* Add other simple modals here */}
    </>
  );
}


export default function PlantsLifecycleDashboardPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all_stages');
  const [strainFilter, setStrainFilter] = useState('all_strains');
  const [locationFilter, setLocationFilter] = useState('all_locations');
  const [qaStatusFilter, setQaStatusFilter] = useState('all_qa');
  const [activeFilter, setActiveFilter] = useState('all_activity');

  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
  const [showSensorDashboardModal, setShowSensorDashboardModal] = useState(false);


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
  
  
  const handleCreateBatch = () => {
    // TODO: Call createPlantBatch(data)
    console.log("Creating batch...");
    toast({ title: "Success", description: "Plant batch created successfully." });
    setShowCreateBatchModal(false);
  };
  

  return (
    <PageContainer>
      <PageHeader
        title="Plant Lifecycle Dashboard"
        description="Monitor, log, and manage all cannabis plant batches from seed to post-harvest. Click 'Create Plant Batch' to start a new batch (select strain, quantity/batch size, origin batch if clones, room/location, starting stage, start date, and notes; option for 'Sample Batch' to exclude from METRC, and to print METRC/RFID tags or QR codes).">
        <Button onClick={() => setShowCreateBatchModal(true)}>
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
              {filteredPlantBatches.map((batch) => (
                <PlantBatchRow key={batch.id} batch={batch} />
              ))}
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
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Thermometer className="mr-2 h-5 w-5"/>Environmental Metrics</CardTitle>
            <CardDescription>Real-time sensor data summary for selected batch/room.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded-md"><div className="flex items-center"><Thermometer className="h-4 w-4 mr-2 text-red-500"/><span className="text-sm">Avg. Temp</span></div><span className="text-sm font-semibold">75°F</span></div>
            <div className="flex items-center justify-between p-2 border rounded-md"><div className="flex items-center"><Droplets className="h-4 w-4 mr-2 text-blue-500"/><span className="text-sm">Avg. Humidity</span></div><span className="text-sm font-semibold">55%</span></div>
            <div className="flex items-center justify-between p-2 border rounded-md"><div className="flex items-center"><Cloud className="h-4 w-4 mr-2 text-gray-500"/><span className="text-sm">Avg. CO2</span></div><span className="text-sm font-semibold">800 ppm</span></div>
            <Button variant="default" size="sm" className="w-full" onClick={() => setShowSensorDashboardModal(true)}>View Sensor Dashboard</Button>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Dashboard Modal */}
      <Dialog open={showSensorDashboardModal} onOpenChange={setShowSensorDashboardModal}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>Cultivation Sensor Dashboard</DialogTitle>
            <DialogDescription>Real-time and historical environmental data for your grow zones. Data is simulated for this demo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="zone-selector">Select Zone:</Label>
                <Select defaultValue="flower-room-1a">
                  <SelectTrigger id="zone-selector" className="w-[250px]">
                    <SelectValue placeholder="Select a grow zone..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg-room-2b">Veg Room 2B</SelectItem>
                    <SelectItem value="flower-room-1a">Flower Room 1A</SelectItem>
                    <SelectItem value="flower-room-2a">Flower Room 2A</SelectItem>
                    <SelectItem value="drying-room-1">Drying Room 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="24h">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export Data</Button>
              </div>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-destructive flex items-center"><AlertTriangle className="mr-2"/>Environmental Alerts (2)</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="p-2 border-l-4 border-destructive rounded-r-md bg-destructive/10"><strong>High Humidity Alert:</strong> Flower Room 2A humidity at 72% (Threshold: 60%). Mute | Acknowledge</div>
                    <div className="p-2 border-l-4 border-yellow-500 rounded-r-md bg-yellow-500/10"><strong>Sensor Offline:</strong> Veg Room 2B - CO2 sensor last synced 2 hours ago. Mute</div>
                </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
                {/* Live Metrics */}
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center"><Thermometer className="mr-1"/>Temp</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">76°F</p><p className="text-xs text-green-600">Optimal</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center"><Wind className="mr-1"/>Humidity</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">58%</p><p className="text-xs text-green-600">Optimal</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center"><Cloud className="mr-1"/>CO₂</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">1100 <span className="text-lg">ppm</span></p><p className="text-xs text-green-600">Optimal</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">VPD</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">1.2 <span className="text-lg">kPa</span></p><p className="text-xs text-green-600">Optimal</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center"><Sun className="mr-1"/>Light (PPFD)</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">950</p><p className="text-xs text-green-600">Optimal</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center"><Droplet className="mr-1"/>Soil Moisture</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">45%</p><p className="text-xs text-green-600">Optimal</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center"><Beaker className="mr-1"/>Reservoir pH</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">6.1</p><p className="text-xs text-yellow-600">Acceptable</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center"><Gauge className="mr-1"/>Reservoir EC</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">1.8</p><p className="text-xs text-green-600">Optimal</p></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle className="text-base">Temperature & Humidity (24h)</CardTitle></CardHeader>
                    <CardContent className="h-64 flex items-center justify-center text-muted-foreground">[Time-Series Chart Placeholder]</CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-base">CO₂ Levels (24h)</CardTitle></CardHeader>
                    <CardContent className="h-64 flex items-center justify-center text-muted-foreground">[Time-Series Chart Placeholder]</CardContent>
                </Card>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle>Sensor Map Overlay</CardTitle>
                    <CardDescription>Placeholder for a visual heatmap of the selected grow room, showing sensor readings spatially.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-48 flex items-center justify-center bg-muted/50 rounded-md text-muted-foreground">
                    [Future Sensor Map/Heatmap Visualization]
                </CardContent>
             </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Plant Batch Modal */}
      <Dialog open={showCreateBatchModal} onOpenChange={setShowCreateBatchModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Plant Batch</DialogTitle>
            <DialogDescription>Enter details for the new plant batch. Batch ID will be auto-generated. METRC/RFID tags can be printed after creation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Basic form fields, actual implementation would use react-hook-form or similar */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="strain" className="text-right">Strain</Label>
              <Input id="strain" placeholder="e.g., Blue Dream" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input id="quantity" type="number" placeholder="e.g., 100" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origin" className="text-right">Origin</Label>
              <Input id="origin" placeholder="e.g., Seeds, Clones from PBX-00Y" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Room/Location</Label>
              <Input id="location" placeholder="e.g., Propagation Area 1" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-stage" className="text-right">Starting Stage</Label>
                <Select>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select starting stage..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Germination">Germination</SelectItem>
                        <SelectItem value="Vegetative">Vegetative</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-date" className="text-right">Start Date</Label>
                <Input id="start-date" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes-create" className="text-right">Notes</Label>
              <Textarea id="notes-create" placeholder="Optional notes for this batch..." className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateBatchModal(false)}>Cancel</Button>
            <Button onClick={handleCreateBatch}>Create Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
    



    

