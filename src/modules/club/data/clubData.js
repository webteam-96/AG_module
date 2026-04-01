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
  { month: 'February 2026', submitted: 'Mar 3',  onTime: true,  status: 'Accepted' },
  { month: 'January 2026',  submitted: 'Feb 5',  onTime: true,  status: 'Accepted' },
  { month: 'December 2025', submitted: 'Jan 8',  onTime: false, status: 'Late'     },
  { month: 'November 2025', submitted: 'Dec 2',  onTime: true,  status: 'Accepted' },
  { month: 'October 2025',  submitted: 'Nov 3',  onTime: true,  status: 'Accepted' },
]

export const CITATION_CHECKLIST = [
  { criterion: 'Membership Growth',       points: 10, earned: 10, detail: '+8 net new members',             status: 'done'       },
  { criterion: 'Service Projects (≥10)',  points: 10, earned: 10, detail: '12 projects completed',          status: 'done'       },
  { criterion: 'TRF Contribution (≥₹2L)', points: 10, earned: 10, detail: '₹3.2L raised',                  status: 'done'       },
  { criterion: 'Attendance (≥75%)',        points: 10, earned: 7,  detail: 'Avg 73.8% — need 2% more',      status: 'partial'    },
  { criterion: 'Public Image Initiative',  points: 10, earned: 5,  detail: '4 of 6 required activities done', status: 'incomplete' },
]

export const MEMBERS = [
  { id: 1, name: 'Khushboo Tadkar', role: 'President',        mobile: '+91 70456 77524', email: 'kt@gmail.com',     type: 'Full',      since: 2018, status: 'Active'   },
  { id: 2, name: 'Rashid Shaikh',   role: 'Secretary',        mobile: '+91 93721 07897', email: 'rashid@email.com', type: 'Full',      since: 2016, status: 'Active'   },
  { id: 3, name: 'Praveen Mestry',  role: 'Foundation Chair', mobile: '+91 98026 36809', email: 'pm@email.com',     type: 'Full',      since: 2014, status: 'Active'   },
  { id: 4, name: 'Anita Kulkarni',  role: 'Treasurer',        mobile: '+91 99870 12345', email: 'anita@email.com',  type: 'Associate', since: 2020, status: 'Active'   },
  { id: 5, name: 'Vijay Nair',      role: 'Member',           mobile: '+91 88001 23456', email: 'vijay@email.com',  type: 'Full',      since: 2019, status: 'Inactive' },
  { id: 6, name: 'Sunita Patil',    role: 'Member',           mobile: '+91 77002 34567', email: 'sunita@email.com', type: 'Full',      since: 2017, status: 'Active'   },
  { id: 7, name: 'Ramesh Joshi',    role: 'Member',           mobile: '+91 66003 45678', email: 'ramesh@email.com', type: 'Associate', since: 2021, status: 'Active'   },
  { id: 8, name: 'Deepa Sharma',    role: 'Member',           mobile: '+91 55004 56789', email: 'deepa@email.com',  type: 'Honorary',  since: 2015, status: 'Active'   },
]

export const PAST_PRESIDENTS = [
  { name: 'Khushboo Tadkar',  year: '2025–26', achievement: 'Current president'      },
  { name: 'Jayesh Thakkar',   year: '2024–25', achievement: 'District Citation winner'},
  { name: 'Arun Patil',       year: '2023–24', achievement: '100% attendance year'   },
  { name: 'Khushboo Falloon', year: '2022–23', achievement: 'Best club award'        },
  { name: 'Shrinath Wala',    year: '2021–22', achievement: 'PHF milestone'          },
  { name: 'Priya Mehta',      year: '2020–21', achievement: 'Most projects in zone'  },
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
