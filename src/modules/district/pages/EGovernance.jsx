import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import {
  CLUB_MONTHLY_REPORTS, CMR_MONTHS,
  PPH_CAMPS,
  CLUB_CITATIONS, CITATION_CRITERIA,
  REPORT_SECTIONS,
} from '../data/egovernanceData'
import { MONTHS, MONTHLY_STATUS } from '../data/monthlyReportData'

const TABS = [
  { id:'monthly',  label:'Club Monthly Reports' },
  { id:'pph',      label:'PPH Camp'             },
  { id:'citation', label:'District Citation'    },
  { id:'reports',  label:'Reports'              },
]

/* ── Status helpers ────────────────────────────────────────────── */
const STATUS_META = {
  S: { label:'Submitted', bg:'bg-green-50',  text:'text-green-700',  short:'S' },
  L: { label:'Late',      bg:'bg-red-50',    text:'text-red-600',    short:'L' },
  P: { label:'Pending',   bg:'bg-amber-50',  text:'text-amber-700',  short:'P' },
  N: { label:'—',         bg:'bg-slate-50',  text:'text-slate-400',  short:'—' },
}
const pctColor = (p) => p >= 80 ? '#16a34a' : p >= 60 ? '#f59e0b' : '#ef4444'
const ragColor = (pct) => pct >= 75 ? '#16a34a' : pct >= 50 ? '#f59e0b' : '#ef4444'

/* ── Shared table wrappers ─────────────────────────────────────── */
function TH({ children, center }) {
  return (
    <th className={`text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 bg-slate-50 border-b border-slate-200 whitespace-nowrap ${center ? 'text-center' : 'text-left'}`}>
      {children}
    </th>
  )
}

/* ── Download pill ─────────────────────────────────────────────── */
function DownloadPill({ color }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="flex items-center gap-1 transition-all whitespace-nowrap flex-shrink-0"
      style={{ border:`0.5px solid ${color}`, padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:500,
               color: hov ? '#fff' : color, backgroundColor: hov ? color : 'transparent' }}
    >
      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Download
    </button>
  )
}

/* ══════════════════════════════════════════════════════════════════
   TAB 1 — Club Monthly Reports (merged: district summary + per-club)
═══════════════════════════════════════════════════════════════════ */
function MonthlyReportTab() {
  const [expandedId, setExpandedId] = useState(null)
  const [year, setYear]             = useState('2025-2026')
  const [whatsapp, setWhatsapp]     = useState(false)
  const [mrSearch, setMrSearch]     = useState('')
  const [mrPage,   setMrPage]       = useState(0)
  const MR_PER_PAGE = 20

  const onTimeSlots   = CLUB_MONTHLY_REPORTS.reduce((s, c) => s + c.months.filter(m => m === 'S').length, 0)
  const pendingSlots  = CLUB_MONTHLY_REPORTS.reduce((s, c) => s + c.months.filter(m => m === 'P').length, 0)
  const lateSlots     = CLUB_MONTHLY_REPORTS.reduce((s, c) => s + c.months.filter(m => m === 'L').length, 0)
  const compliancePct = Math.round((onTimeSlots / (CLUB_MONTHLY_REPORTS.length * 9)) * 100)

  const statuses = MONTHS.map(m => ({ ...m, ...MONTHLY_STATUS[m.id] }))

  const mrFiltered   = CLUB_MONTHLY_REPORTS.filter(c => c.name.toLowerCase().includes(mrSearch.toLowerCase()))
  const mrTotalPages = Math.ceil(mrFiltered.length / MR_PER_PAGE)
  const mrSafePage   = Math.min(mrPage, Math.max(0, mrTotalPages - 1))
  const mrRows       = mrFiltered.slice(mrSafePage * MR_PER_PAGE, (mrSafePage + 1) * MR_PER_PAGE)

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Total Clubs"   value={CLUB_MONTHLY_REPORTS.length} sub="Reporting clubs"  subColor="muted" accent="#003DA5" />
        <StatCard label="Submitted"     value={onTimeSlots}                 sub="On-time reports"  subColor="up"    accent="#16a34a" />
        <StatCard label="On-time Rate"  value={`${compliancePct}%`}         sub="Across all clubs" subColor={compliancePct >= 75 ? 'up' : 'down'} accent="#9333ea" />
        <StatCard label="Pending"       value={pendingSlots + lateSlots}    sub="Need attention"   subColor="down"  accent="#f59e0b" />
      </div>

      {/* ── Section 1: District month-by-month summary ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3 pb-3">
          <div>
            <CardTitle className="text-sm">District Summary — By Month</CardTitle>
            <CardDescription className="text-xs">How many clubs submitted each month</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <select value={year} onChange={e => setYear(e.target.value)}
              className="text-xs text-slate-600 rounded-lg bg-white border border-slate-200 px-3 py-1.5 outline-none">
              {['2025-2026','2024-2025','2023-2024'].map(y => <option key={y}>{y}</option>)}
            </select>
            <button className="text-xs font-medium text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              Export to Excel
            </button>
            <div className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5">
              <span className="text-xs text-slate-600">WhatsApp Notify</span>
              <button onClick={() => setWhatsapp(w => !w)}
                className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${whatsapp ? 'bg-green-500' : 'bg-slate-200'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${whatsapp ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {statuses.map(m => {
              const pct  = Math.round((m.submitted / m.total) * 100)
              const color = pct === 100 ? '#16a34a' : pct >= 50 ? '#b45309' : '#e11d48'
              const bg    = pct === 100 ? '#f0fdf4' : pct >= 50 ? '#fffbeb' : '#fef2f2'
              return (
                <div key={m.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span className="text-sm font-medium text-slate-700">{m.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: bg, color }}>
                      {m.submitted}/{m.total} submitted
                    </span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, backgroundColor: color }} />
                    </div>
                    <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Section 2: Per-club breakdown ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Per-Club Breakdown</CardTitle>
          <CardDescription className="text-xs">Click any club to see month-by-month detail</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 max-w-sm mb-3">
            <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={mrSearch} onChange={e => { setMrSearch(e.target.value); setMrPage(0) }}
              placeholder="Search club..."
              className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
          </div>

          {/* Legend */}
          <div className="flex gap-4 flex-wrap mb-2">
            {[['S','Submitted','bg-green-500'],['L','Late','bg-red-400'],['P','Pending','bg-amber-400'],['N','Not Started','bg-slate-200']].map(([k,l,c]) => (
              <div key={k} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${c}`} />
                <span className="text-[11px] text-slate-500">{l}</span>
              </div>
            ))}
          </div>

          {mrRows.map(club => {
            const submitted = club.months.filter(m => m === 'S').length
            const late      = club.months.filter(m => m === 'L').length
            const pending   = club.months.filter(m => m === 'P').length
            const pct       = Math.round((submitted / 9) * 100)
            const isOpen    = expandedId === club.id

            return (
              <div key={club.id} className="rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpandedId(isOpen ? null : club.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"
                      className="flex-shrink-0 transition-transform" style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    <span className="text-sm font-semibold text-slate-800 truncate">{club.name}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <div className="hidden sm:flex gap-0.5">
                      {club.months.map((m, i) => (
                        <div key={i} title={CMR_MONTHS[i]}
                          className={`w-3 h-3 rounded-sm ${m === 'S' ? 'bg-green-500' : m === 'L' ? 'bg-red-400' : m === 'P' ? 'bg-amber-400' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-700 font-semibold">{submitted} on-time</span>
                      {late > 0    && <span className="text-red-600 font-semibold">{late} late</span>}
                      {pending > 0 && <span className="text-amber-600 font-semibold">{pending} pending</span>}
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${pct}%`, backgroundColor: pctColor(pct) }} />
                      </div>
                      <span className="font-bold tabular-nums" style={{ color: pctColor(pct) }}>{pct}%</span>
                    </div>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {CMR_MONTHS.map(m => (
                            <th key={m} className="text-center font-semibold text-slate-500 px-2 py-2 whitespace-nowrap uppercase tracking-wider">{m}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {club.months.map((m, i) => {
                            const s = STATUS_META[m]
                            return (
                              <td key={i} className="px-2 py-3 text-center">
                                <span className={`inline-flex items-center justify-center text-[10px] font-bold px-2 py-1 rounded-md ${s.bg} ${s.text}`}>
                                  {m === 'S' ? '✓' : m === 'L' ? 'Late' : m === 'P' ? '...' : '—'}
                                </span>
                              </td>
                            )
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
          {mrFiltered.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">No clubs match your search.</p>
          )}
          {mrTotalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-400">
                {mrSafePage * MR_PER_PAGE + 1}–{Math.min((mrSafePage + 1) * MR_PER_PAGE, mrFiltered.length)} of {mrFiltered.length} clubs
              </span>
              <div className="flex gap-1">
                <button onClick={() => setMrPage(p => Math.max(0, p - 1))} disabled={mrSafePage === 0}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
                <button onClick={() => setMrPage(p => Math.min(mrTotalPages - 1, p + 1))} disabled={mrSafePage >= mrTotalPages - 1}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   TAB 2 — PPH Camp
═══════════════════════════════════════════════════════════════════ */
function PPHCampTab() {
  const [search,   setSearch]   = useState('')
  const [pphPage,  setPphPage]  = useState(0)
  const PPH_PER_PAGE = 15

  const filtered = PPH_CAMPS.filter(c =>
    c.club.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase()) ||
    c.coordinator.toLowerCase().includes(search.toLowerCase())
  )
  const pphTotalPages = Math.ceil(filtered.length / PPH_PER_PAGE)
  const pphSafePage   = Math.min(pphPage, Math.max(0, pphTotalPages - 1))
  const pphRows       = filtered.slice(pphSafePage * PPH_PER_PAGE, (pphSafePage + 1) * PPH_PER_PAGE)

  const totalChildren    = PPH_CAMPS.reduce((s, c) => s + c.children, 0)
  const totalRotarians   = PPH_CAMPS.reduce((s, c) => s + c.rotarians, 0)
  const totalRotaractors = PPH_CAMPS.reduce((s, c) => s + c.rotaractors, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Total Camps"          value={PPH_CAMPS.length}    sub="Across all clubs"    subColor="muted" accent="#003DA5" />
        <StatCard label="Children Vaccinated"  value={totalChildren}       sub="District-wide"       subColor="up"    accent="#16a34a" />
        <StatCard label="Rotarians Involved"   value={totalRotarians}      sub="Volunteers"          subColor="muted" accent="#9333ea" />
        <StatCard label="Rotaractors Involved" value={totalRotaractors}    sub="Youth volunteers"    subColor="muted" accent="#0891b2" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">PPH Vaccination Camps — All Clubs</CardTitle>
            <CardDescription className="text-xs">District 5656 · RY 2025–26</CardDescription>
          </div>
          <div className="flex gap-2">
            <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg" style={{ backgroundColor:'#003DA5' }}>+ Add Camp</button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              Export
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 max-w-sm">
            <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setPphPage(0) }}
              placeholder="Search club, location or coordinator..."
              className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['#','Club','Camp Date','Location','Children Vaccinated','Rotarians','Rotaractors','Coordinator'].map(h => (
                    <TH key={h} center={!['Club','Location','Coordinator'].includes(h)}>{h}</TH>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pphRows.map((c, i) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 text-xs text-slate-400 text-center tabular-nums">{i + 1}</td>
                    <td className="px-3 py-3 text-xs font-semibold text-slate-700 whitespace-nowrap">{c.club}</td>
                    <td className="px-3 py-3 text-xs text-slate-500 whitespace-nowrap text-center">{c.date}</td>
                    <td className="px-3 py-3 text-xs text-slate-600">{c.location}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-lg font-extrabold text-green-600 tabular-nums">{c.children}</span>
                    </td>
                    <td className="px-3 py-3 text-xs text-center tabular-nums font-semibold text-slate-700">{c.rotarians}</td>
                    <td className="px-3 py-3 text-xs text-center tabular-nums font-semibold text-slate-700">{c.rotaractors}</td>
                    <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">{c.coordinator}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t border-slate-200">
                  <td colSpan={4} className="px-3 py-2.5 text-xs font-bold text-slate-600">Totals</td>
                  <td className="px-3 py-2.5 text-center text-base font-extrabold text-green-700 tabular-nums">{totalChildren}</td>
                  <td className="px-3 py-2.5 text-center text-xs font-bold text-slate-700 tabular-nums">{totalRotarians}</td>
                  <td className="px-3 py-2.5 text-center text-xs font-bold text-slate-700 tabular-nums">{totalRotaractors}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          {pphTotalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-400">
                {pphSafePage * PPH_PER_PAGE + 1}–{Math.min((pphSafePage + 1) * PPH_PER_PAGE, filtered.length)} of {filtered.length} camps
              </span>
              <div className="flex gap-1">
                <button onClick={() => setPphPage(p => Math.max(0, p - 1))} disabled={pphSafePage === 0}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
                <button onClick={() => setPphPage(p => Math.min(pphTotalPages - 1, p + 1))} disabled={pphSafePage >= pphTotalPages - 1}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
              </div>
            </div>
          )}
          <p className="text-xs text-slate-400">{filtered.length} of {PPH_CAMPS.length} camps · {totalChildren} children vaccinated total</p>
        </CardContent>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   TAB 3 — District Citation
═══════════════════════════════════════════════════════════════════ */
function CitationTab() {
  const [search,     setSearch]     = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [page,       setPage]       = useState(0)
  const CIT_PER_PAGE = 15

  const sorted    = [...CLUB_CITATIONS].sort((a, b) => b.total - a.total)
  const distAvg   = Math.round(CLUB_CITATIONS.reduce((s, c) => s + c.total, 0) / CLUB_CITATIONS.length)
  const qualified = CLUB_CITATIONS.filter(c => c.total >= 40).length

  const filtered   = sorted.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / CIT_PER_PAGE)
  const safePage   = Math.min(page, Math.max(0, totalPages - 1))
  const pageRows   = filtered.slice(safePage * CIT_PER_PAGE, (safePage + 1) * CIT_PER_PAGE)

  const citPctColor = p => p >= 80 ? '#16a34a' : p >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Total Clubs"      value={CLUB_CITATIONS.length} sub="Participating"       subColor="muted" accent="#003DA5" />
        <StatCard label="District Average" value={`${distAvg}/50`}       sub="Citation score"      subColor={distAvg >= 40 ? 'up' : 'down'} accent="#9333ea" />
        <StatCard label="Qualified"        value={qualified}             sub="≥ 40 pts (citation)" subColor="up"    accent="#16a34a" />
        <StatCard label="Max Score"        value="50"                    sub="Points possible"     subColor="muted" accent="#0891b2" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm">Citation Scores — All Clubs</CardTitle>
              <CardDescription className="text-xs">Ranked by total score · click a row to expand</CardDescription>
            </div>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search club..."
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-slate-400 placeholder-slate-400 w-48" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {pageRows.map(club => {
            const rank   = filtered.indexOf(club)
            const pct    = Math.round((club.total / club.max) * 100)
            const color  = citPctColor(pct)
            const isOpen = expandedId === club.id
            return (
              <div key={club.id} className="rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpandedId(isOpen ? null : club.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="text-xs font-bold w-6 text-center flex-shrink-0" style={{ color }}>{rank + 1}</span>
                  <span className="flex-1 text-sm font-semibold text-slate-800 truncate">{club.name}</span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full rounded-full" style={{ width:`${pct}%`, backgroundColor: color }} />
                    </div>
                    <span className="text-sm font-extrabold tabular-nums" style={{ color }}>{club.total}</span>
                    <span className="text-xs text-slate-400">/ {club.max}</span>
                    <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"
                      className="transition-transform" style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-4 pb-3 pt-2 bg-slate-50 space-y-2">
                    {CITATION_CRITERIA.map((crit, i) => {
                      const earned = club.criteria[i]
                      const cPct   = Math.round((earned / crit.points) * 100)
                      const cColor = citPctColor(cPct)
                      return (
                        <div key={i}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[11px] text-slate-500">{crit.criterion}</span>
                            <span className="text-[11px] font-bold tabular-nums ml-2" style={{ color: cColor }}>{earned}/{crit.points}</span>
                          </div>
                          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width:`${cPct}%`, backgroundColor: cColor }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-10">No clubs match your search.</p>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                {safePage * CIT_PER_PAGE + 1}–{Math.min((safePage + 1) * CIT_PER_PAGE, filtered.length)} of {filtered.length} clubs
              </span>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   TAB 4 — Reports
═══════════════════════════════════════════════════════════════════ */
const SECTION_ICON = {
  members:  (c) => (
    <svg width="15" height="15" fill="none" stroke={c} strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  district: (c) => (
    <svg width="15" height="15" fill="none" stroke={c} strokeWidth="1.8" viewBox="0 0 24 24">
      <line x1="12" y1="2" x2="12" y2="6"/>
      <path d="M4 6h16v2H4zM2 8h20v2H2zM3 10v10h18V10"/><rect x="9" y="14" width="6" height="6"/>
    </svg>
  ),
  clubs: (c) => (
    <svg width="15" height="15" fill="none" stroke={c} strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
}

function ReportRow({ report, color, hoverBg, isLast }) {
  const [hov, setHov] = useState(false)
  const [filterVal, setFilterVal] = useState(report.filter?.options[0] ?? '')
  return (
    <div className="flex items-center gap-3 px-5 py-3 transition-colors"
      style={{ borderBottom: isLast ? 'none' : '0.5px solid #f1f5f9', backgroundColor: hov ? hoverBg : 'transparent' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div className="flex-1 min-w-0">
        <span className="text-[14px] text-slate-700">{report.name}</span>
        {report.sub && <span className="ml-1.5 text-[12px] text-slate-400">{report.sub}</span>}
      </div>
      {report.filter && (
        <select value={filterVal} onChange={e => setFilterVal(e.target.value)}
          className="text-xs text-slate-600 rounded-lg bg-white flex-shrink-0 border border-slate-200 px-2 py-1.5 outline-none" style={{ width:'160px' }}>
          {report.filter.options.map(o => <option key={o}>{o}</option>)}
        </select>
      )}
      <DownloadPill color={color} />
    </div>
  )
}

function ReportSectionCard({ section }) {
  return (
    <div className="bg-white rounded-xl flex flex-col overflow-hidden"
      style={{ border:'0.5px solid #e2e8f0', borderLeft:`3px solid ${section.color}` }}>
      <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom:'0.5px solid #f1f5f9' }}>
        {SECTION_ICON[section.id](section.color)}
        <span className="text-[15px] font-medium" style={{ color: section.color }}>{section.label}</span>
        <span className="text-[12px] text-slate-400">{section.reports.length} report{section.reports.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex-1">
        {section.reports.map((r, i) => (
          <ReportRow key={r.id} report={r} color={section.color} hoverBg={section.hoverBg}
            isLast={i === section.reports.length - 1} />
        ))}
      </div>
    </div>
  )
}

function ReportsTab() {
  const [year, setYear] = useState('2025-2026')
  const members  = REPORT_SECTIONS.find(s => s.id === 'members')
  const district = REPORT_SECTIONS.find(s => s.id === 'district')
  const clubs    = REPORT_SECTIONS.find(s => s.id === 'clubs')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">Reports</p>
          <p className="text-xs text-slate-400 mt-0.5">District 5656</p>
        </div>
        <select value={year} onChange={e => setYear(e.target.value)}
          className="text-xs text-slate-600 rounded-lg bg-white border border-slate-200 px-3 py-1.5 outline-none">
          {['2025-2026','2024-2025','2023-2024','2022-2023'].map(y => <option key={y}>{y}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-4">
          <ReportSectionCard section={members} />
          <ReportSectionCard section={district} />
        </div>
        <div>
          <ReportSectionCard section={clubs} />
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   Main export
═══════════════════════════════════════════════════════════════════ */
export default function DistrictEGovernance() {
  const [activeTab, setActiveTab] = useState('monthly')

  const totalSubmitted = CLUB_MONTHLY_REPORTS.reduce((s, c) => s + c.months.filter(m => m === 'S').length, 0)
  const totalCamps     = PPH_CAMPS.length
  const distAvgCitation= Math.round(CLUB_CITATIONS.reduce((s, c) => s + c.total, 0) / CLUB_CITATIONS.length)

  return (
    <div className="space-y-5">

      {/* KPI strip */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        <StatCard label="Monthly Reports"    value={totalSubmitted}         sub="Submitted on time" subColor="up"    accent="#003DA5" />
        <StatCard label="PPH Camps"          value={totalCamps}             sub="District-wide"     subColor="muted" accent="#16a34a" />
        <StatCard label="Avg Citation Score" value={`${distAvgCitation}/50`} sub="All clubs"        subColor={distAvgCitation >= 40 ? 'up' : 'down'} accent="#9333ea" />
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">E-Governance & Reporting</CardTitle>
          <CardDescription className="text-xs">Monthly reports, PPH camps, citations and downloads</CardDescription>

          {/* Tab bar */}
          <div className="flex gap-1 mt-4 flex-wrap">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === t.id ? 'text-[#1e3a5f] shadow-sm' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                }`}
                style={activeTab === t.id ? { backgroundColor:'#F7A81B' } : {}}>
                {t.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          {activeTab === 'monthly'  && <MonthlyReportTab />}
          {activeTab === 'pph'      && <PPHCampTab />}
          {activeTab === 'citation' && <CitationTab />}
          {activeTab === 'reports'  && <ReportsTab />}
        </CardContent>
      </Card>
    </div>
  )
}
