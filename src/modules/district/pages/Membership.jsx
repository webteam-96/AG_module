// src/modules/district/pages/Membership.jsx
import { useState } from 'react'
import StatCard from '../../club/components/StatCard'
import { CLUB_ANALYTICS } from '../data/analyticsData'
import DistrictDirectory  from './Directory'
import DistrictCommittee  from './Committee'
import DistrictAG         from './AG'
import DistrictModerator  from './Moderator'
import DistrictClubs      from './Clubs'

const TABS = [
  { id: 'directory',  label: 'Directory'           },
  { id: 'committee',  label: 'District Committee'  },
  { id: 'ag',         label: 'Assistant Governors' },
  { id: 'moderator',  label: 'Club Moderator'      },
  { id: 'clubs',      label: 'Clubs'               },
]

const totalMembers  = CLUB_ANALYTICS.reduce((s, c) => s + c.members, 0)
const activeMembers = CLUB_ANALYTICS.reduce((s, c) => s + c.activeMembers, 0)
const newThisYear   = CLUB_ANALYTICS.reduce((s, c) => s + c.newThisYear, 0)
const terminated    = CLUB_ANALYTICS.reduce((s, c) => s + c.terminated, 0)

export default function DistrictMembership() {
  const [activeTab, setActiveTab] = useState('directory')

  return (
    <div className="space-y-4">

      {/* District-wide KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Members"  value={totalMembers}  sub="All clubs"        subColor="muted" accent="#003DA5" />
        <StatCard label="Active Members" value={activeMembers} sub="Currently active" subColor="up"    accent="#16a34a" />
        <StatCard label="New This Year"  value={newThisYear}   sub="New this RY"      subColor="up"    accent="#9333ea" />
        <StatCard label="Terminated"     value={terminated}    sub="Exits this RY"    subColor="down"  accent="#e11d48" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'text-[#1e3a5f] shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            style={activeTab === t.id ? { backgroundColor: '#F7A81B' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'directory'  && <DistrictDirectory />}
      {activeTab === 'committee'  && <DistrictCommittee />}
      {activeTab === 'ag'         && <DistrictAG />}
      {activeTab === 'moderator'  && <DistrictModerator />}
      {activeTab === 'clubs'      && <DistrictClubs />}
    </div>
  )
}
