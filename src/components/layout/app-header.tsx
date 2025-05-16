"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  // Find current page title logic (can be improved)
  let currentPageTitle = "Dashboard"; // Default title
  
  const allNavItems = [...siteConfig.mainNav, ...siteConfig.adminNav];

  function findItemRecursive(items: typeof allNavItems, currentPath: string): string | null {
    for (const item of items) {
      if (item.href === currentPath) {
        return item.title;
      }
      if (item.items) {
        const foundInChildren = findItemRecursive(item.items, currentPath);
        if (foundInChildren) return foundInChildren;
      }
    }
    return null;
  }

  const foundTitle = findItemRecursive(allNavItems, pathname);
  if (foundTitle) {
    currentPageTitle = foundTitle;
  } else if (pathname.startsWith("/admin")) {
    currentPageTitle = "Admin"; // Fallback for deeper admin pages
  }


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-none px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2">
          {isMobile && <SidebarTrigger />}
          {!isMobile && (
            <div className="hidden md:block">
              {/* Breadcrumbs or page title can go here if not using Logo */}
            </div>
          )}
           <div className={cn("md:hidden")}>
             <Logo collapsed={true}/>
           </div>
           <h1 className="text-lg font-semibold hidden md:block">{currentPageTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Add any header actions here if needed */}
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
