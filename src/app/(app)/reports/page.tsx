
'use client';

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, Filter, Brain, AlertTriangle, Map, TrendingUp } from "lucide-react"; // Added TrendingUp for Yield Efficiency
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "January", yield: 186, sales: 80, efficiency: 0.15 },
  { month: "February", yield: 305, sales: 200, efficiency: 0.18 },
  { month: "March", yield: 237, sales: 120, efficiency: 0.16 },
  { month: "April", yield: 73, sales: 190, efficiency: 0.12 },
  { month: "May", yield: 209, sales: 130, efficiency: 0.17 },
  { month: "June", yield: 214, sales: 140, efficiency: 0.19 },
];

const chartConfig = {
  yield: {
    label: "Harvest Yield (kg)",
    color: "hsl(var(--primary))",
  },
  sales: {
    label: "Sales ($K)",
    color: "hsl(var(--accent))",
  },
  efficiency: {
    label: "Extraction Efficiency (%)",
    color: "hsl(var(--chart-2))", // Using another chart color
  }
};

export default function ReportsPage() {
  return (
    <PageContainer>
      <PageHeader title="Interactive Reports & Analytics" description="Visualize yields, sales, inventory, compliance, and gain deeper business insights.">
         <div className="flex items-center space-x-2">
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Button>
                <Download className="mr-2 h-4 w-4" /> Export Reports
            </Button>
        </div>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Harvest Yields Over Time</CardTitle>
            <CardDescription>Monthly harvest yields in kilograms.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="yield" fill="var(--color-yield)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
            <CardDescription>Monthly sales performance in thousands of dollars.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
         <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Compliance History</CardTitle>
                <CardDescription>Overview of compliance events and audit logs.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Table or visualization of compliance history, pass/fail rates for testing, METRC sync status, etc.</p>
                <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2">Compliance data visualizations will appear here.</p>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
            <CardTitle>Yield &amp; Efficiency Reports</CardTitle>
            <CardDescription>Track extraction efficiency by method, strain, or processor.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Analyze the efficiency of your extraction processes to optimize output and quality. Compare different methods, input materials (strains), and operator performance.</p>
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <h4 className="font-semibold mb-2 text-md">Extraction Yield Efficiency (%)</h4>
                     <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData} layout="vertical">
                            <CartesianGrid horizontal={false} />
                            <XAxis type="number" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                            <YAxis dataKey="month" type="category" tickLine={false} axisLine={false} />
                            <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="efficiency" fill="var(--color-efficiency)" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
                <div className="p-4 border rounded-lg shadow-sm bg-muted/30">
                    <TrendingUp className="h-6 w-6 text-primary mb-2" />
                    <h4 className="font-semibold text-md mb-1">Key Efficiency Metrics</h4>
                    <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 mt-2">
                        <li>Average yield per batch: <strong>17.5%</strong></li>
                        <li>Best performing strain: <strong>Strain A (22% avg)</strong></li>
                        <li>Most efficient method: <strong>CO2 Extraction (avg +2% vs Ethanol)</strong></li>
                        <li>Processor performance variance: <strong>+/- 3%</strong></li>
                    </ul>
                    <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs mt-3">View Detailed Efficiency Breakdown</Button>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
            <CardTitle>Business Intelligence Insights</CardTitle>
            <CardDescription>Aggregate KPIs and advanced analytics for strategic decision-making.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg shadow-sm">
                <Brain className="h-6 w-6 text-primary mb-2" />
                <h4 className="font-semibold text-md mb-1">Insights Dashboard</h4>
                <p className="text-xs text-muted-foreground">
                    Role-based KPIs: best-selling SKUs, yield per batch, failed tests by vendor, operational efficiency metrics, and more.
                </p>
                 <div className="mt-3 p-4 bg-muted/50 rounded-md text-center text-xs text-muted-foreground">
                    Detailed KPI visualizations here.
                </div>
            </div>
             <div className="p-4 border rounded-lg shadow-sm">
                <AlertTriangle className="h-6 w-6 text-primary mb-2" />
                <h4 className="font-semibold text-md mb-1">Predictive Restock Alerts</h4>
                <p className="text-xs text-muted-foreground">
                    Machine learning-based projections for low inventory alerts, optimizing stock levels and preventing shortages.
                </p>
                <div className="mt-3 p-4 bg-muted/50 rounded-md text-center text-xs text-muted-foreground">
                    ML-driven alert system interface.
                </div>
            </div>
             <div className="p-4 border rounded-lg shadow-sm">
                <Map className="h-6 w-6 text-primary mb-2" />
                <h4 className="font-semibold text-md mb-1">Sales Heatmaps</h4>
                <p className="text-xs text-muted-foreground">
                    Visual time-based sales data (per hour, day, month) to identify peak periods, customer traffic patterns, and product popularity by time.
                </p>
                <div className="mt-3 p-4 bg-muted/50 rounded-md text-center text-xs text-muted-foreground">
                    Interactive heatmap visualization.
                </div>
            </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
