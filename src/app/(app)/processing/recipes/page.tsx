
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, NotebookText, ListChecks, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dummy data for recipes
const recipes = [
  { id: "REC001", name: "CBD Tincture - 500mg Peppermint", productType: "Tincture", version: "1.2", lastUpdated: "2023-10-15" },
  { id: "REC002", name: "Gummy Bears - 10mg THC Strawberry", productType: "Edible", version: "2.0", lastUpdated: "2023-11-01" },
  { id: "REC003", name: "Relief Balm - CBD/THC 1:1 Lavender", productType: "Topical", version: "1.0", lastUpdated: "2023-09-20" },
];

export default function RecipeManagementPage() {
  return (
    <PageContainer>
      <PageHeader title="Recipe Management" description="Define, manage, and version control product formulas for consistent manufacturing.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Recipe
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
                <CardTitle>Product Formulas</CardTitle>
                <CardDescription>Manage recipes for edibles, tinctures, concentrates, and other manufactured products.</CardDescription>
            </div>
            <Input placeholder="Search recipes..." className="max-w-xs" />
          </div>
        </CardHeader>
        <CardContent>
          {recipes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipe ID</TableHead>
                  <TableHead>Recipe Name</TableHead>
                  <TableHead>Product Type</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell className="font-medium">{recipe.id}</TableCell>
                    <TableCell>{recipe.name}</TableCell>
                    <TableCell>{recipe.productType}</TableCell>
                    <TableCell>{recipe.version}</TableCell>
                    <TableCell>{recipe.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ListChecks className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Recipe</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
              <NotebookText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2">No recipes defined yet. Click "Create New Recipe" to get started.</p>
              <p className="text-xs mt-1">Define ingredients, quantities, steps, and SOPs for each product formula.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
