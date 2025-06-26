
# TruChain Application Inventory

This document provides a comprehensive inventory of all pages, components, utilities, and other core files within the TruChain web application.

## 1. Application Pages & Modules

This section lists all user-facing pages, grouped by their respective modules.

### Core App Shell & Top-Level Pages

-   **`src/app/layout.tsx`**: The root layout for the entire application, including `<html>` and `<body>`.
-   **`src/app/(app)/layout.tsx`**: The main application layout, containing the persistent sidebar and header.
-   **`src/app/page.tsx`**: The root page, which redirects to `/dashboard`.
-   **`src/app/login/page.tsx`**: The user authentication/login page.

### Main Modules

-   **Dashboard**: `src/app/(app)/dashboard/page.tsx`
-   **Inventory**: `src/app/(app)/inventory/page.tsx`
-   **Plants**: `src/app/(app)/plants/page.tsx`
-   **Waste Management**: `src/app/(app)/waste/page.tsx`
-   **Reports**: `src/app/(app)/reports/page.tsx`
-   **Profile**: `src/app/(app)/profile/page.tsx`
-   **Billing**: `src/app/(app)/billing/page.tsx`
-   **Settings**: `src/app/(app)/settings/page.tsx`

### Processing Module

-   **Overview**: `src/app/(app)/processing/page.tsx`
-   **Batches**: `src/app/(app)/processing/batches/page.tsx`
-   **Drying & Curing**: `src/app/(app)/processing/drying-curing/page.tsx`
-   **Packaging & Labeling**: `src/app/(app)/processing/packaging/page.tsx`
-   **Recipe Management**: `src/app/(app)/processing/recipes/page.tsx`

### Lab Testing Module

-   **Overview**: `src/app/(app)/lab-testing/page.tsx`
-   **Test Requests**: `src/app/(app)/lab-testing/requests/page.tsx`
-   **Results & COAs**: `src/app/(app)/lab-testing/results/page.tsx`

### Transfers Module

-   **Overview**: `src/app/(app)/transfers/page.tsx`
-   **Manifests**: `src/app/(app)/transfers/manifests/page.tsx`
-   **Incoming Transfers**: `src/app/(app)/transfers/incoming/page.tsx`
-   **Customer Deliveries**: `src/app/(app)/transfers/deliveries/page.tsx`
-   **Chain of Custody**: `src/app/(app)/transfers/custody/page.tsx`
-   **Drivers & Vehicles**: `src/app/(app)/transfers/drivers-vehicles/page.tsx`

### Sales Module

-   **Overview/Redirect**: `src/app/(app)/sales/page.tsx`
-   **Retail POS**: `src/app/(app)/sales/pos/page.tsx`
-   **Sales Records**: `src/app/(app)/sales/records/page.tsx`
-   **Customer History**: `src/app/(app)/sales/history/page.tsx`
-   **Returns & Refunds**: `src/app/(app)/sales/returns/page.tsx`
-   **Discounts & Promotions**: `src/app/(app)/sales/discounts/page.tsx`
-   **Label Generation**: `src/app/(app)/sales/labels/page.tsx`

### Medical Module

-   **Overview**: `src/app/(app)/medical/page.tsx`
-   **Patient Profiles**: `src/app/(app)/medical/patients/page.tsx`
-   **Consultations**: `src/app/(app)/medical/consultations/page.tsx`
-   **Medical Inventory**: `src/app/(app)/medical/inventory/page.tsx`

### Admin Module

-   **Admin Layout**: `src/app/(app)/admin/layout.tsx`
-   **Dashboard**: `src/app/(app)/admin/page.tsx`
-   **User Management**: `src/app/(app)/admin/users/page.tsx`
-   **Facilities**: `src/app/(app)/admin/facilities/page.tsx`
-   **Licenses**: `src/app/(app)/admin/licenses/page.tsx`
-   **System Settings**: `src/app/(app)/admin/settings/page.tsx`

---

## 2. Reusable UI Components (`src/components/ui`)

This is an inventory of the base UI components, primarily from the ShadCN library.

-   `accordion.tsx`
-   `alert-dialog.tsx`
-   `alert.tsx`
-   `avatar.tsx`
-   `badge.tsx`
-   `button.tsx`
-   `calendar.tsx`
-   `card.tsx`
-   `chart.tsx`
-   `checkbox.tsx`
-   `dialog.tsx`
-   `dropdown-menu.tsx`
-   `form.tsx`
-   `input.tsx`
-   `label.tsx`
-   `menubar.tsx`
-   `popover.tsx`
-   `progress.tsx`
-   `radio-group.tsx`
-   `scroll-area.tsx`
-   `select.tsx`
-   `separator.tsx`
-   `sheet.tsx`
-   `sidebar.tsx`
-   `skeleton.tsx`
-   `slider.tsx`
-   `switch.tsx`
-   `table.tsx`
-   `tabs.tsx`
-   `textarea.tsx`
-   `toast.tsx`
-   `toaster.tsx`
-   `tooltip.tsx`

---

## 3. Custom Components, Logic & Configuration

This section lists custom-built components, layout helpers, hooks, and configuration files that are specific to the TruChain application.

### Custom Components & Layouts

-   **`src/components/layout/app-header.tsx`**: Renders the main header bar across the top of the application.
-   **`src/components/layout/sidebar-nav.tsx`**: Renders the navigation links within the main sidebar.
-   **`src/components/logo.tsx`**: A simple component for displaying the application logo and name.
-   **`src/components/page-container.tsx`**: A wrapper component that provides consistent padding and spacing for main page content.
-   **`src/components/page-header.tsx`**: A component for displaying the main title and description at the top of a page.
-   **`src/components/theme-provider.tsx`**: Wrapper for `next-themes` to handle light/dark mode.
-   **`src/components/theme-toggle.tsx`**: The UI button for switching between light, dark, and system themes.
-   **`src/components/user-nav.tsx`**: The user avatar dropdown menu in the header with links to profile, billing, settings, and logout.

### Custom Logic & Utilities

-   **`src/hooks/use-mobile.tsx`**: A React hook to detect if the user is on a mobile-sized screen.
-   **`src/hooks/use-toast.ts`**: The custom hook and system for triggering toast notifications.
-   **`src/lib/utils.ts`**: Contains the `cn` utility function for merging Tailwind CSS classes.
-   **`src/types/nav.ts`**: TypeScript type definitions for navigation item structures.

### Configuration

-   **`src/config/site.ts`**: The central configuration file that defines the structure of the sidebar navigation (`mainNav` and `adminNav`).
-   **`src/app/globals.css`**: The global CSS file containing Tailwind directives and the application's color theme variables (CSS custom properties) for light and dark modes.

### AI (Genkit)

-   **`src/ai/genkit.ts`**: Initializes and configures the core Genkit `ai` object with plugins (like Google AI) and a default model.
-   **`src/ai/dev.ts`**: The development entry point for Genkit flows.
