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
  useSidebar
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { cn } from "@/lib/utils";

function SidebarInnerContent() {
  const { state: sidebarState, isMobile } = useSidebar();
  const isCollapsed = sidebarState === "collapsed" && !isMobile;

  return (
    <>
      <SidebarHeader className="p-4">
        <Logo collapsed={isCollapsed} />
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
  // Read sidebar state from cookie or localStorage for persistence
  const [defaultOpen, setDefaultOpen] = React.useState(true);

  React.useEffect(() => {
    const storedState = localStorage.getItem("sidebar_state_trucanalytix");
    if (storedState !== null) {
      setDefaultOpen(JSON.parse(storedState));
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    setDefaultOpen(open);
    localStorage.setItem("sidebar_state_trucanalytix", JSON.stringify(open));
  };
  
  return (
    <SidebarProvider defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
      <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarInnerContent />
      </Sidebar>
      <div className="flex flex-col flex-1 min-h-screen">
        <AppHeader />
        <SidebarInset> {/* This is the main content area wrapper */}
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
