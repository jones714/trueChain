
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Droplets, DollarSign, BarChart3, Download, Filter, Settings, Edit } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart } from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const powerUsageData = [
    { name: "Veg Room 1", usage: 450, cost: 54.00, perSqFt: 2.25 },
    { name: "Flower Room 2A", usage: 1200, cost: 144.00, perSqFt: 6.00 },
    { name: "Processing", usage: 300, cost: 36.00, perSqFt: 1.50 },
    { name: "Drying Room A", usage: 150, cost: 18.00, perSqFt: 0.75 },
];

const waterUsageData = [
    { name: "Veg Room 1", usage: 200, cost: 2.00, perPlant: 1.0 },
    { name: "Flower Room 2A", usage: 800, cost: 8.00, perPlant: 4.0 },
    { name: "Processing", usage: 50, cost: 0.50, perPlant: null },
];

const historicalUsageData = [
  { day: "Mon", power: 2100, water: 1050 },
  { day: "Tue", power: 2200, water: 1100 },
  { day: "Wed", power: 2150, water: 1075 },
  { day: "Thu", power: 2300, water: 1150 },
  { day: "Fri", power: 2350, water: 1175 },
  { day: "Sat", power: 2400, water: 1200 },
  { day: "Sun", power: 2250, water: 1125 },
];

const chartConfigPower = {
  usage: { label: "Power (kWh)", color: "hsl(var(--chart-2))" },
};
const chartConfigWater = {
  usage: { label: "Water (Gal)", color: "hsl(var(--chart-1))" },
};

export default function EnvironmentalDashboardPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Environmental & Utility Usage" 
        description="Monitor power and water consumption, estimate costs, and track resource usage across all zones."
      >
        <div className="flex items-center space-x-2">
            <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filters</Button>
            <Button><Download className="mr-2 h-4 w-4" /> Export Reports</Button>
        </div>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Power Usage (24h)</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">2,100 kWh</div>
                <p className="text-xs text-muted-foreground">Across all facilities</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Water Usage (24h)</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1,050 Gal</div>
                <p className="text-xs text-muted-foreground">Irrigation & facility use</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estimated Monthly Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$8,125.00</div>
                <p className="text-xs text-muted-foreground">Based on current rates</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utility Rate Settings</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-xs">Power: $0.12/kWh</p>
                <p className="text-xs">Water: $0.01/Gal</p>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1">
                    <Edit className="mr-1 h-3 w-3"/> Edit Rates
                </Button>
            </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
            <CardTitle>Historical Usage (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{...chartConfigPower, ...chartConfigWater}} className="min-h-[300px] w-full">
                <LineChart data={historicalUsageData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="hsl(var(--chart-2))" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-1))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line yAxisId="left" type="monotone" dataKey="power" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Power (kWh)" />
                    <Line yAxisId="right" type="monotone" dataKey="water" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Water (Gal)" />
                </LineChart>
            </ChartContainer>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="power" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="power"><Zap className="mr-2 h-4 w-4"/>Power Consumption</TabsTrigger>
          <TabsTrigger value="water"><Droplets className="mr-2 h-4 w-4"/>Water Usage</TabsTrigger>
        </TabsList>
        <TabsContent value="power">
          <Card>
            <CardHeader>
              <CardTitle>Power Usage by Zone</CardTitle>
              <CardDescription>Daily electricity consumption breakdown per cultivation or processing area.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone / Room</TableHead>
                    <TableHead>Usage (kWh)</TableHead>
                    <TableHead>Estimated Cost</TableHead>
                    <TableHead>Usage per sq ft (kWh)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {powerUsageData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.usage.toFixed(2)}</TableCell>
                      <TableCell>${row.cost.toFixed(2)}</TableCell>
                      <TableCell>{row.perSqFt.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="water">
          <Card>
            <CardHeader>
              <CardTitle>Water Usage by Zone</CardTitle>
              <CardDescription>Daily water consumption from irrigation and other facility activities.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone / Room</TableHead>
                    <TableHead>Usage (Gallons)</TableHead>
                    <TableHead>Estimated Cost</TableHead>
                    <TableHead>Usage per Plant (Gal)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waterUsageData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.usage.toFixed(2)}</TableCell>
                      <TableCell>${row.cost.toFixed(2)}</TableCell>
                      <TableCell>{row.perPlant ? row.perPlant.toFixed(2) : "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
