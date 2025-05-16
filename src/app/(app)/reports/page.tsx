import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, Filter } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "January", yield: 186, sales: 80 },
  { month: "February", yield: 305, sales: 200 },
  { month: "March", yield: 237, sales: 120 },
  { month: "April", yield: 73, sales: 190 },
  { month: "May", yield: 209, sales: 130 },
  { month: "June", yield: 214, sales: 140 },
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
};

export default function ReportsPage() {
  return (
    <PageContainer>
      <PageHeader title="Interactive Reports" description="Visualize harvest yields, sales trends, inventory, and compliance.">
         <div className="flex items-center space-x-2">
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Button>
                <Download className="mr-2 h-4 w-4" /> Export All Reports
            </Button>
        </div>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
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
        <Card>
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
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Compliance History</CardTitle>
            <CardDescription>Overview of compliance events and audit logs.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Table or visualization of compliance history, pass/fail rates for testing, METRC sync status, etc.</p>
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">Compliance data visualizations will appear here.</p>
            </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
