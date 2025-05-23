
import type { SidebarNavItem } from "@/types/nav";
import {
  LayoutDashboard,
  Sprout,
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
  PackagePlus,
  Archive,
  ScanBarcode,
  HeartPulse,
  ClipboardList,
  MessageSquare,
  NotebookText,
  Trash2,
  Droplets, 
  Flower2, 
  Scissors,
  Recycle,
  Car,
  DownloadCloud,
  RotateCcw, // Added for Returns & Refunds
  Percent,   // Added for Discounts & Promotions
  History,   // Added for Customer History
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
  url: "https://example.com", 
  ogImage: "https://example.com/og.jpg", 
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Inventory",
      href: "/inventory",
      icon: Warehouse,
    },
    {
      title: "Plants",
      href: "/plants", 
      icon: Sprout,
    },
    {
      title: "Processing",
      icon: PackagePlus,
      items: [
        { title: "Overview", href: "/processing", icon: PackagePlus },
        { title: "Batches", href: "/processing/batches", icon: Archive },
        { title: "Drying & Curing", href: "/processing/drying-curing", icon: Recycle },
        { title: "Packaging", href: "/processing/packaging", icon: PackagePlus },
        { title: "Recipe Management", href: "/processing/recipes", icon: NotebookText },
      ],
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
        { title: "Drivers & Vehicles", href: "/transfers/drivers-vehicles", icon: Car },
        { title: "Incoming Transfers", href: "/transfers/incoming", icon: DownloadCloud },
      ],
    },
    {
      title: "Sales",
      icon: ShoppingCart,
      items: [
        { title: "Retail POS", href: "/sales/pos", icon: ScanBarcode },
        { title: "Sales Records", href: "/sales/records", icon: BarChart3 },
        { title: "Label Generation", href: "/sales/labels", icon: ScanBarcode },
        { title: "Returns & Refunds", href: "/sales/returns", icon: RotateCcw },
        { title: "Discounts & Promotions", href: "/sales/discounts", icon: Percent },
        { title: "Customer History", href: "/sales/history", icon: History },
      ],
    },
     {
      title: "Medical",
      icon: HeartPulse,
      items: [
        { title: "Overview", href: "/medical", icon: HeartPulse },
        { title: "Medical Inventory", href: "/medical/inventory", icon: ClipboardList },
        { title: "Patient Profiles", href: "/medical/patients", icon: Users },
        { title: "Consultations", href: "/medical/consultations", icon: MessageSquare },
      ],
    },
    {
      title: "Waste Management",
      href: "/waste",
      icon: Trash2,
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
