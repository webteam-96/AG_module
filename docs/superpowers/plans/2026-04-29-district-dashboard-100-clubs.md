# District Dashboard — 100-Club Scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scale the district dashboard from 6 clubs to 100+ clubs with aggregated district-wide KPIs, paginated tables, and per-club drill-downs that mirror the club dashboard's analytical depth.

**Architecture:** Expand existing data files in place (Option A) — grow analyticsData.js to 100 clubs using a deterministic generator, update all district pages to add search + pagination, and rewrite Overview.jsx to mirror the club dashboard's 4-card analytical layout with district-wide aggregates. No new files created; no routing changes.

**Tech Stack:** React 18, Vite, Recharts, Tailwind CSS, shadcn/ui Card components. Dev command: `npm run dev`.

---

## File Map

| File | What Changes |
|------|-------------|
| `src/modules/district/data/analyticsData.js` | 6 → 100 clubs with generator; adds new fields: activeMembers, maleMembers, femaleMembers, honoraryMembers, newThisYear, terminated, annualFund, phfContributors, majorDonors, beneficiaries, manHours, memberRoster |
| `src/modules/district/data/clubsData.js` | Derived from analyticsData; 100 clubs |
| `src/modules/district/data/foundationData.js` | Generator produces ~300 projects + ~200 events |
| `src/modules/district/data/egovernanceData.js` | 100 clubs monthly reports, 150 PPH camps, 100 citations |
| `src/modules/district/pages/Overview.jsx` | Full rewrite: 4 analytical cards + paginated leaderboard + paginated matrix |
| `src/modules/district/pages/Clubs.jsx` | Rewrite: paginated table with accordion member drill-down |
| `src/modules/district/pages/Membership.jsx` | Add district-wide KPI strip above tabs |
| `src/modules/district/pages/Foundation.jsx` | Add search + pagination to both tabs |
| `src/modules/district/pages/EGovernance.jsx` | Search + pagination on monthly reports + PPH; citation tab switches from card grid to paginated table |

---

### Task 1: Rewrite analyticsData.js — 100 clubs with generator

**Files:**
- Modify: `src/modules/district/data/analyticsData.js`

- [ ] **Step 1: Replace the entire file with the generator below**

```js
// src/modules/district/data/analyticsData.js

const MALE_FIRST  = ['Rajesh','Suresh','Amit','Vijay','Sanjay','Pradeep','Mahesh','Dinesh','Ramesh','Nilesh','Rakesh','Deepak','Vivek','Manish','Anil','Sunil','Kapil','Girish','Harish','Sachin','Rohit','Nikhil','Rahul','Ankit','Varun','Pankaj','Tarun','Arun','Vikas','Umesh']
const FEMALE_FIRST= ['Sunita','Priya','Neha','Pooja','Sneha','Seema','Kavita','Anita','Geeta','Rekha','Lata','Divya','Nisha','Meena','Asha','Usha','Rupa','Shobha','Hema','Jaya']
const SURNAMES    = ['Sharma','Verma','Patel','Shah','Joshi','Mehta','Desai','Nair','Kumar','Singh','Gupta','Rao','Iyer','Reddy','Kulkarni','Patil','Deshpande','Bhatt','Chauhan','Mishra','Thakur','Pandey','Agarwal','Bose','Chatterjee']
const BOARD_ROLES = ['President','Secretary','Treasurer','IPP','President Elect','Vice President','Director','Member','Member','Member','Member','Member','Member']
const DAYS        = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const TIMES       = ['7:00 AM','7:30 AM','8:00 AM','12:30 PM','1:00 PM','6:30 PM','7:00 PM','7:30 PM']

const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function makeRoster(seed, count) {
  return Array.from({ length: count }, (_, i) => {
    const isFemale = (seed * 3 + i * 7) % 5 === 0
    const first = isFemale
      ? FEMALE_FIRST[(seed + i * 3) % FEMALE_FIRST.length]
      : MALE_FIRST[(seed * 2 + i) % MALE_FIRST.length]
    const last = SURNAMES[(seed * 7 + i * 11) % SURNAMES.length]
    return {
      name: `${first} ${last}`,
      designation: BOARD_ROLES[Math.min(i, BOARD_ROLES.length - 1)],
      mobile: `+91 98${String(seed * 100 + i).padStart(8, '0').slice(0, 8)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${seed}@email.com`,
      since: 2010 + ((seed + i * 3) % 14),
      status: (seed * 5 + i * 3) % 7 !== 0 ? 'Active' : 'Inactive',
    }
  })
}

function makeClub(name, tier, seed) {
  const s = seed + 1
  const hi = tier === 'high', lo = tier === 'low'

  const members       = hi ? 80 + (s * 3 % 71)  : lo ? 12 + (s * 2 % 19) : 30 + (s * 5 % 51)
  const memberTarget  = Math.round(members * (hi ? 1.08 : lo ? 1.25 : 1.15))
  const activePct     = hi ? 0.87 + (s % 9) * 0.01 : lo ? 0.60 + (s % 12) * 0.01 : 0.73 + (s % 13) * 0.01
  const activeMembers = Math.round(members * activePct)
  const maleMembers   = Math.round(members * (0.62 + (s % 9) * 0.01))
  const femaleMembers = Math.round(members * (0.17 + (s % 6) * 0.01))
  const honoraryMembers = Math.max(0, members - activeMembers - Math.round(members * 0.04))
  const newThisYear   = hi ? 3 + (s % 8) : lo ? s % 3 : 1 + (s % 5)
  const terminated    = lo ? 1 + (s % 4) : s % 3

  const trfGoal       = hi ? 200000 + (s * 13 % 300001) : lo ? 50000 + (s * 7 % 50001) : 100000 + (s * 11 % 100001)
  const trfPctVal     = hi ? 0.60 + (s % 36) * 0.01 : lo ? 0.10 + (s % 31) * 0.01 : 0.30 + (s % 41) * 0.01
  const trfRaised     = Math.round(trfGoal * trfPctVal)
  const annualFund    = Math.round(trfRaised * 0.55)
  const phfContributors = hi ? 10 + (s % 15) : lo ? 1 + (s % 4) : 4 + (s % 8)
  const majorDonors   = hi ? 1 + (s % 5) : lo ? 0 : s % 3

  const serviceProjects = hi ? 8 + (s % 11) : lo ? 1 + (s % 4) : 3 + (s % 8)
  const beneficiaries   = hi ? 1500 + (s * 7 % 1501) : lo ? 100 + (s * 3 % 401) : 400 + (s * 5 % 1101)
  const manHours        = serviceProjects * (30 + s % 50)

  const citationScore    = hi ? 40 + (s % 11) : lo ? 8 + (s % 17) : 22 + (s % 18)
  const reportsSubmitted = hi ? 9 + (s % 3) : lo ? 2 + (s % 5) : 5 + (s % 5)
  const avgAttendance    = hi ? 78 + (s % 18) : lo ? 30 + (s % 26) : 52 + (s % 27)

  const rosterCount = hi ? 13 + (s % 3) : lo ? 8 + (s % 3) : 10 + (s % 4)

  return {
    id: slug(name),
    name,
    meetingDay:  DAYS[(seed * 3 + tier.length) % DAYS.length],
    meetingTime: TIMES[(seed * 5 + tier.length) % TIMES.length],
    members, memberTarget,
    activeMembers, maleMembers, femaleMembers, honoraryMembers,
    newThisYear, terminated,
    trfRaised, trfGoal, annualFund, phfContributors, majorDonors,
    serviceProjects, beneficiaries, manHours,
    citationScore, citationMax: 50,
    reportsSubmitted, reportsTotal: 12,
    avgAttendance,
    memberRoster: makeRoster(seed, rosterCount),
  }
}

const HIGH_CLUBS = [
  'Thane City View','Tikujiniwadi','Thane Heritage','Navi Mumbai Central','Vashi Sunrise',
  'Nerul Bay','Belapur Heights','Kharghar Hills','Kalyan East','Kalyan Sunrise',
  'Dombivli Premier','Mira Road North','Bhayandar Esteem','Vasai Vikas','Thane Uptown',
  'Powai Lakeside','Mulund East','Ghatkopar Prestige','Thane Midtown','Koparkhairane Tech',
  'Panvel Gateway','Airoli Industrial','Chembur Elite','Thane Elite','Vashi Central',
]

const MID_CLUBS = [
  'Owala','Lake Shore Club','Rotary Club of Leo','Thane West','Thane Central',
  'Thane North','Kalyan West','Kalyan Central','Dombivli East','Dombivli West',
  'Ulhasnagar Central','Ulhasnagar East','Ambernath Industrial','Badlapur New Town','Bhiwandi North',
  'Bhiwandi East','Mira Bhayandar','Vasai Road','Virar West','Nalasopara East',
  'Navi Mumbai South','Nerul West','Belapur CBD','Turbhe MIDC','Ghansoli East',
  'Sanpada Heights','Kharghar Sector','Taloja Industrial','Panvel East','Pen Valley',
  'Alibag Coastal','Uran Port','Karjat Hills','Khopoli Gateway','Roha River',
  'Mangaon Central','Mahad Industrial','Raigad Heritage','Thane Lakeside','Thane Cosmos',
  'Thane Grandeur','Kalyan Metro','Dombivli Central','Mira Road South','Navi Mumbai North',
  'Vashi Harbour','Nerul South','Airoli West','Ghansoli Central','Sanpada Bay',
]

const LOW_CLUBS = [
  'New Club Test Entry','Titwala East','Titwala West','Murbad Rural','Wada Township',
  'Shahapur Hills','Jawhar Tribal','Vikramgad Village','Mokhada Remote','Dahanu Coastal',
  'Talasari Border','Palghar North','Palghar South','Boisar Industrial','Vangaon Station',
  'Gholvad East','Nalasopara West','Saphale Rural','Kelwa Beach','Manor District',
  'Kasa Village','Zhari Rural','Khardi Hills','Umbermali Remote','Tokavde New',
]

export const CLUB_ANALYTICS = [
  ...HIGH_CLUBS.map((name, i) => makeClub(name, 'high', i)),
  ...MID_CLUBS.map((name, i)  => makeClub(name, 'mid',  i)),
  ...LOW_CLUBS.map((name, i)  => makeClub(name, 'low',  i)),
]
```

- [ ] **Step 2: Verify the browser console shows no errors**

Run `npm run dev`, open the district dashboard. Check the browser console — no import errors expected since we kept the same export name `CLUB_ANALYTICS` with the same existing fields plus additions.

- [ ] **Step 3: Commit**

```bash
git add src/modules/district/data/analyticsData.js
git commit -m "data(district): expand analyticsData to 100 clubs with generator"
```

---

### Task 2: Rewrite clubsData.js — sync to 100 clubs

**Files:**
- Modify: `src/modules/district/data/clubsData.js`

- [ ] **Step 1: Replace the file — derive directly from CLUB_ANALYTICS**

```js
// src/modules/district/data/clubsData.js
import { CLUB_ANALYTICS } from './analyticsData'

export const CLUBS_5656 = CLUB_ANALYTICS.map(c => ({
  id:          c.id,
  name:        c.name,
  meetingDay:  c.meetingDay,
  meetingTime: c.meetingTime,
  members:     c.members,
}))
```

- [ ] **Step 2: Verify in browser**

Open `/districtdashboard/membership` → Clubs tab. Should now list 100 clubs (as cards — current Clubs.jsx will render them all, which is fine for now; we'll paginate it in Task 6).

- [ ] **Step 3: Commit**

```bash
git add src/modules/district/data/clubsData.js
git commit -m "data(district): derive clubsData from analyticsData (100 clubs)"
```

---

### Task 3: Rewrite foundationData.js — 300 projects + 200 events

**Files:**
- Modify: `src/modules/district/data/foundationData.js`

- [ ] **Step 1: Replace the file with generators**

```js
// src/modules/district/data/foundationData.js
import { CLUB_ANALYTICS } from './analyticsData'

export const fmtINR = v =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString()}`

export const AVENUE_COLORS = {
  'Community Service':     '#003DA5',
  'Vocational Service':    '#16a34a',
  'New Generation':        '#9333ea',
  'International Service': '#0891b2',
  'Public Image':          '#ca8a04',
  'Club Service':          '#e11d48',
}

export const EVENT_TYPE_COLORS = {
  District:  { bg:'bg-blue-50',   text:'text-blue-700'   },
  TRF:       { bg:'bg-amber-50',  text:'text-amber-700'  },
  'New Gen': { bg:'bg-purple-50', text:'text-purple-700' },
  Service:   { bg:'bg-green-50',  text:'text-green-700'  },
  Meeting:   { bg:'bg-slate-100', text:'text-slate-600'  },
}

export const STATUS_COLORS = {
  Completed:   { bg:'bg-green-50',  text:'text-green-700'  },
  'In Progress':{ bg:'bg-amber-50', text:'text-amber-700'  },
  Upcoming:    { bg:'bg-blue-50',   text:'text-blue-700'   },
}

// ── Project generator ────────────────────────────────────────────
const PROJECT_TEMPLATES = [
  { name:'Blood Donation Drive',         avenue:'Community Service',     fundsFactor:0,      hoursFactor:48, beneFactor:300  },
  { name:'Medical Camp',                 avenue:'Community Service',     fundsFactor:90000,  hoursFactor:96, beneFactor:400  },
  { name:'Tree Plantation Drive',        avenue:'Community Service',     fundsFactor:20000,  hoursFactor:60, beneFactor:500  },
  { name:'Eye Check-up Camp',            avenue:'Community Service',     fundsFactor:40000,  hoursFactor:32, beneFactor:280  },
  { name:'Senior Citizen Health Camp',   avenue:'Community Service',     fundsFactor:35000,  hoursFactor:40, beneFactor:180  },
  { name:'Clean Village Drive',          avenue:'Community Service',     fundsFactor:18000,  hoursFactor:60, beneFactor:450  },
  { name:'Digital Literacy Workshop',    avenue:'Vocational Service',    fundsFactor:18000,  hoursFactor:36, beneFactor:90   },
  { name:'Vocational Training Camp',     avenue:'Vocational Service',    fundsFactor:70000,  hoursFactor:72, beneFactor:75   },
  { name:'Women Empowerment Workshop',   avenue:'Vocational Service',    fundsFactor:28000,  hoursFactor:48, beneFactor:120  },
  { name:'Career Guidance Seminar',      avenue:'Vocational Service',    fundsFactor:8000,   hoursFactor:16, beneFactor:75   },
  { name:'Scholarship Distribution',     avenue:'New Generation',        fundsFactor:180000, hoursFactor:24, beneFactor:45   },
  { name:'Youth Leadership Camp',        avenue:'New Generation',        fundsFactor:25000,  hoursFactor:40, beneFactor:50   },
  { name:'Interact Club Installation',   avenue:'New Generation',        fundsFactor:12000,  hoursFactor:20, beneFactor:60   },
  { name:'RYLA District',                avenue:'New Generation',        fundsFactor:45000,  hoursFactor:72, beneFactor:40   },
  { name:'Solar Light Distribution',     avenue:'International Service', fundsFactor:85000,  hoursFactor:30, beneFactor:100  },
  { name:'Awareness Walk',               avenue:'Public Image',          fundsFactor:5000,   hoursFactor:12, beneFactor:500  },
  { name:'Mega Blood Donation Camp',     avenue:'Community Service',     fundsFactor:0,      hoursFactor:96, beneFactor:650  },
  { name:'Water Conservation Project',   avenue:'Community Service',     fundsFactor:60000,  hoursFactor:80, beneFactor:800  },
]

const PROJECT_DATES = [
  'Jul 15, 2025','Aug 10, 2025','Sep 20, 2025','Oct 5, 2025','Nov 12, 2025',
  'Dec 18, 2025','Jan 25, 2026','Feb 14, 2026','Mar 15, 2026','Apr 10, 2026','May 5, 2026','Jun 8, 2026',
]
const PROJECT_STATUSES = ['Completed','Completed','Completed','Completed','In Progress','Upcoming']

let pid = 0
function makeProjects(club, seed) {
  const count = 2 + (seed % 4)
  return Array.from({ length: count }, (_, i) => {
    const t = PROJECT_TEMPLATES[(seed * 3 + i * 7) % PROJECT_TEMPLATES.length]
    const scale = 0.6 + (seed % 8) * 0.05
    return {
      id: ++pid,
      club,
      name: t.name,
      avenue: t.avenue,
      date: PROJECT_DATES[(seed * 2 + i * 5) % PROJECT_DATES.length],
      beneficiaries: Math.round(t.beneFactor * scale),
      funds: Math.round(t.fundsFactor * scale),
      manHours: t.hoursFactor + (seed % 3) * 8,
      status: PROJECT_STATUSES[(seed + i * 3) % PROJECT_STATUSES.length],
    }
  })
}

// ── Event generator ──────────────────────────────────────────────
const EVENT_TEMPLATES = [
  { name:'Weekly Meeting',         type:'Meeting' },
  { name:'Monthly Meeting',        type:'Meeting' },
  { name:'Fortnightly Meeting',    type:'Meeting' },
  { name:'Blood Donation Camp',    type:'Service' },
  { name:'Medical Camp',           type:'Service' },
  { name:'TRF Fundraiser Dinner',  type:'TRF'     },
  { name:'Foundation Awareness Night', type:'TRF' },
  { name:'Youth Leadership Event', type:'New Gen' },
  { name:'Interact Meeting',       type:'New Gen' },
  { name:'Career Fair',            type:'Service' },
]
const VENUES = [
  'Club Hall','Hotel Regency, Thane','Community Centre','Municipal Hall',
  'School Auditorium','Hotel Solitaire','Banquet Hall','Online / Zoom',
]
const EVENT_DATES = [
  '2025-10-05','2025-11-08','2025-12-12','2026-01-09','2026-02-06',
  '2026-03-06','2026-04-05','2026-04-20','2026-05-08','2026-06-05',
]
const EVENT_TIMES = ['7:00 AM','7:30 PM','6:30 PM','9:00 AM','10:00 AM','5:30 PM','7:00 PM']
const EVENT_STATUSES = ['Completed','Completed','Upcoming','Upcoming']

let eid = 0
function makeEvents(club, seed) {
  const count = 1 + (seed % 3)
  return Array.from({ length: count }, (_, i) => {
    const t = EVENT_TEMPLATES[(seed * 2 + i * 5) % EVENT_TEMPLATES.length]
    return {
      id: ++eid,
      club,
      name: t.name,
      type: t.type,
      date: EVENT_DATES[(seed + i * 3) % EVENT_DATES.length],
      time: EVENT_TIMES[(seed * 3 + i) % EVENT_TIMES.length],
      venue: `${VENUES[(seed + i * 7) % VENUES.length]}`,
      status: EVENT_STATUSES[(seed + i) % EVENT_STATUSES.length],
    }
  })
}

// Seed projects/events with 'District 5656' events first
eid = 0
const DISTRICT_EVENTS_PREFIX = [
  { id:++eid, club:'District 5656', name:'District Assembly',       type:'District', date:'2026-05-03', time:'9:00 AM',  venue:'Hotel Vivanta, Thane',  status:'Upcoming'  },
  { id:++eid, club:'District 5656', name:'District Conference',     type:'District', date:'2026-06-14', time:'10:00 AM', venue:'Grand Hyatt, Mumbai',   status:'Upcoming'  },
  { id:++eid, club:'District 5656', name:'DG Installation Ceremony',type:'District', date:'2026-07-01', time:'6:00 PM',  venue:'Hotel Regency, Thane',  status:'Upcoming'  },
  { id:++eid, club:'District 5656', name:'District Citation Review', type:'District', date:'2026-04-28', time:'6:00 PM',  venue:'Online / Zoom',         status:'Upcoming'  },
]

export const DISTRICT_PROJECTS = CLUB_ANALYTICS.flatMap((c, i) => makeProjects(c.name, i))
export const DISTRICT_EVENTS   = [
  ...DISTRICT_EVENTS_PREFIX,
  ...CLUB_ANALYTICS.flatMap((c, i) => makeEvents(c.name, i)),
]
```

- [ ] **Step 2: Verify in browser**

Open `/districtdashboard/foundation`. Both Projects and Events tabs should load without errors. KPI numbers will now reflect the full dataset.

- [ ] **Step 3: Commit**

```bash
git add src/modules/district/data/foundationData.js
git commit -m "data(district): expand foundationData to ~300 projects + ~200 events via generator"
```

---

### Task 4: Rewrite egovernanceData.js — 100 clubs

**Files:**
- Modify: `src/modules/district/data/egovernanceData.js`

- [ ] **Step 1: Replace the file with generators**

```js
// src/modules/district/data/egovernanceData.js
import { CLUB_ANALYTICS } from './analyticsData'

export const CMR_MONTHS = [
  'Jul 2025','Aug 2025','Sep 2025','Oct 2025','Nov 2025','Dec 2025',
  'Jan 2026','Feb 2026','Mar 2026','Apr 2026','May 2026','Jun 2026',
]

// S=Submitted, L=Late, P=Pending, N=Not Started
function makeMonths(submitted, seed) {
  return Array.from({ length: 12 }, (_, i) => {
    if (i > 9) return 'N'                          // Apr-Jun not started yet
    if (i >= submitted) return i === submitted ? 'P' : 'N'
    return (!submitted || (seed + i) % 6 === 0) ? 'L' : 'S'
  })
}

export const CLUB_MONTHLY_REPORTS = CLUB_ANALYTICS.map((c, i) => ({
  id:     c.id,
  name:   c.name,
  months: makeMonths(c.reportsSubmitted, i),
}))

// PPH Camps — 150 camps distributed across clubs
const PPH_LOCATIONS = [
  'Kopri, Thane East','Wagle Estate, Thane','Mumbra, Thane','Diva, Thane',
  'Airoli, Navi Mumbai','Vashi, Navi Mumbai','Nerul, Navi Mumbai','Kalyan East',
  'Dombivli, Thane','Bhiwandi, Thane District','Mira Road, Thane','Vasai, Palghar',
  'Panvel, Raigad','Belapur, Navi Mumbai','Ulhasnagar, Thane',
]
const PPH_COORDINATORS_M = ['Ramesh Joshi','Anil Mehta','Sanjay Patel','Deepak Verma','Vijay Shah','Rakesh Kumar','Suresh Sharma','Mahesh Desai']
const PPH_COORDINATORS_F = ['Sunita Patil','Priya Desai','Kiran Reddy','Divya Menon','Seema Kapoor','Neha Joshi']
const PPH_DATES = ['Nov 2, 2025','Nov 28, 2025','Dec 10, 2025','Jan 18, 2026','Jan 25, 2026','Feb 2, 2026','Feb 14, 2026','Mar 5, 2026','Mar 22, 2026']

let campId = 0
export const PPH_CAMPS = CLUB_ANALYTICS.flatMap((c, ci) => {
  const campCount = c.citationScore >= 40 ? 2 : c.citationScore >= 25 ? 1 : (ci % 3 === 0 ? 1 : 0)
  return Array.from({ length: campCount }, (_, i) => {
    const seed = ci * 3 + i
    const coords = seed % 3 === 0 ? PPH_COORDINATORS_F : PPH_COORDINATORS_M
    return {
      id:          ++campId,
      club:        c.name,
      date:        PPH_DATES[seed % PPH_DATES.length],
      location:    PPH_LOCATIONS[seed % PPH_LOCATIONS.length],
      children:    150 + (seed * 17 % 251),
      rotarians:   6  + (seed * 3  % 15),
      rotaractors: 3  + (seed * 2  % 10),
      coordinator: coords[seed % coords.length],
    }
  })
})

export const CITATION_CRITERIA = [
  { criterion:'Membership Growth',       points:10 },
  { criterion:'Service Projects (≥10)',  points:10 },
  { criterion:'TRF Contribution',        points:10 },
  { criterion:'Attendance (≥75%)',       points:10 },
  { criterion:'Public Image Initiative', points:10 },
]

function makeCriteria(club, seed) {
  return CITATION_CRITERIA.map((crit, i) => {
    const maxPts = crit.points
    const pctBasis = club.citationScore / 50
    const raw = Math.round(maxPts * (pctBasis + ((seed + i * 3) % 5) * 0.02 - 0.04))
    return Math.max(0, Math.min(maxPts, raw))
  })
}

export const CLUB_CITATIONS = CLUB_ANALYTICS.map((c, i) => ({
  id:       c.id,
  name:     c.name,
  total:    c.citationScore,
  max:      c.citationMax,
  criteria: makeCriteria(c, i),
}))

export const REPORT_SECTIONS = [
  {
    id: 'members', label: 'Membership Reports', color: '#003DA5', hoverBg: '#eff6ff',
    reports: [
      { id:'m1', name:'Member Roster (All Clubs)',        sub:'Current RY' },
      { id:'m2', name:'New Members Report',               sub:'This RY'    },
      { id:'m3', name:'Terminated Members Report',        sub:'This RY'    },
      { id:'m4', name:'Attendance Summary',               sub:'Monthly'    },
    ],
  },
  {
    id: 'district', label: 'District Reports', color: '#9333ea', hoverBg: '#faf5ff',
    reports: [
      { id:'d1', name:'District Citation Report',         sub:'RY 2025–26' },
      { id:'d2', name:'DG Visit Summary',                 sub:'All clubs'  },
      { id:'d3', name:'PPH Camp Summary',                 sub:'This RY'    },
      { id:'d4', name:'TRF District Report',              sub:'RY 2025–26' },
    ],
  },
  {
    id: 'clubs', label: 'Club Reports', color: '#16a34a', hoverBg: '#f0fdf4',
    reports: [
      { id:'c1', name:'Monthly Report Compliance',        sub:'All clubs',  filter:{ options:['All Clubs','Submitted','Pending','Late'] } },
      { id:'c2', name:'Service Projects by Club',         sub:'This RY'    },
      { id:'c3', name:'Club Foundation Contributions',    sub:'This RY'    },
      { id:'c4', name:'Club Attendance Report',           sub:'Monthly',    filter:{ options:['All Months','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'] } },
    ],
  },
]
```

- [ ] **Step 2: Verify in browser**

Open `/districtdashboard/egovernance`. All tabs (Monthly Reports, PPH Camp, Citation, Reports) should load without errors. PPH Camps tab will show 100+ entries without pagination yet.

- [ ] **Step 3: Commit**

```bash
git add src/modules/district/data/egovernanceData.js
git commit -m "data(district): expand egovernanceData to 100 clubs via generator"
```

---

### Task 5: Rewrite Overview.jsx — 4 analytical cards + paginated leaderboard + matrix

**Files:**
- Modify: `src/modules/district/pages/Overview.jsx`

- [ ] **Step 1: Replace the entire file**

```jsx
// src/modules/district/pages/Overview.jsx
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { CLUB_ANALYTICS } from '../data/analyticsData'

// ── District-wide aggregates ─────────────────────────────────────
const distTotalMembers    = CLUB_ANALYTICS.reduce((s, c) => s + c.members, 0)
const distActiveMembers   = CLUB_ANALYTICS.reduce((s, c) => s + c.activeMembers, 0)
const distMaleMembers     = CLUB_ANALYTICS.reduce((s, c) => s + c.maleMembers, 0)
const distFemaleMembers   = CLUB_ANALYTICS.reduce((s, c) => s + c.femaleMembers, 0)
const distHonoraryMembers = CLUB_ANALYTICS.reduce((s, c) => s + c.honoraryMembers, 0)
const distInactiveMembers = distTotalMembers - distActiveMembers
const distNewThisYear     = CLUB_ANALYTICS.reduce((s, c) => s + c.newThisYear, 0)
const distTerminated      = CLUB_ANALYTICS.reduce((s, c) => s + c.terminated, 0)

const distTrfRaised       = CLUB_ANALYTICS.reduce((s, c) => s + c.trfRaised, 0)
const distTrfGoal         = CLUB_ANALYTICS.reduce((s, c) => s + c.trfGoal, 0)
const distAnnualFund      = CLUB_ANALYTICS.reduce((s, c) => s + c.annualFund, 0)
const distPhfContributors = CLUB_ANALYTICS.reduce((s, c) => s + c.phfContributors, 0)
const distMajorDonors     = CLUB_ANALYTICS.reduce((s, c) => s + c.majorDonors, 0)
const distTrfPct          = Math.round((distTrfRaised / distTrfGoal) * 100)

const distServiceProjects = CLUB_ANALYTICS.reduce((s, c) => s + c.serviceProjects, 0)
const distBeneficiaries   = CLUB_ANALYTICS.reduce((s, c) => s + c.beneficiaries, 0)

const distCitationAvg     = Math.round(CLUB_ANALYTICS.reduce((s, c) => s + c.citationScore, 0) / CLUB_ANALYTICS.length)
const distCitationPct     = Math.round((distCitationAvg / 50) * 100)
const distQualified       = CLUB_ANALYTICS.filter(c => c.citationScore >= 40).length

// ── Existing derived data (kept) ─────────────────────────────────
const enriched = CLUB_ANALYTICS.map(c => ({
  ...c,
  citationPct:   Math.round((c.citationScore   / c.citationMax)  * 100),
  compliancePct: Math.round((c.reportsSubmitted / c.reportsTotal) * 100),
  memberPct:     Math.round((c.members          / c.memberTarget) * 100),
  trfPct:        Math.round((c.trfRaised        / c.trfGoal)      * 100),
}))
const withComposite = enriched.map(c => ({
  ...c,
  composite: Math.round((c.citationPct + c.compliancePct + c.avgAttendance) / 3),
}))
const ranked = [...withComposite].sort((a, b) => b.composite - a.composite)

const avgOf = key => Math.round(withComposite.reduce((s, c) => s + c[key], 0) / withComposite.length)
const avgCitation   = avgOf('citationPct')
const avgCompliance = avgOf('compliancePct')
const avgAttendance = avgOf('avgAttendance')
const avgProjects   = avgOf('serviceProjects')

const fmtUSD = v => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(1)}K` : `$${v}`
const INR_TO_USD = 84

// ── RAG helpers ─────────────────────────────────────────────────
const rag = pct => pct > 75 ? 'green' : pct >= 50 ? 'amber' : 'red'
const RAG = {
  green: { dot:'bg-green-500', text:'text-green-700' },
  amber: { dot:'bg-amber-400', text:'text-amber-700' },
  red:   { dot:'bg-red-500',   text:'text-red-600'   },
}
function RagCell({ pct, label }) {
  const s = RAG[rag(pct)]
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
      <span className={`text-xs font-semibold tabular-nums ${s.text}`}>{label}</span>
    </div>
  )
}

// ── Pagination component ─────────────────────────────────────────
function Pagination({ page, total, perPage, setPage }) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
      <span className="text-xs text-slate-400">
        {page * perPage + 1}–{Math.min((page + 1) * perPage, total)} of {total}
      </span>
      <div className="flex gap-1">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
          className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
          ←
        </button>
        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
          className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
          →
        </button>
      </div>
    </div>
  )
}

// ── CardWrapper (same interaction as club dashboard) ─────────────
function CardWrapper({ id, activeCard, setActiveCard, children }) {
  const isActive = activeCard === id
  return (
    <div onClick={() => setActiveCard(id)} className="cursor-pointer rounded-[inherit] transition-all"
      style={isActive ? { outline:'2px solid #003DA5', outlineOffset:'2px', borderRadius:'0.75rem' } : {}}>
      {children}
    </div>
  )
}

export default function DistrictOverview() {
  const [activeCard, setActiveCard]   = useState('membership')
  const [lbSearch,   setLbSearch]     = useState('')
  const [lbPage,     setLbPage]       = useState(0)
  const [matSearch,  setMatSearch]    = useState('')
  const [matPage,    setMatPage]      = useState(0)

  const LB_PER_PAGE  = 10
  const MAT_PER_PAGE = 15

  // Leaderboard filter + paginate
  const lbFiltered = ranked.filter(c => c.name.toLowerCase().includes(lbSearch.toLowerCase()))
  const lbPage_ = Math.min(lbPage, Math.max(0, Math.ceil(lbFiltered.length / LB_PER_PAGE) - 1))
  const lbRows  = lbFiltered.slice(lbPage_ * LB_PER_PAGE, (lbPage_ + 1) * LB_PER_PAGE)

  // Matrix filter + paginate
  const matFiltered = withComposite.filter(c => c.name.toLowerCase().includes(matSearch.toLowerCase()))
  const matPage_    = Math.min(matPage, Math.max(0, Math.ceil(matFiltered.length / MAT_PER_PAGE) - 1))
  const matRows     = matFiltered.slice(matPage_ * MAT_PER_PAGE, (matPage_ + 1) * MAT_PER_PAGE)

  // Chart data: top 20 clubs for selected metric
  const top20 = (key, label) =>
    [...withComposite].sort((a, b) => b[key] - a[key]).slice(0, 20).map(c => ({
      name: c.name.split(' ')[0],
      [label]: c[key],
    }))

  return (
    <div className="space-y-4">

      {/* ── KPI Strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatCard label="Total Clubs"       value={CLUB_ANALYTICS.length}    sub="District 5656"      subColor="muted" accent="#003DA5" />
        <StatCard label="Total Members"     value={distTotalMembers}          sub="Across all clubs"   subColor="muted" accent="#16a34a" />
        <StatCard label="Avg Citation"      value={`${avgCitation}%`}         sub="District average"   subColor={avgCitation   > 75 ? 'up' : 'down'} accent="#9333ea" />
        <StatCard label="Report Compliance" value={`${avgCompliance}%`}       sub="Monthly reports"    subColor={avgCompliance > 75 ? 'up' : 'down'} accent="#0891b2" />
        <StatCard label="Avg Attendance"    value={`${avgAttendance}%`}       sub="Meeting attendance" subColor={avgAttendance > 75 ? 'up' : 'down'} accent="#f59e0b" />
      </div>

      {/* ── Row 1: 4 Analytical Cards ─────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 items-stretch">

        {/* 1 — Membership */}
        <CardWrapper id="membership" activeCard={activeCard} setActiveCard={setActiveCard}>
          <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm">Membership</CardTitle>
                  <CardDescription className="text-xs">All {CLUB_ANALYTICS.length} clubs · RY 2025–26</CardDescription>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                  +{distNewThisYear} new
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-end gap-1.5 mb-3">
                  <span className="text-4xl font-extrabold text-slate-900 tabular-nums leading-none">
                    {distTotalMembers.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 mb-1 ml-1">total members</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label:'Active',   value: distActiveMembers,   color:'#003DA5' },
                    { label:'Male',     value: distMaleMembers,     color:'#0891b2' },
                    { label:'Female',   value: distFemaleMembers,   color:'#e11d48' },
                    { label:'Honorary', value: distHonoraryMembers, color:'#9333ea' },
                    { label:'Inactive', value: distInactiveMembers, color:'#94a3b8' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-500">{s.label}</span>
                        <span className="text-xs font-semibold tabular-nums" style={{ color: s.color }}>
                          {s.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width:`${(s.value/distTotalMembers)*100}%`, backgroundColor: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Terminated this RY</span>
                <span className="text-xs font-semibold text-slate-700">{distTerminated}</span>
              </div>
            </CardContent>
          </Card>
        </CardWrapper>

        {/* 2 — TRF Goal */}
        <CardWrapper id="trf" activeCard={activeCard} setActiveCard={setActiveCard}>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm">TRF Goal</CardTitle>
              <CardDescription className="text-xs mt-0.5">District aggregate · all clubs</CardDescription>
            </CardHeader>
            <CardContent className="pt-3 flex-1 flex flex-col justify-between">
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#fef3c7" strokeWidth="10" />
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#f59e0b" strokeWidth="10"
                      strokeDasharray={`${2*Math.PI*44*Math.min(distTrfPct,100)/100} ${2*Math.PI*44}`}
                      strokeLinecap="round" transform="rotate(-90 55 55)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-amber-600 leading-none tabular-nums">{distTrfPct}%</span>
                    <span className="text-xs text-slate-400 mt-1">of goal</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-800 mt-2 tabular-nums">{fmtUSD(distTrfRaised/INR_TO_USD)} raised</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { label:'Annual Fund',    value: distAnnualFund,      max: distTrfGoal,        color:'#003DA5', display: fmtUSD(distAnnualFund/INR_TO_USD)       },
                  { label:'PHF Members',    value: distPhfContributors, max: CLUB_ANALYTICS.length*25, color:'#9333ea', display: `${distPhfContributors} members` },
                  { label:'Major Donors',   value: distMajorDonors,     max: CLUB_ANALYTICS.length*5,  color:'#ca8a04', display: `${distMajorDonors}`              },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-slate-500">{r.label}</span>
                      <span className="text-xs font-semibold tabular-nums" style={{ color: r.color }}>{r.display}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width:`${Math.min((r.value/r.max)*100,100)}%`, backgroundColor: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs border-t border-slate-100 pt-3 mt-3">
                <span className="text-slate-500">Remaining to goal</span>
                <span className="font-bold text-red-600 tabular-nums">{fmtUSD((distTrfGoal-distTrfRaised)/INR_TO_USD)}</span>
              </div>
            </CardContent>
          </Card>
        </CardWrapper>

        {/* 3 — Service Projects */}
        <CardWrapper id="projects" activeCard={activeCard} setActiveCard={setActiveCard}>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Service Projects</CardTitle>
              <CardDescription className="text-xs">District-wide · RY 2025–26</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 flex-1 flex flex-col justify-between">
              <div className="flex flex-col items-center py-4 gap-1">
                <span className="text-5xl font-extrabold text-slate-900 tabular-nums leading-none">
                  {distServiceProjects}
                </span>
                <span className="text-xs text-slate-400">total projects</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label:'Total Beneficiaries', value: distBeneficiaries.toLocaleString(), color:'#16a34a' },
                  { label:'Clubs with ≥10 Projects', value: CLUB_ANALYTICS.filter(c => c.serviceProjects >= 10).length, color:'#003DA5' },
                  { label:'Avg per Club', value: avgProjects, color:'#9333ea' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-xs text-slate-500">{s.label}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardWrapper>

        {/* 4 — District Citation */}
        <CardWrapper id="citation" activeCard={activeCard} setActiveCard={setActiveCard}>
          <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm">District Citation</CardTitle>
              <CardDescription className="text-xs">Average score · all clubs</CardDescription>
            </CardHeader>
            <CardContent className="pt-3 flex-1 flex flex-col justify-between">
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#f43f5e" strokeWidth="10"
                      strokeDasharray={`${2*Math.PI*44*distCitationPct/100} ${2*Math.PI*44}`}
                      strokeLinecap="round" transform="rotate(-90 55 55)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-rose-600 leading-none tabular-nums">{distCitationAvg}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">avg / 50</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label:`Qualified (≥40 pts)`,    value: distQualified,                        color:'#16a34a' },
                  { label:'Needs Improvement (<25)', value: CLUB_ANALYTICS.filter(c=>c.citationScore<25).length, color:'#ef4444' },
                  { label:'In Progress (25–39)',     value: CLUB_ANALYTICS.filter(c=>c.citationScore>=25&&c.citationScore<40).length, color:'#f59e0b' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-xs text-slate-500">{s.label}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardWrapper>

      </div>

      {/* ── Row 2: Dynamic Chart + Leaderboard ────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Dynamic chart */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              { activeCard === 'membership' ? 'Top 20 Clubs — Member Count'
              : activeCard === 'trf'        ? 'Top 20 Clubs — TRF Achievement %'
              : activeCard === 'projects'   ? 'Top 20 Clubs — Service Projects'
              :                              'Top 20 Clubs — Citation Score'
              }
            </CardTitle>
            <CardDescription className="text-xs">
              { activeCard === 'membership' ? 'Members by club (highest first)'
              : activeCard === 'trf'        ? 'TRF raised vs goal (%)'
              : activeCard === 'projects'   ? 'Total projects completed this RY'
              :                              'Citation score out of 50'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {activeCard === 'membership' && (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={top20('members','Members')} margin={{ left:0, right:16 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip contentStyle={{ fontSize:12, borderRadius:6 }} />
                  <Bar dataKey="Members" fill="#003DA5" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {activeCard === 'trf' && (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={top20('trfPct','TRF %')} margin={{ left:0, right:16 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0,100]} tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={36} unit="%" />
                  <Tooltip formatter={v=>[`${v}%`,'TRF %']} contentStyle={{ fontSize:12, borderRadius:6 }} />
                  <Bar dataKey="TRF %" radius={[4,4,0,0]}>
                    {top20('trfPct','TRF %').map((_, i) => <Cell key={i} fill={i < 5 ? '#16a34a' : i < 15 ? '#f59e0b' : '#ef4444'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            {activeCard === 'projects' && (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={top20('serviceProjects','Projects')} margin={{ left:0, right:16 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ fontSize:12, borderRadius:6 }} />
                  <Bar dataKey="Projects" fill="#16a34a" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {activeCard === 'citation' && (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={top20('citationScore','Score')} margin={{ left:0, right:16 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0,50]} tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ fontSize:12, borderRadius:6 }} />
                  <Bar dataKey="Score" radius={[4,4,0,0]}>
                    {top20('citationScore','Score').map((d,i) => (
                      <Cell key={i} fill={d.Score >= 40 ? '#16a34a' : d.Score >= 25 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard with search + pagination */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Club Leaderboard</CardTitle>
            <div className="mt-2">
              <input value={lbSearch} onChange={e => { setLbSearch(e.target.value); setLbPage(0) }}
                placeholder="Search club..."
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-slate-400 placeholder-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {lbRows.map((c, rowIdx) => {
                const rank    = lbFiltered.indexOf(c)
                const isTop   = rank < 5
                const isBottom= rank >= lbFiltered.length - 5
                return (
                  <div key={c.id}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${
                      isTop ? 'bg-green-50' : isBottom ? 'bg-red-50' : 'bg-slate-50'
                    }`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs font-bold w-5 text-center flex-shrink-0 ${
                        isTop ? 'text-green-600' : isBottom ? 'text-red-500' : 'text-slate-400'
                      }`}>{rank + 1}</span>
                      <span className={`text-xs font-semibold truncate ${
                        isTop ? 'text-green-800' : isBottom ? 'text-red-800' : 'text-slate-700'
                      }`}>{c.name}</span>
                    </div>
                    <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${
                      isTop ? 'text-green-700' : isBottom ? 'text-red-600' : 'text-slate-600'
                    }`}>{c.composite}%</span>
                  </div>
                )
              })}
              {lbFiltered.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No clubs match your search.</p>
              )}
            </div>
            <Pagination page={lbPage_} total={lbFiltered.length} perPage={LB_PER_PAGE} setPage={setLbPage} />
            {ranked.filter(c => c.composite < 50).length > 0 && !lbSearch && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-red-600">
                  ⚠ {ranked.filter(c => c.composite < 50).length} club(s) below 50%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Club Comparison Matrix ─────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-sm">Club Comparison Matrix</CardTitle>
            <input value={matSearch} onChange={e => { setMatSearch(e.target.value); setMatPage(0) }}
              placeholder="Search club..."
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-slate-400 placeholder-slate-400 w-48" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Club','Members','Citation','Reports','Attendance','TRF','Projects'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matRows.map(c => {
                  const projPct = c.serviceProjects >= avgProjects ? 100 : c.serviceProjects >= avgProjects * 0.8 ? 65 : 40
                  const trfColor = c.trfPct > 75 ? '#16a34a' : c.trfPct >= 50 ? '#f59e0b' : '#e11d48'
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 font-semibold text-slate-800 text-xs whitespace-nowrap">{c.name}</td>
                      <td className="px-3 py-3"><RagCell pct={c.memberPct}     label={`${c.members}/${c.memberTarget}`} /></td>
                      <td className="px-3 py-3"><RagCell pct={c.citationPct}   label={`${c.citationPct}%`} /></td>
                      <td className="px-3 py-3"><RagCell pct={c.compliancePct} label={`${c.reportsSubmitted}/${c.reportsTotal}`} /></td>
                      <td className="px-3 py-3"><RagCell pct={c.avgAttendance} label={`${c.avgAttendance}%`} /></td>
                      <td className="px-3 py-3">
                        <RagCell pct={c.trfPct} label={`${c.trfPct}%`} />
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden w-16 mt-1">
                          <div className="h-full rounded-full" style={{ width:`${c.trfPct}%`, backgroundColor: trfColor }} />
                        </div>
                      </td>
                      <td className="px-3 py-3"><RagCell pct={projPct} label={String(c.serviceProjects)} /></td>
                    </tr>
                  )
                })}
                {matFiltered.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-10 text-center text-sm text-slate-400">No clubs match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={matPage_} total={matFiltered.length} perPage={MAT_PER_PAGE} setPage={setMatPage} />
        </CardContent>
      </Card>

    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open `/districtdashboard/overview`. Confirm:
- KPI strip shows 100 clubs and aggregated member total
- All 4 analytical cards render (Membership, TRF Goal, Service Projects, Citation)
- Clicking each card changes the chart to show top 20 clubs for that metric
- Leaderboard shows 10 clubs with working prev/next pagination
- Search in leaderboard filters by club name
- Comparison matrix shows 15 rows with prev/next pagination
- Search in matrix filters correctly

- [ ] **Step 3: Commit**

```bash
git add src/modules/district/pages/Overview.jsx
git commit -m "feat(district): rewrite Overview with 4 analytical cards + paginated leaderboard and matrix"
```

---

### Task 6: Rewrite Clubs.jsx — paginated table + accordion member drill-down

**Files:**
- Modify: `src/modules/district/pages/Clubs.jsx`

- [ ] **Step 1: Replace the file**

```jsx
// src/modules/district/pages/Clubs.jsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { CLUB_ANALYTICS } from '../data/analyticsData'

const PER_PAGE = 15

const STATUS_COLORS = {
  Active:   'bg-green-50 text-green-700',
  Inactive: 'bg-slate-100 text-slate-500',
}

export default function DistrictClubs() {
  const [search,      setSearch]      = useState('')
  const [page,        setPage]        = useState(0)
  const [expandedId,  setExpandedId]  = useState(null)

  const totalMembers = CLUB_ANALYTICS.reduce((s, c) => s + c.members, 0)
  const totalActive  = CLUB_ANALYTICS.reduce((s, c) => s + c.activeMembers, 0)
  const totalNew     = CLUB_ANALYTICS.reduce((s, c) => s + c.newThisYear, 0)

  const filtered  = CLUB_ANALYTICS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const safePage   = Math.min(page, Math.max(0, totalPages - 1))
  const rows       = filtered.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE)

  return (
    <div className="space-y-5">

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Clubs"   value={CLUB_ANALYTICS.length} sub="District 5656"    subColor="muted" accent="#003DA5" />
        <StatCard label="Total Members" value={totalMembers}           sub="Across all clubs" subColor="muted" accent="#16a34a" />
        <StatCard label="Active Members"value={totalActive}            sub="Currently active" subColor="up"    accent="#0891b2" />
        <StatCard label="New This Year" value={totalNew}               sub="New members RY"   subColor="up"    accent="#9333ea" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-sm">All Clubs — District 5656</CardTitle>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search club..."
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-slate-400 placeholder-slate-400 w-52" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">

          {/* Club list */}
          {rows.map(club => {
            const isOpen = expandedId === club.id
            const attendColor = club.avgAttendance >= 75 ? '#16a34a' : club.avgAttendance >= 50 ? '#f59e0b' : '#ef4444'
            return (
              <div key={club.id} className="rounded-xl border border-slate-200 overflow-hidden">

                {/* Club row */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : club.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor:'#003DA5' }}>
                    {club.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{club.name}</p>
                    <p className="text-xs text-slate-400">{club.meetingDay} · {club.meetingTime}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 flex-shrink-0 text-xs">
                    <div className="text-center">
                      <p className="font-bold text-slate-800 tabular-nums">{club.members}</p>
                      <p className="text-slate-400">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold tabular-nums" style={{ color: attendColor }}>{club.avgAttendance}%</p>
                      <p className="text-slate-400">Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-800 tabular-nums">{club.newThisYear}</p>
                      <p className="text-slate-400">New</p>
                    </div>
                  </div>
                  <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"
                    className="flex-shrink-0 transition-transform" style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>

                {/* Member drill-down */}
                {isOpen && (
                  <div className="border-t border-slate-100 overflow-x-auto bg-slate-50">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200">
                          {['Name','Designation','Mobile','Email','Since','Status'].map(h => (
                            <th key={h} className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {club.memberRoster.map((m, i) => (
                          <tr key={i} className="hover:bg-white">
                            <td className="px-3 py-2.5 font-semibold text-slate-800 whitespace-nowrap">{m.name}</td>
                            <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{m.designation}</td>
                            <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{m.mobile}</td>
                            <td className="px-3 py-2.5 text-slate-500">{m.email}</td>
                            <td className="px-3 py-2.5 text-slate-500 tabular-nums">{m.since}</td>
                            <td className="px-3 py-2.5">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[m.status] ?? STATUS_COLORS.Active}`}>
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-10">No clubs match your search.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                {safePage * PER_PAGE + 1}–{Math.min((safePage + 1) * PER_PAGE, filtered.length)} of {filtered.length} clubs
              </span>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">←</button>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">→</button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open `/districtdashboard/membership` → Clubs tab. Confirm:
- 100 clubs listed, 15 per page with prev/next
- Search filters by club name
- Clicking any club row expands an accordion showing the member roster table
- Member table shows Name, Designation, Mobile, Email, Since, Status
- Clicking again collapses

- [ ] **Step 3: Commit**

```bash
git add src/modules/district/pages/Clubs.jsx
git commit -m "feat(district): paginated clubs table with member drill-down accordion"
```

---

### Task 7: Update Membership.jsx — add district-wide KPI strip

**Files:**
- Modify: `src/modules/district/pages/Membership.jsx`

- [ ] **Step 1: Read the current file, then add KPI strip**

The current file imports and renders tab sub-components. Add these imports and the KPI strip above the tab bar:

```jsx
// src/modules/district/pages/Membership.jsx
import { useState } from 'react'
import StatCard from '../../club/components/StatCard'
import { CLUB_ANALYTICS } from '../data/analyticsData'
import DistrictDirectory  from './Directory'
import DistrictCommittee from './Committee'
import DistrictAG        from './AG'
import DistrictModerator from './Moderator'
import DistrictClubs     from './Clubs'

const TABS = [
  { id: 'directory',  label: 'Directory'           },
  { id: 'committee',  label: 'District Committee'  },
  { id: 'ag',         label: 'Assistant Governors' },
  { id: 'moderator',  label: 'Club Moderator'      },
  { id: 'clubs',      label: 'Clubs'               },
]

const totalMembers  = CLUB_ANALYTICS.reduce((s, c) => s + c.members, 0)
const activeMembers = CLUB_ANALYTICS.reduce((s, c) => s + c.activeMembers, 0)
const newThisYear   = CLUB_ANALYTICS.reduce((s, c) => s + c.newThisYear, 0)
const terminated    = CLUB_ANALYTICS.reduce((s, c) => s + c.terminated, 0)

export default function DistrictMembership() {
  const [activeTab, setActiveTab] = useState('directory')

  return (
    <div className="space-y-4">

      {/* KPI strip — district-wide aggregates */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Members"  value={totalMembers}  sub="All clubs"        subColor="muted" accent="#003DA5" />
        <StatCard label="Active Members" value={activeMembers} sub="Currently active" subColor="up"    accent="#16a34a" />
        <StatCard label="New This Year"  value={newThisYear}   sub="New this RY"      subColor="up"    accent="#9333ea" />
        <StatCard label="Terminated"     value={terminated}    sub="Exits this RY"    subColor="down"  accent="#e11d48" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'text-[#1e3a5f] shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            style={activeTab === t.id ? { backgroundColor: '#F7A81B' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'directory'  && <DistrictDirectory />}
      {activeTab === 'committee'  && <DistrictCommittee />}
      {activeTab === 'ag'         && <DistrictAG />}
      {activeTab === 'moderator'  && <DistrictModerator />}
      {activeTab === 'clubs'      && <DistrictClubs />}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open `/districtdashboard/membership`. KPI strip (Total Members, Active Members, New This Year, Terminated) appears above the tab bar with correct aggregated numbers from 100 clubs.

- [ ] **Step 3: Commit**

```bash
git add src/modules/district/pages/Membership.jsx
git commit -m "feat(district): add district-wide KPI strip to Membership page"
```

---

### Task 8: Update Foundation.jsx — search + pagination

**Files:**
- Modify: `src/modules/district/pages/Foundation.jsx`

- [ ] **Step 1: Add pagination to ProjectsTab**

In `Foundation.jsx`, find the `ProjectsTab` function. After the existing filter logic, add pagination state and slice the filtered array. Replace the table body's `filtered.map(...)` with `pageRows.map(...)` and add the pagination controls after the table.

Add at the top of `ProjectsTab`:
```jsx
const PER_PAGE = 15
const [page, setPage] = useState(0)
```

After the existing filter logic (the `filtered` const), add:
```jsx
const totalPages = Math.ceil(filtered.length / PER_PAGE)
const safePage   = Math.min(page, Math.max(0, totalPages - 1))
const pageRows   = filtered.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE)
```

Change `filtered.map(...)` in the tbody to `pageRows.map(...)`.

Replace the existing count line at the bottom of the card:
```jsx
<p className="text-xs text-slate-400">{filtered.length} of {DISTRICT_PROJECTS.length} projects shown</p>
```
With:
```jsx
<div className="flex items-center justify-between">
  <p className="text-xs text-slate-400">{filtered.length} of {DISTRICT_PROJECTS.length} projects shown</p>
  {totalPages > 1 && (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">
        Page {safePage + 1} of {totalPages}
      </span>
      <div className="flex gap-1">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
          className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}
          className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
      </div>
    </div>
  )}
</div>
```

Also reset page to 0 when any filter changes — add `setPage(0)` to every `onChange` in the filter controls:
- `setSearch`: `onChange={e => { setSearch(e.target.value); setPage(0) }}`
- `setClub`: `onChange={e => { setClub(e.target.value); setPage(0) }}`
- `setAvenue`: `onChange={e => { setAvenue(e.target.value); setPage(0) }}`
- `setStatus` buttons: `onClick={() => { setStatus(s); setPage(0) }}`

- [ ] **Step 2: Add pagination to EventsTab the same way**

Apply the identical pattern to `EventsTab`: add `page` state, `safePage`, `pageRows`, replace `filtered.map` with `pageRows.map`, add pagination controls, reset page on filter changes.

- [ ] **Step 3: Verify in browser**

Open `/districtdashboard/foundation`. Projects tab should show 15 rows with working pagination. Events tab the same. Filter + search should reset to page 1.

- [ ] **Step 4: Commit**

```bash
git add src/modules/district/pages/Foundation.jsx
git commit -m "feat(district): add search + pagination to Foundation Projects and Events tabs"
```

---

### Task 9: Update EGovernance.jsx — search/pagination + citation table

**Files:**
- Modify: `src/modules/district/pages/EGovernance.jsx`

- [ ] **Step 1: Add search + pagination to MonthlyReportTab**

In `MonthlyReportTab`, add at the top:
```jsx
const [search, setSearch] = useState('')
const [page,   setPage]   = useState(0)
const MR_PER_PAGE = 20
```

Add a search input just above the Per-Club Breakdown card:
```jsx
<div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 max-w-sm">
  <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
  <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
    placeholder="Search club..."
    className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
</div>
```

After the search input, filter and paginate `CLUB_MONTHLY_REPORTS`:
```jsx
const mrFiltered  = CLUB_MONTHLY_REPORTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
const mrPages     = Math.ceil(mrFiltered.length / MR_PER_PAGE)
const mrSafePage  = Math.min(page, Math.max(0, mrPages - 1))
const mrRows      = mrFiltered.slice(mrSafePage * MR_PER_PAGE, (mrSafePage + 1) * MR_PER_PAGE)
```

Replace `CLUB_MONTHLY_REPORTS.map(club =>` with `mrRows.map(club =>`.

After the club accordion list, add:
```jsx
{mrPages > 1 && (
  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
    <span className="text-xs text-slate-400">
      {mrSafePage * MR_PER_PAGE + 1}–{Math.min((mrSafePage + 1) * MR_PER_PAGE, mrFiltered.length)} of {mrFiltered.length} clubs
    </span>
    <div className="flex gap-1">
      <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={mrSafePage === 0}
        className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
      <button onClick={() => setPage(p => Math.min(mrPages - 1, p + 1))} disabled={mrSafePage >= mrPages - 1}
        className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
    </div>
  </div>
)}
```

- [ ] **Step 2: Add pagination to PPHCampTab**

In `PPHCampTab`, add `page` / `setPage` state with `PPH_PER_PAGE = 15`. Apply the same filter+paginate pattern after the existing `filtered` const. Replace `filtered.map` with `pageRows.map` in the table body. Add pagination controls below the table.

- [ ] **Step 3: Rewrite CitationTab — switch from card grid to paginated table**

Replace the entire `CitationTab` function body with:

```jsx
function CitationTab() {
  const [search,     setSearch]     = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [page,       setPage]       = useState(0)
  const CIT_PER_PAGE = 15

  const sorted    = [...CLUB_CITATIONS].sort((a, b) => b.total - a.total)
  const distAvg   = Math.round(CLUB_CITATIONS.reduce((s, c) => s + c.total, 0) / CLUB_CITATIONS.length)
  const qualified = CLUB_CITATIONS.filter(c => c.total >= 40).length

  const filtered   = sorted.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / CIT_PER_PAGE)
  const safePage   = Math.min(page, Math.max(0, totalPages - 1))
  const pageRows   = filtered.slice(safePage * CIT_PER_PAGE, (safePage + 1) * CIT_PER_PAGE)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Total Clubs"       value={CLUB_CITATIONS.length} sub="Participating"       subColor="muted" accent="#003DA5" />
        <StatCard label="District Average"  value={`${distAvg}/50`}       sub="Citation score"      subColor={distAvg >= 40 ? 'up' : 'down'} accent="#9333ea" />
        <StatCard label="Qualified"         value={qualified}             sub="≥ 40 pts (citation)" subColor="up"    accent="#16a34a" />
        <StatCard label="Max Score"         value="50"                    sub="Points possible"     subColor="muted" accent="#0891b2" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm">Citation Scores — All Clubs</CardTitle>
              <CardDescription className="text-xs">Ranked by total score · click a row to expand</CardDescription>
            </div>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search club..."
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-slate-400 placeholder-slate-400 w-48" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {pageRows.map((club, rowIdx) => {
            const rank    = filtered.indexOf(club)
            const pct     = Math.round((club.total / club.max) * 100)
            const color   = pct >= 80 ? '#16a34a' : pct >= 50 ? '#f59e0b' : '#ef4444'
            const isOpen  = expandedId === club.id
            return (
              <div key={club.id} className="rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpandedId(isOpen ? null : club.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="text-xs font-bold w-6 text-center flex-shrink-0" style={{ color }}>{rank + 1}</span>
                  <span className="flex-1 text-sm font-semibold text-slate-800 truncate">{club.name}</span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full rounded-full" style={{ width:`${pct}%`, backgroundColor: color }} />
                    </div>
                    <span className="text-sm font-extrabold tabular-nums" style={{ color }}>{club.total}</span>
                    <span className="text-xs text-slate-400">/ {club.max}</span>
                    <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"
                      className="transition-transform" style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-4 pb-3 pt-2 bg-slate-50 space-y-2">
                    {CITATION_CRITERIA.map((crit, i) => {
                      const earned = club.criteria[i]
                      const cPct   = Math.round((earned / crit.points) * 100)
                      const cColor = cPct === 100 ? '#16a34a' : cPct >= 60 ? '#f59e0b' : '#ef4444'
                      return (
                        <div key={i}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[11px] text-slate-500">{crit.criterion}</span>
                            <span className="text-[11px] font-bold tabular-nums ml-2" style={{ color: cColor }}>
                              {earned}/{crit.points}
                            </span>
                          </div>
                          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width:`${cPct}%`, backgroundColor: cColor }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-10">No clubs match your search.</p>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                {safePage * CIT_PER_PAGE + 1}–{Math.min((safePage + 1) * CIT_PER_PAGE, filtered.length)} of {filtered.length} clubs
              </span>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 4: Verify in browser**

Open `/districtdashboard/egovernance`:
- Monthly Reports tab: search box filters clubs, accordion shows 20/page with pagination
- PPH Camp tab: table shows 15/page with pagination
- Citation tab: ranked list of 100 clubs as expandable rows, 15/page, search works, clicking a row shows per-criterion breakdown

- [ ] **Step 5: Commit**

```bash
git add src/modules/district/pages/EGovernance.jsx
git commit -m "feat(district): search + pagination on monthly reports and PPH; citation tab as paginated table"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| 100 clubs with all fields | Task 1 |
| clubsData synced to 100 clubs | Task 2 |
| ~300 projects, ~200 events | Task 3 |
| 100 clubs monthly reports, PPH, citations | Task 4 |
| Overview: 4 analytical cards (Membership, TRF, Service Projects, Citation) | Task 5 |
| Overview: district-wide KPI strip (5 cards) | Task 5 |
| Overview: paginated leaderboard with search | Task 5 |
| Overview: paginated comparison matrix with search | Task 5 |
| Overview: dynamic chart responds to card click | Task 5 |
| Membership: district KPI strip | Task 7 |
| Membership → Clubs tab: paginated club table | Task 6 |
| Membership → Clubs tab: accordion member drill-down | Task 6 |
| Foundation: search + pagination | Task 8 |
| E-Governance monthly reports: search + pagination | Task 9 |
| E-Governance PPH camps: pagination | Task 9 |
| E-Governance citation: paginated table with expand | Task 9 |
| Communication module: no change needed | — |

**No placeholders, no TODOs found.**

**Type consistency:** `CLUB_ANALYTICS` is the single source of truth. `clubsData.js` imports from it. `egovernanceData.js` imports from it. `foundationData.js` imports from it. All pages import `CLUB_ANALYTICS` directly or via these data files — consistent throughout.
