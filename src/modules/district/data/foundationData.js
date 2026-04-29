// src/modules/district/data/foundationData.js

export const DISTRICT_PROJECTS = [
  // Thane City View
  { id:1,  club:'Thane City View',    name:'Blood Donation Drive',         avenue:'Community Service',     date:'Mar 15, 2026', beneficiaries:320,  funds:0,      manHours:48,  rotarians:28, status:'Completed'   },
  { id:2,  club:'Thane City View',    name:'Scholarship Distribution',     avenue:'New Generation',        date:'Mar 10, 2026', beneficiaries:45,   funds:180000, manHours:24,  rotarians:12, status:'Completed'   },
  { id:3,  club:'Thane City View',    name:'Tree Plantation Drive',        avenue:'Community Service',     date:'Feb 22, 2026', beneficiaries:600,  funds:45000,  manHours:120, rotarians:35, status:'Completed'   },
  { id:4,  club:'Thane City View',    name:'Vocational Training Camp',     avenue:'Vocational Service',    date:'Apr 18, 2026', beneficiaries:80,   funds:72000,  manHours:72,  rotarians:15, status:'In Progress' },
  { id:5,  club:'Thane City View',    name:'Rotaract Charter Ceremony',    avenue:'New Generation',        date:'Apr 25, 2026', beneficiaries:200,  funds:35000,  manHours:60,  rotarians:20, status:'Upcoming'    },
  { id:6,  club:'Thane City View',    name:'Medical Camp',                 avenue:'Community Service',     date:'Jan 18, 2026', beneficiaries:450,  funds:95000,  manHours:96,  rotarians:30, status:'Completed'   },
  // Lake Shore Club
  { id:7,  club:'Lake Shore Club',    name:'Literacy Drive',               avenue:'Vocational Service',    date:'Dec 5, 2025',  beneficiaries:120,  funds:30000,  manHours:48,  rotarians:12, status:'Completed'   },
  { id:8,  club:'Lake Shore Club',    name:'Water Conservation Project',   avenue:'Community Service',     date:'Feb 10, 2026', beneficiaries:800,  funds:60000,  manHours:80,  rotarians:20, status:'Completed'   },
  { id:9,  club:'Lake Shore Club',    name:'Youth Leadership Camp',        avenue:'New Generation',        date:'Mar 20, 2026', beneficiaries:50,   funds:25000,  manHours:40,  rotarians:8,  status:'Completed'   },
  { id:10, club:'Lake Shore Club',    name:'Eye Check-up Camp',            avenue:'Community Service',     date:'Apr 10, 2026', beneficiaries:300,  funds:40000,  manHours:32,  rotarians:15, status:'Upcoming'    },
  // Owala
  { id:11, club:'Owala',              name:'Digital Literacy Workshop',    avenue:'Vocational Service',    date:'Jan 25, 2026', beneficiaries:90,   funds:18000,  manHours:36,  rotarians:10, status:'Completed'   },
  { id:12, club:'Owala',              name:'Clean Village Drive',          avenue:'Community Service',     date:'Feb 28, 2026', beneficiaries:500,  funds:22000,  manHours:60,  rotarians:18, status:'Completed'   },
  { id:13, club:'Owala',              name:'Career Guidance Seminar',      avenue:'Vocational Service',    date:'Mar 28, 2026', beneficiaries:75,   funds:8000,   manHours:16,  rotarians:6,  status:'Completed'   },
  { id:14, club:'Owala',              name:'Interact Club Installation',   avenue:'New Generation',        date:'Apr 20, 2026', beneficiaries:60,   funds:12000,  manHours:20,  rotarians:8,  status:'Upcoming'    },
  // Rotary Club Leo
  { id:15, club:'Rotary Club of Leo', name:'Senior Citizen Health Camp',   avenue:'Community Service',     date:'Dec 18, 2025', beneficiaries:180,  funds:35000,  manHours:40,  rotarians:10, status:'Completed'   },
  { id:16, club:'Rotary Club of Leo', name:'School Kit Distribution',      avenue:'New Generation',        date:'Jan 10, 2026', beneficiaries:250,  funds:50000,  manHours:30,  rotarians:12, status:'Completed'   },
  { id:17, club:'Rotary Club of Leo', name:'Skill Training Program',       avenue:'Vocational Service',    date:'Apr 5, 2026',  beneficiaries:45,   funds:20000,  manHours:48,  rotarians:8,  status:'In Progress' },
  // New Club
  { id:18, club:'New Club Test Entry',name:'Community Clean-up Drive',     avenue:'Community Service',     date:'Mar 5, 2026',  beneficiaries:200,  funds:10000,  manHours:24,  rotarians:10, status:'Completed'   },
  { id:19, club:'New Club Test Entry',name:'Awareness Walk',               avenue:'Public Image',          date:'Apr 12, 2026', beneficiaries:500,  funds:5000,   manHours:12,  rotarians:8,  status:'Upcoming'    },
  // Tikujiniwadi
  { id:20, club:'Tikujiniwadi',       name:'Mega Blood Donation Camp',     avenue:'Community Service',     date:'Jan 30, 2026', beneficiaries:650,  funds:0,      manHours:96,  rotarians:40, status:'Completed'   },
  { id:21, club:'Tikujiniwadi',       name:'Women Empowerment Workshop',   avenue:'Vocational Service',    date:'Feb 15, 2026', beneficiaries:120,  funds:28000,  manHours:48,  rotarians:15, status:'Completed'   },
  { id:22, club:'Tikujiniwadi',       name:'RYLA District',                avenue:'New Generation',        date:'Mar 22, 2026', beneficiaries:40,   funds:45000,  manHours:72,  rotarians:12, status:'Completed'   },
  { id:23, club:'Tikujiniwadi',       name:'Solar Light Distribution',     avenue:'International Service', date:'Apr 28, 2026', beneficiaries:100,  funds:85000,  manHours:30,  rotarians:10, status:'Upcoming'    },
]

export const DISTRICT_EVENTS = [
  // District-level events
  { id:1,  club:'District 5656',      name:'District Assembly',              type:'District',  date:'2026-05-03', time:'9:00 AM',  venue:'Hotel Vivanta, Thane',         status:'Upcoming'  },
  { id:2,  club:'District 5656',      name:'District Conference',            type:'District',  date:'2026-06-14', time:'10:00 AM', venue:'Grand Hyatt, Mumbai',          status:'Upcoming'  },
  { id:3,  club:'District 5656',      name:'District Citation Review',       type:'District',  date:'2026-04-28', time:'6:00 PM',  venue:'Online / Zoom',                status:'Upcoming'  },
  { id:4,  club:'District 5656',      name:'DG Installation Ceremony',       type:'District',  date:'2026-07-01', time:'6:00 PM',  venue:'Hotel Regency, Thane',         status:'Upcoming'  },
  // Thane City View
  { id:5,  club:'Thane City View',    name:'Weekly Meeting',                 type:'Meeting',   date:'2026-04-05', time:'7:00 PM',  venue:'Hotel Regency, Thane',         status:'Completed' },
  { id:6,  club:'Thane City View',    name:'TRF Fundraiser Dinner',          type:'TRF',       date:'2026-04-20', time:'7:30 PM',  venue:'Vivanta Hotel',                status:'Upcoming'  },
  { id:7,  club:'Thane City View',    name:'Blood Donation Camp',            type:'Service',   date:'2026-04-12', time:'9:00 AM',  venue:'Thane Civil Hospital',         status:'Upcoming'  },
  { id:8,  club:'Thane City View',    name:'Rotaract Charter Ceremony',      type:'New Gen',   date:'2026-04-25', time:'5:00 PM',  venue:'Thane Club',                   status:'Upcoming'  },
  // Lake Shore Club
  { id:9,  club:'Lake Shore Club',    name:'Monthly Meeting',                type:'Meeting',   date:'2026-04-08', time:'7:30 PM',  venue:'Lake View Banquet, Thane',     status:'Completed' },
  { id:10, club:'Lake Shore Club',    name:'Eye Check-up Camp',              type:'Service',   date:'2026-04-10', time:'10:00 AM', venue:'Thane Municipal Hospital',     status:'Upcoming'  },
  { id:11, club:'Lake Shore Club',    name:'Foundation Awareness Night',     type:'TRF',       date:'2026-05-02', time:'7:00 PM',  venue:'Hotel Solitaire, Thane',       status:'Upcoming'  },
  // Owala
  { id:12, club:'Owala',              name:'Weekly Meeting',                 type:'Meeting',   date:'2026-04-06', time:'8:00 PM',  venue:'Owala Club House',             status:'Completed' },
  { id:13, club:'Owala',              name:'Interact Club Installation',     type:'New Gen',   date:'2026-04-20', time:'5:30 PM',  venue:'St. Xavier School, Owala',    status:'Upcoming'  },
  { id:14, club:'Owala',              name:'Career Fair',                    type:'Service',   date:'2026-05-10', time:'10:00 AM', venue:'Community Hall, Owala',        status:'Upcoming'  },
  // Rotary Club Leo
  { id:15, club:'Rotary Club of Leo', name:'Fortnightly Meeting',            type:'Meeting',   date:'2026-04-09', time:'7:00 PM',  venue:'Leo Hall, Thane West',         status:'Completed' },
  { id:16, club:'Rotary Club of Leo', name:'Skill Training Program',         type:'Service',   date:'2026-04-05', time:'9:00 AM',  venue:'Polytechnic, Thane',           status:'In Progress'},
  // New Club
  { id:17, club:'New Club Test Entry',name:'Monthly Meeting',                type:'Meeting',   date:'2026-04-07', time:'7:00 PM',  venue:'New Club Hall',                status:'Completed' },
  { id:18, club:'New Club Test Entry',name:'Awareness Walk',                 type:'Service',   date:'2026-04-12', time:'7:00 AM',  venue:'Thane Railway Station',        status:'Upcoming'  },
  // Tikujiniwadi
  { id:19, club:'Tikujiniwadi',       name:'Weekly Meeting',                 type:'Meeting',   date:'2026-04-04', time:'7:30 PM',  venue:'Tikujiniwadi Club',            status:'Completed' },
  { id:20, club:'Tikujiniwadi',       name:'Solar Light Distribution',       type:'Service',   date:'2026-04-28', time:'10:00 AM', venue:'Murbad, Thane District',       status:'Upcoming'  },
  { id:21, club:'Tikujiniwadi',       name:'RYLA Follow-up Session',         type:'New Gen',   date:'2026-05-05', time:'4:00 PM',  venue:'Tikujiniwadi Community Hall',  status:'Upcoming'  },
]

export const AVENUE_COLORS = {
  'Community Service':     '#16a34a',
  'Vocational Service':    '#0891b2',
  'New Generation':        '#f59e0b',
  'International Service': '#9333ea',
  'Public Image':          '#e11d48',
  'Club Service':          '#003DA5',
}

export const EVENT_TYPE_COLORS = {
  District:  { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  Meeting:   { bg: 'bg-slate-100', text: 'text-slate-600'  },
  Service:   { bg: 'bg-green-50',  text: 'text-green-700'  },
  TRF:       { bg: 'bg-amber-50',  text: 'text-amber-700'  },
  'New Gen': { bg: 'bg-purple-50', text: 'text-purple-700' },
}

export const STATUS_COLORS = {
  Completed:    { bg: 'bg-green-50',  text: 'text-green-700'  },
  'In Progress':{ bg: 'bg-amber-50',  text: 'text-amber-700'  },
  Upcoming:     { bg: 'bg-blue-50',   text: 'text-blue-700'   },
}

export const fmtINR = (n) => {
  if (!n) return '—'
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L'
  if (n >= 1000)   return '₹' + (n / 1000).toFixed(0) + 'K'
  return '₹' + n.toLocaleString('en-IN')
}
