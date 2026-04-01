# Club Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganise the app into 3 independent modules (AG `/agdashboard/`, Club `/clubdashboard/`, District `/districtdashboard/`) and build a full 6-page Club Dashboard using shadcn/ui + Recharts.

**Architecture:** Each module gets its own Layout component and route prefix. Existing AG pages move to `src/modules/ag/`. Club Dashboard gets 6 pages behind a collapsible sidebar dropdown. All pages use shadcn Card/Table/Badge/Tabs + Recharts charts.

**Tech Stack:** React 18, React Router DOM v6, shadcn/ui (@base-ui/react), Recharts 2, Lucide React, Tailwind CSS

---

## File Map

### Modified
- `src/App.jsx` — add all 3 module route trees

### Moved (AG module)
- `src/components/Layout.jsx` → `src/modules/ag/layout/AGLayout.jsx`
- `src/pages/*.jsx` → `src/modules/ag/pages/*.jsx`

### Created (Club module)
- `src/modules/club/layout/ClubLayout.jsx`
- `src/modules/club/data/clubData.js`
- `src/modules/club/pages/Overview.jsx`
- `src/modules/club/pages/AvenueOfService.jsx`
- `src/modules/club/pages/Communication.jsx`
- `src/modules/club/pages/EGovernance.jsx`
- `src/modules/club/pages/Payments.jsx`
- `src/modules/club/pages/Directory.jsx`

### Created (District module)
- `src/modules/district/layout/DistrictLayout.jsx`
- `src/modules/district/pages/Overview.jsx`

---

## Task 1: Create module folder structure + move AG files

**Files:**
- Create: `src/modules/ag/layout/AGLayout.jsx`
- Create: `src/modules/ag/pages/` (all existing pages)
- Modify: `src/App.jsx`

- [ ] **Step 1: Create folders**
```bash
mkdir -p src/modules/ag/layout src/modules/ag/pages src/modules/club/layout src/modules/club/pages src/modules/club/data src/modules/district/layout src/modules/district/pages
```

- [ ] **Step 2: Copy Layout to AGLayout**

Copy `src/components/Layout.jsx` to `src/modules/ag/layout/AGLayout.jsx`. No content changes needed — imports still resolve via `@/` alias.

- [ ] **Step 3: Copy all AG pages**

Copy each file in `src/pages/` to `src/modules/ag/pages/`. File names stay identical.

- [ ] **Step 4: Update App.jsx**

Replace the entire content of `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// AG module
import AGLayout from './modules/ag/layout/AGLayout'
import ZoneOverview from './modules/ag/pages/ZoneOverview'
import ClubDirectory from './modules/ag/pages/ClubDirectory'
import Membership from './modules/ag/pages/Membership'
import TRFGiving from './modules/ag/pages/TRFGiving'
import ClubExcellence from './modules/ag/pages/ClubExcellence'
import YouthServices from './modules/ag/pages/YouthServices'
import ServiceProjects from './modules/ag/pages/ServiceProjects'
import DistrictComparison from './modules/ag/pages/DistrictComparison'
import ClubDetail from './modules/ag/pages/ClubDetail'

// Club module
import ClubLayout from './modules/club/layout/ClubLayout'
import ClubOverview from './modules/club/pages/Overview'
import AvenueOfService from './modules/club/pages/AvenueOfService'
import Communication from './modules/club/pages/Communication'
import EGovernance from './modules/club/pages/EGovernance'
import Payments from './modules/club/pages/Payments'
import Directory from './modules/club/pages/Directory'

// District module
import DistrictLayout from './modules/district/layout/DistrictLayout'
import DistrictOverview from './modules/district/pages/Overview'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route index element={<Navigate to="/agdashboard/clubs" replace />} />

        {/* AG Dashboard */}
        <Route path="/agdashboard" element={<AGLayout />}>
          <Route index element={<Navigate to="/agdashboard/clubs" replace />} />
          <Route path="clubs" element={<ClubDirectory />} />
          <Route path="clubs/:clubId" element={<ClubDetail />} />
          <Route path="overview" element={<ZoneOverview />} />
          <Route path="membership" element={<Membership />} />
          <Route path="trf" element={<TRFGiving />} />
          <Route path="excellence" element={<ClubExcellence />} />
          <Route path="youth" element={<YouthServices />} />
          <Route path="projects" element={<ServiceProjects />} />
          <Route path="district" element={<DistrictComparison />} />
        </Route>

        {/* Club Dashboard */}
        <Route path="/clubdashboard" element={<ClubLayout />}>
          <Route index element={<Navigate to="/clubdashboard/overview" replace />} />
          <Route path="overview" element={<ClubOverview />} />
          <Route path="avenue" element={<AvenueOfService />} />
          <Route path="communication" element={<Communication />} />
          <Route path="egovernance" element={<EGovernance />} />
          <Route path="payments" element={<Payments />} />
          <Route path="directory" element={<Directory />} />
        </Route>

        {/* District Dashboard */}
        <Route path="/districtdashboard" element={<DistrictLayout />}>
          <Route index element={<Navigate to="/districtdashboard/overview" replace />} />
          <Route path="overview" element={<DistrictOverview />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/agdashboard/clubs" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 5: Update AGLayout nav links**

In `src/modules/ag/layout/AGLayout.jsx`, update the `NAV` array and `pageName` map to use `/agdashboard/` prefixes:

```jsx
const NAV = [
  { to: '/agdashboard/clubs', icon: LayoutDashboard, label: 'My Clubs' },
  { to: '/agdashboard/membership', icon: TrendingUp, label: 'Membership' },
  { to: '/agdashboard/trf', icon: Heart, label: 'Foundation & TRF' },
  { to: '/agdashboard/excellence', icon: Award, label: 'Goals' },
  { to: '/agdashboard/youth', icon: Star, label: 'Youth Services' },
  { to: '/agdashboard/projects', icon: Briefcase, label: 'Service Projects' },
  { to: '/agdashboard/district', icon: BarChart3, label: 'District View' },
]
```

Also update `pageName`:
```jsx
function pageName(pathname) {
  const map = {
    '/agdashboard/clubs':      'My Clubs',
    '/agdashboard/membership': 'Membership',
    '/agdashboard/trf':        'TRF & Foundation',
    '/agdashboard/excellence': 'Club Excellence',
    '/agdashboard/youth':      'Youth Services',
    '/agdashboard/projects':   'Service Projects',
    '/agdashboard/district':   'District View',
  }
  return map[pathname] ?? 'Dashboard'
}
```

- [ ] **Step 6: Verify AG Dashboard still works**

Run `npm run dev`, open `http://localhost:5173/agdashboard/clubs` — all existing pages should load normally.

- [ ] **Step 7: Commit**
```bash
git add src/
git commit -m "refactor: move AG pages under /agdashboard/ module structure"
```

---

## Task 2: Create Club Dashboard mock data

**Files:**
- Create: `src/modules/club/data/clubData.js`

- [ ] **Step 1: Create the data file**

Create `src/modules/club/data/clubData.js`:

```js
// Mock data for Club Dashboard — Thane City View
// Replace with real API data when available

export const CLUB = {
  id: 'thane-city-view',
  name: 'Thane City View',
  district: 3142,
  rotaryYear: '2025–26',
}

export const CLUB_STATS = {
  totalMembers: 142,
  activeMembers: 128,
  fullMembers: 97,
  associateMembers: 26,
  honoraryMembers: 19,
  newMembersThisYear: 8,
  terminatedThisYear: 0,
  avgAttendance: 73.8,
  trfRaised: 320000,
  trfGoal: 470000,
  phfContributors: 18,
  serviceProjects: 12,
  districtCitationScore: 42,
  districtCitationMax: 50,
  zonalAwards: 3,
  reportsSubmitted: 8,
  reportsTotal: 9,
}

export const MEMBER_GROWTH = [
  { month: 'Jul', members: 134 },
  { month: 'Aug', members: 135 },
  { month: 'Sep', members: 136 },
  { month: 'Oct', members: 137 },
  { month: 'Nov', members: 138 },
  { month: 'Dec', members: 139 },
  { month: 'Jan', members: 140 },
  { month: 'Feb', members: 141 },
  { month: 'Mar', members: 141 },
  { month: 'Apr', members: 142 },
]

export const ATTENDANCE_DATA = [
  { date: 'Mar 1', present: 116, total: 142, pct: 82 },
  { date: 'Mar 8', present: 107, total: 142, pct: 75 },
  { date: 'Mar 15', present: 97, total: 142, pct: 68 },
  { date: 'Mar 22', present: 114, total: 142, pct: 80 },
  { date: 'Mar 29', present: 85, total: 142, pct: 60 },
  { date: 'Apr 5', present: 111, total: 142, pct: 78 },
]

export const AVENUE_DATA = [
  { name: 'Club Service',          completed: 9,  target: 10, color: '#003DA5', beneficiaries: 380 },
  { name: 'Community Service',     completed: 8,  target: 10, color: '#16a34a', beneficiaries: 2400 },
  { name: 'New Generation',        completed: 6,  target: 10, color: '#f59e0b', beneficiaries: 1100 },
  { name: 'Vocational Service',    completed: 5,  target: 10, color: '#0891b2', beneficiaries: 720 },
  { name: 'Public Image',          completed: 4,  target: 10, color: '#e11d48', beneficiaries: 150 },
  { name: 'International Service', completed: 3,  target: 10, color: '#9333ea', beneficiaries: 220 },
]

export const PROJECTS = [
  { id: 1, name: 'Blood Donation Drive',      avenue: 'Community Service',  date: 'Mar 15, 2026', beneficiaries: 320,  funds: 0,       status: 'Completed' },
  { id: 2, name: 'Scholarship Distribution',  avenue: 'New Generation',     date: 'Mar 10, 2026', beneficiaries: 45,   funds: 180000,  status: 'Completed' },
  { id: 3, name: 'Tree Plantation Drive',     avenue: 'Community Service',  date: 'Feb 22, 2026', beneficiaries: 600,  funds: 45000,   status: 'Completed' },
  { id: 4, name: 'Vocational Training Camp',  avenue: 'Vocational Service', date: 'Apr 18, 2026', beneficiaries: 80,   funds: 72000,   status: 'In Progress' },
  { id: 5, name: 'Rotaract Charter Ceremony', avenue: 'New Generation',     date: 'Apr 25, 2026', beneficiaries: 200,  funds: 35000,   status: 'Upcoming' },
  { id: 6, name: 'Public Image Workshop',     avenue: 'Public Image',       date: 'Feb 10, 2026', beneficiaries: 60,   funds: 20000,   status: 'Completed' },
  { id: 7, name: 'Medical Camp',              avenue: 'Community Service',  date: 'Jan 18, 2026', beneficiaries: 450,  funds: 95000,   status: 'Completed' },
  { id: 8, name: 'Literacy Drive',            avenue: 'Vocational Service', date: 'Dec 5, 2025',  beneficiaries: 120,  funds: 30000,   status: 'Completed' },
]

export const EVENTS = [
  { id: 1, name: 'Weekly Meeting',          date: '2026-04-05', time: '7:00 PM',  venue: 'Hotel Regency, Thane',    type: 'Meeting'  },
  { id: 2, name: 'Blood Donation Camp',     date: '2026-04-12', time: '9:00 AM',  venue: 'Thane Civil Hospital',    type: 'Service'  },
  { id: 3, name: 'TRF Fundraiser Dinner',   date: '2026-04-20', time: '7:30 PM',  venue: 'Vivanta Hotel',           type: 'TRF'      },
  { id: 4, name: 'Rotaract Charter Ceremony',date: '2026-04-25', time: '5:00 PM', venue: 'Thane Club',              type: 'New Gen'  },
  { id: 5, name: 'District Citation Review', date: '2026-04-28', time: '6:00 PM', venue: 'Online / Zoom',           type: 'District' },
]

export const ANNOUNCEMENTS = [
  { id: 1, text: 'District citation deadline is April 30. Submit all reports before the deadline.', date: 'Apr 1, 2026',  priority: 'urgent' },
  { id: 2, text: 'Monthly report submission window is now open for March 2026. Due by Apr 10.',     date: 'Mar 31, 2026', priority: 'normal' },
  { id: 3, text: 'New Rotaract charter approved — congratulations to Thane West Rotaract club.',    date: 'Mar 28, 2026', priority: 'info'   },
  { id: 4, text: 'PPH Camp registration open. Confirm your club\'s participation by Apr 15.',       date: 'Mar 25, 2026', priority: 'action' },
]

export const DOCUMENTS = [
  { id: 1, name: 'March 2026 Newsletter',      type: 'PDF', size: '2.4 MB', date: 'Mar 30, 2026' },
  { id: 2, name: 'Attendance Register Q3',      type: 'XLS', size: '890 KB', date: 'Mar 15, 2026' },
  { id: 3, name: 'Annual Report Draft 2025',    type: 'DOC', size: '1.1 MB', date: 'Feb 28, 2026' },
  { id: 4, name: 'February 2026 Newsletter',    type: 'PDF', size: '1.9 MB', date: 'Feb 28, 2026' },
]

export const MONTHLY_REPORTS = [
  { month: 'March 2026',   submitted: null,       onTime: null,   status: 'Pending' },
  { month: 'February 2026', submitted: 'Mar 3',   onTime: true,   status: 'Accepted' },
  { month: 'January 2026',  submitted: 'Feb 5',   onTime: true,   status: 'Accepted' },
  { month: 'December 2025', submitted: 'Jan 8',   onTime: false,  status: 'Late' },
  { month: 'November 2025', submitted: 'Dec 2',   onTime: true,   status: 'Accepted' },
  { month: 'October 2025',  submitted: 'Nov 3',   onTime: true,   status: 'Accepted' },
]

export const CITATION_CHECKLIST = [
  { criterion: 'Membership Growth',      points: 10, earned: 10, detail: '+8 net new members',            status: 'done' },
  { criterion: 'Service Projects (≥10)', points: 10, earned: 10, detail: '12 projects completed',         status: 'done' },
  { criterion: 'TRF Contribution (≥₹2L)',points: 10, earned: 10, detail: '₹3.2L raised',                  status: 'done' },
  { criterion: 'Attendance (≥75%)',       points: 10, earned: 7,  detail: 'Avg 73.8% — need 2% more',      status: 'partial' },
  { criterion: 'Public Image Initiative', points: 10, earned: 5,  detail: '4 of 6 required activities done', status: 'incomplete' },
]

export const MEMBERS = [
  { id: 1,  name: 'Khushboo Tadkar',  role: 'President',        mobile: '+91 70456 77524', email: 'kt@gmail.com',        type: 'Full',      since: 2018, status: 'Active' },
  { id: 2,  name: 'Rashid Shaikh',    role: 'Secretary',        mobile: '+91 93721 07897', email: 'rashid@email.com',    type: 'Full',      since: 2016, status: 'Active' },
  { id: 3,  name: 'Praveen Mestry',   role: 'Foundation Chair', mobile: '+91 98026 36809', email: 'pmestry@email.com',   type: 'Full',      since: 2014, status: 'Active' },
  { id: 4,  name: 'Anita Kulkarni',   role: 'Treasurer',        mobile: '+91 99870 12345', email: 'anita.k@email.com',   type: 'Associate', since: 2020, status: 'Active' },
  { id: 5,  name: 'Vijay Nair',       role: 'Member',           mobile: '+91 88001 23456', email: 'vijay.n@email.com',   type: 'Full',      since: 2019, status: 'Inactive' },
  { id: 6,  name: 'Sunita Patil',     role: 'Member',           mobile: '+91 77002 34567', email: 'sunita@email.com',    type: 'Full',      since: 2017, status: 'Active' },
  { id: 7,  name: 'Ramesh Joshi',     role: 'Member',           mobile: '+91 66003 45678', email: 'ramesh@email.com',    type: 'Associate', since: 2021, status: 'Active' },
  { id: 8,  name: 'Deepa Sharma',     role: 'Member',           mobile: '+91 55004 56789', email: 'deepa@email.com',     type: 'Honorary',  since: 2015, status: 'Active' },
]

export const PAST_PRESIDENTS = [
  { name: 'Khushboo Tadkar',  year: '2025–26', achievement: 'Current president' },
  { name: 'Jayesh Thakkar',   year: '2024–25', achievement: 'District Citation winner' },
  { name: 'Arun Patil',       year: '2023–24', achievement: '100% attendance year' },
  { name: 'Khushboo Falloon', year: '2022–23', achievement: 'Best club award' },
  { name: 'Shrinath Wala',    year: '2021–22', achievement: 'PHF milestone' },
  { name: 'Priya Mehta',      year: '2020–21', achievement: 'Most projects in zone' },
]

export const BOARD = [
  { name: 'Khushboo Tadkar', role: 'President',        mobile: '+91 70456 77524', initials: 'KT', color: '#003DA5' },
  { name: 'Rashid Shaikh',   role: 'Secretary',        mobile: '+91 93721 07897', initials: 'RS', color: '#16a34a' },
  { name: 'Praveen Mestry',  role: 'Foundation Chair', mobile: '+91 98026 36809', initials: 'PM', color: '#ca8a04' },
  { name: 'Anita Kulkarni',  role: 'Treasurer',        mobile: '+91 99870 12345', initials: 'AK', color: '#9333ea' },
]

export const DUES = [
  { id: 1, name: 'Khushboo Tadkar', type: 'Full',      amount: 6000, dueDate: 'Mar 31', status: 'Paid',    initials: 'KT', color: '#003DA5' },
  { id: 2, name: 'Rashid Shaikh',   type: 'Full',      amount: 6000, dueDate: 'Mar 31', status: 'Paid',    initials: 'RS', color: '#9333ea' },
  { id: 3, name: 'Asha Kumar',      type: 'Associate', amount: 4000, dueDate: 'Mar 31', status: 'Overdue', initials: 'AK', color: '#e11d48' },
  { id: 4, name: 'Vijay Nair',      type: 'Full',      amount: 6000, dueDate: 'Apr 15', status: 'Pending', initials: 'VN', color: '#ca8a04' },
  { id: 5, name: 'Praveen Mestry',  type: 'Full',      amount: 6000, dueDate: 'Mar 31', status: 'Paid',    initials: 'PM', color: '#0891b2' },
]

export const EVENT_LINKS = [
  { id: 1, name: 'TRF Fundraiser Dinner',   price: '₹2,500 / seat', date: 'Apr 20', status: 'Active' },
  { id: 2, name: 'Rotaract Charter Ceremony', price: 'Free entry',   date: 'Apr 25', status: 'Active' },
  { id: 3, name: 'Annual Membership Renewal', price: '₹6,000 / member', date: 'Apr 30', status: 'Open' },
]

// Helpers
export const fmtINR = (n) => {
  if (!n && n !== 0) return '—'
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L'
  if (n >= 1000)   return '₹' + (n / 1000).toFixed(0) + 'K'
  return '₹' + n.toLocaleString('en-IN')
}

export const attendanceColor = (pct) => {
  if (pct >= 75) return 'text-green-600'
  if (pct >= 65) return 'text-amber-600'
  return 'text-red-600'
}

export const attendanceBg = (pct) => {
  if (pct >= 75) return '#16a34a'
  if (pct >= 65) return '#f59e0b'
  return '#ef4444'
}
```

- [ ] **Step 2: Commit**
```bash
git add src/modules/club/data/clubData.js
git commit -m "feat: add club dashboard mock data"
```

---

## Task 3: Create ClubLayout with collapsible sidebar dropdown

**Files:**
- Create: `src/modules/club/layout/ClubLayout.jsx`

- [ ] **Step 1: Create ClubLayout.jsx**

Create `src/modules/club/layout/ClubLayout.jsx`:

```jsx
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  LayoutDashboard, Shield, Phone, FileText,
  CreditCard, Users, ChevronRight, Menu, X,
} from 'lucide-react'
import { CLUB } from '../data/clubData'

const SUB_NAV = [
  { to: '/clubdashboard/overview',      icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clubdashboard/avenue',        icon: Shield,          label: 'Avenue of Service' },
  { to: '/clubdashboard/communication', icon: Phone,           label: 'Communication' },
  { to: '/clubdashboard/egovernance',   icon: FileText,        label: 'E-Governance & Reporting' },
  { to: '/clubdashboard/payments',      icon: CreditCard,      label: 'Payments' },
  { to: '/clubdashboard/directory',     icon: Users,           label: 'Directory & Leadership' },
]

const PAGE_TITLES = {
  '/clubdashboard/overview':      'Club Overview',
  '/clubdashboard/avenue':        'Avenue of Service',
  '/clubdashboard/communication': 'Communication',
  '/clubdashboard/egovernance':   'E-Governance & Reporting',
  '/clubdashboard/payments':      'Payments',
  '/clubdashboard/directory':     'Directory & Leadership',
}

export default function ClubLayout() {
  const location = useLocation()
  const [open, setOpen] = useState(false)       // mobile sidebar
  const [ddOpen, setDdOpen] = useState(true)    // dropdown always open by default

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#F7A81B,#e09210)', color: '#1e3a5f' }}
          >RI</div>
          <div>
            <p className="text-white text-[11px] font-bold leading-tight">Rotary International</p>
            <p className="text-slate-500 text-[9px] mt-0.5">Club Dashboard</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="px-3 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 bg-white/4 rounded-lg px-2.5 py-2">
          <Avatar className="h-6 w-6 rounded-md flex-shrink-0">
            <AvatarFallback className="text-white text-[9px] font-bold rounded-md" style={{ background: '#16a34a' }}>
              TC
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-white text-[11px] font-semibold truncate">{CLUB.name}</p>
            <p className="text-slate-500 text-[9px]">Club President</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-2 py-2">
        <p className="text-[8.5px] font-semibold text-slate-600 uppercase tracking-widest px-2 pt-2 pb-1">Navigation</p>

        {/* Collapsible Overview parent */}
        <button
          onClick={() => setDdOpen(v => !v)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
        >
          <LayoutDashboard size={13} className="flex-shrink-0" />
          <span className="flex-1 text-left">Overview</span>
          <ChevronRight
            size={12}
            className="flex-shrink-0 transition-transform duration-200"
            style={{ transform: ddOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
          />
        </button>

        {/* Dropdown items */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: ddOpen ? '400px' : '0px' }}
        >
          {SUB_NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 pl-8 pr-2 py-[5px] mx-1 my-[1px] rounded-md text-[10.5px] font-medium transition-all ${
                  isActive
                    ? 'text-sky-400 bg-blue-900/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/4'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: isActive ? '#60a5fa' : 'currentColor', opacity: isActive ? 1 : 0.5 }}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </ScrollArea>

      <Separator className="bg-white/5 mx-3" />
      <p className="text-slate-600 text-[8.5px] text-center tracking-widest uppercase py-2.5">
        Rotary Year {CLUB.rotaryYear}
      </p>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0" style={{ background: '#080e1c' }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative flex flex-col w-56 z-10 shadow-2xl" style={{ background: '#080e1c' }}>
            <button className="absolute top-3 right-3 text-slate-400 hover:text-white" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-5 h-[50px] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100" onClick={() => setOpen(true)}>
              <Menu size={18} />
            </button>
            <div>
              <p className="text-slate-800 font-semibold text-sm leading-tight">
                {PAGE_TITLES[location.pathname] ?? 'Club Dashboard'}
              </p>
              <p className="text-slate-400 text-[10px]">
                Club Dashboard / {CLUB.name}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify layout renders**

Open `http://localhost:5173/clubdashboard` — should redirect to `/clubdashboard/overview` and show the dark sidebar with the dropdown toggle.

- [ ] **Step 3: Commit**
```bash
git add src/modules/club/layout/ClubLayout.jsx
git commit -m "feat: add ClubLayout with collapsible sidebar dropdown"
```

---

## Task 4: Create shared StatCard component

**Files:**
- Create: `src/modules/club/components/StatCard.jsx`

This component is used by every Club Dashboard page.

- [ ] **Step 1: Create component**

Create `src/modules/club/components/StatCard.jsx`:

```jsx
import { cn } from '@/lib/utils'

export default function StatCard({ label, value, sub, subColor = 'muted', accent }) {
  const subClass = {
    up:     'text-green-600',
    down:   'text-red-600',
    muted:  'text-slate-400',
  }[subColor]

  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 relative overflow-hidden">
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-xl" style={{ background: accent }} />
      )}
      <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>
      <p className="text-[21px] font-extrabold text-slate-900 leading-none tabular-nums">{value}</p>
      {sub && <p className={cn('text-[9.5px] font-semibold mt-1.5', subClass)}>{sub}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/modules/club/components/StatCard.jsx
git commit -m "feat: add StatCard component for club dashboard pages"
```

---

## Task 5: Create Overview page

**Files:**
- Create: `src/modules/club/pages/Overview.jsx`

- [ ] **Step 1: Create Overview.jsx**

Create `src/modules/club/pages/Overview.jsx`:

```jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts'
import StatCard from '../components/StatCard'
import {
  CLUB_STATS, MEMBER_GROWTH, ATTENDANCE_DATA, AVENUE_DATA,
  ANNOUNCEMENTS, EVENTS, BOARD, CITATION_CHECKLIST, fmtINR, attendanceBg,
} from '../data/clubData'

const EVENT_COLORS = {
  Meeting:  { bg: 'bg-blue-50',   text: 'text-blue-700'  },
  Service:  { bg: 'bg-red-50',    text: 'text-red-700'   },
  TRF:      { bg: 'bg-amber-50',  text: 'text-amber-700' },
  'New Gen':{ bg: 'bg-purple-50', text: 'text-purple-700'},
  District: { bg: 'bg-slate-100', text: 'text-slate-600' },
}

const ANN_COLORS = {
  urgent: '#f59e0b',
  normal: '#003DA5',
  info:   '#16a34a',
  action: '#e11d48',
}

const membershipPie = [
  { name: 'Full',      value: CLUB_STATS.fullMembers,      fill: '#003DA5' },
  { name: 'Associate', value: CLUB_STATS.associateMembers, fill: '#60a5fa' },
  { name: 'Honorary',  value: CLUB_STATS.honoraryMembers,  fill: '#bfdbfe' },
]

const trfPct = Math.round((CLUB_STATS.trfRaised / CLUB_STATS.trfGoal) * 100)
const citationPct = Math.round((CLUB_STATS.districtCitationScore / CLUB_STATS.districtCitationMax) * 100)

export default function Overview() {
  return (
    <div className="space-y-4">

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Total Members"    value={CLUB_STATS.totalMembers}    sub="▲ 8 new this year"          subColor="up"   accent="#003DA5" />
        <StatCard label="Avg Attendance"   value={`${CLUB_STATS.avgAttendance}%`} sub="▲ 4% vs last month"   subColor="up"   accent="#16a34a" />
        <StatCard label="TRF Contribution" value={fmtINR(CLUB_STATS.trfRaised)} sub={`${trfPct}% of goal`}   subColor="muted" accent="#ca8a04" />
        <StatCard label="Service Projects" value={CLUB_STATS.serviceProjects} sub="▲ 3 this quarter"          subColor="up"   accent="#9333ea" />
        <StatCard label="District Citation" value={`${citationPct}%`}         sub={`${CLUB_STATS.districtCitationScore}/${CLUB_STATS.districtCitationMax} pts`} subColor="muted" accent="#e11d48" />
        <StatCard label="Active Members"   value={CLUB_STATS.activeMembers}   sub="90% of total"              subColor="muted" accent="#0891b2" />
      </div>

      {/* Row 1: 4 analytics cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">

        {/* Membership Mix Donut */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-[12px]">Membership Mix</CardTitle>
            <CardDescription className="text-[10px]">By category</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="flex items-center gap-3">
              <ResponsiveContainer width={90} height={90}>
                <PieChart>
                  <Pie data={membershipPie} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={2}>
                    {membershipPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 flex-1">
                {membershipPie.map(d => (
                  <div key={d.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                      <span className="text-[10px] text-slate-500">{d.name}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 tabular-nums">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TRF Goal */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-[12px]">TRF Goal</CardTitle>
            <CardDescription className="text-[10px]">{fmtINR(CLUB_STATS.trfGoal)} target this year</CardDescription>
          </CardHeader>
          <CardContent className="pt-3 pb-3 space-y-3">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-extrabold text-amber-600 tabular-nums">{trfPct}%</span>
              <span className="text-[10px] text-slate-400 mb-1">{fmtINR(CLUB_STATS.trfRaised)} raised</span>
            </div>
            <Progress value={trfPct} className="h-2" />
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">PHF Contributors</span>
                <span className="font-semibold text-slate-700">{CLUB_STATS.phfContributors}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Remaining</span>
                <span className="font-semibold text-red-600">{fmtINR(CLUB_STATS.trfGoal - CLUB_STATS.trfRaised)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Bars */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-[12px]">Meeting Attendance</CardTitle>
            <CardDescription className="text-[10px]">Last 6 meetings</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-2">
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={ATTENDANCE_DATA} barSize={14}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Attendance']}
                  contentStyle={{ fontSize: 10, borderRadius: 6 }}
                />
                <Bar dataKey="pct" radius={[3,3,0,0]}>
                  {ATTENDANCE_DATA.map((d, i) => (
                    <Cell key={i} fill={attendanceBg(d.pct)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-3 mt-1">
              <span className="text-[9px] text-slate-400">Avg <b className="text-slate-700">{CLUB_STATS.avgAttendance}%</b></span>
              <span className="text-[9px] text-slate-400">Best <b className="text-green-600">82%</b></span>
              <span className="text-[9px] text-slate-400">Low <b className="text-red-600">60%</b></span>
            </div>
          </CardContent>
        </Card>

        {/* District Citation */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-[12px]">District Citation</CardTitle>
            <CardDescription className="text-[10px]">{CLUB_STATS.districtCitationScore} / {CLUB_STATS.districtCitationMax} points</CardDescription>
          </CardHeader>
          <CardContent className="pt-3 pb-3 space-y-2">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-extrabold text-rose-600 tabular-nums">{citationPct}%</span>
            </div>
            <Progress value={citationPct} className="h-2 [&>div]:bg-rose-500" />
            <div className="space-y-1 mt-2">
              {CITATION_CHECKLIST.slice(0,3).map(c => (
                <div key={c.criterion} className="flex justify-between text-[10px]">
                  <span className="text-slate-500 truncate">{c.criterion}</span>
                  <span className={c.status === 'done' ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>
                    {c.status === 'done' ? '✓' : '~'} {c.earned}/{c.points}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Member Growth + Events */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">

        {/* Member Growth */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-[12px]">Member Growth Trend</CardTitle>
            <CardDescription className="text-[10px]">Monthly headcount — RY 2025–26</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={MEMBER_GROWTH}>
                <defs>
                  <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#003DA5" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#003DA5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[130, 145]} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                <Area
                  type="monotone" dataKey="members" stroke="#003DA5" strokeWidth={2}
                  fill="url(#memberGrad)" dot={{ r: 3, fill: '#003DA5', strokeWidth: 1.5, stroke: 'white' }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              <span className="text-[9.5px] text-slate-400">Start of year <b className="text-slate-700">134</b></span>
              <span className="text-[9.5px] text-slate-400">New <b className="text-green-600">+{CLUB_STATS.newMembersThisYear}</b></span>
              <span className="text-[9.5px] text-slate-400">Left <b className="text-red-600">-{CLUB_STATS.terminatedThisYear}</b></span>
              <span className="text-[9.5px] text-slate-400">Net growth <b className="text-blue-700">+{((CLUB_STATS.newMembersThisYear / 134) * 100).toFixed(1)}%</b></span>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Upcoming Events</CardTitle>
            </div>
            <button className="text-[10px] text-blue-700 font-medium hover:bg-blue-50 px-2 py-1 rounded">View all</button>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-50">
            {EVENTS.map(ev => {
              const [, m, d] = ev.date.split('-')
              const mon = new Date(ev.date).toLocaleString('default', { month: 'short' })
              const col = EVENT_COLORS[ev.type] ?? EVENT_COLORS.District
              return (
                <div key={ev.id} className="flex gap-2.5 py-2 items-center">
                  <div className="w-9 text-center bg-slate-50 rounded-lg py-1 flex-shrink-0">
                    <p className="text-[7.5px] font-bold text-slate-400 uppercase">{mon}</p>
                    <p className="text-[15px] font-extrabold text-slate-800 leading-tight">{d}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11.5px] font-semibold text-slate-800 truncate">{ev.name}</p>
                    <p className="text-[9.5px] text-slate-400">{ev.time} · {ev.venue}</p>
                  </div>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${col.bg} ${col.text}`}>{ev.type}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Avenue progress + BOD + Announcements */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">

        {/* Avenue of Service */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Avenue of Service</CardTitle>
              <CardDescription className="text-[10px]">Project completion this RY</CardDescription>
            </div>
            <button className="text-[10px] text-blue-700 font-medium hover:bg-blue-50 px-2 py-1 rounded">Details</button>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {AVENUE_DATA.map(a => (
              <div key={a.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10.5px] font-medium text-slate-600">{a.name}</span>
                  <span className="text-[10px] text-slate-400 tabular-nums">{a.completed}/{a.target}</span>
                </div>
                <Progress value={(a.completed / a.target) * 100} className="h-[5px]" style={{ '--progress-color': a.color }} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Board of Directors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Board of Directors</CardTitle>
              <CardDescription className="text-[10px]">RY 2025–26</CardDescription>
            </div>
            <button className="text-[10px] text-blue-700 font-medium hover:bg-blue-50 px-2 py-1 rounded">Manage</button>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-50">
            {BOARD.map(m => (
              <div key={m.name} className="flex items-center gap-2.5 py-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: m.color }}
                >{m.initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-semibold text-slate-800 truncate">{m.name}</p>
                  <p className="text-[9.5px] text-slate-400">{m.role}</p>
                </div>
                <span className="text-[9.5px] text-blue-700 font-medium">{m.mobile}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[12px]">Announcements</CardTitle>
            <button className="text-[10px] text-blue-700 font-medium hover:bg-blue-50 px-2 py-1 rounded">View all</button>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-50">
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} className="flex gap-2.5 py-2.5 items-start">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: ANN_COLORS[a.priority] }} />
                <div>
                  <p className="text-[10.5px] text-slate-600 leading-snug">{a.text}</p>
                  <p className="text-[9px] text-slate-400 mt-1">{a.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Fix Progress bar color**

The shadcn Progress component uses a CSS variable for the bar fill. Add this to `src/index.css` (or use Tailwind's `[&>div]` approach per page). The simplest approach — wrap each avenue progress in a div and pass inline style via the existing class pattern:

In Overview.jsx, replace the avenue `Progress` with a custom inline bar to avoid CSS variable complexity:

```jsx
{/* Replace the Progress component line with: */}
<div className="h-[5px] bg-slate-100 rounded-full overflow-hidden">
  <div
    className="h-full rounded-full transition-all"
    style={{ width: `${(a.completed / a.target) * 100}%`, background: a.color }}
  />
</div>
```

Apply same replacement for TRF Goal and District Citation Progress components:

For TRF Goal card:
```jsx
<div className="h-2 bg-slate-100 rounded-full overflow-hidden">
  <div className="h-full rounded-full bg-amber-500" style={{ width: `${trfPct}%` }} />
</div>
```

For District Citation card:
```jsx
<div className="h-2 bg-slate-100 rounded-full overflow-hidden">
  <div className="h-full rounded-full bg-rose-500" style={{ width: `${citationPct}%` }} />
</div>
```

- [ ] **Step 3: Verify Overview page**

Open `http://localhost:5173/clubdashboard/overview` — should show 6 KPI cards, 4 donut/bar/progress cards, area chart, events list, avenue bars, BOD cards, announcements.

- [ ] **Step 4: Commit**
```bash
git add src/modules/club/pages/Overview.jsx
git commit -m "feat: add Club Dashboard Overview page with charts and analytics"
```

---

## Task 6: Avenue of Service page

**Files:**
- Create: `src/modules/club/pages/AvenueOfService.jsx`

- [ ] **Step 1: Create AvenueOfService.jsx**

```jsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import StatCard from '../components/StatCard'
import { AVENUE_DATA, PROJECTS, fmtINR } from '../data/clubData'

const STATUS_STYLE = {
  'Completed':   { bg: 'bg-green-50',  text: 'text-green-700'  },
  'In Progress': { bg: 'bg-amber-50',  text: 'text-amber-700'  },
  'Upcoming':    { bg: 'bg-blue-50',   text: 'text-blue-700'   },
}

const AVENUE_TABS = ['All', 'Community Service', 'Club Service', 'New Generation', 'Vocational Service', 'Public Image', 'International Service']

export default function AvenueOfService() {
  const [tab, setTab] = useState('All')
  const filtered = tab === 'All' ? PROJECTS : PROJECTS.filter(p => p.avenue === tab)
  const totalBeneficiaries = AVENUE_DATA.reduce((s, a) => s + a.beneficiaries, 0)
  const totalFunds = PROJECTS.reduce((s, p) => s + p.funds, 0)
  const completed = PROJECTS.filter(p => p.status === 'Completed').length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Total Projects"   value={PROJECTS.length} sub="This RY"               subColor="muted" accent="#003DA5" />
        <StatCard label="Completed"        value={completed}       sub={`${Math.round(completed/PROJECTS.length*100)}% done`} subColor="up" accent="#16a34a" />
        <StatCard label="In Progress"      value={PROJECTS.filter(p=>p.status==='In Progress').length} sub="Ongoing" subColor="muted" accent="#f59e0b" />
        <StatCard label="Beneficiaries"    value={totalBeneficiaries.toLocaleString()} sub="People impacted" subColor="up" accent="#0891b2" />
        <StatCard label="Funds Deployed"   value={fmtINR(totalFunds)} sub="This year"          subColor="muted" accent="#9333ea" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-[12px]">Projects by Avenue</CardTitle>
            <CardDescription className="text-[10px]">Count completed this RY</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={AVENUE_DATA} barSize={28}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={n => n.split(' ')[0]} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={20} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                <Bar dataKey="completed" radius={[4,4,0,0]}>
                  {AVENUE_DATA.map((a,i) => <Cell key={i} fill={a.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[12px]">Beneficiary Reach</CardTitle>
            <CardDescription className="text-[10px]">People impacted by avenue</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {[...AVENUE_DATA].sort((a,b)=>b.beneficiaries-a.beneficiaries).map(a => (
              <div key={a.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10.5px] font-medium text-slate-600">{a.name}</span>
                  <span className="text-[10px] text-slate-400 tabular-nums">{a.beneficiaries.toLocaleString()}</span>
                </div>
                <div className="h-[5px] bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(a.beneficiaries/2400)*100}%`, background: a.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[12px]">All Projects</CardTitle>
            <CardDescription className="text-[10px]">Filter by avenue or status</CardDescription>
          </div>
          <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">
            + Add Project
          </button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-1.5 flex-wrap mb-3">
            {AVENUE_TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-medium transition-all ${
                  tab === t ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >{t}</button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Project Name</th>
                  <th className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Avenue</th>
                  <th className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Date</th>
                  <th className="text-right text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Beneficiaries</th>
                  <th className="text-right text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Funds</th>
                  <th className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => {
                  const s = STATUS_STYLE[p.status] ?? STATUS_STYLE['Upcoming']
                  const av = AVENUE_DATA.find(a => a.name === p.avenue)
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                      <td className="px-3 py-2.5 font-semibold text-slate-700">{p.name}</td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: av?.color ?? '#94a3b8' }} />
                          {p.avenue}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500">{p.date}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{p.beneficiaries}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{p.funds ? fmtINR(p.funds) : '—'}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>{p.status}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/modules/club/pages/AvenueOfService.jsx
git commit -m "feat: add Avenue of Service page with charts and projects table"
```

---

## Task 7: Communication page

**Files:**
- Create: `src/modules/club/pages/Communication.jsx`

- [ ] **Step 1: Create Communication.jsx**

```jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { EVENTS, ANNOUNCEMENTS, DOCUMENTS } from '../data/clubData'

const EVENT_COLORS = {
  Meeting:   { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  Service:   { bg: 'bg-red-50',    text: 'text-red-700'    },
  TRF:       { bg: 'bg-amber-50',  text: 'text-amber-700'  },
  'New Gen': { bg: 'bg-purple-50', text: 'text-purple-700' },
  District:  { bg: 'bg-slate-100', text: 'text-slate-600'  },
}

const ANN_COLORS = { urgent:'#f59e0b', normal:'#003DA5', info:'#16a34a', action:'#e11d48' }

const DOC_COLORS = { PDF:'bg-red-50 text-red-600', XLS:'bg-green-50 text-green-700', DOC:'bg-blue-50 text-blue-700' }

export default function Communication() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Upcoming Events"    value={EVENTS.length}        sub="Next 30 days"  subColor="muted" accent="#003DA5" />
        <StatCard label="Active Announcements" value={ANNOUNCEMENTS.length} sub="Active"       subColor="muted" accent="#f59e0b" />
        <StatCard label="Newsletters"         value={9}                    sub="This RY"       subColor="muted" accent="#0891b2" />
        <StatCard label="Shared Documents"    value={DOCUMENTS.length}     sub="Files"         subColor="muted" accent="#16a34a" />
      </div>

      {/* Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[12px]">Upcoming Events</CardTitle>
            <CardDescription className="text-[10px]">Scheduled for next 30 days</CardDescription>
          </div>
          <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">+ Add Event</button>
        </CardHeader>
        <CardContent className="pt-0 divide-y divide-slate-50">
          {EVENTS.map(ev => {
            const d = ev.date.split('-')[2]
            const mon = new Date(ev.date).toLocaleString('default', { month: 'short' })
            const col = EVENT_COLORS[ev.type] ?? EVENT_COLORS.District
            return (
              <div key={ev.id} className="flex gap-3 py-2.5 items-center">
                <div className="w-10 text-center bg-slate-50 rounded-lg py-1.5 flex-shrink-0">
                  <p className="text-[7.5px] font-bold text-slate-400 uppercase">{mon}</p>
                  <p className="text-[16px] font-extrabold text-slate-800 leading-tight">{d}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-slate-800">{ev.name}</p>
                  <p className="text-[10px] text-slate-400">{ev.time} · {ev.venue}</p>
                </div>
                <span className={`text-[9px] font-semibold px-2 py-1 rounded-md ${col.bg} ${col.text}`}>{ev.type}</span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {/* Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Announcements</CardTitle>
              <CardDescription className="text-[10px]">Active notices for members</CardDescription>
            </div>
            <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">+ Post</button>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-50">
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} className="flex gap-3 py-2.5 items-start">
                <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: ANN_COLORS[a.priority] }} />
                <div>
                  <p className="text-[11px] text-slate-600 leading-snug">{a.text}</p>
                  <p className="text-[9.5px] text-slate-400 mt-1">{a.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Documents & Newsletters</CardTitle>
              <CardDescription className="text-[10px]">Shared with club members</CardDescription>
            </div>
            <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">Upload</button>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-50">
            {DOCUMENTS.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-slate-50 -mx-4 px-4 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${DOC_COLORS[doc.type]}`}>
                  {doc.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-semibold text-slate-700">{doc.name}</p>
                  <p className="text-[9.5px] text-slate-400">{doc.size} · {doc.date}</p>
                </div>
                <button className="text-[11px] text-blue-700 hover:text-blue-900 font-medium px-1.5">↓</button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/modules/club/pages/Communication.jsx
git commit -m "feat: add Communication page"
```

---

## Task 8: E-Governance & Reporting page

**Files:**
- Create: `src/modules/club/pages/EGovernance.jsx`

- [ ] **Step 1: Create EGovernance.jsx**

```jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import StatCard from '../components/StatCard'
import {
  CLUB_STATS, ATTENDANCE_DATA, MONTHLY_REPORTS,
  CITATION_CHECKLIST, fmtINR, attendanceBg, attendanceColor,
} from '../data/clubData'

const STATUS_STYLE = {
  Accepted: { bg: 'bg-green-50',  text: 'text-green-700'  },
  Late:     { bg: 'bg-red-50',    text: 'text-red-600'    },
  Pending:  { bg: 'bg-amber-50',  text: 'text-amber-700'  },
}

const CITATION_ICON = { done: '✓', partial: '~', incomplete: '✕' }
const CITATION_COLOR = { done: 'text-green-600', partial: 'text-amber-600', incomplete: 'text-red-600' }
const CITATION_BG = { done: 'bg-green-50', partial: 'bg-amber-50', incomplete: 'bg-red-50' }

export default function EGovernance() {
  const trfPct = Math.round((CLUB_STATS.trfRaised / CLUB_STATS.trfGoal) * 100)
  const citationPct = Math.round((CLUB_STATS.districtCitationScore / CLUB_STATS.districtCitationMax) * 100)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Reports Submitted" value={`${CLUB_STATS.reportsSubmitted}/${CLUB_STATS.reportsTotal}`} sub="89% on time" subColor="up" accent="#003DA5" />
        <StatCard label="Avg Attendance"    value={`${CLUB_STATS.avgAttendance}%`} sub="▲ 4% YoY"    subColor="up"   accent="#16a34a" />
        <StatCard label="TRF Raised"        value={fmtINR(CLUB_STATS.trfRaised)} sub={`${trfPct}% of goal`} subColor="muted" accent="#ca8a04" />
        <StatCard label="District Citation" value={`${citationPct}%`}            sub={`${CLUB_STATS.districtCitationScore}/${CLUB_STATS.districtCitationMax} pts`} subColor="muted" accent="#9333ea" />
        <StatCard label="Zonal Awards"      value={CLUB_STATS.zonalAwards}       sub="This year"    subColor="up"   accent="#0891b2" />
      </div>

      <Card>
        <CardContent className="pt-4">
          <Tabs defaultValue="attendance">
            <TabsList variant="line" className="mb-4 flex-wrap gap-1 h-auto">
              {['attendance','monthly','trf','citation','ocv','pph','awards'].map(t => (
                <TabsTrigger key={t} value={t} className="text-[10.5px] capitalize">
                  {t === 'attendance' ? 'Attendance' :
                   t === 'monthly' ? 'Monthly Report' :
                   t === 'trf' ? 'TRF Contribution' :
                   t === 'citation' ? 'District Citation' :
                   t === 'ocv' ? 'OCV / GOV' :
                   t === 'pph' ? 'PPH Camp' : 'Zonal Awards'}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Attendance Tab */}
            <TabsContent value="attendance">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-semibold text-slate-700">Meeting Attendance Register</p>
                <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">Export</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['#','Meeting Date','Venue','Present','Total','Attendance %','Status'].map(h => (
                        <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {ATTENDANCE_DATA.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 cursor-pointer">
                        <td className="px-3 py-2.5 text-slate-400">{ATTENDANCE_DATA.length - i}</td>
                        <td className="px-3 py-2.5 font-semibold text-slate-700">{row.date}, 2026</td>
                        <td className="px-3 py-2.5 text-slate-500">Hotel Regency</td>
                        <td className="px-3 py-2.5 tabular-nums">{row.present}</td>
                        <td className="px-3 py-2.5 tabular-nums">{row.total}</td>
                        <td className="px-3 py-2.5">
                          <span className={`font-bold tabular-nums ${attendanceColor(row.pct)}`}>{row.pct}%</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                            row.pct >= 75 ? 'bg-green-50 text-green-700' :
                            row.pct >= 65 ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {row.pct >= 75 ? 'Good' : row.pct >= 65 ? 'Average' : 'Low'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Monthly Report Tab */}
            <TabsContent value="monthly">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-semibold text-slate-700">Monthly Report Submissions</p>
                <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">Submit Report</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['Month','Submitted On','On Time','Status'].map(h => (
                        <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {MONTHLY_REPORTS.map((r, i) => {
                      const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.Pending
                      return (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 font-semibold text-slate-700">{r.month}</td>
                          <td className="px-3 py-2.5 text-slate-500">{r.submitted ?? '—'}</td>
                          <td className="px-3 py-2.5">
                            {r.onTime === null ? <span className="text-slate-300">—</span> :
                             r.onTime ? <span className="text-green-600 font-semibold">Yes</span> :
                             <span className="text-red-600 font-semibold">Late</span>}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>{r.status}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* District Citation Tab */}
            <TabsContent value="citation">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-semibold text-slate-700">District Citation Checklist — {CLUB_STATS.districtCitationScore}/{CLUB_STATS.districtCitationMax} pts</p>
              </div>
              <div className="divide-y divide-slate-50">
                {CITATION_CHECKLIST.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${CITATION_BG[c.status]} ${CITATION_COLOR[c.status]}`}>
                      {CITATION_ICON[c.status]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11.5px] font-semibold text-slate-700">{c.criterion}</p>
                      <p className="text-[10px] text-slate-400">{c.detail}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${CITATION_BG[c.status]} ${CITATION_COLOR[c.status]}`}>
                      {c.earned}/{c.points} pts
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: `${Math.round((CLUB_STATS.districtCitationScore/CLUB_STATS.districtCitationMax)*100)}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  {CLUB_STATS.districtCitationScore} of {CLUB_STATS.districtCitationMax} points — {CLUB_STATS.districtCitationMax - CLUB_STATS.districtCitationScore} points needed for full citation
                </p>
              </div>
            </TabsContent>

            {/* TRF Tab */}
            <TabsContent value="trf">
              <p className="text-[12px] font-semibold text-slate-700 mb-3">TRF Contribution Summary</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-amber-700 tabular-nums">{fmtINR(CLUB_STATS.trfRaised)}</p>
                  <p className="text-[10px] text-amber-600 mt-1">Total Raised</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-slate-700 tabular-nums">{fmtINR(CLUB_STATS.trfGoal)}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Annual Goal</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-blue-700">{CLUB_STATS.phfContributors}</p>
                  <p className="text-[10px] text-blue-600 mt-1">PHF Contributors</p>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${trfPct}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">{trfPct}% of annual goal — {fmtINR(CLUB_STATS.trfGoal - CLUB_STATS.trfRaised)} remaining</p>
            </TabsContent>

            {/* Placeholder tabs */}
            {['ocv','pph','awards'].map(t => (
              <TabsContent key={t} value={t}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-slate-400 text-sm">No data available yet for this section.</p>
                  <button className="mt-3 text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">+ Add Entry</button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/modules/club/pages/EGovernance.jsx
git commit -m "feat: add E-Governance & Reporting page with tabs"
```

---

## Task 9: Payments page

**Files:**
- Create: `src/modules/club/pages/Payments.jsx`

- [ ] **Step 1: Create Payments.jsx**

```jsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { DUES, EVENT_LINKS, fmtINR } from '../data/clubData'

const STATUS_STYLE = {
  Paid:    { bg: 'bg-green-50',  text: 'text-green-700' },
  Pending: { bg: 'bg-amber-50',  text: 'text-amber-700' },
  Overdue: { bg: 'bg-red-50',    text: 'text-red-600'   },
}

const LINK_STYLE = {
  Active: { bg: 'bg-green-50', text: 'text-green-700' },
  Open:   { bg: 'bg-blue-50',  text: 'text-blue-700'  },
}

export default function Payments() {
  const [search, setSearch] = useState('')
  const totalDues = DUES.reduce((s, d) => s + d.amount, 0)
  const collected = DUES.filter(d => d.status === 'Paid').reduce((s, d) => s + d.amount, 0)
  const pending = totalDues - collected
  const pct = Math.round((collected / totalDues) * 100)
  const filtered = DUES.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Dues Collected"  value={fmtINR(collected)} sub={`${pct}% collection`}  subColor="up"   accent="#16a34a" />
        <StatCard label="Dues Pending"    value={fmtINR(pending)}   sub={`${DUES.filter(d=>d.status!=='Paid').length} members`} subColor="down" accent="#e11d48" />
        <StatCard label="Event Revenue"   value="₹2.1L"             sub="This RY"               subColor="muted" accent="#003DA5" />
        <StatCard label="TRF Collected"   value={fmtINR(320000)}    sub="68% of goal"           subColor="muted" accent="#ca8a04" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {/* Dues table */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Membership Dues</CardTitle>
              <CardDescription className="text-[10px]">Current year payment status</CardDescription>
            </div>
            <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">Send Reminder</button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 mb-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search members..."
                className="flex-1 bg-transparent text-[11px] outline-none text-slate-600 placeholder-slate-400"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Member','Type','Amount','Due Date','Status'].map(h => (
                      <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(d => {
                    const s = STATUS_STYLE[d.status]
                    return (
                      <tr key={d.id} className="hover:bg-slate-50 cursor-pointer">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                              style={{ background: d.color }}>{d.initials}</div>
                            <span className="font-semibold text-slate-700">{d.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-slate-500">{d.type}</td>
                        <td className="px-3 py-2.5 tabular-nums font-medium text-slate-700">₹{d.amount.toLocaleString()}</td>
                        <td className={`px-3 py-2.5 ${d.status === 'Overdue' ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>{d.dueDate}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>{d.status}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-3">
          {/* Collection summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[12px]">Collection Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 rounded-lg p-2.5">
                  <p className="text-[14px] font-extrabold text-green-700 tabular-nums">{fmtINR(collected)}</p>
                  <p className="text-[8.5px] text-green-600 mt-0.5">Collected</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2.5">
                  <p className="text-[14px] font-extrabold text-red-600 tabular-nums">{fmtINR(pending)}</p>
                  <p className="text-[8.5px] text-red-500 mt-0.5">Pending</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <p className="text-[14px] font-extrabold text-slate-700">{pct}%</p>
                  <p className="text-[8.5px] text-slate-500 mt-0.5">Recovery</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-500">Full Members (97)</span>
                  <span className="text-slate-600 font-medium tabular-nums">₹4.8L / ₹5.8L</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: '83%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-500">Associate (26)</span>
                  <span className="text-slate-600 font-medium tabular-nums">₹76K / ₹1.04L</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-sky-400" style={{ width: '73%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Online Event Links */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[12px]">Online Event Links</CardTitle>
              <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-md border border-blue-200">+ Create</button>
            </CardHeader>
            <CardContent className="pt-0 divide-y divide-slate-50">
              {EVENT_LINKS.map(l => {
                const s = LINK_STYLE[l.status]
                return (
                  <div key={l.id} className="flex items-center gap-2.5 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11.5px] font-semibold text-slate-700 truncate">{l.name}</p>
                      <p className="text-[9.5px] text-slate-400">{l.price} · {l.date}</p>
                    </div>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>{l.status}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/modules/club/pages/Payments.jsx
git commit -m "feat: add Payments page with dues table and collection summary"
```

---

## Task 10: Directory & Leadership page

**Files:**
- Create: `src/modules/club/pages/Directory.jsx`

- [ ] **Step 1: Create Directory.jsx**

```jsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { MEMBERS, PAST_PRESIDENTS, BOARD, CLUB_STATS } from '../data/clubData'

const TYPE_STYLE = {
  Full:      { bg: 'bg-blue-50',   text: 'text-blue-700'  },
  Associate: { bg: 'bg-purple-50', text: 'text-purple-700'},
  Honorary:  { bg: 'bg-slate-100', text: 'text-slate-600' },
}
const STATUS_STYLE = {
  Active:   { bg: 'bg-green-50', text: 'text-green-700' },
  Inactive: { bg: 'bg-amber-50', text: 'text-amber-700' },
}
const ROLE_COLORS = { President:'#003DA5', Secretary:'#16a34a', 'Foundation Chair':'#ca8a04', Treasurer:'#9333ea' }
const MEMBER_COLORS = ['#003DA5','#16a34a','#ca8a04','#9333ea','#0891b2','#e11d48','#f59e0b','#64748b']

export default function Directory() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  const filtered = MEMBERS.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.mobile.includes(search)
    const matchType = typeFilter === 'All' || m.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Total Members"   value={CLUB_STATS.totalMembers}        sub="▲ 8 this RY"    subColor="up"   accent="#003DA5" />
        <StatCard label="Full Members"    value={CLUB_STATS.fullMembers}         sub="68% of total"   subColor="muted" accent="#16a34a" />
        <StatCard label="Associates"      value={CLUB_STATS.associateMembers}    sub="18% of total"   subColor="muted" accent="#60a5fa" />
        <StatCard label="Honorary"        value={CLUB_STATS.honoraryMembers}     sub="13% of total"   subColor="muted" accent="#9333ea" />
        <StatCard label="Past Presidents" value={PAST_PRESIDENTS.length}        sub="On record"      subColor="muted" accent="#ca8a04" />
      </div>

      {/* Member Directory */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[12px]">Member Directory</CardTitle>
            <CardDescription className="text-[10px]">All members with contact details</CardDescription>
          </div>
          <div className="flex gap-2">
            <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">+ Add Member</button>
            <button className="text-[10.5px] font-medium text-slate-600 hover:bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">Export</button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Search + filters */}
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 min-w-48">
              <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email or mobile..."
                className="flex-1 bg-transparent text-[11px] outline-none text-slate-600 placeholder-slate-400" />
            </div>
            {['All','Full','Associate','Honorary'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-medium transition-all ${
                  typeFilter === t ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >{t}</button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Member','Mobile No.','Email','Type','Member Since','Status','Actions'].map(h => (
                    <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((m, i) => {
                  const ts = TYPE_STYLE[m.type]
                  const ss = STATUS_STYLE[m.status]
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                            style={{ background: MEMBER_COLORS[i % MEMBER_COLORS.length] }}>
                            {m.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700">{m.name}</p>
                            <p className="text-[9px] text-slate-400">{m.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 tabular-nums">{m.mobile}</td>
                      <td className="px-3 py-2.5 text-slate-500 text-[10px]">{m.email}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${ts.bg} ${ts.text}`}>{m.type}</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 tabular-nums">{m.since}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${ss.bg} ${ss.text}`}>{m.status}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-2">
                          <button className="text-[10px] text-blue-700 hover:text-blue-900 font-medium">Edit</button>
                          <button className="text-[10px] text-red-500 hover:text-red-700 font-medium">Remove</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {/* Past Presidents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Past Presidents</CardTitle>
              <CardDescription className="text-[10px]">Club leadership history</CardDescription>
            </div>
            <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-md border border-blue-200">+ Add</button>
          </CardHeader>
          <CardContent className="pt-0">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Name','Year','Notable Achievement'].map(h => (
                    <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {PAST_PRESIDENTS.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-semibold text-slate-700">{p.name}</td>
                    <td className="px-3 py-2.5 text-slate-500 tabular-nums">{p.year}</td>
                    <td className="px-3 py-2.5 text-slate-500">{p.achievement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Board of Directors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Board of Directors 2025–26</CardTitle>
            </div>
            <button className="text-[10.5px] font-medium text-slate-600 hover:bg-slate-50 px-2 py-1 rounded-md border border-slate-200">Export</button>
          </CardHeader>
          <CardContent className="pt-0">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Member','Role','Contact'].map(h => (
                    <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {BOARD.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                          style={{ background: b.color }}>{b.initials}</div>
                        <span className="font-semibold text-slate-700">{b.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: b.color + '18', color: b.color }}>{b.role}</span>
                    </td>
                    <td className="px-3 py-2.5 text-blue-700 text-[10.5px] font-medium tabular-nums">{b.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/modules/club/pages/Directory.jsx
git commit -m "feat: add Directory & Leadership page"
```

---

## Task 11: District Dashboard placeholder

**Files:**
- Create: `src/modules/district/layout/DistrictLayout.jsx`
- Create: `src/modules/district/pages/Overview.jsx`

- [ ] **Step 1: Create DistrictLayout.jsx**

```jsx
import { Outlet, useLocation } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

export default function DistrictLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0" style={{ background: '#080e1c' }}>
        <div className="px-4 py-4 border-b border-white/5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#F7A81B,#e09210)', color: '#1e3a5f' }}>RI</div>
          <div>
            <p className="text-white text-[11px] font-bold leading-tight">Rotary International</p>
            <p className="text-slate-500 text-[9px] mt-0.5">District Dashboard</p>
          </div>
        </div>
        <div className="px-3 py-4">
          <div className="flex items-center gap-2 bg-white/4 rounded-lg px-2.5 py-2">
            <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-[9px] font-bold text-white">D</div>
            <div>
              <p className="text-white text-[11px] font-semibold">District 3142</p>
              <p className="text-slate-500 text-[9px]">DG Office</p>
            </div>
          </div>
        </div>
        <Separator className="bg-white/5 mx-3" />
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-purple-900/30 text-purple-300 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Overview
          </div>
        </div>
        <div className="mt-auto px-3 py-2.5 border-t border-white/5 text-[8.5px] text-slate-600 text-center uppercase tracking-widest">
          RY 2025–26
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-5 h-[50px] flex items-center">
          <div>
            <p className="text-slate-800 font-semibold text-sm">District Dashboard</p>
            <p className="text-slate-400 text-[10px]">District 3142 / Overview</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5"><Outlet /></main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create DistrictOverview.jsx**

```jsx
export default function DistrictOverview() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
        <svg width="28" height="28" fill="none" stroke="#9333ea" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800">District Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1">Coming soon — District 3142 analytics and reporting</p>
      </div>
      <div className="flex gap-3">
        <a href="/agdashboard/clubs" className="text-[11px] font-medium text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 transition-colors">
          Go to AG Dashboard
        </a>
        <a href="/clubdashboard/overview" className="text-[11px] font-medium text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 transition-colors">
          Go to Club Dashboard
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**
```bash
git add src/modules/district/
git commit -m "feat: add District Dashboard placeholder layout and overview"
```

---

## Task 12: Final wiring + smoke test

- [ ] **Step 1: Verify all routes work**

Start dev server: `npm run dev`

Test each URL:
- `http://localhost:5173` → redirects to `/agdashboard/clubs`
- `http://localhost:5173/agdashboard/clubs` → AG ClubDirectory
- `http://localhost:5173/agdashboard/membership` → Membership page
- `http://localhost:5173/clubdashboard` → redirects to `/clubdashboard/overview`
- `http://localhost:5173/clubdashboard/overview` → Overview with charts
- `http://localhost:5173/clubdashboard/avenue` → Avenue of Service
- `http://localhost:5173/clubdashboard/communication` → Communication
- `http://localhost:5173/clubdashboard/egovernance` → E-Governance tabs
- `http://localhost:5173/clubdashboard/payments` → Payments
- `http://localhost:5173/clubdashboard/directory` → Directory
- `http://localhost:5173/districtdashboard` → District placeholder

- [ ] **Step 2: Check sidebar dropdown**

On `/clubdashboard/overview` — click the "Overview" parent in sidebar — dropdown should collapse/expand. Each sub-item should highlight when active.

- [ ] **Step 3: Check responsive**

Resize browser to mobile width — hamburger should appear, sidebar should open as overlay.

- [ ] **Step 4: Final commit**
```bash
git add .
git commit -m "feat: complete Club Dashboard module with 6 pages and 3-module routing"
```

---

## Self-Review

**Spec coverage check:**
- ✅ 3 modules with independent URL prefixes
- ✅ AG pages moved to `/agdashboard/`
- ✅ Club Dashboard: Overview, Avenue, Communication, E-Governance, Payments, Directory
- ✅ Sidebar dropdown with collapsible Overview group
- ✅ shadcn Card, Badge, Tabs, Progress used throughout
- ✅ Recharts: AreaChart, BarChart, PieChart
- ✅ StatCard shared component
- ✅ Mock data in `clubData.js`
- ✅ District Dashboard placeholder
- ✅ Mobile responsive sidebar

**Placeholder scan:** No TBD/TODO in code steps — all code is complete.

**Type consistency:** `fmtINR`, `attendanceBg`, `attendanceColor` defined in `clubData.js` and used consistently across pages. `StatCard` props: `label`, `value`, `sub`, `subColor`, `accent` — consistent across all 6 pages.
