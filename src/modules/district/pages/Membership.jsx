import { useState } from 'react'
import DistrictDirectory  from './Directory'
import DistrictCommittee from './Committee'
import DistrictAG        from './AG'
import DistrictModerator from './Moderator'
import DistrictClubs     from './Clubs'

const TABS = [
  { id: 'directory',  label: 'Directory'           },
  { id: 'committee',  label: 'District Committee'  },
  { id: 'ag',         label: 'Assistant Governors' },
  { id: 'moderator',  label: 'Club Moderator'      },
  { id: 'clubs',      label: 'Clubs'               },
]

export default function DistrictMembership() {
  const [activeTab, setActiveTab] = useState('directory')

  return (
    <div className="space-y-4">
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
