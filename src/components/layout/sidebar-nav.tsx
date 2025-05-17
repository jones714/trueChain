"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarNavItem } from "@/types/nav";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
}
from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
// ChevronDownIcon is provided by AccordionTrigger from ui/accordion
import React from "react";

interface SidebarNavProps {
  items: SidebarNavItem[];
  className?: string;
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  const pathname = usePathname();
  const { state: sidebarState, isMobile } = useSidebar();
  const isCollapsed = sidebarState === "collapsed" && !isMobile;

  if (!items?.length) {
    return null;
  }
  
  // Determine default open accordion items based on active child route
  const defaultOpenValues = React.useMemo(() => {
    const openValues: string[] = [];
    items.forEach(item => {
      if (item.items) {
        const isActiveParent = item.items.some(subItem => subItem.href && pathname.startsWith(subItem.href));
        if (isActiveParent) {
          openValues.push(item.title);
        }
      }
    });
    return openValues;
  }, [pathname, items]);


  return (
    <nav className={cn("flex flex-col w-full gap-1 px-2", className)}>
       {isCollapsed ? (
        // Collapsed view: Icons only
        <SidebarMenu>
          {items.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                asChild
                isActive={item.href ? pathname === item.href : false}
                tooltip={item.title}
              >
                <Link href={item.href || "#"}>
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span className="sr-only">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      ) : (
        // Expanded view: Full menu with accordions
        <Accordion type="multiple" defaultValue={defaultOpenValues} className="w-full">
          {items.map((item, index) =>
            item.items && item.items.length > 0 ? (
              <AccordionItem value={item.title} key={index} className="border-b-0">
                <AccordionTrigger
                  className={cn(
                    "flex items-center justify-between w-full py-2 px-2 rounded-md text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                    // Removed [&amp;[data-state=open]>svg]:rotate-180 as AccordionTrigger handles its own icon rotation
                    item.items.some(sub => sub.href === pathname) && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.title}
                  </div>
                  {/* Removed explicit ChevronDownIcon here, as AccordionTrigger provides it */}
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0 pl-4">
                  <SidebarMenuSub className="mx-0 border-l-0 pl-2">
                    {item.items.map((subItem, subIndex) => (
                      <SidebarMenuSubItem key={subIndex}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.href}
                          className="w-full justify-start"
                        >
                          <Link href={subItem.href || "#"}>
                            {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                            {subItem.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <Button
                key={index}
                asChild
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-9 mb-1",
                  pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Link href={item.href || "#"}>
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}
                </Link>
              </Button>
            )
          )}
        </Accordion>
      )}
    </nav>
  );
}
