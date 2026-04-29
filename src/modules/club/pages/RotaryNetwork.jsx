import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { TERMINATED_MEMBERS, POTENTIAL_MEMBERS } from '../data/clubData'

const REASON_STYLE = {
  'Non-payment':          { bg: 'bg-red-50',    text: 'text-red-600',    dot: '#e11d48' },
  'Personal':             { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: '#0891b2' },
  'Family':               { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: '#ca8a04' },
  'Business':             { bg: 'bg-green-50',  text: 'text-green-700',  dot: '#16a34a' },
  'Lack of Participation':{ bg: 'bg-purple-50', text: 'text-purple-700', dot: '#9333ea' },
}

const LEAD_STYLE = {
  'Hot':  { bg: 'bg-red-50',   text: 'text-red-600',   dot: '#e11d48' },
  'Warm': { bg: 'bg-amber-50', text: 'text-amber-700', dot: '#f59e0b' },
  'Cold': { bg: 'bg-slate-100',text: 'text-slate-500', dot: '#94a3b8' },
}

const TABS = ['Terminated Members', 'Potential Members']

const ALL_REASONS = ['All Reasons', ...Object.keys(REASON_STYLE)]
const ALL_LEADS   = ['All Status', 'Hot', 'Warm', 'Cold']

export default function RotaryNetwork() {
  const [activeTab, setActiveTab]   = useState('Terminated Members')
  const [search, setSearch]         = useState('')
  const [reasonFilter, setReason]   = useState('All Reasons')
  const [leadFilter, setLead]       = useState('All Status')
  const [terminated, setTerminated] = useState(TERMINATED_MEMBERS)
  const [potential, setPotential]   = useState(POTENTIAL_MEMBERS)

  const filteredTerm = terminated.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = !q || [m.firstName, m.middleName, m.lastName, m.memberId, m.type]
      .some(v => v.toLowerCase().includes(q))
    const matchReason = reasonFilter === 'All Reasons' || m.reason === reasonFilter
    return matchSearch && matchReason
  })

  const filteredPot = potential.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = !q || [m.name, m.prospectId, m.phone, m.email, m.referredBy]
      .some(v => v.toLowerCase().includes(q))
    const matchLead = leadFilter === 'All Status' || m.leadStatus === leadFilter
    return matchSearch && matchLead
  })

  const thisRY = terminated.filter(m =>
    m.terminationDate.includes('2025') || m.terminationDate.includes('2026')
  ).length

  const hotCount  = potential.filter(m => m.leadStatus === 'Hot').length
  const warmCount = potential.filter(m => m.leadStatus === 'Warm').length
  const coldCount = potential.filter(m => m.leadStatus === 'Cold').length

  return (
    <div className="space-y-5">

      {activeTab === 'Terminated Members' ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard label="Total Terminated"   value={terminated.length}  sub="All records"          subColor="down"  accent="#e11d48" />
          <StatCard label="This Rotary Year"   value={thisRY}             sub="Since Jul 2025"        subColor="muted" accent="#9333ea" />
          <StatCard label="Non-payment"        value={terminated.filter(m => m.reason === 'Non-payment').length}          sub="Top exit reason"   subColor="down"  accent="#ca8a04" />
          <StatCard label="Lack of Participation" value={terminated.filter(m => m.reason === 'Lack of Participation').length} sub="Engagement exits" subColor="muted" accent="#0891b2" />
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard label="Total Prospects"  value={potential.length} sub="In pipeline"     subColor="up"    accent="#003DA5" />
          <StatCard label="Hot Leads"        value={hotCount}         sub="Ready to join"   subColor="up"    accent="#e11d48" />
          <StatCard label="Warm Leads"       value={warmCount}        sub="In conversation" subColor="muted" accent="#f59e0b" />
          <StatCard label="Cold Leads"       value={coldCount}        sub="Needs follow-up" subColor="down"  accent="#94a3b8" />
        </div>
      )}

      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm">Rotary Network</CardTitle>
              <CardDescription className="text-xs">Manage terminated and prospective members</CardDescription>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400 w-28"
                />
              </div>

              {activeTab === 'Terminated Members' && (
                <select
                  value={reasonFilter}
                  onChange={e => setReason(e.target.value)}
                  className="text-xs border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-1.5 text-slate-600 outline-none cursor-pointer"
                >
                  {ALL_REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
              )}

              {activeTab === 'Potential Members' && (
                <>
                  <select
                    value={leadFilter}
                    onChange={e => setLead(e.target.value)}
                    className="text-xs border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-1.5 text-slate-600 outline-none cursor-pointer"
                  >
                    {ALL_LEADS.map(l => <option key={l}>{l}</option>)}
                  </select>
                  <button
                    className="text-xs font-semibold text-white px-3 py-1.5 rounded-md"
                    style={{ backgroundColor: '#003DA5' }}
                  >
                    + Add Prospect
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-1 mt-4">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => { setActiveTab(t); setSearch(''); setReason('All Reasons'); setLead('All Status') }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === t ? 'text-[#1e3a5f] shadow-sm' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                }`}
                style={activeTab === t ? { backgroundColor: '#F7A81B' } : {}}
              >
                {t}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-4">

          {activeTab === 'Terminated Members' && (
            <>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['S.No.','Member ID','Member Type','First Name','Middle Name','Last Name','Admission Date','Termination Date','Termination Reason',''].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTerm.map((m, i) => {
                      const rs = REASON_STYLE[m.reason] ?? REASON_STYLE['Non-payment']
                      return (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="px-3 py-3 text-xs text-slate-400">{i + 1}</td>
                          <td className="px-3 py-3 text-xs font-mono text-slate-500">{m.memberId}</td>
                          <td className="px-3 py-3">
                            <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{m.type}</span>
                          </td>
                          <td className="px-3 py-3 text-xs font-semibold text-slate-700">{m.firstName}</td>
                          <td className="px-3 py-3 text-xs text-slate-500">{m.middleName || '—'}</td>
                          <td className="px-3 py-3 text-xs font-semibold text-slate-700">{m.lastName}</td>
                          <td className="px-3 py-3 text-xs text-slate-500 tabular-nums whitespace-nowrap">{m.admissionDate}</td>
                          <td className="px-3 py-3 text-xs text-slate-500 tabular-nums whitespace-nowrap">{m.terminationDate}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md ${rs.bg} ${rs.text}`}>
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: rs.dot }} />
                              {m.reason}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => setTerminated(r => r.filter(x => x.id !== m.id))}
                              className="text-red-400 hover:text-red-600 p-0.5 rounded transition-colors"
                              title="Remove record"
                            >
                              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <p className="text-xs text-slate-400">{filteredTerm.length} of {terminated.length} records</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {Object.entries(REASON_STYLE).map(([reason, style]) => (
                    <span key={reason} className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.dot }} />
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'Potential Members' && (
            <>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['S.No.','Prospect ID','Full Name','Phone','Email','Referred By','Lead Status','Notes',''].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPot.map((m, i) => {
                      const ls = LEAD_STYLE[m.leadStatus] ?? LEAD_STYLE['Cold']
                      return (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="px-3 py-3 text-xs text-slate-400">{i + 1}</td>
                          <td className="px-3 py-3 text-xs font-mono text-slate-500">{m.prospectId}</td>
                          <td className="px-3 py-3 text-xs font-semibold text-slate-800">{m.name}</td>
                          <td className="px-3 py-3 text-xs text-slate-600 tabular-nums whitespace-nowrap">{m.phone}</td>
                          <td className="px-3 py-3 text-xs text-slate-500">{m.email}</td>
                          <td className="px-3 py-3 text-xs text-slate-600">{m.referredBy}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md ${ls.bg} ${ls.text}`}>
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ls.dot }} />
                              {m.leadStatus}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-400 max-w-[180px] truncate" title={m.notes}>{m.notes}</td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => setPotential(r => r.filter(x => x.id !== m.id))}
                              className="text-red-400 hover:text-red-600 p-0.5 rounded transition-colors"
                              title="Remove record"
                            >
                              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <p className="text-xs text-slate-400">{filteredPot.length} of {potential.length} prospects</p>
                <div className="flex items-center gap-3">
                  {Object.entries(LEAD_STYLE).map(([status, style]) => (
                    <span key={status} className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.dot }} />
                      {status}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
