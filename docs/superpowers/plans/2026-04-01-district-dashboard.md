# District Dashboard (5656) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build out the District Dashboard with 7 functional modules for District 5656, replacing the current "coming soon" placeholder.

**Architecture:** Per-module data files under `src/modules/district/data/`, 8 page components under `src/modules/district/pages/`, updated layout with full sidebar navigation. Follows the same patterns as the Club Dashboard module (`src/modules/club/`).

**Tech Stack:** React 18, React Router v6, Tailwind CSS, shadcn/ui (Card, ScrollArea, Separator, Avatar), Lucide React

---

## File Map

**Modified:**
- `src/App.jsx` — add 7 new district routes
- `src/modules/district/layout/DistrictLayout.jsx` — update to District 5656, add 8-item sidebar nav + mobile hamburger

**Created:**
- `src/modules/district/data/directoryData.js`
- `src/modules/district/data/committeeData.js`
- `src/modules/district/data/clubsData.js`
- `src/modules/district/data/monthlyReportData.js`
- `src/modules/district/data/moderatorData.js`
- `src/modules/district/data/agData.js`
- `src/modules/district/pages/Overview.jsx` (replaces placeholder)
- `src/modules/district/pages/Directory.jsx`
- `src/modules/district/pages/Committee.jsx`
- `src/modules/district/pages/Clubs.jsx`
- `src/modules/district/pages/MonthlyReport.jsx`
- `src/modules/district/pages/Moderator.jsx`
- `src/modules/district/pages/AG.jsx`
- `src/modules/district/pages/WebsiteData.jsx`

---

## Task 1: Create data files

**Files:**
- Create: `src/modules/district/data/directoryData.js`
- Create: `src/modules/district/data/committeeData.js`
- Create: `src/modules/district/data/clubsData.js`
- Create: `src/modules/district/data/monthlyReportData.js`
- Create: `src/modules/district/data/moderatorData.js`
- Create: `src/modules/district/data/agData.js`

- [ ] **Step 1: Create directoryData.js**

```js
// src/modules/district/data/directoryData.js
export const DISTRICT = { number: 5656, rotaryYear: '2025–26' }

export const DIRECTORY_MEMBERS = [
  { id: 1,  name: 'Rajesh Sharma',    mobile: '+91 98765 43210', email: 'rajesh.sharma@example.com',   isAdmin: true  },
  { id: 2,  name: 'Anita Mehta',      mobile: '+91 98765 43211', email: 'anita.mehta@example.com',     isAdmin: false },
  { id: 3,  name: 'Suresh Patil',     mobile: '+91 98765 43212', email: 'suresh.patil@example.com',    isAdmin: true  },
  { id: 4,  name: 'Priya Nair',       mobile: '+91 98765 43213', email: 'priya.nair@example.com',      isAdmin: false },
  { id: 5,  name: 'Mukesh Dc',        mobile: '+91 98765 43214', email: 'mukesh.dc@example.com',       isAdmin: true  },
  { id: 6,  name: 'Dikshita Kasare',  mobile: '+91 98765 43215', email: 'dikshita.k@example.com',      isAdmin: false },
  { id: 7,  name: 'Kalpesh A',        mobile: '+91 98765 43216', email: 'kalpesh.a@example.com',       isAdmin: false },
  { id: 8,  name: 'Feba Joseph',      mobile: '+91 98765 43217', email: 'feba.joseph@example.com',     isAdmin: true  },
  { id: 9,  name: 'Ravi Kumar',       mobile: '+91 98765 43218', email: 'ravi.kumar@example.com',      isAdmin: false },
  { id: 10, name: 'Sunita Verma',     mobile: '+91 98765 43219', email: 'sunita.verma@example.com',    isAdmin: false },
  { id: 11, name: 'Deepak Joshi',     mobile: '+91 98765 43220', email: 'deepak.joshi@example.com',    isAdmin: false },
  { id: 12, name: 'Meena Pillai',     mobile: '+91 98765 43221', email: 'meena.pillai@example.com',    isAdmin: false },
  { id: 13, name: 'Arun Desai',       mobile: '+91 98765 43222', email: 'arun.desai@example.com',      isAdmin: false },
  { id: 14, name: 'Pooja Thakkar',    mobile: '+91 98765 43223', email: 'pooja.thakkar@example.com',   isAdmin: false },
  { id: 15, name: 'Nitin Kulkarni',   mobile: '+91 98765 43224', email: 'nitin.kulkarni@example.com',  isAdmin: false },
  { id: 16, name: 'Kavita Shah',      mobile: '+91 98765 43225', email: 'kavita.shah@example.com',     isAdmin: false },
  { id: 17, name: 'Vikas Gupta',      mobile: '+91 98765 43226', email: 'vikas.gupta@example.com',     isAdmin: false },
  { id: 18, name: 'Lalita Rao',       mobile: '+91 98765 43227', email: 'lalita.rao@example.com',      isAdmin: false },
  { id: 19, name: 'Sanjay Bhatt',     mobile: '+91 98765 43228', email: 'sanjay.bhatt@example.com',    isAdmin: false },
  { id: 20, name: 'Rekha Iyer',       mobile: '+91 98765 43229', email: 'rekha.iyer@example.com',      isAdmin: false },
  { id: 21, name: 'Harish Malhotra',  mobile: '+91 98765 43230', email: 'harish.m@example.com',        isAdmin: false },
  { id: 22, name: 'Usha Patel',       mobile: '+91 98765 43231', email: 'usha.patel@example.com',      isAdmin: false },
  { id: 23, name: 'Prakash Naik',     mobile: '+91 98765 43232', email: 'prakash.naik@example.com',    isAdmin: false },
  { id: 24, name: 'Seema Choudhary',  mobile: '+91 98765 43233', email: 'seema.c@example.com',         isAdmin: false },
  { id: 25, name: 'Girish Deshpande', mobile: '+91 98765 43234', email: 'girish.d@example.com',        isAdmin: false },
  { id: 26, name: 'Nandita Shetty',   mobile: '+91 98765 43235', email: 'nandita.s@example.com',       isAdmin: false },
  { id: 27, name: 'Ramesh Hegde',     mobile: '+91 98765 43236', email: 'ramesh.hegde@example.com',    isAdmin: false },
  { id: 28, name: 'Shobha Krishnan',  mobile: '+91 98765 43237', email: 'shobha.k@example.com',        isAdmin: false },
  { id: 29, name: 'Vivek Jain',       mobile: '+91 98765 43238', email: 'vivek.jain@example.com',      isAdmin: false },
]
```

- [ ] **Step 2: Create committeeData.js**

```js
// src/modules/district/data/committeeData.js
export const COMMITTEE_MEMBERS = [
  { id: 1, name: 'Mukesh Dc',       mobile: '+91 98765 00001', email: 'mukesh.dc@example.com',      designation: 'District Governor 2025-26', club: 'Thane City View', remark: 'Lead DG for RY 2025-26' },
  { id: 2, name: 'Dikshita Kasare', mobile: '+91 98765 00002', email: 'dikshita.k@example.com',     designation: 'Vice President',            club: 'Thane City View', remark: '' },
  { id: 3, name: 'Kalpesh A',       mobile: '+91 98765 00003', email: 'kalpesh.a@example.com',      designation: 'Rotarian',                  club: 'Thane City View', remark: '' },
  { id: 4, name: 'Feba Joseph',     mobile: '+91 98765 00004', email: 'feba.joseph@example.com',    designation: 'District Secretary',        club: 'Lake Shore Club', remark: 'Administrative lead' },
  { id: 5, name: 'Anita Mehta',     mobile: '+91 98765 00005', email: 'anita.mehta@example.com',    designation: 'Treasurer',                 club: 'Owala',           remark: '' },
  { id: 6, name: 'Rajesh Sharma',   mobile: '+91 98765 00006', email: 'rajesh.sharma@example.com',  designation: 'Sergeant-at-Arms',          club: 'Tikujiniwadi',    remark: '' },
]

export const DESIGNATIONS = [
  'District Governor 2025-26',
  'Vice President',
  'District Secretary',
  'Treasurer',
  'Sergeant-at-Arms',
  'Rotarian',
  'Committee Chair',
  'Advisory Member',
]
```

- [ ] **Step 3: Create clubsData.js**

```js
// src/modules/district/data/clubsData.js
export const CLUBS_5656 = [
  { id: 'lakeshore',         name: 'Lake Shore Club',      meetingDay: 'Friday',  meetingTime: '12:00 AM', members: 38 },
  { id: 'newclub',           name: 'New Club Test Entry',  meetingDay: 'Monday',  meetingTime: '1:30 AM',  members: 12 },
  { id: 'owala',             name: 'Owala',                meetingDay: 'Monday',  meetingTime: '12:00 AM', members: 24 },
  { id: 'rotary-club-of-leo',name: 'Rotary Club of Leo',   meetingDay: 'Monday',  meetingTime: '5:00 PM',  members: 31 },
  { id: 'thane-city-view',   name: 'Thane City View',      meetingDay: 'Tuesday', meetingTime: '1:30 PM',  members: 28 },
  { id: 'tikujiniwadi',      name: 'Tikujiniwadi',         meetingDay: 'Monday',  meetingTime: '12:00 AM', members: 19 },
]
```

- [ ] **Step 4: Create monthlyReportData.js**

```js
// src/modules/district/data/monthlyReportData.js
export const MONTHS = [
  { id: 'jul-2025', label: 'July 2025' },
  { id: 'aug-2025', label: 'August 2025' },
  { id: 'sep-2025', label: 'September 2025' },
  { id: 'oct-2025', label: 'October 2025' },
  { id: 'nov-2025', label: 'November 2025' },
  { id: 'dec-2025', label: 'December 2025' },
  { id: 'jan-2026', label: 'January 2026' },
  { id: 'feb-2026', label: 'February 2026' },
  { id: 'mar-2026', label: 'March 2026' },
  { id: 'apr-2026', label: 'April 2026' },
]

// submitted: number of clubs that submitted; total: total clubs in district
export const MONTHLY_STATUS = {
  'jul-2025': { submitted: 6, total: 6 },
  'aug-2025': { submitted: 5, total: 6 },
  'sep-2025': { submitted: 6, total: 6 },
  'oct-2025': { submitted: 4, total: 6 },
  'nov-2025': { submitted: 6, total: 6 },
  'dec-2025': { submitted: 5, total: 6 },
  'jan-2026': { submitted: 3, total: 6 },
  'feb-2026': { submitted: 6, total: 6 },
  'mar-2026': { submitted: 2, total: 6 },
  'apr-2026': { submitted: 0, total: 6 },
}
```

- [ ] **Step 5: Create moderatorData.js**

```js
// src/modules/district/data/moderatorData.js
export const MODERATORS = [
  { id: 1, name: 'Arun Desai',      club: 'Thane City View',     mobile: '+91 98765 11111', email: 'arun.desai@example.com'   },
  { id: 2, name: 'Priya Nair',      club: 'Lake Shore Club',     mobile: '+91 98765 22222', email: 'priya.nair@example.com'   },
  { id: 3, name: 'Suresh Patil',    club: 'Owala',               mobile: '+91 98765 33333', email: 'suresh.patil@example.com' },
  { id: 4, name: 'Meena Pillai',    club: 'Rotary Club of Leo',  mobile: '+91 98765 44444', email: 'meena.pillai@example.com' },
  { id: 5, name: 'Nitin Kulkarni',  club: 'Tikujiniwadi',        mobile: '+91 98765 55555', email: 'nitin.k@example.com'      },
]
```

- [ ] **Step 6: Create agData.js**

```js
// src/modules/district/data/agData.js
export const ZONES = [
  { id: 1, zoneName: 'Zone A', agName: 'Anita Mehta',   agMobile: '+91 98765 44401', agEmail: 'anita.mehta@example.com',  clubs: ['Thane City View', 'Lake Shore Club'] },
  { id: 2, zoneName: 'Zone B', agName: 'Rajiv Sharma',  agMobile: '+91 98765 44402', agEmail: 'rajiv.sharma@example.com', clubs: ['Owala', 'Tikujiniwadi'] },
  { id: 3, zoneName: 'Zone C', agName: 'Meena Joshi',   agMobile: '+91 98765 44403', agEmail: 'meena.joshi@example.com',  clubs: ['Rotary Club of Leo', 'New Club Test Entry'] },
]
```

- [ ] **Step 7: Commit data files**

```bash
git add src/modules/district/data/
git commit -m "feat(district): add mock data files for all 7 district modules"
```

---

## Task 2: Update DistrictLayout

**Files:**
- Modify: `src/modules/district/layout/DistrictLayout.jsx`

- [ ] **Step 1: Replace full file content**

```jsx
// src/modules/district/layout/DistrictLayout.jsx
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Menu, X } from 'lucide-react'

const NAV = [
  { to: '/districtdashboard/overview',      label: 'Overview'             },
  { to: '/districtdashboard/directory',     label: 'Directory',  badge: 29 },
  { to: '/districtdashboard/committee',     label: 'District Committee'   },
  { to: '/districtdashboard/clubs',         label: 'Clubs',      badge: 6  },
  { to: '/districtdashboard/monthly-report',label: 'Club Monthly Report'  },
  { to: '/districtdashboard/moderator',     label: 'Club Moderator'       },
  { to: '/districtdashboard/ag',            label: 'AG / Zones'           },
  { to: '/districtdashboard/website-data',  label: 'Website Data'         },
]

const PAGE_TITLES = {
  '/districtdashboard/overview':       'District Dashboard',
  '/districtdashboard/directory':      'Directory',
  '/districtdashboard/committee':      'District Committee',
  '/districtdashboard/clubs':          'Clubs',
  '/districtdashboard/monthly-report': 'Club Monthly Report',
  '/districtdashboard/moderator':      'Club Moderator',
  '/districtdashboard/ag':             'AG / Zones',
  '/districtdashboard/website-data':   'Website Data',
}

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <img src="/logo.png" alt="Rotary" className="h-10 w-auto" />
        <p className="text-xs text-slate-400 mt-2 font-medium">District Dashboard</p>
      </div>

      {/* Identity card */}
      <div className="px-3 py-3 border-b border-white/10">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
          <div className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: '#F7A81B', color: '#1e3a5f' }}>DG</div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold">District 5656</p>
            <p className="text-slate-400 text-xs">DG Office</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-2 py-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pb-2">Navigation</p>
        {NAV.map(({ to, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 mx-0.5 my-0.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-[#1e3a5f] font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#F7A81B' } : {}}
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: isActive ? '#1e3a5f' : '#475569' }} />
                  {label}
                </span>
                {badge != null && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#1e3a5f]/20 text-[#1e3a5f]' : 'bg-white/10 text-slate-300'
                  }`}>{badge}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </ScrollArea>

      <Separator className="bg-white/10 mx-3" />
      <p className="text-slate-500 text-xs text-center tracking-widest uppercase py-3">RY 2025–26</p>
    </div>
  )
}

export default function DistrictLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const title = PAGE_TITLES[location.pathname] ?? 'District Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0" style={{ background: '#0f172a' }}>
        <SidebarContent onClose={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative flex flex-col w-60 z-10 shadow-2xl" style={{ background: '#0f172a' }}>
            <button className="absolute top-3 right-3 text-slate-400 hover:text-white" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
            <SidebarContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b-2 px-6 h-14 flex items-center justify-between flex-shrink-0"
          style={{ borderBottomColor: '#F7A81B' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <p className="text-slate-800 font-semibold text-base leading-tight">{title}</p>
              <p className="text-slate-400 text-xs mt-0.5">District 5656 · RY 2025–26</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/district/layout/DistrictLayout.jsx
git commit -m "feat(district): update DistrictLayout to District 5656 with full sidebar nav and mobile menu"
```

---

## Task 3: Update App.jsx routes

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add imports at top of App.jsx (after existing district imports)**

Add these imports after `import DistrictOverview from './modules/district/pages/Overview'`:

```jsx
import DistrictDirectory   from './modules/district/pages/Directory'
import DistrictCommittee   from './modules/district/pages/Committee'
import DistrictClubs       from './modules/district/pages/Clubs'
import DistrictMonthlyReport from './modules/district/pages/MonthlyReport'
import DistrictModerator   from './modules/district/pages/Moderator'
import DistrictAG          from './modules/district/pages/AG'
import DistrictWebsiteData from './modules/district/pages/WebsiteData'
```

- [ ] **Step 2: Replace the District Dashboard route block**

Find and replace:
```jsx
        {/* District Dashboard */}
        <Route path="/districtdashboard" element={<DistrictLayout />}>
          <Route index element={<Navigate to="/districtdashboard/overview" replace />} />
          <Route path="overview" element={<DistrictOverview />} />
        </Route>
```

With:
```jsx
        {/* District Dashboard */}
        <Route path="/districtdashboard" element={<DistrictLayout />}>
          <Route index element={<Navigate to="/districtdashboard/overview" replace />} />
          <Route path="overview"       element={<DistrictOverview />} />
          <Route path="directory"      element={<DistrictDirectory />} />
          <Route path="committee"      element={<DistrictCommittee />} />
          <Route path="clubs"          element={<DistrictClubs />} />
          <Route path="monthly-report" element={<DistrictMonthlyReport />} />
          <Route path="moderator"      element={<DistrictModerator />} />
          <Route path="ag"             element={<DistrictAG />} />
          <Route path="website-data"   element={<DistrictWebsiteData />} />
        </Route>
```

- [ ] **Step 3: Commit**

Note: The page files don't exist yet — the app will show errors until Task 4 onwards. That is expected. If you want the app to run cleanly after this commit, do Tasks 4–11 first, then commit App.jsx last.

```bash
git add src/App.jsx
git commit -m "feat(district): add routes for all 7 district dashboard modules"
```

---

## Task 4: Overview page (7-tile home)

**Files:**
- Modify: `src/modules/district/pages/Overview.jsx`

- [ ] **Step 1: Replace full file content**

```jsx
// src/modules/district/pages/Overview.jsx
import { useNavigate } from 'react-router-dom'

const MODULES = [
  {
    label: 'Directory', badge: 29, route: '/districtdashboard/directory', color: '#003DA5',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: 'District Committee', badge: null, route: '/districtdashboard/committee', color: '#16a34a',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    label: 'Clubs', badge: 6, route: '/districtdashboard/clubs', color: '#9333ea',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: 'Club Monthly Report', badge: null, route: '/districtdashboard/monthly-report', color: '#0891b2',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    label: 'Club Moderator', badge: null, route: '/districtdashboard/moderator', color: '#ca8a04',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    label: 'AG / Zones', badge: null, route: '/districtdashboard/ag', color: '#e11d48',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    label: 'Website Data', badge: null, route: '/districtdashboard/website-data', color: '#64748b',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
      </svg>
    ),
  },
]

export default function DistrictOverview() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">District 5656</h1>
        <p className="text-slate-400 text-sm mt-1">Rotary Year 2025–26 · 6 Clubs · 152 Members</p>
      </div>

      {/* Module tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {MODULES.map(({ label, badge, route, color, icon }) => (
          <button
            key={route}
            onClick={() => navigate(route)}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center gap-3 hover:shadow-md hover:border-slate-300 transition-all text-center group"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: color + '18', color }}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-snug">{label}</p>
              {badge != null && (
                <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: color }}>{badge}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/district/pages/Overview.jsx
git commit -m "feat(district): add Overview page with 7-tile module navigation"
```

---

## Task 5: Directory page

**Files:**
- Create: `src/modules/district/pages/Directory.jsx`

- [ ] **Step 1: Create file**

```jsx
// src/modules/district/pages/Directory.jsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { DIRECTORY_MEMBERS } from '../data/directoryData'

const COLORS = ['#003DA5','#16a34a','#ca8a04','#9333ea','#0891b2','#e11d48','#f59e0b','#64748b']
const PAGE_SIZE = 8

export default function DistrictDirectory() {
  const [search, setSearch]         = useState('')
  const [adminStates, setAdminStates] = useState(() =>
    Object.fromEntries(DIRECTORY_MEMBERS.map(m => [m.id, m.isAdmin]))
  )
  const [page, setPage] = useState(1)

  const filtered = DIRECTORY_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.mobile.includes(search)
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const adminCount = Object.values(adminStates).filter(Boolean).length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Members"    value={DIRECTORY_MEMBERS.length} sub="District-level access" subColor="muted" accent="#003DA5" />
        <StatCard label="Admins"           value={adminCount}               sub="With portal access"    subColor="muted" accent="#16a34a" />
        <StatCard label="Read-Only Access" value={DIRECTORY_MEMBERS.length - adminCount} sub="View only" subColor="muted" accent="#64748b" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">Member Directory</CardTitle>
            <CardDescription className="text-xs">District 5656 — governance access list (read-only)</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Search */}
          <div className="flex items-center gap-2 mb-4 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 max-w-sm">
            <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search name, email or mobile..."
              className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 w-10">Photo</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Mobile No.</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paged.map((m, i) => {
                  const colorIdx = ((page - 1) * PAGE_SIZE + i) % COLORS.length
                  const isAdmin = adminStates[m.id]
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: COLORS[colorIdx] }}>
                          {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-800">{m.name}</td>
                      <td className="px-3 py-3 text-slate-600 tabular-nums text-xs">{m.mobile}</td>
                      <td className="px-3 py-3 text-slate-600 text-xs">{m.email}</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                          isAdmin
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>{isAdmin ? 'Admin' : 'Member'}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-500">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage(1)}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">First</button>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    p === page ? 'text-white border-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  style={p === page ? { backgroundColor: '#003DA5' } : {}}>{p}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">›</button>
              <button disabled={page === totalPages} onClick={() => setPage(totalPages)}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">Last</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/district/pages/Directory.jsx
git commit -m "feat(district): add Directory page — read-only member table with search and pagination"
```

---

## Task 6: District Committee page

**Files:**
- Create: `src/modules/district/pages/Committee.jsx`

- [ ] **Step 1: Create file**

```jsx
// src/modules/district/pages/Committee.jsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { COMMITTEE_MEMBERS, DESIGNATIONS } from '../data/committeeData'

const COLORS = ['#003DA5','#16a34a','#ca8a04','#9333ea','#0891b2','#e11d48']

const EMPTY_FORM = { name: '', mobile: '', email: '', designation: '', club: '', remark: '' }

export default function DistrictCommittee() {
  const [members, setMembers]         = useState(COMMITTEE_MEMBERS)
  const [search, setSearch]           = useState('')
  const [yearFilter]                  = useState('2025-2026')
  const [designationFilter, setDFilter] = useState('')
  const [showForm, setShowForm]       = useState(false)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [editId, setEditId]           = useState(null)

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.club.toLowerCase().includes(search.toLowerCase())
    const matchDesig = !designationFilter || m.designation === designationFilter
    return matchSearch && matchDesig
  })

  const uniqueDesignations = [...new Set(members.map(m => m.designation))]

  const handleSubmit = () => {
    if (!form.name.trim()) return
    if (editId != null) {
      setMembers(ms => ms.map(m => m.id === editId ? { ...m, ...form } : m))
      setEditId(null)
    } else {
      setMembers(ms => [...ms, { ...form, id: Date.now() }])
    }
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const handleEdit = (m) => {
    setForm({ name: m.name, mobile: m.mobile, email: m.email, designation: m.designation, club: m.club, remark: m.remark })
    setEditId(m.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id) => setMembers(ms => ms.filter(m => m.id !== id))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Members"      value={members.length}      sub={yearFilter}            subColor="muted" accent="#003DA5" />
        <StatCard label="Designations"       value={uniqueDesignations.length} sub="Unique roles"    subColor="muted" accent="#16a34a" />
        <StatCard label="Clubs Represented"  value={new Set(members.map(m => m.club)).size} sub="Across district" subColor="muted" accent="#9333ea" />
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{editId != null ? 'Edit Member' : 'Add Committee Member'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {[
                { field: 'name',        label: 'Name',           type: 'text' },
                { field: 'mobile',      label: 'Mobile Number',  type: 'text' },
                { field: 'email',       label: 'Email',          type: 'email' },
                { field: 'club',        label: 'Club',           type: 'text' },
              ].map(({ field, label, type }) => (
                <div key={field}>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
                  <input type={type} value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">District Designation</label>
                <input list="designations-list" value={form.designation}
                  onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"
                  placeholder="Type or select..." />
                <datalist id="designations-list">
                  {DESIGNATIONS.map(d => <option key={d} value={d} />)}
                </datalist>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Remark</label>
                <input type="text" value={form.remark}
                  onChange={e => setForm(f => ({ ...f, remark: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSubmit}
                className="text-xs font-semibold text-white px-4 py-2 rounded-lg"
                style={{ backgroundColor: '#003DA5' }}>
                {editId != null ? 'Update' : 'Add Member'}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }}
                className="text-xs font-medium text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">District Committee</CardTitle>
            <CardDescription className="text-xs">District 5656 — {yearFilter}</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setShowForm(s => !s); setEditId(null); setForm(EMPTY_FORM) }}
              className="text-xs font-semibold text-white px-3 py-1.5 rounded-md"
              style={{ backgroundColor: '#003DA5' }}>
              {showForm ? '✕ Cancel' : '+ Add Member'}
            </button>
            <button className="text-xs font-medium text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              Export PDF
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-sm">
              <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name or club..."
                className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
            </div>
            <select value={designationFilter} onChange={e => setDFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 bg-white outline-none">
              <option value="">All Designations</option>
              {uniqueDesignations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Photo','Name','Club','Designation','Mobile','Email','Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((m, i) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: COLORS[i % COLORS.length] }}>
                        {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap">{m.name}</td>
                    <td className="px-3 py-3 text-slate-600 text-xs whitespace-nowrap">{m.club}</td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 whitespace-nowrap">
                        {m.designation}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600 tabular-nums text-xs whitespace-nowrap">{m.mobile}</td>
                    <td className="px-3 py-3 text-slate-600 text-xs">{m.email}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(m)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="Edit">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(m.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" title="Delete">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-400">No members found</td></tr>
                )}
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
git add src/modules/district/pages/Committee.jsx
git commit -m "feat(district): add District Committee page with searchable table, add/edit/delete form"
```

---

## Task 7: Clubs page

**Files:**
- Create: `src/modules/district/pages/Clubs.jsx`

- [ ] **Step 1: Create file**

```jsx
// src/modules/district/pages/Clubs.jsx
import { Card, CardContent } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { CLUBS_5656 } from '../data/clubsData'

const DAY_COLORS = {
  Monday: '#003DA5', Tuesday: '#16a34a', Wednesday: '#9333ea',
  Thursday: '#0891b2', Friday: '#ca8a04', Saturday: '#e11d48', Sunday: '#64748b',
}

export default function DistrictClubs() {
  const totalMembers = CLUBS_5656.reduce((sum, c) => sum + c.members, 0)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Clubs"   value={CLUBS_5656.length} sub="Under District 5656" subColor="muted" accent="#003DA5" />
        <StatCard label="Total Members" value={totalMembers}       sub="Across all clubs"    subColor="muted" accent="#16a34a" />
        <StatCard label="Rotary Year"   value="2025–26"            sub="Active year"         subColor="muted" accent="#9333ea" />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-600 mb-3">All Clubs — District 5656</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {CLUBS_5656.map(club => {
            const dayColor = DAY_COLORS[club.meetingDay] ?? '#64748b'
            return (
              <Card key={club.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-4">
                    {/* Club avatar */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                      style={{ backgroundColor: dayColor }}>
                      {club.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 leading-snug">{club.name}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span className="text-xs text-slate-500">{club.meetingDay}</span>
                        <span className="text-slate-300">·</span>
                        <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span className="text-xs text-slate-500">{club.meetingTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                        </svg>
                        <span className="text-xs text-slate-500">{club.members} members</span>
                      </div>
                    </div>
                  </div>
                  {/* Day badge */}
                  <div className="mt-3 flex justify-end">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: dayColor }}>{club.meetingDay}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/district/pages/Clubs.jsx
git commit -m "feat(district): add Clubs page with club cards grid"
```

---

## Task 8: Club Monthly Report page

**Files:**
- Create: `src/modules/district/pages/MonthlyReport.jsx`

- [ ] **Step 1: Create file**

```jsx
// src/modules/district/pages/MonthlyReport.jsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { MONTHS, MONTHLY_STATUS } from '../data/monthlyReportData'

function statusBadge(submitted, total) {
  if (submitted === 0)     return { label: `0/${total} submitted`, color: '#e11d48',  bg: '#fef2f2',  text: '#e11d48' }
  if (submitted === total) return { label: `${total}/${total} submitted`, color: '#16a34a', bg: '#f0fdf4', text: '#16a34a' }
  return { label: `${submitted}/${total} submitted`, color: '#f59e0b', bg: '#fffbeb', text: '#b45309' }
}

export default function DistrictMonthlyReport() {
  const [whatsapp, setWhatsapp] = useState(false)

  const statuses = MONTHS.map(m => ({ ...m, ...MONTHLY_STATUS[m.id] }))
  const fullSubmission = statuses.filter(m => m.submitted === m.total).length
  const avgRate = Math.round(
    statuses.reduce((sum, m) => sum + (m.submitted / m.total) * 100, 0) / statuses.length
  )

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Months Tracked"    value={MONTHS.length}     sub="Jul 2025 – Apr 2026"  subColor="muted" accent="#003DA5" />
        <StatCard label="Full Submissions"  value={fullSubmission}    sub="All clubs submitted"  subColor="up"    accent="#16a34a" />
        <StatCard label="Avg Compliance"    value={`${avgRate}%`}     sub="Across all months"    subColor="muted" accent="#0891b2" />
        <StatCard label="Clubs in District" value={6}                 sub="Active clubs"         subColor="muted" accent="#9333ea" />
      </div>

      {/* Controls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3 pb-3">
          <div>
            <CardTitle className="text-sm">Club Monthly Report</CardTitle>
            <CardDescription className="text-xs">Submission status per month — RY 2025–26</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <button className="text-xs font-medium text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              Export to Excel
            </button>
            <div className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5">
              <span className="text-xs text-slate-600">WhatsApp Notify</span>
              <button
                onClick={() => setWhatsapp(w => !w)}
                className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${whatsapp ? 'bg-green-500' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${whatsapp ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {statuses.map(m => {
              const { label, bg, text } = statusBadge(m.submitted, m.total)
              return (
                <div key={m.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span className="text-sm font-medium text-slate-700">{m.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: bg, color: text }}>
                      {label}
                    </span>
                    {/* Progress bar */}
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${(m.submitted / m.total) * 100}%`, backgroundColor: text }} />
                    </div>
                    <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/district/pages/MonthlyReport.jsx
git commit -m "feat(district): add Club Monthly Report page with submission status and WhatsApp toggle"
```

---

## Task 9: Club Moderator page

**Files:**
- Create: `src/modules/district/pages/Moderator.jsx`

- [ ] **Step 1: Create file**

```jsx
// src/modules/district/pages/Moderator.jsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { MODERATORS } from '../data/moderatorData'

const COLORS = ['#003DA5','#16a34a','#ca8a04','#9333ea','#0891b2','#e11d48']

export default function DistrictModerator() {
  const [search, setSearch] = useState('')

  const filtered = MODERATORS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.club.toLowerCase().includes(search.toLowerCase()) ||
    m.mobile.includes(search)
  )

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Moderators"  value={MODERATORS.length} sub="Assigned"           subColor="muted" accent="#003DA5" />
        <StatCard label="Clubs Covered"     value={MODERATORS.length} sub="With moderator"     subColor="up"    accent="#16a34a" />
        <StatCard label="Unassigned Clubs"  value={6 - MODERATORS.length} sub="Need assignment" subColor={6 - MODERATORS.length > 0 ? 'down' : 'muted'} accent="#e11d48" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">Club Moderators</CardTitle>
            <CardDescription className="text-xs">District staff assigned to oversee specific clubs</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 mb-4 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 max-w-sm">
            <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name or club..."
              className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 w-10">Sr.</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Mobile</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((m, i) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 text-slate-500 text-xs">{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: COLORS[i % COLORS.length] }}>
                          {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{m.name}</p>
                          <p className="text-[11px] text-slate-400">({m.club})</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-600 tabular-nums text-xs">{m.mobile}</td>
                    <td className="px-3 py-3 text-slate-600 text-xs">{m.email}</td>
                    <td className="px-3 py-3">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="View Club">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-400">No moderators found</td></tr>
                )}
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
git add src/modules/district/pages/Moderator.jsx
git commit -m "feat(district): add Club Moderator page"
```

---

## Task 10: AG / Zones page

**Files:**
- Create: `src/modules/district/pages/AG.jsx`

- [ ] **Step 1: Create file**

```jsx
// src/modules/district/pages/AG.jsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { ZONES } from '../data/agData'

const COLORS = ['#003DA5','#16a34a','#9333ea']
const EMPTY_FORM = { zoneName: '', agName: '', agMobile: '', agEmail: '', clubs: '' }

export default function DistrictAG() {
  const [zones, setZones]     = useState(ZONES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]       = useState(EMPTY_FORM)
  const [editId, setEditId]   = useState(null)

  const handleSubmit = () => {
    if (!form.zoneName.trim() || !form.agName.trim()) return
    const clubs = form.clubs.split(',').map(c => c.trim()).filter(Boolean)
    if (editId != null) {
      setZones(zs => zs.map(z => z.id === editId ? { ...z, ...form, clubs } : z))
      setEditId(null)
    } else {
      setZones(zs => [...zs, { ...form, clubs, id: Date.now() }])
    }
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const handleEdit = (z) => {
    setForm({ zoneName: z.zoneName, agName: z.agName, agMobile: z.agMobile, agEmail: z.agEmail, clubs: z.clubs.join(', ') })
    setEditId(z.id)
    setShowForm(true)
  }

  const handleDelete = (id) => setZones(zs => zs.filter(z => z.id !== id))

  const totalClubs = zones.reduce((sum, z) => sum + z.clubs.length, 0)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Zones"  value={zones.length}  sub="Under District 5656"  subColor="muted" accent="#003DA5" />
        <StatCard label="Total AGs"    value={zones.length}  sub="Active AGs"           subColor="up"    accent="#16a34a" />
        <StatCard label="Clubs Covered" value={totalClubs}   sub="Across all zones"     subColor="muted" accent="#9333ea" />
      </div>

      {showForm && (
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{editId != null ? 'Edit Zone' : 'Add Zone'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {[
                { field: 'zoneName', label: 'Zone Name'   },
                { field: 'agName',   label: 'AG Name'     },
                { field: 'agMobile', label: 'AG Mobile'   },
                { field: 'agEmail',  label: 'AG Email'    },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
                  <input value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Assigned Clubs (comma-separated)</label>
                <input value={form.clubs}
                  onChange={e => setForm(f => ({ ...f, clubs: e.target.value }))}
                  placeholder="Club A, Club B, Club C"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSubmit}
                className="text-xs font-semibold text-white px-4 py-2 rounded-lg"
                style={{ backgroundColor: '#003DA5' }}>
                {editId != null ? 'Update Zone' : 'Add Zone'}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }}
                className="text-xs font-medium text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">Zones & Assistant Governors</CardTitle>
            <CardDescription className="text-xs">District 5656 — zone assignments</CardDescription>
          </div>
          <button onClick={() => { setShowForm(s => !s); setEditId(null); setForm(EMPTY_FORM) }}
            className="text-xs font-semibold text-white px-3 py-1.5 rounded-md"
            style={{ backgroundColor: '#003DA5' }}>
            {showForm ? '✕ Cancel' : '+ Add Zone'}
          </button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Zone','AG Name','Mobile','Email','Clubs','Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {zones.map((z, i) => (
                  <tr key={z.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3">
                      <span className="font-semibold text-sm px-2.5 py-1 rounded-md text-white"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}>{z.zoneName}</span>
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap">{z.agName}</td>
                    <td className="px-3 py-3 text-slate-600 tabular-nums text-xs whitespace-nowrap">{z.agMobile}</td>
                    <td className="px-3 py-3 text-slate-600 text-xs">{z.agEmail}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {z.clubs.map(c => (
                          <span key={c} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 whitespace-nowrap">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(z)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="Edit">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(z.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" title="Delete">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
git add src/modules/district/pages/AG.jsx
git commit -m "feat(district): add AG / Zones page with add/edit/delete zone management"
```

---

## Task 11: Website Data placeholder page

**Files:**
- Create: `src/modules/district/pages/WebsiteData.jsx`

- [ ] **Step 1: Create file**

```jsx
// src/modules/district/pages/WebsiteData.jsx
export default function DistrictWebsiteData() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
        <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18"/><path d="M9 21V9"/>
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800">Website Data</h2>
        <p className="text-slate-400 text-sm mt-1">District 5656 website data management — coming soon</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/district/pages/WebsiteData.jsx
git commit -m "feat(district): add Website Data placeholder page"
```

---

## Task 12: Wire up App.jsx (commit routes last)

If you deferred the App.jsx commit from Task 3 to avoid broken imports, do it now that all page files exist.

- [ ] **Step 1: Verify all page files exist**

Run: `ls src/modules/district/pages/`

Expected output should include:
```
AG.jsx  Clubs.jsx  Committee.jsx  Directory.jsx  Moderator.jsx  MonthlyReport.jsx  Overview.jsx  WebsiteData.jsx
```

- [ ] **Step 2: Verify dev server starts without errors**

Run: `npm run dev`

Navigate to `http://localhost:5173/districtdashboard/overview` — should show 7 icon tiles.

Check each route navigates correctly:
- `/districtdashboard/directory` → member table (29 rows across 4 pages)
- `/districtdashboard/committee` → committee table (6 rows)
- `/districtdashboard/clubs` → 6 club cards
- `/districtdashboard/monthly-report` → 10 month rows
- `/districtdashboard/moderator` → 5 moderator rows
- `/districtdashboard/ag` → 3 zone rows
- `/districtdashboard/website-data` → placeholder

- [ ] **Step 3: Final commit if App.jsx not yet committed**

```bash
git add src/App.jsx
git commit -m "feat(district): wire district dashboard routes in App.jsx"
```
