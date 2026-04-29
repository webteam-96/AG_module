// src/modules/district/data/egovernanceData.js

const MONTHS = [
  'Jul 2025','Aug 2025','Sep 2025','Oct 2025','Nov 2025','Dec 2025',
  'Jan 2026','Feb 2026','Mar 2026','Apr 2026','May 2026','Jun 2026',
]

// Status for each club × 12 months
// 'S' = Submitted on time, 'L' = Late, 'P' = Pending/In Progress, 'N' = Not Started
export const CLUB_MONTHLY_REPORTS = [
  {
    id: 'thane-city-view', name: 'Thane City View',
    months: ['S','S','S','S','S','L','S','S','P','N','N','N'],
  },
  {
    id: 'lakeshore', name: 'Lake Shore Club',
    months: ['S','S','L','S','S','S','S','P','N','N','N','N'],
  },
  {
    id: 'owala', name: 'Owala',
    months: ['S','S','S','S','S','S','S','S','S','N','N','N'],
  },
  {
    id: 'rotary-club-leo', name: 'Rotary Club of Leo',
    months: ['S','L','S','S','N','L','S','P','N','N','N','N'],
  },
  {
    id: 'newclub', name: 'New Club Test Entry',
    months: ['N','N','S','L','S','N','S','N','N','N','N','N'],
  },
  {
    id: 'tikujiniwadi', name: 'Tikujiniwadi',
    months: ['S','S','S','S','S','S','S','S','S','S','N','N'],
  },
]

export const CMR_MONTHS = MONTHS

export const PPH_CAMPS = [
  { id:1,  club:'Thane City View',    date:'Jan 25, 2026', location:'Kopri, Thane East',          children:280, rotarians:12, rotaractors:8,  coordinator:'Sunita Patil'   },
  { id:2,  club:'Thane City View',    date:'Nov 2, 2025',  location:'Wagle Estate, Thane',        children:320, rotarians:15, rotaractors:10, coordinator:'Ramesh Joshi'   },
  { id:3,  club:'Lake Shore Club',    date:'Dec 10, 2025', location:'Mumbra, Thane',              children:210, rotarians:10, rotaractors:6,  coordinator:'Priya Desai'    },
  { id:4,  club:'Lake Shore Club',    date:'Feb 14, 2026', location:'Diva, Thane',                children:195, rotarians:8,  rotaractors:5,  coordinator:'Kiran Reddy'    },
  { id:5,  club:'Owala',              date:'Jan 18, 2026', location:'Owala Village, Thane',       children:260, rotarians:11, rotaractors:7,  coordinator:'Divya Menon'    },
  { id:6,  club:'Tikujiniwadi',       date:'Nov 28, 2025', location:'Tikujiniwadi, Thane',        children:310, rotarians:14, rotaractors:9,  coordinator:'Anil Mehta'     },
  { id:7,  club:'Tikujiniwadi',       date:'Mar 5, 2026',  location:'Bhiwandi, Thane District',   children:380, rotarians:18, rotaractors:12, coordinator:'Seema Kapoor'   },
  { id:8,  club:'Rotary Club of Leo', date:'Feb 2, 2026',  location:'Leo Nagar, Thane',           children:150, rotarians:7,  rotaractors:4,  coordinator:'Sanjay Patel'   },
]

export const CITATION_CRITERIA = [
  { criterion:'Membership Growth',        points:10 },
  { criterion:'Service Projects (≥10)',   points:10 },
  { criterion:'TRF Contribution',         points:10 },
  { criterion:'Attendance (≥75%)',        points:10 },
  { criterion:'Public Image Initiative',  points:10 },
]

export const CLUB_CITATIONS = [
  {
    id:'thane-city-view', name:'Thane City View',
    total:42, max:50,
    criteria:[10,10,10,7,5],
  },
  {
    id:'tikujiniwadi', name:'Tikujiniwadi',
    total:45, max:50,
    criteria:[10,10,10,10,5],
  },
  {
    id:'owala', name:'Owala',
    total:38, max:50,
    criteria:[8,10,10,8,2],
  },
  {
    id:'lakeshore', name:'Lake Shore Club',
    total:31, max:50,
    criteria:[6,8,6,8,3],
  },
  {
    id:'rotary-club-leo', name:'Rotary Club of Leo',
    total:22, max:50,
    criteria:[4,4,4,6,4],
  },
  {
    id:'newclub', name:'New Club Test Entry',
    total:15, max:50,
    criteria:[2,2,4,4,3],
  },
]

export const ZONAL_AWARDS = [
  { id:1,  award:'Best Club Award',              club:'Tikujiniwadi',      zone:'Zone A', category:'Club Excellence', year:'2025–26', recipient:'Club President'          },
  { id:2,  award:'District Citation Winner',     club:'Thane City View',   zone:'Zone A', category:'Citation',        year:'2025–26', recipient:'Club'                    },
  { id:3,  award:'PHF Award',                   club:'Thane City View',   zone:'Zone A', category:'Foundation',      year:'2025–26', recipient:'Praveen Mestry'           },
  { id:4,  award:'Best Service Project',        club:'Owala',             zone:'Zone B', category:'Service',         year:'2025–26', recipient:'Community Service Team'   },
  { id:5,  award:'Most Projects in Zone',       club:'Tikujiniwadi',      zone:'Zone A', category:'Service',         year:'2025–26', recipient:'Club'                    },
  { id:6,  award:'Membership Growth Award',     club:'Lake Shore Club',   zone:'Zone B', category:'Membership',      year:'2025–26', recipient:'Club'                    },
  { id:7,  award:'Best Public Image',           club:'Thane City View',   zone:'Zone A', category:'Public Image',    year:'2025–26', recipient:'Deepa Sharma'             },
  { id:8,  award:'Rotaractors Best Club',       club:'Owala',             zone:'Zone B', category:'New Generation',  year:'2025–26', recipient:'Rotaract Club Owala'      },
  { id:9,  award:'Best New Club Award',         club:'New Club Test Entry',zone:'Zone C', category:'Club Excellence', year:'2025–26', recipient:'Club'                    },
  { id:10, award:'District PPH Champion',       club:'Tikujiniwadi',      zone:'Zone A', category:'Service',         year:'2025–26', recipient:'Club'                    },
]

export const REPORT_SECTIONS = [
  {
    id:'members', label:'Members', color:'#185FA5', hoverBg:'#E6F1FB',
    reports:[
      { id:1, name:'Members',                 sub:'Active across all clubs'           },
      { id:2, name:'Board of Directors (BOD)', filter:{ options:['ALL','President','Secretary','Treasurer','Vice President','Director'] } },
      { id:3, name:'District Committee'                                                },
      { id:4, name:'Family Details'                                                    },
      { id:5, name:'Data Collection',         sub:'All Members'                       },
      { id:6, name:'Data Collection',         sub:'Presidents & Secretaries'          },
    ],
  },
  {
    id:'district', label:'District', color:'#0F6E56', hoverBg:'#E1F5EE',
    reports:[
      { id:1, name:'District Citation'                                                 },
      { id:2, name:'Zonal Awards Summary'                                              },
      { id:3, name:'District Performance Report'                                       },
    ],
  },
  {
    id:'clubs', label:'Clubs', color:'#BA7517', hoverBg:'#FAEEDA',
    reports:[
      { id:1,  name:'Club Monthly Report',        sub:'All Clubs'         },
      { id:2,  name:'Attendance',                 sub:'Club-wise'         },
      { id:3,  name:'Avenue of Service',          filter:{ options:['-All-','Club Service','Vocational Service','Community Service','International Service','Youth Service'] } },
      { id:4,  name:'PPH Camp',                   sub:'District-wide'     },
      { id:5,  name:'TRF Contributions',          sub:'All Clubs'         },
      { id:6,  name:'Service Projects',           sub:'All Clubs'         },
      { id:7,  name:'Membership Summary',         sub:'All Clubs'         },
      { id:8,  name:'Club Dues',                  sub:'District-wide'     },
    ],
  },
]
