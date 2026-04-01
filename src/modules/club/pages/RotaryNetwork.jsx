import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { TERMINATED_MEMBERS, POTENTIAL_MEMBERS } from '../data/clubData'

const TERM_COLORS = ['#e11d48','#9333ea','#0891b2','#ca8a04']
const POT_COLORS  = ['#003DA5','#16a34a','#ca8a04','#9333ea','#0891b2']

const POTENTIAL_STATUS_STYLE = {
  'Contacted':    { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  'Meeting Set':  { bg: 'bg-amber-50',  text: 'text-amber-700'  },
  'Interested':   { bg: 'bg-purple-50', text: 'text-purple-700' },
  'Proposal Sent':{ bg: 'bg-green-50',  text: 'text-green-700'  },
  'Declined':     { bg: 'bg-slate-100', text: 'text-slate-500'  },
}

const REASON_STYLE = {
  'Resigned':    { bg: 'bg-slate-100', text: 'text-slate-600'  },
  'Relocated':   { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  'Non-payment': { bg: 'bg-red-50',    text: 'text-red-600'    },
  'Deceased':    { bg: 'bg-slate-100', text: 'text-slate-400'  },
}

const TABS = ['Terminated Members', 'Potential Members']

export default function RotaryNetwork() {
  const [activeTab, setActiveTab]     = useState('Terminated Members')
  const [search, setSearch]           = useState('')
  const [terminated, setTerminated]   = useState(TERMINATED_MEMBERS)
  const [potential, setPotential]     = useState(POTENTIAL_MEMBERS)

  const filteredTerm = terminated.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.reason.toLowerCase().includes(search.toLowerCase())
  )

  const filteredPot = potential.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.referredBy.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Terminated Members"  value={terminated.length}  sub="Left the club"           subColor="down"  accent="#e11d48" />
        <StatCard label="Potential Members"   value={potential.length}   sub="In pipeline"             subColor="up"    accent="#16a34a" />
        <StatCard label="Conversion Rate"     value="60%"                sub="Potential → Full member" subColor="up"    accent="#003DA5" />
        <StatCard label="This RY Terminated"  value={terminated.filter(m => m.terminatedOn.includes('2025') || m.terminatedOn.includes('2026')).length} sub="Since Jul 2025" subColor="muted" accent="#9333ea" />
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm">Rotary Network</CardTitle>
              <CardDescription className="text-xs">Manage terminated and prospective members</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search..." className="bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400 w-28" />
              </div>
              {activeTab === 'Potential Members' && (
                <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-md" style={{ backgroundColor: '#003DA5' }}>+ Add Potential</button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {TABS.map(t => (
              <button key={t} onClick={() => { setActiveTab(t); setSearch('') }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === t ? 'text-[#1e3a5f] shadow-sm' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                }`}
                style={activeTab === t ? { backgroundColor: '#F7A81B' } : {}}>{t}</button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-4">

          {/* ── Terminated Members ──────────────────────────────────── */}
          {activeTab === 'Terminated Members' && (
            <>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['Sr.No.', 'Name', 'Mobile No.', 'Email', 'Type', 'Terminated On', 'Reason', 'Proposed By', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTerm.map((m, i) => {
                      const rs = REASON_STYLE[m.reason] ?? REASON_STYLE['Resigned']
                      return (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="px-3 py-3 text-xs text-slate-400">{i + 1}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                style={{ background: TERM_COLORS[i % TERM_COLORS.length] }}>
                                {m.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                              </div>
                              <span className="font-semibold text-slate-700">{m.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-slate-600 text-xs tabular-nums">{m.mobile}</td>
                          <td className="px-3 py-3 text-slate-500 text-xs">{m.email}</td>
                          <td className="px-3 py-3">
                            <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{m.type}</span>
                          </td>
                          <td className="px-3 py-3 text-slate-500 text-xs tabular-nums whitespace-nowrap">{m.terminatedOn}</td>
                          <td className="px-3 py-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${rs.bg} ${rs.text}`}>{m.reason}</span>
                          </td>
                          <td className="px-3 py-3 text-slate-500 text-xs">{m.proposedBy}</td>
                          <td className="px-3 py-3">
                            <div className="flex gap-2">
                              <button className="text-xs text-blue-700 font-medium hover:text-blue-900">Restore</button>
                              <button onClick={() => setTerminated(r => r.filter(x => x.id !== m.id))}
                                className="text-red-500 hover:text-red-700 p-0.5 rounded">
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-2">{filteredTerm.length} terminated members on record</p>
            </>
          )}

          {/* ── Potential Members ────────────────────────────────────── */}
          {activeTab === 'Potential Members' && (
            <>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['Sr.No.', 'Name', 'Mobile No.', 'Email', 'Referred By', 'Status', 'Follow-Up', 'Notes', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPot.map((m, i) => {
                      const ss = POTENTIAL_STATUS_STYLE[m.status] ?? POTENTIAL_STATUS_STYLE['Contacted']
                      return (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="px-3 py-3 text-xs text-slate-400">{i + 1}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                style={{ background: POT_COLORS[i % POT_COLORS.length] }}>
                                {m.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                              </div>
                              <span className="font-semibold text-slate-800">{m.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-slate-600 text-xs tabular-nums">{m.mobile}</td>
                          <td className="px-3 py-3 text-slate-500 text-xs">{m.email}</td>
                          <td className="px-3 py-3 text-slate-600 text-xs">{m.referredBy}</td>
                          <td className="px-3 py-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${ss.bg} ${ss.text}`}>{m.status}</span>
                          </td>
                          <td className="px-3 py-3 text-slate-500 text-xs whitespace-nowrap">{m.followUp}</td>
                          <td className="px-3 py-3 text-slate-400 text-xs max-w-[160px] truncate" title={m.notes}>{m.notes}</td>
                          <td className="px-3 py-3">
                            <div className="flex gap-2">
                              <button className="text-xs text-blue-700 font-medium hover:text-blue-900">Edit</button>
                              <button onClick={() => setPotential(r => r.filter(x => x.id !== m.id))}
                                className="text-red-500 hover:text-red-700 p-0.5">
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-2">{filteredPot.length} potential members in pipeline</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
