// src/modules/district/data/committeeData.js

export const COMMITTEES = [
  {
    id: 1,
    name: 'District Governing Board',
    color: '#003DA5',
    members: [
      { id: 1, name: 'Mukesh Dc',       designation: 'District Governor 2025-26', club: 'Thane City View', mobile: '+91 98765 00001', email: 'mukesh.dc@example.com'      },
      { id: 2, name: 'Dikshita Kasare', designation: 'Vice President',            club: 'Thane City View', mobile: '+91 98765 00002', email: 'dikshita.k@example.com'     },
      { id: 3, name: 'Feba Joseph',     designation: 'District Secretary',        club: 'Lake Shore Club', mobile: '+91 98765 00004', email: 'feba.joseph@example.com'    },
      { id: 4, name: 'Anita Mehta',     designation: 'Treasurer',                 club: 'Owala',           mobile: '+91 98765 00005', email: 'anita.mehta@example.com'    },
      { id: 5, name: 'Rajesh Sharma',   designation: 'Sergeant-at-Arms',          club: 'Tikujiniwadi',    mobile: '+91 98765 00006', email: 'rajesh.sharma@example.com'  },
    ],
  },
  {
    id: 2,
    name: 'Foundation / TRF Committee',
    color: '#ca8a04',
    members: [
      { id: 1, name: 'Praveen Mestry',  designation: 'Foundation Chair',          club: 'Thane City View', mobile: '+91 98026 36809', email: 'pm@example.com'             },
      { id: 2, name: 'Sunita Rao',      designation: 'Annual Fund Co-Chair',      club: 'Lake Shore Club', mobile: '+91 98765 00011', email: 'sunita.rao@example.com'     },
      { id: 3, name: 'Harish Nambiar',  designation: 'PHF Coordinator',           club: 'Owala',           mobile: '+91 98765 00012', email: 'harish.n@example.com'       },
      { id: 4, name: 'Lata Desai',      designation: 'Major Gifts Officer',       club: 'Tikujiniwadi',    mobile: '+91 98765 00013', email: 'lata.d@example.com'         },
    ],
  },
  {
    id: 3,
    name: 'Membership Committee',
    color: '#16a34a',
    members: [
      { id: 1, name: 'Meera Shenoy',    designation: 'Membership Chair',          club: 'Thane City View', mobile: '+91 88007 65432', email: 'meera@example.com'          },
      { id: 2, name: 'Kiran Reddy',     designation: 'Retention Co-Chair',        club: 'Lake Shore Club', mobile: '+91 98765 00021', email: 'kiran.r@example.com'        },
      { id: 3, name: 'Divya Menon',     designation: 'New Member Coordinator',    club: 'Owala',           mobile: '+91 98765 00022', email: 'divya.m@example.com'        },
    ],
  },
  {
    id: 4,
    name: 'Service Projects Committee',
    color: '#e11d48',
    members: [
      { id: 1, name: 'Ramesh Joshi',    designation: 'Service Projects Chair',    club: 'Tikujiniwadi',    mobile: '+91 66003 45678', email: 'ramesh@example.com'         },
      { id: 2, name: 'Sunita Patil',    designation: 'Community Service Lead',    club: 'Thane City View', mobile: '+91 77002 34567', email: 'sunita.p@example.com'       },
      { id: 3, name: 'Arvind Kulkarni', designation: 'International Service Lead',club: 'Lake Shore Club', mobile: '+91 99001 22334', email: 'arvind@example.com'         },
      { id: 4, name: 'Rohit Verma',     designation: 'Youth Services Lead',       club: 'Owala',           mobile: '+91 88004 55667', email: 'rohit@example.com'          },
      { id: 5, name: 'Priya Desai',     designation: 'Vocational Service Lead',   club: 'Rotary Club Leo', mobile: '+91 77009 87654', email: 'priya.d@example.com'        },
    ],
  },
  {
    id: 5,
    name: 'Public Image Committee',
    color: '#9333ea',
    members: [
      { id: 1, name: 'Deepa Sharma',    designation: 'Public Image Chair',        club: 'Thane City View', mobile: '+91 55004 56789', email: 'deepa@example.com'          },
      { id: 2, name: 'Anil Mehta',      designation: 'Media Coordinator',         club: 'Lake Shore Club', mobile: '+91 99002 33445', email: 'anil.m@example.com'         },
      { id: 3, name: 'Seema Kapoor',    designation: 'Social Media Manager',      club: 'Tikujiniwadi',    mobile: '+91 77003 44556', email: 'seema@example.com'          },
    ],
  },
  {
    id: 6,
    name: 'E-Governance & IT Committee',
    color: '#0891b2',
    members: [
      { id: 1, name: 'Kalpesh A',       designation: 'IT Chair',                  club: 'Thane City View', mobile: '+91 98765 00003', email: 'kalpesh.a@example.com'      },
      { id: 2, name: 'Neha Sharma',     designation: 'Data Management Lead',      club: 'Owala',           mobile: '+91 98001 11111', email: 'neha@example.com'           },
    ],
  },
  {
    id: 7,
    name: 'Youth Services Committee',
    color: '#f59e0b',
    members: [
      { id: 1, name: 'Rohit Verma',     designation: 'Youth Chair',               club: 'Owala',           mobile: '+91 88004 55667', email: 'rohit@example.com'          },
      { id: 2, name: 'Sanjay Patel',    designation: 'Rotaract Coordinator',      club: 'Lake Shore Club', mobile: '+91 76003 33333', email: 'sanjay@example.com'         },
      { id: 3, name: 'Rajan Choudhary', designation: 'Interact Coordinator',      club: 'Rotary Club Leo', mobile: '+91 54005 55555', email: 'rajan@example.com'          },
    ],
  },
]

export const DESIGNATIONS = [
  'District Governor 2025-26',
  'Vice President',
  'District Secretary',
  'Treasurer',
  'Sergeant-at-Arms',
  'Committee Chair',
  'Co-Chair',
  'Coordinator',
  'Advisory Member',
  'Rotarian',
]
