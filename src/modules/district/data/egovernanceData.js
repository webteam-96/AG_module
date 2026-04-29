// src/modules/district/data/egovernanceData.js
import { CLUB_ANALYTICS } from './analyticsData'

export const CMR_MONTHS = [
  'Jul 2025','Aug 2025','Sep 2025','Oct 2025','Nov 2025','Dec 2025',
  'Jan 2026','Feb 2026','Mar 2026','Apr 2026','May 2026','Jun 2026',
]

function makeMonths(submitted, seed) {
  return Array.from({ length: 12 }, (_, i) => {
    if (i > 9) return 'N'
    if (i >= submitted) return i === submitted ? 'P' : 'N'
    return (!submitted || (seed + i) % 6 === 0) ? 'L' : 'S'
  })
}

export const CLUB_MONTHLY_REPORTS = CLUB_ANALYTICS.map((c, i) => ({
  id:     c.id,
  name:   c.name,
  months: makeMonths(c.reportsSubmitted, i),
}))

const PPH_LOCATIONS = [
  'Kopri, Thane East','Wagle Estate, Thane','Mumbra, Thane','Diva, Thane',
  'Airoli, Navi Mumbai','Vashi, Navi Mumbai','Nerul, Navi Mumbai','Kalyan East',
  'Dombivli, Thane','Bhiwandi, Thane District','Mira Road, Thane','Vasai, Palghar',
  'Panvel, Raigad','Belapur, Navi Mumbai','Ulhasnagar, Thane',
]
const PPH_COORDS_M = ['Ramesh Joshi','Anil Mehta','Sanjay Patel','Deepak Verma','Vijay Shah','Rakesh Kumar','Suresh Sharma','Mahesh Desai']
const PPH_COORDS_F = ['Sunita Patil','Priya Desai','Kiran Reddy','Divya Menon','Seema Kapoor','Neha Joshi']
const PPH_DATES    = ['Nov 2, 2025','Nov 28, 2025','Dec 10, 2025','Jan 18, 2026','Jan 25, 2026','Feb 2, 2026','Feb 14, 2026','Mar 5, 2026','Mar 22, 2026']

let campId = 0
export const PPH_CAMPS = CLUB_ANALYTICS.flatMap((c, ci) => {
  const campCount = c.citationScore >= 800 ? 2 : c.citationScore >= 500 ? 1 : (ci % 3 === 0 ? 1 : 0)
  return Array.from({ length: campCount }, (_, i) => {
    const seed   = ci * 3 + i
    const coords = seed % 3 === 0 ? PPH_COORDS_F : PPH_COORDS_M
    return {
      id:          ++campId,
      club:        c.name,
      date:        PPH_DATES[seed % PPH_DATES.length],
      location:    PPH_LOCATIONS[seed % PPH_LOCATIONS.length],
      children:    150 + (seed * 17 % 251),
      rotarians:   6   + (seed * 3  % 15),
      rotaractors: 3   + (seed * 2  % 10),
      coordinator: coords[seed % coords.length],
    }
  })
})

export const CITATION_CRITERIA = [
  { criterion:'Membership Growth',       points:200 },
  { criterion:'Service Projects (≥10)',  points:200 },
  { criterion:'TRF Contribution',        points:200 },
  { criterion:'Attendance (≥75%)',       points:200 },
  { criterion:'Public Image Initiative', points:200 },
]

function makeCriteria(club, seed) {
  return CITATION_CRITERIA.map((crit, i) => {
    const maxPts  = crit.points
    const pctBase = club.citationScore / 1000
    const raw     = Math.round(maxPts * (pctBase + ((seed + i * 3) % 5) * 0.02 - 0.04))
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
    id:'members', label:'Membership Reports', color:'#003DA5', hoverBg:'#eff6ff',
    reports:[
      { id:'m1', name:'Member Roster (All Clubs)',     sub:'Current RY' },
      { id:'m2', name:'New Members Report',            sub:'This RY'    },
      { id:'m3', name:'Terminated Members Report',     sub:'This RY'    },
      { id:'m4', name:'Attendance Summary',            sub:'Monthly'    },
    ],
  },
  {
    id:'district', label:'District Reports', color:'#9333ea', hoverBg:'#faf5ff',
    reports:[
      { id:'d1', name:'District Citation Report',      sub:'RY 2025–26' },
      { id:'d2', name:'DG Visit Summary',              sub:'All clubs'  },
      { id:'d3', name:'PPH Camp Summary',              sub:'This RY'    },
      { id:'d4', name:'TRF District Report',           sub:'RY 2025–26' },
    ],
  },
  {
    id:'clubs', label:'Club Reports', color:'#16a34a', hoverBg:'#f0fdf4',
    reports:[
      { id:'c1', name:'Monthly Report Compliance',     sub:'All clubs',  filter:{ options:['All Clubs','Submitted','Pending','Late'] } },
      { id:'c2', name:'Service Projects by Club',      sub:'This RY'    },
      { id:'c3', name:'Club Foundation Contributions', sub:'This RY'    },
      { id:'c4', name:'Club Attendance Report',        sub:'Monthly',    filter:{ options:['All Months','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'] } },
    ],
  },
]
