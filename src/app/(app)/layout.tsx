
"use client";

import { AppHeader } from "@/components/layout/app-header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Logo } from "@/components/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  useSidebar,
  SidebarTrigger // Added SidebarTrigger import
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";


function SidebarPlaceholderContent() {
  const isCollapsed = false; // Placeholder always renders as "expanded" initially

  return (
    <>
      <SidebarHeader className="p-4 flex items-center justify-between">
        {!isCollapsed && <Logo collapsed={isCollapsed} />}
        <div className={cn(isCollapsed && "w-full flex justify-center")}>
            {/* Placeholder for trigger, or could be a static icon */}
            <Skeleton className="h-7 w-7" />
        </div>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent>
          {siteConfig.mainNav.map((item, index) => (
            <Skeleton key={`main-placeholder-${item.title || index}`} className="h-9 w-full mb-1" />
          ))}
        </SidebarContent>
        <Separator className="my-4" />
        <SidebarContent>
           <p className={cn("px-4 pb-2 text-xs font-medium text-sidebar-foreground/70", isCollapsed && "text-center")}>
            {isCollapsed ? "ADM" : "Administration"}
           </p>
           {siteConfig.adminNav.map((item, index) => (
             <Skeleton key={`admin-placeholder-${item.title || index}`} className="h-9 w-full mb-1" />
           ))}
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className="p-4 mt-auto">
        {!isCollapsed && (
          <p className="text-xs text-sidebar-foreground/70">
            © {new Date().getFullYear()} TruCanalytix
          </p>
        )}
      </SidebarFooter>
    </>
  );
}


function SidebarInnerContent() {
  const { state: sidebarState, isMobile } = useSidebar();
  const isCollapsed = sidebarState === "collapsed" && !isMobile;

  return (
    <>
      <SidebarHeader className="p-4 flex items-center justify-between">
        {!isCollapsed && <Logo collapsed={isCollapsed} />}
        <div className={cn(isCollapsed && "w-full flex justify-center")}>
            {/* This trigger is for desktop, always visible in the sidebar itself */}
            {/* Hide on mobile because AppHeader already provides one */}
            {!isMobile && <SidebarTrigger />}
        </div>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent>
          <SidebarNav items={siteConfig.mainNav} />
        </SidebarContent>
        <Separator className="my-4" />
        <SidebarContent>
           <p className={cn("px-4 pb-2 text-xs font-medium text-sidebar-foreground/70", isCollapsed && "text-center")}>
            {isCollapsed ? "ADM" : "Administration"}
           </p>
          <SidebarNav items={siteConfig.adminNav} />
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className="p-4 mt-auto">
        {/* Footer content like version number or quick links */}
        {!isCollapsed && (
          <p className="text-xs text-sidebar-foreground/70">
            © {new Date().getFullYear()} TruCanalytix
          </p>
        )}
      </SidebarFooter>
    </>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [defaultOpen, setDefaultOpen] = React.useState(true); // Default to true (expanded) for SSR
  const [sidebarSettingsLoaded, setSidebarSettingsLoaded] = React.useState(false);


  React.useEffect(() => {
    const storedState = localStorage.getItem("sidebar_state_trucanalytix");
    if (storedState !== null) {
      setDefaultOpen(JSON.parse(storedState));
    }
    setSidebarSettingsLoaded(true);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setDefaultOpen(open);
    localStorage.setItem("sidebar_state_trucanalytix", JSON.stringify(open));
  };
  
  return (
    <SidebarProvider defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
      <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        {sidebarSettingsLoaded ? <SidebarInnerContent /> : <SidebarPlaceholderContent />}
      </Sidebar>
      <div className="flex flex-col flex-1 min-h-screen overflow-x-hidden"> {/* Added overflow-x-hidden */}
        <AppHeader />
        <SidebarInset> {/* This is the main content area wrapper */}
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
