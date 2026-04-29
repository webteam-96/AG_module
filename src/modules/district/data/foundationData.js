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
  Completed:    { bg:'bg-green-50',  text:'text-green-700'  },
  'In Progress':{ bg:'bg-amber-50',  text:'text-amber-700'  },
  Upcoming:     { bg:'bg-blue-50',   text:'text-blue-700'   },
}

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
    const t     = PROJECT_TEMPLATES[(seed * 3 + i * 7) % PROJECT_TEMPLATES.length]
    const scale = 0.6 + (seed % 8) * 0.05
    return {
      id:           ++pid,
      club,
      name:         t.name,
      avenue:       t.avenue,
      date:         PROJECT_DATES[(seed * 2 + i * 5) % PROJECT_DATES.length],
      beneficiaries:Math.round(t.beneFactor * scale),
      funds:        Math.round(t.fundsFactor * scale),
      manHours:     t.hoursFactor + (seed % 3) * 8,
      status:       PROJECT_STATUSES[(seed + i * 3) % PROJECT_STATUSES.length],
    }
  })
}

const EVENT_TEMPLATES = [
  { name:'Weekly Meeting',             type:'Meeting' },
  { name:'Monthly Meeting',            type:'Meeting' },
  { name:'Fortnightly Meeting',        type:'Meeting' },
  { name:'Blood Donation Camp',        type:'Service' },
  { name:'Medical Camp',               type:'Service' },
  { name:'TRF Fundraiser Dinner',      type:'TRF'     },
  { name:'Foundation Awareness Night', type:'TRF'     },
  { name:'Youth Leadership Event',     type:'New Gen' },
  { name:'Interact Meeting',           type:'New Gen' },
  { name:'Career Fair',                type:'Service' },
]
const VENUES = [
  'Club Hall','Hotel Regency, Thane','Community Centre','Municipal Hall',
  'School Auditorium','Hotel Solitaire','Banquet Hall','Online / Zoom',
]
const EVENT_DATES = [
  '2025-10-05','2025-11-08','2025-12-12','2026-01-09','2026-02-06',
  '2026-03-06','2026-04-05','2026-04-20','2026-05-08','2026-06-05',
]
const EVENT_TIMES    = ['7:00 AM','7:30 PM','6:30 PM','9:00 AM','10:00 AM','5:30 PM','7:00 PM']
const EVENT_STATUSES = ['Completed','Completed','Upcoming','Upcoming']

let eid = 4
function makeEvents(club, seed) {
  const count = 1 + (seed % 3)
  return Array.from({ length: count }, (_, i) => {
    const t = EVENT_TEMPLATES[(seed * 2 + i * 5) % EVENT_TEMPLATES.length]
    return {
      id:     ++eid,
      club,
      name:   t.name,
      type:   t.type,
      date:   EVENT_DATES[(seed + i * 3) % EVENT_DATES.length],
      time:   EVENT_TIMES[(seed * 3 + i) % EVENT_TIMES.length],
      venue:  VENUES[(seed + i * 7) % VENUES.length],
      status: EVENT_STATUSES[(seed + i) % EVENT_STATUSES.length],
    }
  })
}

const DISTRICT_EVENTS_PREFIX = [
  { id:1, club:'District 5656', name:'District Assembly',        type:'District', date:'2026-05-03', time:'9:00 AM',  venue:'Hotel Vivanta, Thane', status:'Upcoming' },
  { id:2, club:'District 5656', name:'District Conference',      type:'District', date:'2026-06-14', time:'10:00 AM', venue:'Grand Hyatt, Mumbai',  status:'Upcoming' },
  { id:3, club:'District 5656', name:'DG Installation Ceremony', type:'District', date:'2026-07-01', time:'6:00 PM',  venue:'Hotel Regency, Thane', status:'Upcoming' },
  { id:4, club:'District 5656', name:'District Citation Review', type:'District', date:'2026-04-28', time:'6:00 PM',  venue:'Online / Zoom',        status:'Upcoming' },
]

export const DISTRICT_PROJECTS = CLUB_ANALYTICS.flatMap((c, i) => makeProjects(c.name, i))
export const DISTRICT_EVENTS   = [
  ...DISTRICT_EVENTS_PREFIX,
  ...CLUB_ANALYTICS.flatMap((c, i) => makeEvents(c.name, i)),
]
