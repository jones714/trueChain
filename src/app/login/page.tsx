"use client"; // This will be a client component for form handling

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, LogIn } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle login logic here
    // For now, redirect to dashboard (in a real app, this would happen after successful auth)
    window.location.href = "/dashboard"; 
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center items-center mb-4">
            <Leaf className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold ml-2 text-foreground">TruChain</h1>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="yourname@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" required placeholder="••••••••" />
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="text-sm font-normal text-muted-foreground">
                Remember me
                </Label>
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center">
           <p className="text-xs text-muted-foreground">
            By logging in, you agree to our <Link href="#" className="underline hover:text-primary">Terms of Service</Link> and <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>.
          </p>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="#" className="font-semibold text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
