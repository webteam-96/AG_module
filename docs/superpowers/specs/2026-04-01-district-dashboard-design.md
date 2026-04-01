# District Dashboard (5656) — Design Spec

**Date:** 2026-04-01
**Status:** Approved
**Approach:** Hybrid — replica structure and data fidelity, current design language (clean cards/tables), no complex charting

---

## 1. Context

The existing codebase has three dashboard modules:
- `/agdashboard` — AG Dashboard (fully built)
- `/clubdashboard` — Club Dashboard (fully built, 7 pages)
- `/districtdashboard` — District Dashboard (placeholder only)

This spec covers building out the District Dashboard to feature parity with the Rotary India `GroupDashboard.aspx` (district context), representing District **5656**.

---

## 2. Architecture

### Data Layer
Per-module data files under `src/modules/district/data/`:

| File | Purpose |
|---|---|
| `directoryData.js` | 29 district-level members |
| `committeeData.js` | District committee members with designations |
| `clubsData.js` | 6 clubs under District 5656 |
| `monthlyReportData.js` | 10-month submission tracking per club |
| `moderatorData.js` | Club moderator assignments |
| `agData.js` | Zones and assigned AGs |

### Routes
All under `/districtdashboard` in `App.jsx`:

```
/districtdashboard/overview        → Overview (7-tile home)
/districtdashboard/directory       → Directory
/districtdashboard/committee       → District Committee
/districtdashboard/clubs           → Clubs
/districtdashboard/monthly-report  → Club Monthly Report
/districtdashboard/moderator       → Club Moderator
/districtdashboard/ag              → AG / Zones
/districtdashboard/website-data    → Website Data
```

### New Page Files
```
src/modules/district/pages/
  Overview.jsx         (replace existing placeholder)
  Directory.jsx
  Committee.jsx
  Clubs.jsx
  MonthlyReport.jsx
  Moderator.jsx
  AG.jsx
  WebsiteData.jsx
```

---

## 3. Layout — DistrictLayout.jsx

Updates to existing layout shell:
- District number: `3142` → `5656`
- Avatar initials: `DG`, label: "District 5656", sub-label: "DG Office"
- Rotary Year: `RY 2025–26`
- Add full sidebar nav (8 items) using same `NavLink` pattern as `ClubLayout`

**Sidebar nav:**
```
Overview
──────────────────
Directory            (badge: 29)
District Committee
Clubs
Club Monthly Report
Club Moderator
AG / Zones
Website Data
```

---

## 4. Module Designs

### 4.1 Overview
Replaces the "coming soon" placeholder. Renders 7 clickable icon tiles in a responsive grid (same visual style as Club Dashboard stat cards). Each tile:
- Icon (SVG)
- Module name
- Badge count (where applicable)
- Navigates to module route on click

### 4.2 Directory
- **Read-only** — no Add/Edit/Delete buttons (district directory is centrally managed)
- Columns: Avatar (initials), Name, Mobile, Email, Admin role badge (Make/Remove Admin)
- Controls: Search input, pagination
- Data: 29 members from `directoryData.js`

### 4.3 District Committee
- **Stat bar** at top: total members count, unique designation count
- **Controls**: Search, Year filter (2025-2026), Designation filter dropdown, Export PDF button
- **Table columns**: Name, Club, Designation, Mobile, Email, Photo (avatar), Edit, Delete
- **Add Member** button opens an inline form card above the table with fields: Name, Mobile, Email, Designation, Club, Remark, Photo upload
- Data: 4 sample members from `committeeData.js`

### 4.4 Clubs
- Responsive grid of **club cards**
- Each card: Club name, Meeting day + time, Member count
- Cards are informational only — no navigation (District 5656 club IDs don't exist in AG data; linking would produce empty detail pages)
- 6 clubs from `clubsData.js`: Lake Shore, New Club Test Entry, Owala, Rotary Club of Leo, Thane City View, Tikujiniwadi

### 4.5 Club Monthly Report
- **Top controls**: Year filter dropdown, Export to Excel button, Zone-wise Export dropdown, WhatsApp notification toggle
- **Month list**: 10 clickable rows (Jul 2025 – Apr 2026), each showing submission status badge (e.g. "6/6 submitted" in green, "4/6 submitted" in amber, "0/6 submitted" in red)
- Data: per-month per-club submission status from `monthlyReportData.js`

### 4.6 Club Moderator
- Simple table
- Columns: Sr.No, Name (club in parentheses), Mobile, Email, action icon (navigate to club)
- Search input
- Data from `moderatorData.js`

### 4.7 AG / Zones
- Standalone page inside `/districtdashboard` (does not link to `/agdashboard`)
- Table of zones with: Zone name, AG Name, AG Mobile, Assigned clubs (comma-separated or count)
- Add/Edit/Delete row controls
- Data from `agData.js`

### 4.8 Website Data
- Placeholder card (same visual treatment as original Overview placeholder)
- Shows icon + "Website Data management coming soon" message
- No functional content — module not fully specced

---

## 5. Design Constraints

- Follow existing color tokens: `#0f172a` sidebar, `#F7A81B` accent, `#1e3a5f` active text
- Use existing shared components: `StatCard`, `ScrollArea`, `Separator`, `Avatar`, `NavLink` pattern
- No Recharts or chart libraries — hybrid approach uses tables/badges, not graphs
- Mobile: hamburger menu pattern from `ClubLayout` applied to `DistrictLayout`
- All data is mock/static; no API calls

---

## 6. Out of Scope

- Real API integration
- Citation analytics heatmaps (Part 9 redesign features)
- Role-based views (DG vs Secretary vs AG)
- Notification center / bell icon
- Unified export hub
- Cross-club drill-down slide-over panel
