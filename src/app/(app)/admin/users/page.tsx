import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserCog, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const users = [
  { id: "USR001", name: "Alice Wonderland", email: "alice@example.com", role: "Admin", status: "Active", avatar: "https://placehold.co/40x40.png?text=AW", dataAiHint: "person avatar" },
  { id: "USR002", name: "Bob The Builder", email: "bob@example.com", role: "Cultivator", status: "Active", avatar: "https://placehold.co/40x40.png?text=BB", dataAiHint: "person construction" },
  { id: "USR003", name: "Charlie Chaplin", email: "charlie@example.com", role: "Retail Clerk", status: "Inactive", avatar: "https://placehold.co/40x40.png?text=CC", dataAiHint: "person suit" },
  { id: "USR004", name: "Diana Prince", email: "diana@example.com", role: "QA/Lab", status: "Active", avatar: "https://placehold.co/40x40.png?text=DP", dataAiHint: "woman hero" },
];

export default function UserManagementPage() {
  return (
    <PageContainer>
      <PageHeader title="User Management" description="Manage user accounts, roles, and permissions.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>View, edit, or deactivate user accounts.</CardDescription>
                </div>
                <Input placeholder="Search users..." className="max-w-xs" />
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.dataAiHint} />
                            <AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-1 text-xs rounded-full",
                       user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300')}>
                        {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <UserCog className="h-4 w-4" />
                      <span className="sr-only">Manage Roles</span>
                    </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                       <span className="sr-only">Edit User</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Deactivate User</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {users.length === 0 && (
            <div className="mt-4 p-8 border border-dashed rounded-md text-center text-muted-foreground">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No users found. Click "Add New User" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
