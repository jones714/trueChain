import { Leaf } from "lucide-react";
import Link from "next/link";

export function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors duration-200">
      <Leaf className="h-7 w-7 text-primary" />
      {!collapsed && (
         <h1 className="text-xl font-bold whitespace-nowrap">TruCanalytix</h1>
      )}
    </Link>
  );
}
