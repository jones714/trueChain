
"use client";

import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { PlusCircle, NotebookText, ListChecks, Edit, Trash2, CookingPot, FlaskConical, PercentCircle, BookOpen, MoreHorizontal, Link2, History, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface Recipe {
  id: string;
  name: string;
  productType: string; // Edible, Tincture, Concentrate, Topical, Vape Cartridge
  version: string;
  lastUpdated: string;
  status: "Draft" | "Active" | "Archived";
  estimatedYield?: string; // e.g., "Approx. 100 units" or "80% by weight"
  expectedPotency?: string; // e.g., "10mg THC/unit" or "75% CBD"
}

const initialRecipes: Recipe[] = [
  { id: "REC001", name: "CBD Tincture - 500mg Peppermint", productType: "Tincture", version: "1.2", lastUpdated: "2023-10-15", status: "Active", estimatedYield: "200 bottles (30ml)", expectedPotency: "16.7mg CBD/ml" },
  { id: "REC002", name: "Gummy Bears - 10mg THC Strawberry", productType: "Edible", version: "2.0", lastUpdated: "2023-11-01", status: "Active", estimatedYield: "1000 gummies", expectedPotency: "10mg THC/gummy" },
  { id: "REC003", name: "Relief Balm - CBD/THC 1:1 Lavender", productType: "Topical", version: "1.0", lastUpdated: "2023-09-20", status: "Draft", estimatedYield: "50 jars (2oz)", expectedPotency: "50mg CBD / 50mg THC per jar" },
  { id: "REC004", name: "Full Spectrum Vape Cartridge - OG Kush", productType: "Vape Cartridge", version: "1.5", lastUpdated: "2023-11-05", status: "Archived", estimatedYield: "500 cartridges (1g)", expectedPotency: "85% THC" },
];


export default function RecipeManagementPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.productType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Placeholder for selected recipe for detailed view/edit
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <PageContainer>
      <PageHeader 
        title="Recipe & Formula Management" 
        description="Define, version, and manage product formulas for consistent manufacturing of edibles, tinctures, concentrates, topicals, and other infused products. Link to production logs and QA results."
      >
        <Button onClick={() => setSelectedRecipe({id: `REC${recipes.length + 1}`, name: "", productType: "", version: "1.0", lastUpdated: new Date().toISOString().split('T')[0], status: "Draft"})}> {/* Basic new recipe object */}
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Recipe
        </Button>
      </PageHeader>

    {selectedRecipe ? (
        // Detailed Recipe Creation/Edit View
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{selectedRecipe.id ? `Edit Recipe: ${selectedRecipe.name || 'New Recipe'}` : 'Create New Recipe'}</CardTitle>
                    <Button variant="ghost" onClick={() => setSelectedRecipe(null)}>Close</Button>
                </div>
                <CardDescription>Define input materials, ingredients, equipment, SOPs, and expected outcomes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div><Label htmlFor="recipe-name">Recipe Name</Label><Input id="recipe-name" placeholder="e.g., CBD Tincture - 500mg Peppermint" defaultValue={selectedRecipe.name}/></div>
                    <div><Label htmlFor="recipe-product-type">Product Type</Label><Input id="recipe-product-type" placeholder="e.g., Tincture, Edible" defaultValue={selectedRecipe.productType}/></div>
                    <div><Label htmlFor="recipe-version">Version</Label><Input id="recipe-version" placeholder="e.g., 1.0" defaultValue={selectedRecipe.version}/></div>
                    <div><Label htmlFor="recipe-status">Status</Label><Input id="recipe-status" placeholder="Draft, Active, Archived" defaultValue={selectedRecipe.status}/></div>
                </div>
                <Separator/>
                <div>
                    <h3 className="text-md font-semibold mb-2 flex items-center"><CookingPot className="mr-2 h-5 w-5 text-primary"/>Input Materials & Ingredients</h3>
                    <Textarea placeholder="List all input materials (e.g., Cannabis Extract - 100g @ 70% THC) and other ingredients with quantities and specifications." rows={3}/>
                    <Button variant="outline" size="sm" className="mt-2">Add Ingredient Line</Button>
                </div>
                <div>
                    <h3 className="text-md font-semibold mb-2 flex items-center"><SlidersHorizontal className="mr-2 h-5 w-5 text-primary"/>Equipment & SOPs</h3>
                    <Textarea placeholder="Specify equipment used (e.g., Magnetic Stirrer, Homogenizer) and detailed Standard Operating Procedures (SOPs) for each step of the manufacturing process." rows={4}/>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div><Label htmlFor="recipe-est-yield">Estimated Yield</Label><Input id="recipe-est-yield" placeholder="e.g., 100 units or 85% by weight" defaultValue={selectedRecipe.estimatedYield}/></div>
                    <div><Label htmlFor="recipe-exp-potency">Expected Potency</Label><Input id="recipe-exp-potency" placeholder="e.g., 10mg THC/unit" defaultValue={selectedRecipe.expectedPotency}/></div>
                </div>
                <Separator/>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="w-full sm:w-auto"><Link2 className="mr-2 h-4 w-4"/>Link to QA Test Results (Placeholder)</Button>
                    <Button className="w-full sm:w-auto" variant="outline"><History className="mr-2 h-4 w-4"/>View Production Logs (Placeholder)</Button>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedRecipe(null)}>Cancel</Button>
                    <Button>Save Recipe</Button>
                </div>
            </CardContent>
        </Card>
    ) : (
      // Recipe List View
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
                <CardTitle>Product Formulas & Recipes</CardTitle>
                <CardDescription>Manage defined recipes for all manufactured cannabis products.</CardDescription>
            </div>
            <Input 
                placeholder="Search recipes by name or type..." 
                className="max-w-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredRecipes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipe ID</TableHead>
                  <TableHead>Recipe Name</TableHead>
                  <TableHead>Product Type</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Est. Yield</TableHead>
                  <TableHead>Exp. Potency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecipes.map((recipe) => (
                  <TableRow key={recipe.id} onClick={() => setSelectedRecipe(recipe)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{recipe.id}</TableCell>
                    <TableCell>{recipe.name}</TableCell>
                    <TableCell>{recipe.productType}</TableCell>
                    <TableCell>{recipe.version}</TableCell>
                    <TableCell>{recipe.estimatedYield || "N/A"}</TableCell>
                    <TableCell>{recipe.expectedPotency || "N/A"}</TableCell>
                    <TableCell><span className={`px-2 py-1 text-xs rounded-full ${recipe.status === 'Active' ? 'bg-green-100 text-green-700' : recipe.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{recipe.status}</span></TableCell>
                    <TableCell>{recipe.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Recipe Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedRecipe(recipe)}><Edit className="mr-2 h-4 w-4" />Edit / View Details</DropdownMenuItem>
                          <DropdownMenuItem><CookingPot className="mr-2 h-4 w-4" />Assign to Production Batch</DropdownMenuItem>
                          <DropdownMenuItem><BookOpen className="mr-2 h-4 w-4" />View Production History</DropdownMenuItem>
                          <DropdownMenuSeparator />
                           <DropdownMenuItem><PlusCircle className="mr-2 h-4 w-4" />Create New Version</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive hover:!text-destructive focus:!text-destructive focus:!bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />Archive Recipe
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
              <NotebookText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2">No recipes found matching your criteria, or no recipes defined yet.</p>
              <p className="text-xs mt-1">Click "Create New Recipe" to define ingredients, quantities, SOPs, equipment, expected yield, and potency for each product formula.</p>
            </div>
          )}
        </CardContent>
      </Card>
    )}
    </PageContainer>
  );
}

    