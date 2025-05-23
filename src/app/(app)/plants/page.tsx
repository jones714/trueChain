
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
  PlusCircle,
  Filter,
  Sprout,
  Move,
  GitFork,
  Scissors,
  Trash2,
  Printer,
  Thermometer,
  Droplets,
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
import { useState } from "react";

// Dummy Data for Plant Batches
const initialPlantBatches = [
  {
    id: "B001-FL",
    tagId: "1A4060300000E0E000000234",
    strain: "Blue Dream",
    stage: "Flowering",
    plantCount: 50,
    location: "Flower Room 1A",
    dateCreated: "2023-09-15",
    expectedHarvest: "2023-11-20",
    status: "Active",
    metrcSync: "synced",
    stageProgress: 75,
  },
  {
    id: "B002-VG",
    tagId: "1A4060300000E0E000000235",
    strain: "OG Kush",
    stage: "Vegetative",
    plantCount: 120,
    location: "Veg Room 2B",
    dateCreated: "2023-10-01",
    expectedHarvest: "2023-12-15",
    status: "Active",
    metrcSync: "error",
    stageProgress: 40,
  },
  {
    id: "G003-GR",
    tagId: "1A4060300000E0E000000236",
    strain: "Sour Diesel",
    stage: "Germination",
    plantCount: 200,
    location: "Propagation Area",
    dateCreated: "2023-10-25",
    expectedHarvest: "2024-02-01",
    status: "Active",
    metrcSync: "synced",
    stageProgress: 10,
  },
  {
    id: "H004-HV",
    tagId: "1A4060300000E0E000000230",
    strain: "Girl Scout Cookies",
    stage: "Harvested",
    plantCount: 45,
    location: "Drying Room 1",
    dateCreated: "2023-08-01",
    expectedHarvest: "2023-10-10",
    status: "Harvested",
    metrcSync: "synced",
    stageProgress: 100,
  },
];

export default function PlantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all_stages');
  const [statusFilter, setStatusFilter] = useState('all_statuses');

  const filteredPlantBatches = initialPlantBatches.filter(batch => {
    const matchesSearchTerm = 
      batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.tagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.strain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = (stageFilter === 'all_stages') ? true : batch.stage === stageFilter;
    const matchesStatus = (statusFilter === 'all_statuses') ? true : batch.status === statusFilter;
    
    return matchesSearchTerm && matchesStage && matchesStatus;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Plant Management Overview"
        description="Comprehensive tracking and management of cannabis plants from seed to harvest.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Plant Batch
        </Button>
      </PageHeader>
      <CardDescription className="mb-4 text-sm text-muted-foreground">
        When creating a new batch: Select strain, number of plants, origin (if clones), room, and starting stage. The system auto-generates a unique ID and offers options to print METRC tags or QR codes.
      </CardDescription>

      {/* Filters and Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Input 
            placeholder="Search by Tag ID, Strain, Room..." 
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_stages">All Stages</SelectItem>
              <SelectItem value="Germination">Germination</SelectItem>
              <SelectItem value="Vegetative">Vegetative</SelectItem>
              <SelectItem value="Flowering">Flowering</SelectItem>
              <SelectItem value="Harvested">Harvested</SelectItem>
              <SelectItem value="Destroyed">Destroyed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_statuses">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Transferred">Transferred</SelectItem>
              <SelectItem value="Destroyed">Destroyed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><ListFilter className="mr-2 h-4 w-4" />More Filters</Button>
        </CardContent>
      </Card>

      {/* Plant Batch Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Plant Batches Overview</CardTitle>
          <CardDescription>
            Detailed list of all plant batches. Click Batch ID for detailed view including compliance metadata (METRC Tag, License #, source, action history, grower notes, photo uploads).
            Quick actions available: Move, Change Stage, Clone, Harvest, Destroy, Print Tags.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Archive className="inline h-4 w-4 mr-1"/>Batch ID</TableHead>
                <TableHead><Sprout className="inline h-4 w-4 mr-1"/>Strain</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Plant Count</TableHead>
                <TableHead><MapPin className="inline h-4 w-4 mr-1"/>Location</TableHead>
                <TableHead><CalendarDays className="inline h-4 w-4 mr-1"/>Created</TableHead>
                <TableHead>Exp. Harvest</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>METRC Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlantBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium hover:underline cursor-pointer">{batch.id}</TableCell>
                  <TableCell>{batch.strain}</TableCell>
                  <TableCell>
                    {batch.stage}
                    <Progress value={batch.stageProgress} className="h-1.5 mt-1" />
                  </TableCell>
                  <TableCell>{batch.plantCount}</TableCell>
                  <TableCell>{batch.location}</TableCell>
                  <TableCell>{batch.dateCreated}</TableCell>
                  <TableCell>{batch.expectedHarvest}</TableCell>
                  <TableCell><Badge variant={batch.status === "Active" || batch.status === "Harvested" ? "default" : "secondary"} className={batch.status === "Harvested" ? "bg-blue-500 dark:bg-blue-700" : ""}>{batch.status}</Badge></TableCell>
                  <TableCell>
                    {batch.metrcSync === "synced" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="Move Plants"><Move className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Change Stage"><Sprout className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Harvest"><Scissors className="h-4 w-4" /></Button>
                    {/* More actions (Clone, Destroy, Print Tags, View Details) can be in a DropdownMenu */}
                  </TableCell>
                </TableRow>
              ))}
              {filteredPlantBatches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    No plant batches found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Visual Charts & KPIs and Environmental Metrics */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Key Metrics & Activity</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Active Plants</CardTitle>
                <Sprout className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,580</div>
                <p className="text-xs text-muted-foreground">+50 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stage Distribution</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {/* Placeholder for Pie Chart */}
                <div className="text-center text-muted-foreground py-4">[Pie Chart: Germ: 15%, Veg: 40%, Flower: 45%]</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Days to Harvest</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75 Days</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Strain (Yield)</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">Blue Dream</div>
                <p className="text-xs text-muted-foreground">Avg. 2.5 lbs/plant</p>
              </CardContent>
            </Card>
            <Card className="sm:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recent Plant Activity</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1 pt-0">
                <div className="flex items-center gap-2"><Activity className="h-3 w-3 text-muted-foreground" /><p>Batch B001-FL moved to Flower Room 1A.</p></div>
                <div className="flex items-center gap-2"><GitFork className="h-3 w-3 text-muted-foreground" /><p>5 Clones created from B002-VG.</p></div>
                <div className="flex items-center gap-2"><Trash2 className="h-3 w-3 text-muted-foreground" /><p>G003-GR: 10 seeds failed germination (logged as waste).</p></div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environmental Metrics</CardTitle>
            <CardDescription>Real-time sensor data (if integrated).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center"><Thermometer className="h-4 w-4 mr-2 text-red-500"/><span className="text-sm">Avg. Temp</span></div>
              <span className="text-sm font-semibold">75°F</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center"><Droplets className="h-4 w-4 mr-2 text-blue-500"/><span className="text-sm">Avg. Humidity</span></div>
              <span className="text-sm font-semibold">55%</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center"><Cloud className="h-4 w-4 mr-2 text-gray-500"/><span className="text-sm">Avg. CO2</span></div>
              <span className="text-sm font-semibold">800 ppm</span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700">
              <div className="flex items-center"><Bug className="h-4 w-4 mr-2"/><span className="text-sm">Pest Alert</span></div>
              <span className="text-sm font-semibold">Veg Room 2B</span>
            </div>
            <Button variant="link" size="sm" className="p-0 h-auto text-primary">View Sensor Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

