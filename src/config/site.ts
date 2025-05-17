import type { SidebarNavItem } from "@/types/nav";
import {
  LayoutDashboard,
  Sprout,
  Recycle,
  Warehouse,
  FlaskConical,
  Truck,
  ShoppingCart,
  BarChart3,
  Users,
  Building,
  BadgeCheck,
  Settings,
  Cog,
  FileText,
  Droplets,
  PackagePlus,
  Archive,
  ScanBarcode
} from "lucide-react";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mainNav: SidebarNavItem[];
  adminNav: SidebarNavItem[];
};

export const siteConfig: SiteConfig = {
  name: "TruCanalytix",
  description: "Comprehensive Cannabis Compliance and Management Platform.",
  url: "https://example.com", // Replace with your actual URL
  ogImage: "https://example.com/og.jpg", // Replace with your actual OG image URL
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Plants",
      icon: Sprout,
      items: [
        { title: "Overview", href: "/plants", icon: Sprout },
        { title: "Germination", href: "/plants/germination", icon: Droplets },
        { title: "Vegetative", href: "/plants/vegetative", icon: Sprout },
        { title: "Flowering", href: "/plants/flowering", icon: Sprout },
        { title: "Harvests", href: "/plants/harvests", icon: Recycle },
      ],
    },
    {
      title: "Processing",
      icon: PackagePlus,
      items: [
        { title: "Overview", href: "/processing", icon: PackagePlus },
        { title: "Batches", href: "/processing/batches", icon: Archive },
        { title: "Drying & Curing", href: "/processing/drying-curing", icon: Recycle },
        { title: "Packaging", href: "/processing/packaging", icon: PackagePlus },
      ],
    },
    {
      title: "Inventory",
      href: "/inventory",
      icon: Warehouse,
    },
    {
      title: "Lab Testing",
      icon: FlaskConical,
      items: [
        { title: "Overview", href: "/lab-testing", icon: FlaskConical },
        { title: "Test Requests", href: "/lab-testing/requests", icon: FileText },
        { title: "Results & COAs", href: "/lab-testing/results", icon: BadgeCheck },
      ],
    },
    {
      title: "Transfers",
      icon: Truck,
      items: [
        { title: "Overview", href: "/transfers", icon: Truck },
        { title: "Manifests", href: "/transfers/manifests", icon: FileText },
        { title: "Chain of Custody", href: "/transfers/custody", icon: Users },
      ],
    },
    {
      title: "Sales",
      icon: ShoppingCart,
      items: [
        { title: "Retail POS", href: "/sales/pos", icon: ScanBarcode },
        { title: "Sales Records", href: "/sales/records", icon: BarChart3 },
        { title: "Label Generation", href: "/sales/labels", icon: ScanBarcode },
      ],
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
  ],
  adminNav: [
     {
      title: "Admin Dashboard",
      href: "/admin",
      icon: Cog,
    },
    {
      title: "Facilities",
      href: "/admin/facilities",
      icon: Building,
    },
    {
      title: "Licenses",
      href: "/admin/licenses",
      icon: BadgeCheck,
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "System Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ],
};
