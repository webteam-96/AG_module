import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import {
  DISTRICT_PROJECTS, DISTRICT_EVENTS,
  AVENUE_COLORS, EVENT_TYPE_COLORS, STATUS_COLORS, fmtINR,
} from '../data/foundationData'

const TABS = [
  { id: 'projects', label: 'District Projects' },
  { id: 'events',   label: 'District Events'   },
]

const CLUBS = ['All Clubs', ...Array.from(new Set(DISTRICT_PROJECTS.map(p => p.club)))]
const EVENT_CLUBS = ['All Clubs', ...Array.from(new Set(DISTRICT_EVENTS.map(e => e.club)))]

/* ── Search icon ─────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

/* ── Projects tab ────────────────────────────────────────────────── */
function ProjectsTab() {
  const [search, setSearch]       = useState('')
  const [clubFilter, setClub]     = useState('All Clubs')
  const [statusFilter, setStatus] = useState('All')
  const [avenueFilter, setAvenue] = useState('All')
  const [page, setPage]           = useState(0)
  const PER_PAGE = 15

  const avenues  = ['All', ...Array.from(new Set(DISTRICT_PROJECTS.map(p => p.avenue)))]
  const statuses = ['All', 'Completed', 'In Progress', 'Upcoming']

  const filtered = DISTRICT_PROJECTS.filter(p => {
    const matchSearch  = p.name.toLowerCase().includes(search.toLowerCase()) || p.club.toLowerCase().includes(search.toLowerCase())
    const matchClub    = clubFilter   === 'All Clubs' || p.club    === clubFilter
    const matchStatus  = statusFilter === 'All'       || p.status  === statusFilter
    const matchAvenue  = avenueFilter === 'All'       || p.avenue  === avenueFilter
    return matchSearch && matchClub && matchStatus && matchAvenue
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const safePage   = Math.min(page, Math.max(0, totalPages - 1))
  const pageRows   = filtered.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE)

  const totalBeneficiaries = DISTRICT_PROJECTS.reduce((s, p) => s + p.beneficiaries, 0)
  const totalFunds         = DISTRICT_PROJECTS.reduce((s, p) => s + p.funds, 0)
  const totalManHours      = DISTRICT_PROJECTS.reduce((s, p) => s + p.manHours, 0)
  const completedCount     = DISTRICT_PROJECTS.filter(p => p.status === 'Completed').length

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Total Projects"      value={DISTRICT_PROJECTS.length}           sub="Across all clubs"  subColor="muted" accent="#003DA5" />
        <StatCard label="Completed"           value={completedCount}                      sub="This RY"           subColor="up"    accent="#16a34a" />
        <StatCard label="Total Beneficiaries" value={totalBeneficiaries.toLocaleString()} sub="Lives touched"     subColor="muted" accent="#9333ea" />
        <StatCard label="Total Funds"         value={fmtINR(totalFunds)}                  sub={`${totalManHours} man-hours`} subColor="muted" accent="#ca8a04" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm">All District Projects</CardTitle>
              <CardDescription className="text-xs">District 5656 · RY 2025–26</CardDescription>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              Export
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
              <SearchIcon />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
                placeholder="Search project or club..."
                className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
            </div>
            <select value={clubFilter} onChange={e => { setClub(e.target.value); setPage(0) }}
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 bg-white outline-none">
              {CLUBS.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={avenueFilter} onChange={e => { setAvenue(e.target.value); setPage(0) }}
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 bg-white outline-none">
              {avenues.map(a => <option key={a}>{a}</option>)}
            </select>
            <div className="flex gap-1">
              {statuses.map(s => (
                <button key={s} onClick={() => { setStatus(s); setPage(0) }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === s ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  style={statusFilter === s ? { backgroundColor: '#003DA5' } : {}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['#', 'Club', 'Project Name', 'Avenue', 'Date', 'Beneficiaries', 'Funds', 'Man-hours', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageRows.map((p, i) => {
                  const aColor  = AVENUE_COLORS[p.avenue] ?? '#64748b'
                  const sStyle  = STATUS_COLORS[p.status] ?? STATUS_COLORS.Upcoming
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 text-xs text-slate-400 tabular-nums">{safePage * PER_PAGE + i + 1}</td>
                      <td className="px-3 py-3">
                        <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">{p.club}</span>
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap">{p.name}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: aColor }} />
                          <span className="text-xs text-slate-600 whitespace-nowrap">{p.avenue}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 whitespace-nowrap">{p.date}</td>
                      <td className="px-3 py-3 text-xs font-semibold text-slate-700 tabular-nums">{p.beneficiaries.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs font-semibold tabular-nums" style={{ color: p.funds ? '#ca8a04' : '#94a3b8' }}>
                        {fmtINR(p.funds)}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 tabular-nums">{p.manHours}h</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${sStyle.bg} ${sStyle.text}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-3 py-10 text-center text-sm text-slate-400">No projects match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-slate-400">{filtered.length} of {DISTRICT_PROJECTS.length} projects shown</p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Page {safePage + 1} of {totalPages}</span>
                <div className="flex gap-1">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
                    className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
                  <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}
                    className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ── Events tab ──────────────────────────────────────────────────── */
function EventsTab() {
  const [search, setSearch]   = useState('')
  const [clubFilter, setClub] = useState('All Clubs')
  const [typeFilter, setType] = useState('All')
  const [page, setPage]       = useState(0)
  const PER_PAGE = 15

  const types = ['All', 'District', 'Meeting', 'Service', 'TRF', 'New Gen']

  const filtered = DISTRICT_EVENTS.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.club.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase())
    const matchClub   = clubFilter  === 'All Clubs' || e.club === clubFilter
    const matchType   = typeFilter  === 'All'       || e.type === typeFilter
    return matchSearch && matchClub && matchType
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const safePage   = Math.min(page, Math.max(0, totalPages - 1))
  const pageRows   = filtered.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE)

  const upcoming  = DISTRICT_EVENTS.filter(e => e.status === 'Upcoming').length
  const completed = DISTRICT_EVENTS.filter(e => e.status === 'Completed').length

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Total Events"    value={DISTRICT_EVENTS.length} sub="All clubs"      subColor="muted" accent="#003DA5" />
        <StatCard label="Upcoming"        value={upcoming}               sub="Scheduled"      subColor="up"    accent="#f59e0b" />
        <StatCard label="Completed"       value={completed}              sub="This RY"        subColor="up"    accent="#16a34a" />
        <StatCard label="District Events" value={DISTRICT_EVENTS.filter(e => e.club === 'District 5656').length} sub="DG-level events" subColor="muted" accent="#9333ea" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm">All District Events</CardTitle>
              <CardDescription className="text-xs">District 5656 · RY 2025–26</CardDescription>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              Export
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
              <SearchIcon />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
                placeholder="Search event, club or venue..."
                className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
            </div>
            <select value={clubFilter} onChange={e => { setClub(e.target.value); setPage(0) }}
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 bg-white outline-none">
              {EVENT_CLUBS.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="flex gap-1 flex-wrap">
              {types.map(t => (
                <button key={t} onClick={() => { setType(t); setPage(0) }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    typeFilter === t ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  style={typeFilter === t ? { backgroundColor: '#003DA5' } : {}}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['#', 'Club', 'Event Name', 'Type', 'Date', 'Time', 'Venue', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageRows.map((ev, i) => {
                  const tStyle = EVENT_TYPE_COLORS[ev.type] ?? EVENT_TYPE_COLORS.Meeting
                  const sStyle = STATUS_COLORS[ev.status]  ?? STATUS_COLORS.Upcoming
                  const d   = ev.date.split('-')[2]
                  const mon = new Date(ev.date).toLocaleString('default', { month: 'short' })
                  return (
                    <tr key={ev.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 text-xs text-slate-400 tabular-nums">{safePage * PER_PAGE + i + 1}</td>
                      <td className="px-3 py-3 text-xs font-semibold text-slate-700 whitespace-nowrap">{ev.club}</td>
                      <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap">{ev.name}</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${tStyle.bg} ${tStyle.text}`}>{ev.type}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 text-center bg-slate-50 border border-slate-100 rounded-lg py-1 flex-shrink-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{mon}</p>
                            <p className="text-sm font-extrabold text-slate-800 leading-tight">{d}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 whitespace-nowrap">{ev.time}</td>
                      <td className="px-3 py-3 text-xs text-slate-500 max-w-[180px] truncate">{ev.venue}</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${sStyle.bg} ${sStyle.text}`}>{ev.status}</span>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-3 py-10 text-center text-sm text-slate-400">No events match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-slate-400">{filtered.length} of {DISTRICT_EVENTS.length} events shown</p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Page {safePage + 1} of {totalPages}</span>
                <div className="flex gap-1">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
                    className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
                  <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}
                    className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ── Main export ─────────────────────────────────────────────────── */
export default function DistrictFoundation() {
  const [activeTab, setActiveTab] = useState('projects')

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

      {activeTab === 'projects' && <ProjectsTab />}
      {activeTab === 'events'   && <EventsTab />}
    </div>
  )
}
