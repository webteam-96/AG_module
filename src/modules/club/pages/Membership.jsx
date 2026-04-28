import { useState } from 'react'
import Directory        from './Directory'
import PastPresidents   from './PastPresidents'
import BoardOfDirectors from './BoardOfDirectors'

const TABS = [
  { id: 'directory',       label: 'Member Directory'  },
  { id: 'past-presidents', label: 'Past Presidents'    },
  { id: 'bod',             label: 'Board of Directors' },
]

export default function Membership() {
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
                ? 'text-white shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            style={activeTab === t.id ? { backgroundColor: '#003DA5' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'directory'       && <Directory />}
      {activeTab === 'past-presidents' && <PastPresidents />}
      {activeTab === 'bod'             && <BoardOfDirectors />}
    </div>
  )
}
