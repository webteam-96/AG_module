// src/modules/district/data/analyticsData.js

const MALE_FIRST   = ['Rajesh','Suresh','Amit','Vijay','Sanjay','Pradeep','Mahesh','Dinesh','Ramesh','Nilesh','Rakesh','Deepak','Vivek','Manish','Anil','Sunil','Kapil','Girish','Harish','Sachin','Rohit','Nikhil','Rahul','Ankit','Varun','Pankaj','Tarun','Arun','Vikas','Umesh']
const FEMALE_FIRST = ['Sunita','Priya','Neha','Pooja','Sneha','Seema','Kavita','Anita','Geeta','Rekha','Lata','Divya','Nisha','Meena','Asha','Usha','Rupa','Shobha','Hema','Jaya']
const SURNAMES     = ['Sharma','Verma','Patel','Shah','Joshi','Mehta','Desai','Nair','Kumar','Singh','Gupta','Rao','Iyer','Reddy','Kulkarni','Patil','Deshpande','Bhatt','Chauhan','Mishra','Thakur','Pandey','Agarwal','Bose','Chatterjee']
const BOARD_ROLES  = ['President','Secretary','Treasurer','IPP','President Elect','Vice President','Director','Member','Member','Member','Member','Member','Member']
const DAYS         = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const TIMES        = ['7:00 AM','7:30 AM','8:00 AM','12:30 PM','1:00 PM','6:30 PM','7:00 PM','7:30 PM']

const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function makeRoster(seed, count) {
  return Array.from({ length: count }, (_, i) => {
    const isFemale = (seed * 3 + i * 7) % 5 === 0
    const first = isFemale
      ? FEMALE_FIRST[(seed + i * 3) % FEMALE_FIRST.length]
      : MALE_FIRST[(seed * 2 + i) % MALE_FIRST.length]
    const last = SURNAMES[(seed * 7 + i * 11) % SURNAMES.length]
    return {
      name:        `${first} ${last}`,
      designation: BOARD_ROLES[Math.min(i, BOARD_ROLES.length - 1)],
      mobile:      `+91 98${String(seed * 100 + i).padStart(8, '0').slice(0, 8)}`,
      email:       `${first.toLowerCase()}.${last.toLowerCase()}${seed}@email.com`,
      since:       2010 + ((seed + i * 3) % 14),
      status:      (seed * 5 + i * 3) % 7 !== 0 ? 'Active' : 'Inactive',
    }
  })
}

function makeClub(name, tier, seed) {
  const s  = seed + 1
  const hi = tier === 'high'
  const lo = tier === 'low'

  const members         = hi ? 80 + (s * 3 % 71)  : lo ? 12 + (s * 2 % 19) : 30 + (s * 5 % 51)
  const memberTarget    = Math.round(members * (hi ? 1.08 : lo ? 1.25 : 1.15))
  const activePct       = hi ? 0.87 + (s % 9) * 0.01 : lo ? 0.60 + (s % 12) * 0.01 : 0.73 + (s % 13) * 0.01
  const activeMembers   = Math.round(members * activePct)
  const maleMembers     = Math.round(members * (0.62 + (s % 9) * 0.01))
  const femaleMembers   = Math.round(members * (0.17 + (s % 6) * 0.01))
  const honoraryMembers = Math.max(0, members - activeMembers - Math.round(members * 0.04))
  const newThisYear     = hi ? 3 + (s % 8) : lo ? s % 3 : 1 + (s % 5)
  const terminated      = lo ? 1 + (s % 4) : s % 3

  const trfGoal         = hi ? 200000 + (s * 13 % 300001) : lo ? 50000 + (s * 7 % 50001) : 100000 + (s * 11 % 100001)
  const trfPctVal       = hi ? 0.60 + (s % 36) * 0.01 : lo ? 0.10 + (s % 31) * 0.01 : 0.30 + (s % 41) * 0.01
  const trfRaised       = Math.round(trfGoal * trfPctVal)
  const annualFund      = Math.round(trfRaised * 0.55)
  const phfContributors = hi ? 10 + (s % 15) : lo ? 1 + (s % 4) : 4 + (s % 8)
  const majorDonors     = hi ? 1 + (s % 5)  : lo ? 0 : s % 3

  const serviceProjects = hi ? 8 + (s % 11) : lo ? 1 + (s % 4) : 3 + (s % 8)
  const beneficiaries   = hi ? 1500 + (s * 7 % 1501) : lo ? 100 + (s * 3 % 401) : 400 + (s * 5 % 1101)
  const manHours        = serviceProjects * (30 + s % 50)

  const citationScore    = hi ? 40 + (s % 11) : lo ? 8 + (s % 17) : 22 + (s % 18)
  const reportsSubmitted = hi ? 9 + (s % 3)  : lo ? 2 + (s % 5)  : 5 + (s % 5)
  const avgAttendance    = hi ? 78 + (s % 18) : lo ? 30 + (s % 26) : 52 + (s % 27)

  const rosterCount = hi ? 13 + (s % 3) : lo ? 8 + (s % 3) : 10 + (s % 4)

  return {
    id: slug(name),
    name,
    meetingDay:   DAYS[(seed * 3 + tier.length) % DAYS.length],
    meetingTime:  TIMES[(seed * 5 + tier.length) % TIMES.length],
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
