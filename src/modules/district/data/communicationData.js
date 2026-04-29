// src/modules/district/data/communicationData.js

export const DISTRICT_EVENTS_COMM = [
  { id:1,  name:'District Assembly',            date:'2026-05-03', time:'9:00 AM',  venue:'Hotel Vivanta, Thane',        type:'District'  },
  { id:2,  name:'District Citation Review',     date:'2026-04-28', time:'6:00 PM',  venue:'Online / Zoom',               type:'District'  },
  { id:3,  name:'TRF Fundraiser Dinner',        date:'2026-04-20', time:'7:30 PM',  venue:'Vivanta Hotel',               type:'TRF'       },
  { id:4,  name:'Rotaract Charter Ceremony',    date:'2026-04-25', time:'5:00 PM',  venue:'Thane Club',                  type:'New Gen'   },
  { id:5,  name:'DG Installation Ceremony',     date:'2026-07-01', time:'6:00 PM',  venue:'Hotel Regency, Thane',        type:'District'  },
  { id:6,  name:'Zone-wise Club Visit — Zone A',date:'2026-05-10', time:'10:00 AM', venue:'Tikujiniwadi Club',           type:'Service'   },
  { id:7,  name:'District Conference',          date:'2026-06-14', time:'10:00 AM', venue:'Grand Hyatt, Mumbai',         type:'District'  },
  { id:8,  name:'PPH Camp — District Drive',    date:'2026-05-20', time:'8:00 AM',  venue:'Multiple Locations',          type:'Service'   },
]

export const DISTRICT_ANNOUNCEMENTS = [
  { id:1, text:'District citation deadline is April 30. All clubs must submit reports before the deadline.',       date:'Apr 1, 2026',  priority:'urgent' },
  { id:2, text:'Monthly report submission window is open for March 2026. Due by April 10. All clubs to comply.',  date:'Mar 31, 2026', priority:'action' },
  { id:3, text:'District Assembly scheduled for May 3 at Hotel Vivanta. Presidents and Secretaries must attend.', date:'Mar 28, 2026', priority:'normal' },
  { id:4, text:'New Rotaract charter approved — congratulations to Thane West Rotaract club.',                    date:'Mar 25, 2026', priority:'info'   },
  { id:5, text:'PPH Camp registration open for all clubs. Confirm participation with AG by April 15.',            date:'Mar 20, 2026', priority:'action' },
]

export const DISTRICT_GREETINGS = [
  { id:1,  name:'Mukesh Dc',       role:'District Governor',   club:'Thane City View', initials:'MD', color:'#003DA5', type:'Birthday',           date:'Apr 28', section:'today' },
  { id:2,  name:'Feba Joseph',     role:'District Secretary',  club:'Lake Shore Club', initials:'FJ', color:'#16a34a', type:'Rotary Anniversary', date:'Apr 28', section:'today' },
  { id:3,  name:'Anita Mehta',     role:'Treasurer',           club:'Owala',           initials:'AM', color:'#ca8a04', type:'Anniversary',        date:'Apr 30', section:'week'  },
  { id:4,  name:'Praveen Mestry',  role:'Foundation Chair',    club:'Thane City View', initials:'PM', color:'#9333ea', type:'Birthday',           date:'May 1',  section:'week'  },
  { id:5,  name:'Meera Shenoy',    role:'Membership Chair',    club:'Thane City View', initials:'MS', color:'#0891b2', type:'Rotary Anniversary', date:'May 2',  section:'week'  },
  { id:6,  name:'Ramesh Joshi',    role:'Service Projects Chair',club:'Tikujiniwadi',  initials:'RJ', color:'#e11d48', type:'Birthday',           date:'May 6',  section:'month' },
  { id:7,  name:'Deepa Sharma',    role:'Public Image Chair',  club:'Thane City View', initials:'DS', color:'#f59e0b', type:'Anniversary',        date:'May 10', section:'month' },
  { id:8,  name:'Rajesh Sharma',   role:'Sergeant-at-Arms',    club:'Tikujiniwadi',    initials:'RS', color:'#003DA5', type:'Birthday',           date:'May 14', section:'month' },
  { id:9,  name:'Kiran Reddy',     role:'Retention Co-Chair',  club:'Lake Shore Club', initials:'KR', color:'#16a34a', type:'Rotary Anniversary', date:'May 19', section:'month' },
  { id:10, name:'Divya Menon',     role:'New Member Coord.',   club:'Owala',           initials:'DM', color:'#9333ea', type:'Birthday',           date:'May 24', section:'month' },
]

export const DISTRICT_DOCUMENTS = [
  { id:1,  name:'District Bulletin — Apr 2026',           type:'PDF',  size:'3.1 MB', date:'Apr 1, 2026'  },
  { id:2,  name:'DG Message — March 2026',                type:'PDF',  size:'1.2 MB', date:'Mar 31, 2026' },
  { id:3,  name:'District Citation Guidelines 2025-26',   type:'PDF',  size:'890 KB', date:'Jul 10, 2025' },
  { id:4,  name:'Club Monthly Report Template',           type:'XLSX', size:'240 KB', date:'Jul 5, 2025'  },
  { id:5,  name:'District Budget 2025-26',                type:'XLSX', size:'560 KB', date:'Jul 15, 2025' },
  { id:6,  name:'District Assembly Agenda — May 2026',    type:'PDF',  size:'320 KB', date:'Apr 20, 2026' },
  { id:7,  name:'District Conference Brochure',           type:'PDF',  size:'4.5 MB', date:'Apr 10, 2026' },
  { id:8,  name:'District Newsletter — Mar 2026',         type:'PDF',  size:'3.8 MB', date:'Mar 1, 2026'  },
  { id:9,  name:'District Newsletter — Feb 2026',         type:'PDF',  size:'3.5 MB', date:'Feb 1, 2026'  },
  { id:10, name:'District Newsletter — Jan 2026',         type:'PDF',  size:'3.2 MB', date:'Jan 1, 2026'  },
  { id:11, name:'District Newsletter — Apr 2026',         type:'PDF',  size:'4.0 MB', date:'Apr 1, 2026'  },
]
