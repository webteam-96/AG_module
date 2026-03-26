// RI District 3192 — Club Status Data as of 19 March 2026

export const DISTRICT_INFO = {
  id: '3192',
  name: 'RI District 3192',
  rotaryYear: '2025-26',
  dgEmail: 'ridist3192dgoffice2526@gmail.com',
  dataAsOf: '19 March 2026',
};

export const ZONES = [
  { id: 'A', name: 'Zone A', ambassador: 'Shankar Sastry C V', secretary: 'Arjun E Merwade', geography: 'Central Thane' },
  { id: 'B', name: 'Zone B', ambassador: 'Sharavana J', secretary: 'Narendran V B', geography: 'Thane East, Mulund, Airoli' },
  { id: 'C', name: 'Zone C', ambassador: 'Aravind S Hooli', secretary: 'Paul Mundackal', geography: 'Thane North, Mira Road, Vasai' },
  { id: 'D', name: 'Zone D', ambassador: 'Manjunath Patil K', secretary: 'Pratap Ujjini', geography: 'Thane West, Bhiwandi taluka' },
  { id: 'E', name: 'Zone E', ambassador: 'Madhusudan R Bidi', secretary: 'Naagheash S', geography: 'Thane West, Wagle Estate corridor' },
  { id: 'F', name: 'Zone F', ambassador: 'Prasanna Kumar C N', secretary: 'Srinivasa Murthy M G', geography: 'Thane Rural & Murbad' },
  { id: 'G', name: 'Zone G', ambassador: 'Rajesh T S', secretary: 'Bernadappa I', geography: 'Kalyan-Dombivli region' },
];

export const CLUBS = [
  // ─── ZONE A ───
  { id: '15766', name: 'Thane', zone: 'A', ag: 'Fazal Ur Rahaman', president: 'Sukhen Padmanabha', charterDate: '12-Jul-1934',
    membership: { atJuly: 321, current: 324, growth: 0.93, female: 89, femalePercent: 27.47, myRotary: 163, myRotaryPercent: 50.31 },
    trf: { annualFund: 2255.45, polioPlus: 626.01, otherFunds: 0, endowment: 0, total: 2881.46, donors: 9, newDonors: 4 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 18, goalsCompleted: 18, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: ['Mandya'], newInteractClubs: ['Flora School', 'Govt. Adarsha Vidyalaya Gundlupete', 'J E S Public School'], sponsoredRCC: [] },
    serviceProjects: { projects: 47, volunteers: 578, manHours: 22900, cost: 52374 } },

  { id: '51651', name: 'Thane Brigades', zone: 'A', ag: 'Anil Rikke', president: 'Mrs. Mahadevi Dayananda Biradar', charterDate: '06-Jan-1999',
    membership: { atJuly: 53, current: 53, growth: 0.00, female: 14, femalePercent: 26.42, myRotary: 39, myRotaryPercent: 73.58 },
    trf: { annualFund: 4349.64, polioPlus: 300.00, otherFunds: 2080.86, endowment: 1000.00, total: 7730.50, donors: 11, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 26, goalsCompleted: 24, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: ['Acharya Thane B School'], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 76, volunteers: 208, manHours: 2031, cost: 121863 } },

  { id: '88092', name: 'Thane Centennial', zone: 'A', ag: 'Fazal Ur Rahaman', president: 'Rtr Srinivas Prabhu', charterDate: '24-Nov-2016',
    membership: { atJuly: 22, current: 13, growth: -40.91, female: 6, femalePercent: 46.15, myRotary: 7, myRotaryPercent: 53.85 },
    trf: { annualFund: 0, polioPlus: 0, otherFunds: 0, endowment: 0, total: 0, donors: 0, newDonors: 0 },
    excellence: { julyInvoice: false, janInvoice: false, goalsSet: 0, goalsCompleted: 0, awardEarned: false, duesOutstanding: 93612.11 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: ['Seshadripuram College'], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 0, volunteers: 0, manHours: 0, cost: 0 } },

  { id: '24067', name: 'Thane Central', zone: 'A', ag: 'Anil Rikke', president: 'Chandrashekhar SM', charterDate: '30-Sep-1986',
    membership: { atJuly: 30, current: 33, growth: 10.00, female: 8, femalePercent: 24.24, myRotary: 31, myRotaryPercent: 93.94 },
    trf: { annualFund: 0, polioPlus: 100.00, otherFunds: 0, endowment: 0, total: 100.00, donors: 1, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: false, goalsSet: 2, goalsCompleted: 1, awardEarned: false, duesOutstanding: 154568.79 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 0, volunteers: 0, manHours: 0, cost: 0 } },

  { id: '84647', name: 'Thane Gokul Vidya', zone: 'A', ag: 'Anil Rikke', president: 'Mr. Sunder Murthy Lakkaiyan', charterDate: '26-Jun-2012',
    membership: { atJuly: 18, current: 24, growth: 33.33, female: 4, femalePercent: 16.67, myRotary: 23, myRotaryPercent: 95.83 },
    trf: { annualFund: 0, polioPlus: 100.00, otherFunds: 0, endowment: 0, total: 100.00, donors: 1, newDonors: 1 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 18, goalsCompleted: 15, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: ['Five H English High School', 'Jothi PU College'], sponsoredRCC: [] },
    serviceProjects: { projects: 9, volunteers: 223, manHours: 1273, cost: 5365 } },

  { id: '223008', name: 'Thane Gulmohar', zone: 'A', ag: 'Fazal Ur Rahaman', president: 'Mrs. Sudha Rani Raavi', charterDate: '02-Jul-2021',
    membership: { atJuly: 27, current: 40, growth: 48.15, female: 13, femalePercent: 32.50, myRotary: 23, myRotaryPercent: 57.50 },
    trf: { annualFund: 400.00, polioPlus: 0, otherFunds: 0, endowment: 0, total: 400.00, donors: 1, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 18, goalsCompleted: 17, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: ['Gulmohar KIT MBA Department Tiptur'], newInteractClubs: ['Albur Govt. School', 'GHS Patrehalli School', 'Gulmohar Girls High School', 'Gulmohar Honnavalli High School', 'Gulmohar Shivara High School', 'Kalpataru Central School'], sponsoredRCC: ['Bhyranakanahalli', 'Bideregudi Village', 'Nonavina Kere', 'Pattrehalli', 'Ramanahalli Honnavalli Hobli', 'Shettihali', 'Tiptur West'] },
    serviceProjects: { projects: 31, volunteers: 323, manHours: 3160, cost: 17650 } },

  { id: '82899', name: 'Thane Junction', zone: 'A', ag: 'Ashok B Patil', president: 'Kamal Kishore Karnani', charterDate: '05-Feb-2010',
    membership: { atJuly: 161, current: 182, growth: 13.04, female: 37, femalePercent: 20.33, myRotary: 119, myRotaryPercent: 65.38 },
    trf: { annualFund: 12504.59, polioPlus: 1132.34, otherFunds: 34600.00, endowment: 0, total: 48236.93, donors: 183, newDonors: 32 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 23, goalsCompleted: 22, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 29, volunteers: 415, manHours: 3342, cost: 68647 } },

  { id: '26816', name: 'Thane R.T. Nagar', zone: 'A', ag: 'Sidharth Hamirwasia', president: 'Mrs Sarita H Desai', charterDate: '01-Dec-1989',
    membership: { atJuly: 39, current: 40, growth: 2.56, female: 12, femalePercent: 30.00, myRotary: 29, myRotaryPercent: 72.50 },
    trf: { annualFund: 1552.40, polioPlus: 103.50, otherFunds: 54347.82, endowment: 0, total: 56003.72, donors: 44, newDonors: 3 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 20, goalsCompleted: 15, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: ['Vidyavahini First Grade College'], sponsoredRCC: [] },
    serviceProjects: { projects: 12, volunteers: 2, manHours: 4, cost: 100 } },

  { id: '31297', name: 'Thane Rajmahal Vilas', zone: 'A', ag: 'Sidharth Hamirwasia', president: 'Rajagopal Hegde', charterDate: '12-Feb-1996',
    membership: { atJuly: 69, current: 70, growth: 1.45, female: 22, femalePercent: 31.43, myRotary: 41, myRotaryPercent: 58.57 },
    trf: { annualFund: 1526.17, polioPlus: 1890.47, otherFunds: 10313.83, endowment: 0, total: 13730.47, donors: 58, newDonors: 2 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 19, goalsCompleted: 4, awardEarned: false, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: ['Daffodils English School', 'Vidyashilp Cambridge'], sponsoredRCC: [] },
    serviceProjects: { projects: 28, volunteers: 495, manHours: 877, cost: 0 } },

  { id: '80571', name: 'Thane Sadashivanagar', zone: 'A', ag: 'Sidharth Hamirwasia', president: 'Pranam K J', charterDate: '15-Oct-2008',
    membership: { atJuly: 19, current: 20, growth: 5.26, female: 4, femalePercent: 20.00, myRotary: 15, myRotaryPercent: 75.00 },
    trf: { annualFund: 410.53, polioPlus: 289.71, otherFunds: 0, endowment: 0, total: 700.24, donors: 5, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 15, goalsCompleted: 8, awardEarned: false, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: ['Thane Namma Samskriti', 'Praani Mitra'], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 4, volunteers: 13, manHours: 27, cost: 6100 } },

  { id: '222188', name: 'E-Club of Thane Sakhi', zone: 'A', ag: 'Ashok B Patil', president: 'Prathima Narasapur Rajarao', charterDate: '19-Jan-2021',
    membership: { atJuly: 12, current: 31, growth: 158.33, female: 31, femalePercent: 100.00, myRotary: 17, myRotaryPercent: 54.84 },
    trf: { annualFund: 816.09, polioPlus: 0, otherFunds: 0, endowment: 0, total: 816.09, donors: 2, newDonors: 1 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 17, goalsCompleted: 15, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: ['MP Birla Institute of Management'], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 67, volunteers: 266, manHours: 1176, cost: 1528 } },

  // ─── ZONE B ───
  { id: '226024', name: 'Thane DownTowners', zone: 'B', ag: 'Nalini Nanjundayya', president: 'Mr Baburajan Angadiyil', charterDate: '18-Apr-2024', isNew: true,
    membership: { atJuly: 28, current: 46, growth: 64.29, female: 7, femalePercent: 15.22, myRotary: 37, myRotaryPercent: 80.43 },
    trf: { annualFund: 113.64, polioPlus: 303.50, otherFunds: 0, endowment: 0, total: 417.14, donors: 4, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 25, goalsCompleted: 16, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: ['Koshys Institute of Management Studies', 'NBC College', 'United International Business School'], newInteractClubs: ['Krithvik Public School', 'St. Theresa Bacq Public School', 'United Composite PU College', 'United International School'], sponsoredRCC: [] },
    serviceProjects: { projects: 14, volunteers: 245, manHours: 1108, cost: 3100 } },

  { id: '15768', name: 'Thane Indiranagar', zone: 'B', ag: 'Nalini Nanjundayya', president: 'Vipin Labroo', charterDate: '11-Jun-1981',
    membership: { atJuly: 171, current: 170, growth: -0.58, female: 41, femalePercent: 24.12, myRotary: 137, myRotaryPercent: 80.59 },
    trf: { annualFund: 4856.11, polioPlus: 2084.53, otherFunds: 243035.25, endowment: 0, total: 249975.89, donors: 108, newDonors: 4 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 20, goalsCompleted: 12, awardEarned: false, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: ['Frank Anthony Public School', 'The Deens Academy Whitefield'], sponsoredRCC: [] },
    serviceProjects: { projects: 71, volunteers: 2063, manHours: 5537, cost: 429684 } },

  { id: '65720', name: 'Thane Kalyan', zone: 'B', ag: 'Nalini Nanjundayya', president: 'Jyothi Manjunath', charterDate: '09-Jun-2004',
    membership: { atJuly: 31, current: 33, growth: 6.45, female: 16, femalePercent: 48.48, myRotary: 29, myRotaryPercent: 87.88 },
    trf: { annualFund: 2767.30, polioPlus: 397.73, otherFunds: 807.02, endowment: 0, total: 3972.05, donors: 32, newDonors: 3 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 23, goalsCompleted: 20, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 46, volunteers: 2095, manHours: 53288, cost: 108695 } },

  { id: '79294', name: 'Thane Ramamurthy Nagar', zone: 'B', ag: 'Usha Prasad', president: 'AshokRaju G', charterDate: '28-May-2008',
    membership: { atJuly: 16, current: 9, growth: -43.75, female: 0, femalePercent: 0.00, myRotary: 7, myRotaryPercent: 77.78 },
    trf: { annualFund: 0, polioPlus: 0, otherFunds: 0, endowment: 0, total: 0, donors: 0, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: false, goalsSet: 18, goalsCompleted: 8, awardEarned: false, duesOutstanding: 39187.80 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 0, volunteers: 0, manHours: 0, cost: 0 } },

  { id: '50540', name: 'Thane Ulsoor', zone: 'B', ag: 'Usha Prasad', president: 'Rtn. Vijayakumar P', charterDate: '11-Jun-1997',
    membership: { atJuly: 47, current: 53, growth: 12.77, female: 12, femalePercent: 22.64, myRotary: 53, myRotaryPercent: 100.00 },
    trf: { annualFund: 1245.50, polioPlus: 416.40, otherFunds: 34090.91, endowment: 0, total: 35752.81, donors: 48, newDonors: 5 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 19, goalsCompleted: 19, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: ["Charan's Degree College"], newInteractClubs: ['B.B.M.P. Composite Junior College Jogupalya', 'Vedam E-City', 'Vedam School Kalyan Nagar'], sponsoredRCC: [] },
    serviceProjects: { projects: 301, volunteers: 1625, manHours: 10457, cost: 102658 } },

  { id: '227165', name: 'Thane Arunodaya', zone: 'B', ag: 'Kiran S Rtr.', president: 'Ganganna M.', charterDate: '01-Aug-2025', isNew: true,
    membership: { atJuly: 0, current: 33, growth: null, female: 0, femalePercent: 0.00, myRotary: 14, myRotaryPercent: 42.42 },
    trf: { annualFund: 0, polioPlus: 0, otherFunds: 0, endowment: 0, total: 0, donors: 0, newDonors: 0 },
    excellence: { julyInvoice: null, janInvoice: true, goalsSet: 17, goalsCompleted: 16, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: ['Devanahalli Town'], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 15, volunteers: 122, manHours: 302, cost: 1628 } },

  { id: '91002', name: 'Thane Disha', zone: 'B', ag: 'Usha Prasad', president: 'Naresh Bhandia', charterDate: '02-Jun-2020',
    membership: { atJuly: 10, current: 13, growth: 30.00, female: 4, femalePercent: 30.77, myRotary: 9, myRotaryPercent: 69.23 },
    trf: { annualFund: 23.26, polioPlus: 0, otherFunds: 0, endowment: 0, total: 23.26, donors: 1, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 22, goalsCompleted: 6, awardEarned: false, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 2, volunteers: 7, manHours: 4, cost: 20 } },

  { id: '91121', name: 'Thane Lake World', zone: 'B', ag: 'Mohan Kumar', president: 'Mr. Vivian John Thenguvila', charterDate: '24-Jun-2020',
    membership: { atJuly: 16, current: 21, growth: 31.25, female: 10, femalePercent: 47.62, myRotary: 18, myRotaryPercent: 85.71 },
    trf: { annualFund: 0, polioPlus: 100.00, otherFunds: 0, endowment: 0, total: 100.00, donors: 1, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 0, goalsCompleted: 0, awardEarned: false, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 0, volunteers: 0, manHours: 0, cost: 0 } },

  { id: '87667', name: 'Thane Manyata', zone: 'B', ag: 'Mohan Kumar', president: 'Dr Manjunath M T', charterDate: '10-Jun-2016',
    membership: { atJuly: 40, current: 38, growth: -5.00, female: 15, femalePercent: 39.47, myRotary: 31, myRotaryPercent: 81.58 },
    trf: { annualFund: 386.36, polioPlus: 100.00, otherFunds: 258342.92, endowment: 0, total: 258829.28, donors: 2, newDonors: 1 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 15, goalsCompleted: 13, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: ['Government High School Bileshivale', 'Government High School Kadusonnappanahalli'], sponsoredRCC: [] },
    serviceProjects: { projects: 31, volunteers: 453, manHours: 6450, cost: 300 } },

  { id: '227001', name: 'Thane Namma Samskriti', zone: 'B', ag: 'Kiran S Rtr.', president: 'Mr. Lakshmi Narayanan S.', charterDate: '19-Jun-2025', isNew: true,
    membership: { atJuly: 20, current: 14, growth: -30.00, female: 3, femalePercent: 21.43, myRotary: 5, myRotaryPercent: 35.71 },
    trf: { annualFund: 0, polioPlus: 0, otherFunds: 0, endowment: 0, total: 0, donors: 0, newDonors: 0 },
    excellence: { julyInvoice: false, janInvoice: false, goalsSet: 0, goalsCompleted: 0, awardEarned: false, duesOutstanding: 60958.80 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 0, volunteers: 0, manHours: 0, cost: 0 } },

  { id: '226388', name: 'Thane Zionhills', zone: 'B', ag: 'Mohan Kumar', president: 'Arun Acharya', charterDate: '22-Aug-2024', isNew: true,
    membership: { atJuly: 27, current: 31, growth: 14.81, female: 14, femalePercent: 45.16, myRotary: 18, myRotaryPercent: 58.06 },
    trf: { annualFund: 471.24, polioPlus: 100.00, otherFunds: 0, endowment: 0, total: 571.24, donors: 2, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 18, goalsCompleted: 16, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 38, volunteers: 163, manHours: 1707, cost: 3901 } },

  // ─── ZONE C (sample key clubs) ───
  { id: '88562', name: 'Thane Vidyaranyapura', zone: 'C', ag: 'Harish A P', president: 'Sreekanthan N', charterDate: '09-Jun-2017',
    membership: { atJuly: 74, current: 89, growth: 20.27, female: 22, femalePercent: 24.72, myRotary: 47, myRotaryPercent: 52.81 },
    trf: { annualFund: 400.00, polioPlus: 212.36, otherFunds: 0, endowment: 0, total: 612.36, donors: 3, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: false, goalsSet: 21, goalsCompleted: 17, awardEarned: false, duesOutstanding: 444826.13 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: ['MES BRS PU College', 'Shanthi Niketan School'], sponsoredRCC: [] },
    serviceProjects: { projects: 13, volunteers: 308, manHours: 434, cost: 1250 } },

  { id: '65579', name: 'Thane Yelahanka', zone: 'C', ag: 'Prashanth Babu S J', president: 'Mr ASHOK HEBBAR', charterDate: '02-Jun-2004',
    membership: { atJuly: 39, current: 45, growth: 15.38, female: 9, femalePercent: 20.00, myRotary: 29, myRotaryPercent: 64.44 },
    trf: { annualFund: 1227.27, polioPlus: 103.50, otherFunds: 0, endowment: 0, total: 1330.77, donors: 4, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 6, goalsCompleted: 3, awardEarned: false, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 3, volunteers: 20, manHours: 55, cost: 0 } },

  { id: '90313', name: 'Thane Oasis', zone: 'C', ag: 'Vinod Kumar V S', president: 'Partha Sarathi Kommineni', charterDate: '24-Jun-2019',
    membership: { atJuly: 30, current: 35, growth: 16.67, female: 7, femalePercent: 20.00, myRotary: 33, myRotaryPercent: 94.29 },
    trf: { annualFund: 440.80, polioPlus: 201.33, otherFunds: 0, endowment: 0, total: 642.13, donors: 33, newDonors: 10 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 18, goalsCompleted: 16, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 13, volunteers: 81, manHours: 869, cost: 1257 } },

  { id: '87115', name: 'Thane Heritage North', zone: 'C', ag: 'Aparna Kanampalli', president: 'Mr Arun Tanksali', charterDate: '08-Oct-2015',
    membership: { atJuly: 22, current: 33, growth: 50.00, female: 15, femalePercent: 45.45, myRotary: 33, myRotaryPercent: 100.00 },
    trf: { annualFund: 809.09, polioPlus: 297.70, otherFunds: 0, endowment: 0, total: 1106.79, donors: 4, newDonors: 1 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 20, goalsCompleted: 18, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 37, volunteers: 1444, manHours: 8116, cost: 5613 } },

  { id: '76592', name: 'Thane Sahakaranagar', zone: 'C', ag: 'Prashanth Babu S J', president: 'Ravindra Guntamadugu', charterDate: '27-Jun-2007',
    membership: { atJuly: 20, current: 30, growth: 50.00, female: 8, femalePercent: 26.67, myRotary: 17, myRotaryPercent: 56.67 },
    trf: { annualFund: 301.72, polioPlus: 0, otherFunds: 0, endowment: 0, total: 301.72, donors: 11, newDonors: 1 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 18, goalsCompleted: 16, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: ['Sahakaranagar'], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 15, volunteers: 113, manHours: 855, cost: 1631 } },

  { id: '225976', name: 'Thane Skyway', zone: 'C', ag: 'Srinivas Manjappa Kanagod', president: 'Bhavna Choudhary', charterDate: '20-Mar-2024', isNew: true,
    membership: { atJuly: 21, current: 25, growth: 19.05, female: 13, femalePercent: 52.00, myRotary: 15, myRotaryPercent: 60.00 },
    trf: { annualFund: 0, polioPlus: 100.00, otherFunds: 0, endowment: 0, total: 100.00, donors: 1, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 19, goalsCompleted: 8, awardEarned: false, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 27, volunteers: 21, manHours: 210, cost: 0 } },

  { id: '226233', name: 'Tarabanahalli', zone: 'C', ag: 'Prashanth Babu S J', president: 'Lakshmi Naveen', charterDate: '18-Jun-2024', isNew: true,
    membership: { atJuly: 12, current: 16, growth: 33.33, female: 4, femalePercent: 25.00, myRotary: 5, myRotaryPercent: 31.25 },
    trf: { annualFund: 408.96, polioPlus: 0, otherFunds: 3956.04, endowment: 0, total: 4365.00, donors: 16, newDonors: 11 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 18, goalsCompleted: 16, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: ['Kesar The International School', 'Maruthi Vidya Mandira'], sponsoredRCC: [] },
    serviceProjects: { projects: 60, volunteers: 0, manHours: 0, cost: 0 } },

  { id: '15822', name: 'Vijayapura', zone: 'C', ag: 'Srinivas Manjappa Kanagod', president: 'VIJAYA BABU CHA', charterDate: '08-May-1974',
    membership: { atJuly: 27, current: 36, growth: 33.33, female: 4, femalePercent: 11.11, myRotary: 13, myRotaryPercent: 36.11 },
    trf: { annualFund: 0, polioPlus: 0, otherFunds: 0, endowment: 0, total: 0, donors: 0, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 17, goalsCompleted: 3, awardEarned: false, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 3, volunteers: 26, manHours: 108, cost: 50 } },

  // ─── ZONE D (key clubs) ───
  { id: '53592', name: 'Thane Udyog', zone: 'D', ag: 'Rupashree Venkat', president: 'Mr. Sandeep G Parvatikar', charterDate: '17-May-2000',
    membership: { atJuly: 130, current: 133, growth: 2.31, female: 26, femalePercent: 19.55, myRotary: 109, myRotaryPercent: 81.95 },
    trf: { annualFund: 186.53, polioPlus: 68.06, otherFunds: 1384.78, endowment: 0, total: 1639.37, donors: 19, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 21, goalsCompleted: 21, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: ['Christ University Thane Yeshwanthpur Campus', 'Dhanwantri Institutions'], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 15, volunteers: 86, manHours: 928, cost: 9709 } },

  { id: '86539', name: 'Thane Platinum City', zone: 'D', ag: 'Naveen Kumar M T', president: 'SANDHYA RAGHUNANDAN', charterDate: '20-Mar-2015',
    membership: { atJuly: 41, current: 63, growth: 53.66, female: 26, femalePercent: 41.27, myRotary: 55, myRotaryPercent: 87.30 },
    trf: { annualFund: 1478.59, polioPlus: 104.69, otherFunds: 0, endowment: 0, total: 1583.28, donors: 3, newDonors: 1 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 25, goalsCompleted: 24, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: ['Thane Compassion Crew'], newInteractClubs: ['East West Public School', 'Jasa Horizons', 'St. John High School'], sponsoredRCC: [] },
    serviceProjects: { projects: 165, volunteers: 646, manHours: 4169, cost: 17436 } },

  { id: '79057', name: 'Thane Kolshet', zone: 'D', ag: 'Surendra Rao D', president: 'Nagaraju G R', charterDate: '07-May-2008',
    membership: { atJuly: 79, current: 102, growth: 29.11, female: 8, femalePercent: 7.84, myRotary: 83, myRotaryPercent: 81.37 },
    trf: { annualFund: 0, polioPlus: 0, otherFunds: 0, endowment: 0, total: 0, donors: 0, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 22, goalsCompleted: 19, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: ['Thane Arunodaya'], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 120, volunteers: 2267, manHours: 10980, cost: 48280 } },

  // ─── ZONE E (key clubs) ───
  { id: '15772', name: 'Thane Wagle', zone: 'E', ag: 'Suryaprakash V Rathnam', president: 'Meenakshi Sarath', charterDate: '25-Apr-1983',
    membership: { atJuly: 61, current: 54, growth: -11.48, female: 12, femalePercent: 22.22, myRotary: 33, myRotaryPercent: 61.11 },
    trf: { annualFund: 405.87, polioPlus: 545.77, otherFunds: 80889.04, endowment: 0, total: 81840.68, donors: 13, newDonors: 1 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 21, goalsCompleted: 18, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: ['Chikkaballapur Prime', 'Vijnatham South Campus'], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 42, volunteers: 306, manHours: 528, cost: 650 } },

  { id: '15771', name: 'Thane North', zone: 'E', ag: 'Ashwath Narayan K S', president: 'S.K. Manjunath', charterDate: '09-May-1966',
    membership: { atJuly: 57, current: 60, growth: 5.26, female: 5, femalePercent: 8.33, myRotary: 41, myRotaryPercent: 68.33 },
    trf: { annualFund: 1512.00, polioPlus: 344.65, otherFunds: 32939.33, endowment: 0, total: 34795.98, donors: 58, newDonors: 4 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 20, goalsCompleted: 19, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: ['B G Nagara Central', 'Chikbalapur Central'], newRotaractClubs: [], newInteractClubs: ['Himanshu Jyothi Kala Peetha', 'Poorna Prajna Education Centre', 'Triveni Memorial Education Trust', 'Triveni Public School CBSE', 'Triveni Public School ICSE', 'Widia Poorna Prajna Pre-University College', 'Soundarya Central School'], sponsoredRCC: [] },
    serviceProjects: { projects: 151, volunteers: 1783, manHours: 9278, cost: 35806 } },

  { id: '15775', name: 'Thane West', zone: 'E', ag: 'Shivananda Gowdanavara Srinivasiah', president: 'YOGESH PACHISIA', charterDate: '18-May-1977',
    membership: { atJuly: 88, current: 76, growth: -13.64, female: 10, femalePercent: 13.16, myRotary: 57, myRotaryPercent: 75.00 },
    trf: { annualFund: 10975.85, polioPlus: 207.00, otherFunds: 0, endowment: 0, total: 11182.85, donors: 3, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 0, goalsCompleted: 0, awardEarned: false, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 6, volunteers: 28, manHours: 40, cost: 208 } },

  // ─── ZONE F (key clubs) ───
  { id: '15819', name: 'Thane City', zone: 'F', ag: 'Krishnaprasad R', president: 'Dr. Ambaram Sundaram Sudarshan', charterDate: '03-Dec-1957',
    membership: { atJuly: 49, current: 63, growth: 28.57, female: 18, femalePercent: 28.57, myRotary: 20, myRotaryPercent: 31.75 },
    trf: { annualFund: 500.00, polioPlus: 0, otherFunds: 0, endowment: 0, total: 500.00, donors: 2, newDonors: 1 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 26, goalsCompleted: 21, awardEarned: true, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: ["Bishop Sargant School", "Govt. High School Oorkere", "Manasa Gangotri"], sponsoredRCC: [] },
    serviceProjects: { projects: 72, volunteers: 331, manHours: 618, cost: 15790 } },

  { id: '61999', name: 'Thane Central', zone: 'F', ag: 'Krishnaprasad R', president: 'Ramasheshagiri Rao A', charterDate: '01-May-2003',
    membership: { atJuly: 43, current: 45, growth: 4.65, female: 17, femalePercent: 37.78, myRotary: 12, myRotaryPercent: 26.67 },
    trf: { annualFund: 0, polioPlus: 430.75, otherFunds: 0, endowment: 0, total: 430.75, donors: 3, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 14, goalsCompleted: 12, awardEarned: false, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: ['Huliyar Central', 'Siragate Yallapura Tumakuru'], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 23, volunteers: 346, manHours: 1040, cost: 7480 } },

  { id: '15759', name: 'Tiptur', zone: 'F', ag: 'Prabhu Swamy G', president: 'Vanitha K', charterDate: '28-Sep-1959',
    membership: { atJuly: 47, current: 42, growth: -10.64, female: 4, femalePercent: 9.52, myRotary: 37, myRotaryPercent: 88.10 },
    trf: { annualFund: 22.50, polioPlus: 209.38, otherFunds: 0, endowment: 0, total: 231.88, donors: 2, newDonors: 1 },
    excellence: { julyInvoice: true, janInvoice: false, goalsSet: 18, goalsCompleted: 1, awardEarned: false, duesOutstanding: 182876.40 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 15, volunteers: 850, manHours: 1545, cost: 3030 } },

  // ─── ZONE G (key clubs) ───
  { id: '15804', name: 'Kalyan', zone: 'G', ag: 'Chandresh A R', president: 'Rajashekara. C', charterDate: '01-Mar-1954',
    membership: { atJuly: 29, current: 29, growth: 0.00, female: 2, femalePercent: 6.90, myRotary: 9, myRotaryPercent: 31.03 },
    trf: { annualFund: 0, polioPlus: 0, otherFunds: 0, endowment: 0, total: 0, donors: 0, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: false, goalsSet: 0, goalsCompleted: 0, awardEarned: false, duesOutstanding: 131984.01 },
    sponsored: { newRotaryClubs: ['Mandavya'], newRotaractClubs: ['Mandya'], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 0, volunteers: 0, manHours: 0, cost: 0 } },

  { id: '15799', name: 'Maddur', zone: 'G', ag: 'Anupama B S', president: 'Srinivas S P', charterDate: '17-Sep-1981',
    membership: { atJuly: 44, current: 58, growth: 31.82, female: 2, femalePercent: 3.45, myRotary: 25, myRotaryPercent: 43.10 },
    trf: { annualFund: 101.18, polioPlus: 0, otherFunds: 0, endowment: 0, total: 101.18, donors: 1, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: true, goalsSet: 4, goalsCompleted: 1, awardEarned: false, duesOutstanding: 0 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: ['H K Veeranna Gowda College'], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 34, volunteers: 583, manHours: 1571, cost: 400 } },

  { id: '87428', name: 'Kalyan West', zone: 'G', ag: 'Aksharam Venkatesh', president: 'Nandish M', charterDate: '06-Apr-2016',
    membership: { atJuly: 6, current: 16, growth: 166.67, female: 1, femalePercent: 6.25, myRotary: 6, myRotaryPercent: 37.50 },
    trf: { annualFund: 0, polioPlus: 0, otherFunds: 0, endowment: 0, total: 0, donors: 0, newDonors: 0 },
    excellence: { julyInvoice: true, janInvoice: false, goalsSet: 11, goalsCompleted: 0, awardEarned: false, duesOutstanding: 100131.73 },
    sponsored: { newRotaryClubs: [], newRotaractClubs: [], newInteractClubs: [], sponsoredRCC: [] },
    serviceProjects: { projects: 0, volunteers: 0, manHours: 0, cost: 0 } },
];

// ─── ZONE AGGREGATES (from PPT) ───
export const ZONE_TOTALS = {
  A: { clubs: 11, membersJuly: 771, membersCurrent: 830, growth: 7.65, female: 240, femalePercent: 28.92, myRotary: 507, myRotaryPercent: 61.08, trfTotal: 130699.41, donors: 315, newDonors: 43, julyInvoice: 10, janInvoice: 9, goalsSet: 9, goalsCompleted: 7, awards: 7, duesClubs: 2, newRotaryClubs: 0, newRotaract: 5, newInteract: 14, rcc: 7, projects: 303, volunteers: 2523, manHours: 34790, projectCost: 273627 },
  B: { clubs: 11, membersJuly: 406, membersCurrent: 461, growth: 13.55, female: 122, femalePercent: 26.46, myRotary: 358, myRotaryPercent: 77.66, trfTotal: 549641.67, donors: 198, newDonors: 13, julyInvoice: 10, janInvoice: 9, goalsSet: 9, goalsCompleted: 6, awards: 6, duesClubs: 2, newRotaryClubs: 1, newRotaract: 4, newInteract: 11, rcc: 0, projects: 518, volunteers: 6773, manHours: 78853, projectCost: 649986 },
  C: { clubs: 15, membersJuly: 313, membersCurrent: 434, growth: 38.66, female: 101, femalePercent: 23.27, myRotary: 233, myRotaryPercent: 53.69, trfTotal: 8858.77, donors: 73, newDonors: 23, julyInvoice: 13, janInvoice: 10, goalsSet: 8, goalsCompleted: 5, awards: 4, duesClubs: 5, newRotaryClubs: 0, newRotaract: 1, newInteract: 4, rcc: 0, projects: 182, volunteers: 2033, manHours: 10747, projectCost: 9801 },
  D: { clubs: 14, membersJuly: 529, membersCurrent: 609, growth: 15.12, female: 119, femalePercent: 19.54, myRotary: 379, myRotaryPercent: 62.23, trfTotal: 3631.74, donors: 23, newDonors: 1, julyInvoice: 10, janInvoice: 9, goalsSet: 13, goalsCompleted: 9, awards: 7, duesClubs: 5, newRotaryClubs: 1, newRotaract: 4, newInteract: 5, rcc: 0, projects: 499, volunteers: 7555, manHours: 21985, projectCost: 130784 },
  E: { clubs: 18, membersJuly: 626, membersCurrent: 643, growth: 2.72, female: 141, femalePercent: 21.93, myRotary: 432, myRotaryPercent: 67.19, trfTotal: 146643.04, donors: 105, newDonors: 8, julyInvoice: 13, janInvoice: 10, goalsSet: 11, goalsCompleted: 7, awards: 6, duesClubs: 8, newRotaryClubs: 4, newRotaract: 4, newInteract: 13, rcc: 0, projects: 507, volunteers: 5959, manHours: 19546, projectCost: 98302 },
  F: { clubs: 14, membersJuly: 389, membersCurrent: 480, growth: 23.39, female: 79, femalePercent: 16.46, myRotary: 175, myRotaryPercent: 36.46, trfTotal: 1304.68, donors: 8, newDonors: 2, julyInvoice: 11, janInvoice: 6, goalsSet: 8, goalsCompleted: 4, awards: 3, duesClubs: 8, newRotaryClubs: 2, newRotaract: 0, newInteract: 3, rcc: 0, projects: 212, volunteers: 2144, manHours: 5003, projectCost: 48770 },
  G: { clubs: 10, membersJuly: 204, membersCurrent: 297, growth: 45.59, female: 20, femalePercent: 6.73, myRotary: 84, myRotaryPercent: 28.28, trfTotal: 448.34, donors: 2, newDonors: 0, julyInvoice: 10, janInvoice: 5, goalsSet: 3, goalsCompleted: 2, awards: 1, duesClubs: 5, newRotaryClubs: 1, newRotaract: 3, newInteract: 1, rcc: 0, projects: 95, volunteers: 886, manHours: 3252, projectCost: 6560 },
};

export const DISTRICT_TOTALS = {
  clubs: 93, membersJuly: 3238, membersCurrent: 3754, growth: 15.94,
  female: 822, femalePercent: 21.90, myRotary: 2168, myRotaryPercent: 57.75,
  trfAnnualFund: 64862.87, trfPolioPlus: 12423.43, trfOther: 762941.35, trfEndowment: 1000.00, trfTotal: 841227.65,
  donors: 724, newDonors: 90,
  julyInvoice: 77, janInvoice: 58,
  goalsSet: 61, goalsCompleted: 40, awards: 34, duesClubs: 35,
  newRotaryClubs: 9, newRotaract: 20, newInteract: 51, rcc: 7,
  projects: 2316, volunteers: 27873, manHours: 174176, projectCost: 1217830,
};

// AG login credentials (demo)
export const AG_USERS = [
  { id: 'ag-a', name: 'Shankar Sastry C V', zone: 'A', mobile: '9XXXXXXXXX', role: 'ag' },
  { id: 'ag-b', name: 'Sharavana J', zone: 'B', mobile: '9XXXXXXXXX', role: 'ag' },
  { id: 'ag-c', name: 'Aravind S Hooli', zone: 'C', mobile: '9XXXXXXXXX', role: 'ag' },
  { id: 'ag-d', name: 'Manjunath Patil K', zone: 'D', mobile: '9XXXXXXXXX', role: 'ag' },
  { id: 'ag-e', name: 'Madhusudan R Bidi', zone: 'E', mobile: '9XXXXXXXXX', role: 'ag' },
  { id: 'ag-f', name: 'Prasanna Kumar C N', zone: 'F', mobile: '9XXXXXXXXX', role: 'ag' },
  { id: 'ag-g', name: 'Rajesh T S', zone: 'G', mobile: '9XXXXXXXXX', role: 'ag' },
  { id: 'dg', name: 'District Governor', zone: 'ALL', mobile: '9XXXXXXXXX', role: 'dg' },
];

export const getZoneClubs = (zoneId) => CLUBS.filter(c => c.zone === zoneId);
export const getZoneInfo = (zoneId) => ZONES.find(z => z.id === zoneId);
export const getZoneTotals = (zoneId) => ZONE_TOTALS[zoneId];
