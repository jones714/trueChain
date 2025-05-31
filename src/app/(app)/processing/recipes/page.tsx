
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircle, NotebookText, ListChecks, Edit, Trash2, CookingPot, FlaskConical, PercentCircle, BookOpen, MoreHorizontal, Link2, History, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipeForForm, setSelectedRecipeForForm] = useState<Recipe | null>(null); // Renamed to avoid conflict
  const [showAssignToProductionModal, setShowAssignToProductionModal] = useState(false);
  const [currentRecipeForAction, setCurrentRecipeForAction] = useState<Recipe | null>(null);


  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.productType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateNewRecipe = () => {
    setSelectedRecipeForForm({
      id: `REC${recipes.length + 1}`, 
      name: "", 
      productType: "", 
      version: "1.0", 
      lastUpdated: new Date().toISOString().split('T')[0], 
      status: "Draft"
    });
  };

  const handleSaveRecipe = () => {
    // TODO: Call saveRecipe(data)
    toast({ title: "Success", description: `Recipe ${selectedRecipeForForm?.name || 'New Recipe'} saved.` });
    setSelectedRecipeForForm(null); // Close the form view
    // Add logic to update the main recipes list if it's a new recipe or an edit
  };

  const handleRowAction = (action: string, recipe: Recipe) => {
    setCurrentRecipeForAction(recipe);
    if (action === "edit") setSelectedRecipeForForm(recipe);
    else if (action === "assignToProduction") setShowAssignToProductionModal(true);
    else if (action === "viewHistory") toast({ title: "Info", description: `Viewing production history for ${recipe.name}`});
    else if (action === "newVersion") toast({ title: "Info", description: `Creating new version for ${recipe.name}`});
    else if (action === "archive") {
        // TODO: Call backend to archive recipe
        toast({ title: "Archived", description: `${recipe.name} archived.`, variant: "destructive"});
    }
  };
  
  const handleSubmitAssignToProduction = () => {
    // TODO: Backend logic to assign recipe
    toast({title: "Success", description: `Recipe ${currentRecipeForAction?.name} assigned to production.`});
    setShowAssignToProductionModal(false);
    setCurrentRecipeForAction(null);
  };


  return (
    <PageContainer>
      <PageHeader 
        title="Recipe & Formula Management" 
        description="Define, version, and manage product formulas for consistent manufacturing of edibles, tinctures, concentrates, topicals, and other infused products. Link to production logs and QA results."
      >
        <Button onClick={handleCreateNewRecipe}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Recipe
        </Button>
      </PageHeader>

    {selectedRecipeForForm ? (
        // Detailed Recipe Creation/Edit View
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{selectedRecipeForForm.id.startsWith('REC') && selectedRecipeForForm.name ? `Edit Recipe: ${selectedRecipeForForm.name}` : 'Create New Recipe'}</CardTitle>
                    <Button variant="ghost" onClick={() => setSelectedRecipeForForm(null)}>Close Editor</Button>
                </div>
                <CardDescription>Define input materials, ingredients, equipment, SOPs, and expected outcomes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div><Label htmlFor="recipe-name">Recipe Name</Label><Input id="recipe-name" placeholder="e.g., CBD Tincture - 500mg Peppermint" defaultValue={selectedRecipeForForm.name}/></div>
                    <div><Label htmlFor="recipe-product-type">Product Type</Label><Input id="recipe-product-type" placeholder="e.g., Tincture, Edible" defaultValue={selectedRecipeForForm.productType}/></div>
                    <div><Label htmlFor="recipe-version">Version</Label><Input id="recipe-version" placeholder="e.g., 1.0" defaultValue={selectedRecipeForForm.version}/></div>
                    <div>
                        <Label htmlFor="recipe-status">Status</Label>
                        <Select defaultValue={selectedRecipeForForm.status}>
                            <SelectTrigger id="recipe-status"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
                    <div><Label htmlFor="recipe-est-yield">Estimated Yield</Label><Input id="recipe-est-yield" placeholder="e.g., 100 units or 85% by weight" defaultValue={selectedRecipeForForm.estimatedYield}/></div>
                    <div><Label htmlFor="recipe-exp-potency">Expected Potency</Label><Input id="recipe-exp-potency" placeholder="e.g., 10mg THC/unit" defaultValue={selectedRecipeForForm.expectedPotency}/></div>
                </div>
                <Separator/>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="w-full sm:w-auto" onClick={() => toast({title:"Placeholder", description:"Link to QA Test Results functionality."})}><Link2 className="mr-2 h-4 w-4"/>Link to QA Test Results</Button>
                    <Button className="w-full sm:w-auto" variant="outline" onClick={() => toast({title:"Placeholder", description:"View Production Logs functionality."})}><History className="mr-2 h-4 w-4"/>View Production Logs</Button>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedRecipeForForm(null)}>Cancel</Button>
                    <Button onClick={handleSaveRecipe}>Save Recipe</Button>
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
                  <TableRow key={recipe.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium" onClick={() => handleRowAction("edit", recipe)}>{recipe.id}</TableCell>
                    <TableCell onClick={() => handleRowAction("edit", recipe)}>{recipe.name}</TableCell>
                    <TableCell onClick={() => handleRowAction("edit", recipe)}>{recipe.productType}</TableCell>
                    <TableCell onClick={() => handleRowAction("edit", recipe)}>{recipe.version}</TableCell>
                    <TableCell onClick={() => handleRowAction("edit", recipe)}>{recipe.estimatedYield || "N/A"}</TableCell>
                    <TableCell onClick={() => handleRowAction("edit", recipe)}>{recipe.expectedPotency || "N/A"}</TableCell>
                    <TableCell onClick={() => handleRowAction("edit", recipe)}><span className={`px-2 py-1 text-xs rounded-full ${recipe.status === 'Active' ? 'bg-green-100 text-green-700' : recipe.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{recipe.status}</span></TableCell>
                    <TableCell onClick={() => handleRowAction("edit", recipe)}>{recipe.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions for {recipe.name}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleRowAction("edit", recipe)}><Edit className="mr-2 h-4 w-4" />Edit / View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRowAction("assignToProduction", recipe)}><CookingPot className="mr-2 h-4 w-4" />Assign to Production Batch</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRowAction("viewHistory", recipe)}><BookOpen className="mr-2 h-4 w-4" />View Production History</DropdownMenuItem>
                          <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={() => handleRowAction("newVersion", recipe)}><PlusCircle className="mr-2 h-4 w-4" />Create New Version</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive hover:!text-destructive focus:!text-destructive focus:!bg-destructive/10" onClick={() => handleRowAction("archive", recipe)}>
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

    {/* Assign Recipe to Production Modal */}
    <Dialog open={showAssignToProductionModal} onOpenChange={setShowAssignToProductionModal}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Assign Recipe: {currentRecipeForAction?.name}</DialogTitle>
                <DialogDescription>Select a processing batch to assign this recipe to.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="production-batch-select">Processing Batch ID</Label>
                <Input id="production-batch-select" placeholder="Enter or select batch ID..."/>
                {/* TODO: Potentially replace Input with a Select populated with active processing batches */}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => {setShowAssignToProductionModal(false); setCurrentRecipeForAction(null);}}>Cancel</Button>
                <Button onClick={handleSubmitAssignToProduction}>Assign to Batch</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    </PageContainer>
  );
}
    
