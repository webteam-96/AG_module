// Mock data for Club Dashboard — Thane City View
// Replace with real API data when available

export const CLUB = {
  id: 'thane-city-view',
  name: 'Thane City View',
  district: 3142,
  rotaryYear: '2026–27',
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
  trfAnnualFund: 180000,
  trfMajorDonors: 3,
  phfContributors: 18,
  trfPhsm: 1,
  trfEPF: 1,
  trfEndowment: 1,
  serviceProjects: 12,
  districtCitationScore: 42000,
  districtCitationMax: 50000,
  zonalAwards: 3,
  reportsSubmitted: 8,
  reportsTotal: 9,
}

export const MEMBER_GROWTH = [
  { month: 'Jul', members: 134, male: 90, female: 25, honorary: 19 },
  { month: 'Aug', members: 132, male: 88, female: 24, honorary: 20 },
  { month: 'Sep', members: 137, male: 93, female: 26, honorary: 18 },
  { month: 'Oct', members: 135, male: 91, female: 25, honorary: 19 },
  { month: 'Nov', members: 140, male: 95, female: 27, honorary: 18 },
  { month: 'Dec', members: 136, male: 90, female: 26, honorary: 20 },
  { month: 'Jan', members: 143, male: 97, female: 28, honorary: 18 },
  { month: 'Feb', members: 138, male: 92, female: 27, honorary: 19 },
  { month: 'Mar', members: 141, male: 94, female: 28, honorary: 19 },
  { month: 'Apr', members: 142, male: 95, female: 28, honorary: 19 },
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
  { name: 'Club Service',          completed: 6,  target: 10, color: '#003DA5', beneficiaries: 380  },
  { name: 'Community Service',     completed: 4,  target: 10, color: '#16a34a', beneficiaries: 1650 },
  { name: 'New Generation',        completed: 4,  target: 10, color: '#f59e0b', beneficiaries: 309  },
  { name: 'Vocational Service',    completed: 3,  target: 10, color: '#0891b2', beneficiaries: 260  },
  { name: 'Public Image',          completed: 4,  target: 10, color: '#e11d48', beneficiaries: 2710 },
  { name: 'International Service', completed: 3,  target: 10, color: '#9333ea', beneficiaries: 228  },
  { name: 'PPH Camp',              completed: 3,  target: 5,  color: '#0891b2', beneficiaries: 810  },
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
  { id: 1, name: 'Weekly Meeting',           date: '2026-04-05', time: '7:00 PM',  venue: 'Hotel Regency, Thane',    type: 'Meeting'  },
  { id: 2, name: 'Blood Donation Camp',      date: '2026-04-12', time: '9:00 AM',  venue: 'Thane Civil Hospital',    type: 'Service'  },
  { id: 3, name: 'TRF Fundraiser Dinner',    date: '2026-04-20', time: '7:30 PM',  venue: 'Vivanta Hotel',           type: 'TRF'      },
  { id: 4, name: 'Rotaract Charter Ceremony',date: '2026-04-25', time: '5:00 PM',  venue: 'Thane Club',              type: 'New Gen'  },
  { id: 5, name: 'District Citation Review', date: '2026-04-28', time: '6:00 PM',  venue: 'Online / Zoom',           type: 'District' },
]

export const ANNOUNCEMENTS = [
  { id: 1, text: 'District citation deadline is April 30. Submit all reports before the deadline.', date: 'Apr 1, 2026',  priority: 'urgent' },
  { id: 2, text: 'Monthly report submission window is now open for March 2026. Due by Apr 10.',     date: 'Mar 31, 2026', priority: 'normal' },
  { id: 3, text: 'New Rotaract charter approved — congratulations to Thane West Rotaract club.',    date: 'Mar 28, 2026', priority: 'info'   },
  { id: 4, text: "PPH Camp registration open. Confirm your club's participation by Apr 15.",        date: 'Mar 25, 2026', priority: 'action' },
]

export const DOCUMENTS = [
  { id: 1, name: 'March 2026 Newsletter',   type: 'PDF', size: '2.4 MB', date: 'Mar 30, 2026' },
  { id: 2, name: 'Attendance Register Q3',  type: 'XLS', size: '890 KB', date: 'Mar 15, 2026' },
  { id: 3, name: 'Annual Report Draft 2025',type: 'DOC', size: '1.1 MB', date: 'Feb 28, 2026' },
  { id: 4, name: 'February 2026 Newsletter',type: 'PDF', size: '1.9 MB', date: 'Feb 28, 2026' },
]

export const MONTHLY_REPORTS = [
  { month: 'March 2026',    submitted: null,     onTime: null,  status: 'Pending'  },
  { month: 'February 2026', submitted: 'Mar 3',  onTime: true,  status: 'Submitted' },
  { month: 'January 2026',  submitted: 'Feb 5',  onTime: true,  status: 'Submitted' },
  { month: 'December 2025', submitted: 'Jan 8',  onTime: false, status: 'Late'     },
  { month: 'November 2025', submitted: 'Dec 2',  onTime: true,  status: 'Submitted' },
  { month: 'October 2025',  submitted: 'Nov 3',  onTime: true,  status: 'Submitted' },
]

export const CITATION_CHECKLIST = [
  { criterion: 'Membership Growth',       points: 10, earned: 10, detail: '+8 net new members',             status: 'done'       },
  { criterion: 'Service Projects (≥10)',  points: 10, earned: 10, detail: '12 projects completed',          status: 'done'       },
  { criterion: 'TRF Contribution (≥₹2L)', points: 10, earned: 10, detail: '₹3.2L raised',                  status: 'done'       },
  { criterion: 'Attendance (≥75%)',        points: 10, earned: 7,  detail: 'Avg 73.8% — need 2% more',      status: 'partial'    },
  { criterion: 'Public Image Initiative',  points: 10, earned: 5,  detail: '4 of 6 required activities done', status: 'incomplete' },
]

export const MEMBERS = [
  { id: 1,  name: 'Khushboo Tadkar',  designation: 'President',          mobile: '+91 70456 77524', email: 'kt@gmail.com',          type: 'Full',      since: 2018, status: 'Active',   isAdmin: true,  isRIAdmin: false },
  { id: 2,  name: 'Rashid Shaikh',    designation: 'Secretary',          mobile: '+91 93721 07897', email: 'rashid@email.com',      type: 'Full',      since: 2016, status: 'Active',   isAdmin: true,  isRIAdmin: false },
  { id: 3,  name: 'Praveen Mestry',   designation: 'Foundation Chair',   mobile: '+91 98026 36809', email: 'pm@email.com',          type: 'Full',      since: 2014, status: 'Active',   isAdmin: false, isRIAdmin: true  },
  { id: 4,  name: 'Anita Kulkarni',   designation: 'Treasurer',          mobile: '+91 99870 12345', email: 'anita@email.com',       type: 'Associate', since: 2020, status: 'Active',   isAdmin: false, isRIAdmin: false },
  { id: 5,  name: 'Vijay Nair',       designation: 'Member',             mobile: '+91 88001 23456', email: 'vijay@email.com',       type: 'Full',      since: 2019, status: 'Inactive', isAdmin: false, isRIAdmin: false },
  { id: 6,  name: 'Sunita Patil',     designation: 'Club Service Chair', mobile: '+91 77002 34567', email: 'sunita@email.com',      type: 'Full',      since: 2017, status: 'Active',   isAdmin: false, isRIAdmin: false },
  { id: 7,  name: 'Ramesh Joshi',     designation: 'Comm. Service Chair',mobile: '+91 66003 45678', email: 'ramesh@email.com',      type: 'Associate', since: 2021, status: 'Active',   isAdmin: false, isRIAdmin: false },
  { id: 8,  name: 'Deepa Sharma',     designation: 'Member',             mobile: '+91 55004 56789', email: 'deepa@email.com',       type: 'Honorary',  since: 2015, status: 'Active',   isAdmin: false, isRIAdmin: false },
  { id: 9,  name: 'Suresh Iyer',      designation: 'Sgt-at-Arms',        mobile: '+91 88012 34567', email: 'suresh@email.com',      type: 'Full',      since: 2017, status: 'Active',   isAdmin: false, isRIAdmin: false },
  { id: 10, name: 'Priya Desai',      designation: 'Voc. Service Chair', mobile: '+91 77009 87654', email: 'priya.d@email.com',     type: 'Full',      since: 2022, status: 'Active',   isAdmin: false, isRIAdmin: false },
  { id: 11, name: 'Arvind Kulkarni',  designation: 'Intl Service Chair', mobile: '+91 99001 22334', email: 'arvind@email.com',      type: 'Full',      since: 2020, status: 'Active',   isAdmin: false, isRIAdmin: true  },
  { id: 12, name: 'Meera Shenoy',     designation: 'Membership Chair',   mobile: '+91 88007 65432', email: 'meera@email.com',       type: 'Full',      since: 2023, status: 'Active',   isAdmin: false, isRIAdmin: false },
  { id: 13, name: 'Anil Mehta',       designation: 'Member',             mobile: '+91 99002 33445', email: 'anil.m@email.com',      type: 'Full',      since: 2015, status: 'Active',   isAdmin: false, isRIAdmin: false },
  { id: 14, name: 'Seema Kapoor',     designation: 'Member',             mobile: '+91 77003 44556', email: 'seema@email.com',       type: 'Associate', since: 2019, status: 'Active',   isAdmin: false, isRIAdmin: false },
  { id: 15, name: 'Rohit Verma',      designation: 'Youth Service Chair',mobile: '+91 88004 55667', email: 'rohit@email.com',       type: 'Full',      since: 2021, status: 'Active',   isAdmin: false, isRIAdmin: false },
]

export const PAST_PRESIDENTS = [
  { name: 'Khushboo Tadkar',   year: '2026–27', achievement: 'Current president'              },
  { name: 'Jayesh Thakkar',    year: '2025–26', achievement: 'District Citation winner'       },
  { name: 'Arun Patil',        year: '2024–25', achievement: '100% attendance year'           },
  { name: 'Khushboo Falloon',  year: '2023–24', achievement: 'Best club award'                },
  { name: 'Shrinath Wala',     year: '2022–23', achievement: 'PHF milestone'                  },
  { name: 'Priya Mehta',       year: '2021–22', achievement: 'Most projects in zone'          },
  { name: 'Deepak Shetty',     year: '2020–21', achievement: 'Pandemic outreach leader'       },
  { name: 'Nandita Rao',       year: '2019–20', achievement: 'Literacy campaign'              },
  { name: 'Rajiv Kapoor',      year: '2018–19', achievement: 'Club charter expansion'         },
  { name: 'Seema Joshi',       year: '2017–18', achievement: '25th anniversary president'    },
  { name: 'Mohan Desai',       year: '2016–17', achievement: 'RI Citation — 3rd consecutive' },
  { name: 'Lata Nair',         year: '2015–16', achievement: 'Club foundation award'          },
]

// Used in Overview BOD widget (short version)
export const BOARD = [
  { name: 'Khushboo Tadkar', role: 'President',        mobile: '+91 70456 77524', initials: 'KT', color: '#003DA5' },
  { name: 'Rashid Shaikh',   role: 'Secretary',        mobile: '+91 93721 07897', initials: 'RS', color: '#16a34a' },
  { name: 'Praveen Mestry',  role: 'Foundation Chair', mobile: '+91 98026 36809', initials: 'PM', color: '#ca8a04' },
  { name: 'Anita Kulkarni',  role: 'Treasurer',        mobile: '+91 99870 12345', initials: 'AK', color: '#9333ea' },
]

// Full BOD for the Board of Directors tab
export const BOARD_OF_DIRECTORS = [
  { id: 1, name: 'Khushboo Tadkar',  designation: 'Club President',             mobile: '+91 70456 77524', email: 'kt@gmail.com',       initials: 'KT', color: '#003DA5' },
  { id: 2, name: 'Rashid Shaikh',    designation: 'Club Secretary',             mobile: '+91 93721 07897', email: 'rashid@email.com',   initials: 'RS', color: '#16a34a' },
  { id: 3, name: 'Praveen Mestry',   designation: 'Club Foundation Chair',      mobile: '+91 98026 36809', email: 'pm@email.com',       initials: 'PM', color: '#ca8a04' },
  { id: 4, name: 'Anita Kulkarni',   designation: 'Club Treasurer',             mobile: '+91 99870 12345', email: 'anita@email.com',    initials: 'AK', color: '#9333ea' },
  { id: 5, name: 'Suresh Iyer',      designation: 'Sergeant-at-Arms',           mobile: '+91 88012 34567', email: 'suresh@email.com',   initials: 'SI', color: '#0891b2' },
  { id: 6, name: 'Sunita Patil',     designation: 'Club Service Chair',         mobile: '+91 77002 34567', email: 'sunita@email.com',   initials: 'SP', color: '#e11d48' },
  { id: 7, name: 'Ramesh Joshi',     designation: 'Community Service Chair',    mobile: '+91 66003 45678', email: 'ramesh@email.com',   initials: 'RJ', color: '#f59e0b' },
  { id: 8, name: 'Priya Desai',      designation: 'Vocational Service Chair',   mobile: '+91 77009 87654', email: 'priya.d@email.com',  initials: 'PD', color: '#b45309' },
  { id: 9, name: 'Arvind Kulkarni',  designation: 'International Service Chair',mobile: '+91 99001 22334', email: 'arvind@email.com',   initials: 'AK', color: '#0f172a' },
  { id: 10,name: 'Rohit Verma',      designation: 'Youth Services Chair',       mobile: '+91 88004 55667', email: 'rohit@email.com',    initials: 'RV', color: '#7c3aed' },
  { id: 11,name: 'Deepa Sharma',     designation: 'Public Image Chair',         mobile: '+91 55004 56789', email: 'deepa@email.com',    initials: 'DS', color: '#64748b' },
  { id: 12,name: 'Meera Shenoy',     designation: 'Membership Chair',           mobile: '+91 88007 65432', email: 'meera@email.com',    initials: 'MS', color: '#16a34a' },
]

export const TERMINATED_MEMBERS = [
  { id:1,  memberId:'RC-2841', type:'Full',      firstName:'Sudhir',   middleName:'Kumar',    lastName:'Kapoor',    admissionDate:'Jan 10, 2018', terminationDate:'Dec 15, 2025', reason:'Non-payment'         },
  { id:2,  memberId:'RC-2903', type:'Associate', firstName:'Kavita',   middleName:'',         lastName:'Bhatia',    admissionDate:'Mar 5, 2020',  terminationDate:'Nov 3, 2025',  reason:'Personal'            },
  { id:3,  memberId:'RC-2765', type:'Full',      firstName:'Harish',   middleName:'Prasad',   lastName:'Nambiar',   admissionDate:'Jul 12, 2016', terminationDate:'Sep 20, 2025', reason:'Non-payment'         },
  { id:4,  memberId:'RC-2988', type:'Full',      firstName:'Tanya',    middleName:'',         lastName:'Agarwal',   admissionDate:'Aug 3, 2019',  terminationDate:'Aug 5, 2025',  reason:'Business'            },
  { id:5,  memberId:'RC-2710', type:'Full',      firstName:'Mohan',    middleName:'Lal',      lastName:'Sharma',    admissionDate:'Feb 14, 2017', terminationDate:'Jul 20, 2025', reason:'Business'            },
  { id:6,  memberId:'RC-3021', type:'Associate', firstName:'Preethi',  middleName:'',         lastName:'Venkat',    admissionDate:'Apr 8, 2021',  terminationDate:'Jun 10, 2025', reason:'Family'              },
  { id:7,  memberId:'RC-2654', type:'Full',      firstName:'Rajan',    middleName:'',         lastName:'Mehta',     admissionDate:'Jun 1, 2015',  terminationDate:'May 5, 2025',  reason:'Lack of Participation'},
  { id:8,  memberId:'RC-2832', type:'Full',      firstName:'Swati',    middleName:'Arun',     lastName:'Desai',     admissionDate:'Sep 20, 2018', terminationDate:'Apr 15, 2025', reason:'Non-payment'         },
  { id:9,  memberId:'RC-2791', type:'Full',      firstName:'Vikram',   middleName:'',         lastName:'Joshi',     admissionDate:'Nov 7, 2017',  terminationDate:'Mar 1, 2025',  reason:'Personal'            },
  { id:10, memberId:'RC-2866', type:'Associate', firstName:'Lata',     middleName:'S.',       lastName:'Srinivasan',admissionDate:'May 22, 2019', terminationDate:'Feb 10, 2025', reason:'Family'              },
  { id:11, memberId:'RC-2702', type:'Full',      firstName:'Deepak',   middleName:'',         lastName:'Roy',       admissionDate:'Aug 15, 2014', terminationDate:'Jan 20, 2025', reason:'Non-payment'         },
  { id:12, memberId:'RC-3045', type:'Full',      firstName:'Ananya',   middleName:'R.',       lastName:'Pillai',    admissionDate:'Oct 3, 2022',  terminationDate:'Dec 5, 2024',  reason:'Lack of Participation'},
  { id:13, memberId:'RC-2748', type:'Full',      firstName:'Suresh',   middleName:'',         lastName:'Babu',      admissionDate:'Mar 18, 2016', terminationDate:'Nov 12, 2024', reason:'Business'            },
  { id:14, memberId:'RC-2934', type:'Associate', firstName:'Rekha',    middleName:'V.',       lastName:'Nair',      admissionDate:'Jul 9, 2020',  terminationDate:'Oct 8, 2024',  reason:'Personal'            },
  { id:15, memberId:'RC-2688', type:'Full',      firstName:'Ashok',    middleName:'',         lastName:'Gupta',     admissionDate:'Dec 1, 2013',  terminationDate:'Sep 15, 2024', reason:'Non-payment'         },
  { id:16, memberId:'RC-2976', type:'Full',      firstName:'Nisha',    middleName:'P.',       lastName:'Patel',     admissionDate:'Feb 27, 2021', terminationDate:'Aug 20, 2024', reason:'Family'              },
  { id:17, memberId:'RC-2812', type:'Full',      firstName:'Manoj',    middleName:'',         lastName:'Verma',     admissionDate:'Apr 14, 2018', terminationDate:'Jul 5, 2024',  reason:'Lack of Participation'},
  { id:18, memberId:'RC-2859', type:'Associate', firstName:'Seema',    middleName:'',         lastName:'Krishnan',  admissionDate:'Jun 30, 2019', terminationDate:'Jun 1, 2024',  reason:'Business'            },
]

export const POTENTIAL_MEMBERS = [
  { id:1,  prospectId:'PRO-001', name:'Neha Sharma',     phone:'+91 98001 11111', email:'neha@email.com',    referredBy:'Praveen Mestry',  leadStatus:'Hot',  notes:'Keen on community service, has NGO background'   },
  { id:2,  prospectId:'PRO-002', name:'Kiran Reddy',     phone:'+91 87002 22222', email:'kiran@email.com',   referredBy:'Sunita Patil',    leadStatus:'Warm', notes:'Wants to meet board before committing'           },
  { id:3,  prospectId:'PRO-003', name:'Sanjay Patel',    phone:'+91 76003 33333', email:'sanjay@email.com',  referredBy:'Ramesh Joshi',    leadStatus:'Hot',  notes:'Vocational trainer, strong interest in Rotary'   },
  { id:4,  prospectId:'PRO-004', name:'Divya Menon',     phone:'+91 65004 44444', email:'divya@email.com',   referredBy:'Meera Shenoy',    leadStatus:'Warm', notes:'TRF donor, exploring membership options'         },
  { id:5,  prospectId:'PRO-005', name:'Rajan Choudhary', phone:'+91 54005 55555', email:'rajan@email.com',   referredBy:'Arvind Kulkarni', leadStatus:'Cold', notes:'International business, limited availability'     },
  { id:6,  prospectId:'PRO-006', name:'Pooja Singh',     phone:'+91 90006 66666', email:'pooja@email.com',   referredBy:'Khushboo Tadkar', leadStatus:'Hot',  notes:'Attending next weekly meeting as guest'          },
  { id:7,  prospectId:'PRO-007', name:'Aakash Mehta',    phone:'+91 91007 77777', email:'aakash@email.com',  referredBy:'Rashid Shaikh',   leadStatus:'Cold', notes:'Busy with business expansion this quarter'       },
  { id:8,  prospectId:'PRO-008', name:'Sunil Nair',      phone:'+91 92008 88888', email:'sunil@email.com',   referredBy:'Priya Desai',     leadStatus:'Warm', notes:'Interested in vocational service avenue'         },
  { id:9,  prospectId:'PRO-009', name:'Priya Iyer',      phone:'+91 93009 99999', email:'priya.i@email.com', referredBy:'Rohit Verma',     leadStatus:'Hot',  notes:'Youth leader, enthusiastic about Rotaract link'  },
  { id:10, prospectId:'PRO-010', name:'Rahul Bose',      phone:'+91 94010 10101', email:'rahul@email.com',   referredBy:'Deepa Sharma',    leadStatus:'Cold', notes:'Needs more information before deciding'          },
  { id:11, prospectId:'PRO-011', name:'Smita Joshi',     phone:'+91 95011 11212', email:'smita@email.com',   referredBy:'Anita Kulkarni',  leadStatus:'Warm', notes:'Interested but evaluating other service clubs'    },
  { id:12, prospectId:'PRO-012', name:'Nikhil Gupta',    phone:'+91 96012 12323', email:'nikhil@email.com',  referredBy:'Suresh Iyer',     leadStatus:'Cold', notes:'Referred by member, no response in 3 weeks'     },
]

export const DUES = [
  { id: 1, name: 'Khushboo Tadkar', type: 'Full',      amount: 6000, dueDate: 'Mar 31', status: 'Paid',    initials: 'KT', color: '#003DA5' },
  { id: 2, name: 'Rashid Shaikh',   type: 'Full',      amount: 6000, dueDate: 'Mar 31', status: 'Paid',    initials: 'RS', color: '#9333ea' },
  { id: 3, name: 'Asha Kumar',      type: 'Associate', amount: 4000, dueDate: 'Mar 31', status: 'Overdue', initials: 'AK', color: '#e11d48' },
  { id: 4, name: 'Vijay Nair',      type: 'Full',      amount: 6000, dueDate: 'Apr 15', status: 'Pending', initials: 'VN', color: '#ca8a04' },
  { id: 5, name: 'Praveen Mestry',  type: 'Full',      amount: 6000, dueDate: 'Mar 31', status: 'Paid',    initials: 'PM', color: '#0891b2' },
]

export const EVENT_LINKS = [
  { id: 1, name: 'TRF Fundraiser Dinner',    price: '₹2,500 / seat',    date: 'Apr 20', status: 'Active' },
  { id: 2, name: 'Rotaract Charter Ceremony',price: 'Free entry',        date: 'Apr 25', status: 'Active' },
  { id: 3, name: 'Annual Membership Renewal',price: '₹6,000 / member',  date: 'Apr 30', status: 'Open'   },
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
