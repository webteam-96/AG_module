# Club Dashboard — Design Spec
**Date:** 2026-04-01
**Status:** Approved

---

## Overview

The project is being reorganised into **3 fully independent modules**, each with its own URL prefix, layout component, sidebar, and folder:

| Module | URL Prefix | Folder | Status |
|---|---|---|---|
| AG Dashboard | `/agdashboard/` | `src/modules/ag/` | Migrate existing pages |
| Club Dashboard | `/clubdashboard/` | `src/modules/club/` | Build new |
| District Dashboard | `/districtdashboard/` | `src/modules/district/` | Placeholder only |

Each module is a **fully separate app** — independent Layout, independent sidebar nav, independent routes. No shared navigation between modules.

---

## Routing Architecture

### Before (current)
```
/ → Layout
  /clubs, /membership, /trf, /excellence, /youth, /projects, /district
  /clubs/:clubId
```

### After
```
/agdashboard/* → AGLayout
  /agdashboard/clubs
  /agdashboard/membership
  /agdashboard/trf
  /agdashboard/excellence
  /agdashboard/youth
  /agdashboard/projects
  /agdashboard/district
  /agdashboard/clubs/:clubId

/clubdashboard/* → ClubLayout
  /clubdashboard → redirect to /clubdashboard/overview
  /clubdashboard/overview
  /clubdashboard/avenue
  /clubdashboard/communication
  /clubdashboard/egovernance
  /clubdashboard/payments
  /clubdashboard/directory

/districtdashboard/* → DistrictLayout (placeholder)
  /districtdashboard/overview
```

---

## Folder Structure

```
src/
  modules/
    ag/
      layout/AGLayout.jsx          # Existing Layout.jsx moved here
      pages/                       # All existing pages moved here
        ClubDirectory.jsx
        ZoneOverview.jsx
        Membership.jsx
        TRFGiving.jsx
        ClubExcellence.jsx
        YouthServices.jsx
        ServiceProjects.jsx
        DistrictComparison.jsx
        ClubDetail.jsx
    club/
      layout/ClubLayout.jsx        # New layout with dropdown sidebar
      pages/
        Overview.jsx
        AvenueOfService.jsx
        Communication.jsx
        EGovernance.jsx
        Payments.jsx
        Directory.jsx
    district/
      layout/DistrictLayout.jsx    # Placeholder
      pages/
        Overview.jsx               # Placeholder
  components/                      # Shared shadcn + custom components (unchanged)
  data/                            # Shared data layer (unchanged)
  App.jsx                          # Updated with all 3 module routes
```

---

## Club Dashboard — Sidebar Navigation

The Club Dashboard sidebar has a **single collapsible "Overview" group** containing all 6 pages as sub-items:

```
▼ Overview           ← collapsible parent (always open by default)
    • Dashboard        /clubdashboard/overview
    • Avenue of Service  /clubdashboard/avenue
    • Communication    /clubdashboard/communication
    • E-Governance & Reporting  /clubdashboard/egovernance
    • Payments         /clubdashboard/payments
    • Directory & Leadership  /clubdashboard/directory
```

---

## Club Dashboard — Pages

### 1. Dashboard (`/clubdashboard/overview`)
**Purpose:** Analytical + operational overview of the club.

**Sections:**
- KPI strip (6 cards): Total Members, Avg Attendance, TRF Contribution, Service Projects, District Citation %, Active Members
- Row 1 — 4 analytic cards:
  - Membership Mix donut (Full / Associate / Honorary)
  - TRF Goal donut (% raised vs target)
  - Meeting Attendance bar chart (last 6 meetings, colour-coded green/amber/red)
  - District Citation donut with checklist breakdown
- Row 2 — 2 columns:
  - Member Growth line+area chart (monthly, RY Jul–Jun)
  - Upcoming Events list (date box + event name + venue + type badge)
- Row 3 — 3 columns:
  - Avenue of Service horizontal progress bars (6 avenues, count + %)
  - Board of Directors table (name, role badge, contact)
  - Announcements feed (dot indicator + text + date)

### 2. Avenue of Service (`/clubdashboard/avenue`)
**Purpose:** Track all service projects across all 6 avenues.

**Sections:**
- KPI strip: Total Projects, Completed, In Progress, Beneficiaries, Funds Deployed
- Row 1 — 2 charts:
  - Bar chart: project count by avenue
  - Horizontal bar: beneficiary reach by avenue
- Projects table (filterable by avenue tab): Name, Avenue badge, Date, Beneficiaries, Funds, Status badge
- Add Project action button

### 3. Communication (`/clubdashboard/communication`)
**Purpose:** Events, announcements, newsletters, documents, greetings.

**Sections:**
- KPI strip: Upcoming Events, Active Announcements, Newsletters, Documents
- Upcoming Events list (full, with venue and type badge)
- 2-col row: Announcements feed | Documents & Newsletters file list (with download)

### 4. E-Governance & Reporting (`/clubdashboard/egovernance`)
**Purpose:** Compliance and reporting hub.

**Sections:**
- KPI strip: Reports Submitted, Avg Attendance, TRF Raised, District Citation, Zonal Awards
- Tabbed interface: Attendance | Monthly Report | TRF Contribution | District Citation | OCV/GOV | PPH Camp | Zonal Awards
- Default tab — Attendance: meeting register table (date, venue, present, total, %)
- District Citation checklist: each criterion with points earned, status icon
- Monthly Reports status table: month, submission date, on-time flag, status badge

### 5. Payments (`/clubdashboard/payments`)
**Purpose:** Dues collection and event payment links.

**Sections:**
- KPI strip: Dues Collected, Dues Pending, Event Revenue, TRF Collected
- Membership Dues table: searchable + filterable, member, type, amount, due date, status (Paid/Pending/Overdue)
- Collection Summary: stat blocks + horizontal bars by member type
- Online Event Links: list of active payment links

### 6. Directory & Leadership (`/clubdashboard/directory`)
**Purpose:** Member directory, past presidents, board.

**Sections:**
- KPI strip: Total, Full, Associate, Honorary, Past Presidents count
- Member Directory table: searchable + type filter, photo/avatar, name, mobile, email, type, since, status, edit/remove actions
- 2-col row: Past Presidents table (name, year, achievement) | Board of Directors table (name, role badge, contact)

---

## Tech Stack & Component Library

- **Framework:** React + Vite (existing)
- **Routing:** React Router DOM v6 (existing)
- **UI Components:** shadcn/ui (existing — Card, Badge, Table, Button, Progress, Tabs, ScrollArea, Separator, Avatar)
- **Charts:** Recharts (existing — BarChart, LineChart, AreaChart, PieChart/RadialBar)
- **Icons:** Lucide React (existing)
- **Styling:** Tailwind CSS (existing)

### Design Tokens (matching existing AG Dashboard)
- Sidebar background: `#0f172a` / `#080e1c`
- Primary blue: `#003DA5`
- Brand gold: `#F7A81B`
- Content background: `#f1f5f9`
- Card background: `white`
- Border: `#e2e8f0`

---

## District Dashboard (Placeholder)

A minimal placeholder layout + one overview page. No data yet. Shows "Coming Soon" with the module name and a back link to the module selector (or AG Dashboard).

---

## Out of Scope

- Authentication / login per module
- Real API / backend data
- District Dashboard full build
- Market Place, Website Data, Rotary Network pages
