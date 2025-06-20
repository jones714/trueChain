# TruChain Application Inventory & Technical Overview

This document provides a detailed inventory of all pages, components, features, and the overall structure of the TruChain web application as of the current build.

---

## 1. Top-Level Pages & Application Modules

The application is structured using Next.js App Router.

### Core Pages
- **`/login`**: (`src/app/login/page.tsx`) - Authentication page for users to log in.
- **`/` (Root)**: (`src/app/page.tsx`) - Redirects authenticated users to the dashboard.

### Main Application Layout (`src/app/(app)/layout.tsx`)

This layout wraps all core application modules and includes the main sidebar and header.

### Application Modules (`src/app/(app)/*`)

- **`/dashboard`**: (`src/app/(app)/dashboard/page.tsx`)
  - A role-aware, customizable command center with widgets for KPIs, alerts, timelines, and quick actions.

- **Plants Module**
  - **`/plants`**: (`src/app/(app)/plants/page.tsx`) - Unified dashboard for managing the entire plant lifecycle from germination to harvest.

- **Processing Module**
  - **`/processing`**: (`src/app/(app)/processing/page.tsx`) - Overview of all post-harvest operations.
  - **`/processing/batches`**: (`src/app/(app)/processing/batches/page.tsx`) - Manage processing batches (drying, curing, extraction, etc.).
  - **`/processing/drying-curing`**: (`src/app/(app)/processing/drying-curing/page.tsx`) - Monitor and manage drying/curing environments.
  - **`/processing/packaging`**: (`src/app/(app)/processing/packaging/page.tsx`) - Manage packaging runs and METRC tag assignment.
  - **`/processing/recipes`**: (`src/app/(app)/processing/recipes/page.tsx`) - Define and manage product formulas.

- **Lab Testing Module**
  - **`/lab-testing`**: (`src/app/(app)/lab-testing/page.tsx`) - Dashboard for monitoring testing workflows and results.
  - **`/lab-testing/requests`**: (`src/app/(app)/lab-testing/requests/page.tsx`) - Create and track requests for lab tests.
  - **`/lab-testing/results`**: (`src/app/(app)/lab-testing/results/page.tsx`) - View, upload, and manage Certificates of Analysis (COAs).

- **Transfers Module**
  - **`/transfers`**: (`src/app/(app)/transfers/page.tsx`) - Logistics dashboard for all product movements.
  - **`/transfers/manifests`**: (`src/app/(app)/transfers/manifests/page.tsx`) - Create and manage METRC-compliant transfer manifests.
  - **`/transfers/incoming`**: (`src/app/(app)/transfers/incoming/page.tsx`) - View and accept/reject incoming transfers.
  - **`/transfers/deliveries`**: (`src/app/(app)/transfers/deliveries/page.tsx`) - Manage direct-to-customer deliveries.
  - **`/transfers/custody`**: (`src/app/(app)/transfers/custody/page.tsx`) - View immutable chain of custody audit trails.
  - **`/transfers/drivers-vehicles`**: (`src/app/(app)/transfers/drivers-vehicles/page.tsx`) - Manage registry of approved drivers and vehicles.

- **Sales Module**
  - **`/sales`**: (`src/app/(app)/sales/page.tsx`) - Redirects to the POS.
  - **`/sales/pos`**: (`src/app/(app)/sales/pos/page.tsx`) - Retail Point of Sale interface.
  - **`/sales/records`**: (`src/app/(app)/sales/records/page.tsx`) - View sales transaction history and audit logs.
  - **`/sales/history`**: (`src/app/(app)/sales/history/page.tsx`) - Look up purchase history for specific customers/patients.
  - **`/sales/returns`**: (`src/app/(app)/sales/returns/page.tsx`) - Manage customer returns and refunds.
  - **`/sales/discounts`**: (`src/app/(app)/sales/discounts/page.tsx`) - Create and manage promotions and loyalty programs.
  - **`/sales/labels`**: (`src/app/(app)/sales/labels/page.tsx`) - Generate and print compliant product labels.

- **Medical Module**
  - **`/medical`**: (`src/app/(app)/medical/page.tsx`) - Dashboard for medical cannabis operations.
  - **`/medical/patients`**: (`src/app/(app)/medical/patients/page.tsx`) - Manage patient profiles, conditions, and prescriptions.
  - **`/medical/consultations`**: (`src/app/(app)/medical/consultations/page.tsx`) - Schedule and document patient consultations.
  - **`/medical/inventory`**: (`src/app/(app)/medical/inventory/page.tsx`) - Manage medical-only inventory with condition-based filtering.

- **`/waste`**: (`src/app/(app)/waste/page.tsx`) - Manage and report cannabis waste.
- **`/reports`**: (`src/app/(app)/reports/page.tsx`) - Interactive reports and analytics dashboard.

- **User Settings**
  - **`/profile`**: (`src/app/(app)/profile/page.tsx`) - User's personal profile management.
  - **`/settings`**: (`src/app/(app)/settings/page.tsx`) - User-specific settings for notifications, appearance, etc.
  - **`/billing`**: (`src/app/(app)/billing/page.tsx`) - Subscription and payment management.

- **Admin Module** (`src/app/(app)/admin/*`)
  - **`/admin`**: (`src/app/(app)/admin/page.tsx`) - Admin dashboard with links to management sections.
  - **`/admin/facilities`**: (`src/app/(app)/admin/facilities/page.tsx`) - Manage business locations.
  - **`/admin/licenses`**: (`src/app/(app)/admin/licenses/page.tsx`) - Manage facility licenses and METRC API keys.
  - **`/admin/users`**: (`src/app/(app)/admin/users/page.tsx`) - Manage user accounts, roles, and permissions.
  - **`/admin/settings`**: (`src/app/(app)/admin/settings/page.tsx`) - Manage global system settings.

---

## 2. Reusable UI Components

### Custom Application Components (`src/components/*`)
- **`layout/app-header.tsx`**: The main header for the application view.
- **`layout/sidebar-nav.tsx`**: The primary navigation component for the sidebar.
- **`logo.tsx`**: The application logo component.
- **`page-container.tsx`**: A wrapper for consistent padding and spacing on main pages.
- **`page-header.tsx`**: A standardized header component for page titles and descriptions.
- **`theme-provider.tsx`**: Next-themes provider for light/dark mode.
- **`theme-toggle.tsx`**: The UI control for switching themes.
- **`user-nav.tsx`**: The user avatar and dropdown menu in the header.

### ShadCN UI Components (`src/components/ui/*`)
- Accordion
- Alert & Alert Dialog
- Avatar
- Badge
- Button
- Calendar
- Card (and its sub-components)
- Chart (and its sub-components for Recharts)
- Checkbox
- Dialog (Modal)
- Dropdown Menu
- Form
- Input
- Label
- Menubar
- Popover
- Progress
- Radio Group
- Scroll Area
- Select
- Separator
- Sheet
- Sidebar (Custom component built with Sheet and other primitives)
- Skeleton
- Slider
- Switch
- Table
- Tabs
- Textarea
- Toast & Toaster
- Tooltip

---

## 3. Custom Logic, Configuration & Hooks

- **`src/lib/utils.ts`**: Contains the `cn` utility for merging Tailwind CSS classes.
- **`src/hooks/use-toast.ts`**: Custom hook for the toast notification system.
- **`src/hooks/use-mobile.tsx`**: Custom hook to detect if the viewport is mobile-sized.
- **`src/config/site.ts`**: Central configuration file defining the navigation structure (mainNav, adminNav) and site metadata.
- **`src/types/nav.ts`**: TypeScript type definitions for navigation items.
- **`src/ai/genkit.ts`**: Configuration and initialization for the Genkit AI plugin.
- **`src/ai/dev.ts`**: Entry point for developing and testing Genkit flows locally.

---

## 4. Routing & Site Map

The site's navigation flow is defined in `src/config/site.ts` and rendered by `src/components/layout/sidebar-nav.tsx`.

### Main Navigation
- **/dashboard**
- **/inventory**
- **/plants**
- **/processing**
  - **/processing/overview** (redirects to `/processing`)
  - **/processing/batches**
  - **/processing/drying-curing**
  - **/processing/packaging**
  - **/processing/recipes**
- **/lab-testing**
  - **/lab-testing/overview** (redirects to `/lab-testing`)
  - **/lab-testing/requests**
  - **/lab-testing/results**
- **/transfers**
  - **/transfers/overview** (redirects to `/transfers`)
  - **/transfers/manifests**
  - **/transfers/incoming**
  - **/transfers/deliveries**
  - **/transfers/custody**
  - **/transfers/drivers-vehicles**
- **/sales**
  - **/sales/pos**
  - **/sales/records**
  - **/sales/history**
  - **/sales/returns**
  - **/sales/discounts**
  - **/sales/labels**
- **/medical**
  - **/medical/overview** (redirects to `/medical`)
  - **/medical/patients**
  - **/medical/consultations**
  - **/medical/inventory**
- **/waste**
- **/reports**

### Administration Navigation
- **/admin**
- **/admin/facilities**
- **/admin/licenses**
- **/admin/users**
- **/admin/settings**

### User Navigation (from Header Dropdown)
- **/profile**
- **/billing**
- **/settings**
- **/login** (for logout)

---

## 5. Review & Confirmation Checklist

This section is for your team to use to verify the completeness of this inventory.

- [ ] **List all top-level pages**: Documented in Section 1.
- [ ] **List all reusable UI components**: Documented in Section 2.
- [ ] **List all custom logic files/utilities**: Documented in Section 3.
- [ ] **Draw the routing/site map showing navigation flow**: Documented in Section 4.
- [ ] **Review the codebase with another dev/stakeholder for missed items**.

### Acceptance Criteria
- [ ] Document exists with all pages, components, and utilities.
- [ ] The routing/site map is included in the doc.
- [ ] At least one other person reviews and confirms completeness.

**Reviewed by:** _________________________

**Date:** _________________________
