# District Dashboard — 100-Club Scale Design
**Date:** 2026-04-29
**Scope:** `src/modules/district/`

## Problem

The district dashboard mirrors the club dashboard module structure (Overview, Membership, Foundation, Communication, E-Governance) but its data layer only has 6 clubs. A real district has 100+ clubs. The current UI — bar charts, leaderboard rows, accordion lists — is built for small-scale data and breaks down visually and functionally at 100 clubs.

## Goal

Make every district module correctly represent 100+ clubs: aggregated district-wide KPIs, club-vs-club comparison with search + pagination, and per-club drill-down where the club dashboard shows single-club detail.

## Approach: Option A — Expand existing files in place

Grow the current data files to 100 clubs and add search/pagination guards to each page. No new architecture, no file restructuring. When real API data replaces mock data, the data files are swapped out regardless of structure.

---

## Data Layer

### `src/modules/district/data/analyticsData.js`
Grows from 6 → 100 clubs. Each entry:
```js
{
  id: 'slug',
  name: 'Club Name',
  meetingDay: 'Monday',
  // Membership
  members: 142, memberTarget: 150,
  activeMembers: 128, maleMembers: 95, femaleMembers: 28,
  honoraryMembers: 19, newThisYear: 8, terminated: 2,
  // TRF
  trfRaised: 320000, trfGoal: 470000,
  annualFund: 180000, phfContributors: 18, majorDonors: 3,
  // Foundation
  serviceProjects: 12, beneficiaries: 2400, manHours: 480,
  // E-Governance
  citationScore: 42, citationMax: 50,
  reportsSubmitted: 8, reportsTotal: 10,
  avgAttendance: 74,
  // Member roster (10-15 per club for drill-down)
  members_list: [ { name, designation, mobile, email, since, status } ]
}
```

Clubs distributed across realistic Indian locality names (Thane, Navi Mumbai, Kalyan, Dombivli, Mira Road, Airoli, etc.), with performance deliberately varied — ~25 high performers, ~50 mid, ~25 low.

### `src/modules/district/data/clubsData.js`
Grows to match the same 100 clubs (id, name, meetingDay, meetingTime, members).

### Other data files
`foundationData.js` — grows to ~300 projects + ~200 events (derived from the 100-club dataset).
`egovernanceData.js` — grows monthly report grid, PPH camps (~150), citations to 100 clubs.

---

## Module Designs

### Overview (`Overview.jsx`)

**KPI Strip (5 cards):**
- Total Clubs, Total Members, Avg TRF %, Report Compliance %, Avg Attendance %

**Row 1 — 4 analytical cards** (same interactive card-click pattern as club dashboard):
1. **Membership** — total members, breakdown bars: Active / Male / Female / Honorary / Inactive. Badge = new members this year (district total)
2. **TRF Goal** — donut (district aggregate raised vs goal) + breakdown bars: Annual Fund, Polio, Endowment, Major Donors
3. **Service Projects** — bar progress per avenue type, aggregated across all clubs
4. **District Citation** — avg citation score donut + criterion breakdown bars (district average)

**Row 2 — Dynamic chart (2/3) + Club Leaderboard (1/3):**
- Chart responds to which card is active (same as club dashboard)
- Leaderboard: top 10 by composite score shown by default, search box to find any club, pagination to browse all 100

**Row 3 — Club Comparison Matrix:**
- Columns: Club, Members, Citation, Reports, Attendance, TRF %, Projects
- Search filter at top
- 15 rows per page, prev/next pagination
- RAG colour coding (green ≥ 75%, amber 50–74%, red < 50%)

---

### Membership (`Membership.jsx`)

**KPI strip added above tabs:**
- Total Members, Active Members, New This Year, Terminated This Year (district-wide sums)

**Clubs tab — two-level view:**
- Top level: paginated table (15 rows/page) of all 100 clubs
  - Columns: Club Name, Total Members, Active, Male, Female, Honorary, New This Year, Attendance %
  - Search box at top
- Drill-down: clicking any row expands an accordion showing that club's member roster (name, designation, mobile, email, since, status)

**Other tabs** (Directory, Committee, AG, Moderator) — no structural change.

---

### Foundation (`Foundation.jsx` + `foundationData.js`)

- Projects table: ~300 rows, search + pagination (15/page), club filter dropdown
- Events table: ~200 rows, search + pagination, club filter dropdown
- KPI numbers update to reflect full dataset

---

### Communication (`Communication.jsx`)

No structural changes — already district-level by design (events, announcements, greetings, documents are not per-club).

---

### E-Governance (`EGovernance.jsx` + `egovernanceData.js`)

**Monthly Reports tab:**
- Per-club accordion list grows to 100 clubs
- Search box added at top (filter by club name)
- Pagination: 20 clubs per page

**PPH Camps tab:**
- Grows to ~150 camps
- Search + pagination (15/page)

**Citation tab:**
- Switches from card grid to paginated table (100 club scorecards as cards is too dense)
- Columns: Rank, Club, Score /50, % + per-criterion mini-bars
- Click row to expand full criterion breakdown
- Search + pagination (15/page)

**Reports tab:** No change.

---

## What Does NOT Change

- Communication module structure
- District Committee, AG, Moderator tabs in Membership
- Reports tab in E-Governance
- DistrictLayout sidebar and routing
- Club dashboard module (entirely separate)

---

## File Changelist

| File | Change |
|------|--------|
| `data/analyticsData.js` | 6 → 100 clubs, add all fields + member rosters |
| `data/clubsData.js` | 6 → 100 clubs |
| `data/foundationData.js` | Expand projects + events |
| `data/egovernanceData.js` | Expand monthly reports, PPH, citations |
| `pages/Overview.jsx` | 4 analytical cards + paginated leaderboard + paginated matrix |
| `pages/Membership.jsx` | KPI strip + Clubs tab with paginated table + member drill-down |
| `pages/Foundation.jsx` | Add search + pagination |
| `pages/EGovernance.jsx` | Search + pagination on monthly, PPH; citation switches to table |
