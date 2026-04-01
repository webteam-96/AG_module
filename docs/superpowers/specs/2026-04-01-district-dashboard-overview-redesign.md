# District Dashboard — Overview Analytics Redesign Spec

**Date:** 2026-04-01
**Status:** Approved
**Replaces:** Overview tile page from `2026-04-01-district-dashboard-design.md`

---

## Goal

Replace the 7-tile Overview home screen with a full analytics command center for the District Governor. Primary value: comparative view of all 6 clubs across 6 key metrics at a glance.

---

## Layout (single scrollable page)

```
┌──────────────────────────────────────────────────────────┐
│  KPI STRIP (5 StatCards)                                 │
├─────────────────────────────┬────────────────────────────┤
│  GROUPED BAR CHART (2/3)    │  LEADERBOARD CARD (1/3)   │
│  Clubs × Citation%,         │  Top 2 clubs (green)      │
│  Compliance%, Attendance%   │  Bottom 2 clubs (red)     │
│  Recharts BarChart          │  Composite score ranking  │
├─────────────────────────────┴────────────────────────────┤
│  CLUB COMPARISON MATRIX (full width)                     │
│  Club | Members | Citation | Reports | Attend | TRF | Proj│
│  RAG color-coded cells (green >75%, amber 50-75%, red <50%)│
├──────────────────────────────────────────────────────────┤
│  QUICK ACCESS STRIP (compact horizontal pills)           │
│  [Directory 29] [Committee] [Clubs 6] ... [Website Data] │
└──────────────────────────────────────────────────────────┘
```

---

## Data File: `src/modules/district/data/analyticsData.js`

```js
export const CLUB_ANALYTICS = [
  {
    id: 'thane-city-view',
    name: 'Thane City View',
    members: 28, memberTarget: 35,
    citationScore: 42, citationMax: 50,
    reportsSubmitted: 9, reportsTotal: 10,
    avgAttendance: 74,
    trfRaised: 180000, trfGoal: 250000,
    serviceProjects: 8,
  },
  // ... 5 more clubs
]
```

Each club has: id, name, members, memberTarget, citationScore, citationMax, reportsSubmitted, reportsTotal, avgAttendance (%), trfRaised, trfGoal, serviceProjects.

---

## KPI Strip

5 StatCards computed from `CLUB_ANALYTICS`:
- **Total Clubs** — `CLUB_ANALYTICS.length`
- **Total Members** — sum of `members`
- **Avg Citation** — avg of `(citationScore/citationMax)*100`, shown as `%`
- **Report Compliance** — avg of `(reportsSubmitted/reportsTotal)*100`, shown as `%`
- **Avg Attendance** — avg of `avgAttendance`, shown as `%`

---

## Grouped Bar Chart

- Library: Recharts `BarChart` (already in project)
- X-axis: club names (abbreviated to first word if long)
- 3 Bar series: Citation %, Compliance %, Attendance %
- Colors: `#003DA5` (citation), `#16a34a` (compliance), `#f59e0b` (attendance)
- Legend, CartesianGrid, Tooltip, ResponsiveContainer
- Height: 220px

---

## Leaderboard Card

Composite score = average of (citation%, compliance%, attendance%) per club.

- Top 2 clubs: green background row, up-arrow, club name, composite score
- Bottom 2 clubs: red background row, down-arrow, club name, composite score
- Small "District Alerts" section below: any club with composite < 50% flagged

---

## Club Comparison Matrix

Plain HTML table (no library). Columns:
| Club | Members | Citation | Reports | Attendance | TRF | Projects |

RAG thresholds (applied to % values):
- Green: > 75%
- Amber: 50–75%
- Red: < 50%

For Members and Projects (absolute values, not %): color relative to district average (above avg = green, within 20% = amber, below = red).

TRF column: progress bar showing `trfRaised/trfGoal` %.

Each cell shows: value + a colored 8px dot.

---

## Quick Access Strip

Compact horizontal row of 7 pill buttons at page bottom:
- `rounded-full border px-3 py-1.5 text-xs font-medium`
- Icon (12px) + label + badge count (where applicable)
- Same navigation as original tiles

---

## Files Changed

- **Modified:** `src/modules/district/pages/Overview.jsx` — full replacement
- **Created:** `src/modules/district/data/analyticsData.js`

No other files change.
