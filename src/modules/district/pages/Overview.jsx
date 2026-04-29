// src/modules/district/pages/Overview.jsx
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { CLUB_ANALYTICS } from '../data/analyticsData'
import { DISTRICT_PROJECTS } from '../data/foundationData'
import { CLUB_CITATIONS, CITATION_CRITERIA } from '../data/egovernanceData'

// ── District-wide aggregates ─────────────────────────────────────
const distTotalMembers    = CLUB_ANALYTICS.reduce((s, c) => s + c.members, 0)
const distActiveMembers   = CLUB_ANALYTICS.reduce((s, c) => s + c.activeMembers, 0)
const distMaleMembers     = CLUB_ANALYTICS.reduce((s, c) => s + c.maleMembers, 0)
const distFemaleMembers   = CLUB_ANALYTICS.reduce((s, c) => s + c.femaleMembers, 0)
const distHonoraryMembers = CLUB_ANALYTICS.reduce((s, c) => s + c.honoraryMembers, 0)
const distInactiveMembers = distTotalMembers - distActiveMembers
const distNewThisYear     = CLUB_ANALYTICS.reduce((s, c) => s + c.newThisYear, 0)
const distTerminated      = CLUB_ANALYTICS.reduce((s, c) => s + c.terminated, 0)

const distTrfRaised       = CLUB_ANALYTICS.reduce((s, c) => s + c.trfRaised, 0)
const distTrfGoal         = CLUB_ANALYTICS.reduce((s, c) => s + c.trfGoal, 0)
const distAnnualFund      = CLUB_ANALYTICS.reduce((s, c) => s + c.annualFund, 0)
const distPhfContributors = CLUB_ANALYTICS.reduce((s, c) => s + c.phfContributors, 0)
const distMajorDonors     = CLUB_ANALYTICS.reduce((s, c) => s + c.majorDonors, 0)
const distTrfPct          = Math.round((distTrfRaised / distTrfGoal) * 100)

const distServiceProjects = CLUB_ANALYTICS.reduce((s, c) => s + c.serviceProjects, 0)
const distBeneficiaries   = CLUB_ANALYTICS.reduce((s, c) => s + c.beneficiaries, 0)

const distCitationAvg     = Math.round(CLUB_ANALYTICS.reduce((s, c) => s + c.citationScore, 0) / CLUB_ANALYTICS.length)
const distCitationPct     = Math.round((distCitationAvg / 50) * 100)
const distQualified       = CLUB_ANALYTICS.filter(c => c.citationScore >= 40).length

// ── Derived & ranked data ────────────────────────────────────────
const enriched = CLUB_ANALYTICS.map(c => ({
  ...c,
  citationPct:   Math.round((c.citationScore   / c.citationMax)  * 100),
  compliancePct: Math.round((c.reportsSubmitted / c.reportsTotal) * 100),
  memberPct:     Math.round((c.members          / c.memberTarget) * 100),
  trfPct:        Math.round((c.trfRaised        / c.trfGoal)      * 100),
}))
const withComposite = enriched.map(c => ({
  ...c,
  composite: Math.round((c.citationPct + c.compliancePct + c.avgAttendance) / 3),
}))
const ranked = [...withComposite].sort((a, b) => b.composite - a.composite)

const avgOf = key => Math.round(withComposite.reduce((s, c) => s + c[key], 0) / withComposite.length)
const avgCitation   = avgOf('citationPct')
const avgCompliance = avgOf('compliancePct')
const avgAttendance = avgOf('avgAttendance')
const avgProjects   = avgOf('serviceProjects')

const INR_TO_USD = 84
const fmtUSD = v => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`

// ── Avenue breakdown for Service Projects card ───────────────────
const AVENUE_COLOR_MAP = {
  'Community Service':     '#003DA5',
  'Vocational Service':    '#16a34a',
  'New Generation':        '#9333ea',
  'International Service': '#0891b2',
  'Public Image':          '#ca8a04',
  'Club Service':          '#e11d48',
}
const avenueCountMap = {}
DISTRICT_PROJECTS.forEach(p => {
  avenueCountMap[p.avenue] = (avenueCountMap[p.avenue] || 0) + 1
})
const AVENUE_BREAKDOWN = Object.entries(avenueCountMap)
  .map(([name, completed]) => ({ name, completed, color: AVENUE_COLOR_MAP[name] ?? '#64748b' }))
  .sort((a, b) => b.completed - a.completed)
const avenueMax = Math.max(...AVENUE_BREAKDOWN.map(a => a.completed))

// ── Per-criterion averages for Citation card ─────────────────────
const CRITERION_AVGS = CITATION_CRITERIA.map((crit, i) => {
  const avg    = Math.round(CLUB_CITATIONS.reduce((s, c) => s + c.criteria[i], 0) / CLUB_CITATIONS.length)
  const pct    = Math.round((avg / crit.points) * 100)
  const status = pct === 100 ? 'done' : pct >= 60 ? 'partial' : 'none'
  return { criterion: crit.criterion, points: crit.points, earned: avg, pct, status }
})

// ── Pagination ───────────────────────────────────────────────────
function Pagination({ page, total, perPage, setPage }) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
      <span className="text-xs text-slate-400">
        {page * perPage + 1}–{Math.min((page + 1) * perPage, total)} of {total}
      </span>
      <div className="flex gap-1">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
          className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">←</button>
        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
          className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">→</button>
      </div>
    </div>
  )
}

// ── CardWrapper ──────────────────────────────────────────────────
function CardWrapper({ id, activeCard, setActiveCard, children }) {
  return (
    <div onClick={() => setActiveCard(id)} className="cursor-pointer rounded-[inherit] transition-all"
      style={activeCard === id ? { outline:'2px solid #003DA5', outlineOffset:'2px', borderRadius:'0.75rem' } : {}}>
      {children}
    </div>
  )
}

// ── Top-20 chart data helper ─────────────────────────────────────
const top20 = (key, label) =>
  [...withComposite].sort((a, b) => b[key] - a[key]).slice(0, 20).map(c => ({
    name: c.name.split(' ')[0],
    [label]: c[key],
  }))

export default function DistrictOverview() {
  const [activeCard, setActiveCard] = useState('membership')
  const [lbSearch,   setLbSearch]   = useState('')
  const [lbPage,     setLbPage]     = useState(0)


  const LB_PER_PAGE  = 10
  const lbFiltered  = ranked.filter(c => c.name.toLowerCase().includes(lbSearch.toLowerCase()))
  const lbSafePage  = Math.min(lbPage, Math.max(0, Math.ceil(lbFiltered.length / LB_PER_PAGE) - 1))
  const lbRows      = lbFiltered.slice(lbSafePage * LB_PER_PAGE, (lbSafePage + 1) * LB_PER_PAGE)

  return (
    <div className="space-y-4">

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Total Clubs"       value={CLUB_ANALYTICS.length}              sub="District 5656"        subColor="muted" accent="#003DA5" />
        <StatCard label="Total Members"     value={distTotalMembers}                   sub="Across all clubs"     subColor="muted" accent="#16a34a" />
        <StatCard label="TRF Contribution"  value={fmtUSD(distTrfRaised / INR_TO_USD)} sub={`${distTrfPct}% of goal`} subColor="muted" accent="#ca8a04" />
        <StatCard label="District Citation" value={`${distCitationAvg} pts`}           sub={`${distQualified} clubs qualified`} subColor={distCitationAvg >= 40 ? 'up' : 'down'} accent="#e11d48" />
      </div>

      {/* Row 1: 4 analytical cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 items-stretch">

        {/* 1 — Membership */}
        <CardWrapper id="membership" activeCard={activeCard} setActiveCard={setActiveCard}>
          <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm">Membership</CardTitle>
                  <CardDescription className="text-xs">All {CLUB_ANALYTICS.length} clubs · RY 2025–26</CardDescription>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">+{distNewThisYear} new</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-end gap-1.5 mb-3">
                  <span className="text-4xl font-extrabold text-slate-900 tabular-nums leading-none">{distTotalMembers.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 mb-1 ml-1">total members</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label:'Active',   value: distActiveMembers,   color:'#003DA5' },
                    { label:'Male',     value: distMaleMembers,     color:'#0891b2' },
                    { label:'Female',   value: distFemaleMembers,   color:'#e11d48' },
                    { label:'Honorary', value: distHonoraryMembers, color:'#9333ea' },
                    { label:'Inactive', value: distInactiveMembers, color:'#94a3b8' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-500">{s.label}</span>
                        <span className="text-xs font-semibold tabular-nums" style={{ color: s.color }}>{s.value.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${(s.value/distTotalMembers)*100}%`, backgroundColor: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Terminated this RY</span>
                <span className="text-xs font-semibold text-slate-700">{distTerminated}</span>
              </div>
            </CardContent>
          </Card>
        </CardWrapper>

        {/* 2 — TRF Goal */}
        <CardWrapper id="trf" activeCard={activeCard} setActiveCard={setActiveCard}>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm">TRF Goal</CardTitle>
              <CardDescription className="text-xs mt-0.5">District aggregate · all clubs</CardDescription>
            </CardHeader>
            <CardContent className="pt-3 flex-1 flex flex-col justify-between">
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#fef3c7" strokeWidth="10" />
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#f59e0b" strokeWidth="10"
                      strokeDasharray={`${2*Math.PI*44*Math.min(distTrfPct,100)/100} ${2*Math.PI*44}`}
                      strokeLinecap="round" transform="rotate(-90 55 55)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-amber-600 leading-none tabular-nums">{distTrfPct}%</span>
                    <span className="text-xs text-slate-400 mt-1">of goal</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-800 mt-2 tabular-nums">{fmtUSD(distTrfRaised / INR_TO_USD)} raised</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { label:'Annual Fund',  value: distAnnualFund,      max: distTrfGoal,                  color:'#003DA5', display: fmtUSD(distAnnualFund / INR_TO_USD)       },
                  { label:'PHF Members',  value: distPhfContributors, max: CLUB_ANALYTICS.length * 25,   color:'#9333ea', display: `${distPhfContributors} members`           },
                  { label:'Major Donors', value: distMajorDonors,     max: CLUB_ANALYTICS.length * 5,    color:'#ca8a04', display: `${distMajorDonors}`                       },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-slate-500">{r.label}</span>
                      <span className="text-xs font-semibold tabular-nums" style={{ color: r.color }}>{r.display}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${Math.min((r.value/r.max)*100,100)}%`, backgroundColor: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs border-t border-slate-100 pt-3 mt-3">
                <span className="text-slate-500">Remaining to goal</span>
                <span className="font-bold text-red-600 tabular-nums">{fmtUSD((distTrfGoal - distTrfRaised) / INR_TO_USD)}</span>
              </div>
            </CardContent>
          </Card>
        </CardWrapper>

        {/* 3 — Service Projects */}
        <CardWrapper id="projects" activeCard={activeCard} setActiveCard={setActiveCard}>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Service Projects & Public Image</CardTitle>
              <CardDescription className="text-xs">Project completion this RY</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {AVENUE_BREAKDOWN.map(a => (
                  <div key={a.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700 truncate">{a.name}</span>
                      <span className="text-xs font-semibold tabular-nums ml-1" style={{ color: a.color }}>{a.completed}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width:`${(a.completed / avenueMax) * 100}%`, background: a.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Total projects</span>
                <span className="text-sm font-extrabold text-slate-800 tabular-nums">{distServiceProjects}</span>
              </div>
            </CardContent>
          </Card>
        </CardWrapper>

        {/* 4 — District Citation */}
        <CardWrapper id="citation" activeCard={activeCard} setActiveCard={setActiveCard}>
          <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm">District Citation</CardTitle>
              <CardDescription className="text-xs">Average score · all clubs</CardDescription>
            </CardHeader>
            <CardContent className="pt-3 flex-1 flex flex-col justify-between">
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                    <circle cx="55" cy="55" r="44" fill="none" stroke="#f43f5e" strokeWidth="10"
                      strokeDasharray={`${2*Math.PI*44*distCitationPct/100} ${2*Math.PI*44}`}
                      strokeLinecap="round" transform="rotate(-90 55 55)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-rose-600 leading-none tabular-nums">{distCitationAvg}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">avg / 50</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {CRITERION_AVGS.map(c => {
                  const color = c.status === 'done' ? '#16a34a' : c.status === 'partial' ? '#f59e0b' : '#ef4444'
                  return (
                    <div key={c.criterion}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="text-xs text-slate-600 truncate">{c.criterion}</span>
                        </div>
                        <span className="text-xs font-bold tabular-nums ml-2 flex-shrink-0" style={{ color }}>{c.earned}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width:`${c.pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-3 pt-3 mt-2 border-t border-slate-100">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-[11px] text-slate-500">Complete</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[11px] text-slate-500">Partial</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[11px] text-slate-500">Incomplete</span></div>
              </div>
            </CardContent>
          </Card>
        </CardWrapper>

      </div>

      {/* Row 2: Dynamic Chart + Leaderboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {activeCard === 'membership' ? 'Top 20 Clubs — Member Count'
              : activeCard === 'trf'       ? 'Top 20 Clubs — TRF Achievement %'
              : activeCard === 'projects'  ? 'Top 20 Clubs — Service Projects'
              :                             'Top 20 Clubs — Citation Score'}
            </CardTitle>
            <CardDescription className="text-xs">
              {activeCard === 'membership' ? 'Members by club (highest first)'
              : activeCard === 'trf'       ? 'TRF raised vs goal (%)'
              : activeCard === 'projects'  ? 'Total projects completed this RY'
              :                             'Citation score out of 50'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {activeCard === 'membership' && (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={top20('members', 'Members')} margin={{ left:0, right:16 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip contentStyle={{ fontSize:12, borderRadius:6 }} />
                  <Bar dataKey="Members" fill="#003DA5" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {activeCard === 'trf' && (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={top20('trfPct', 'TRF %')} margin={{ left:0, right:16 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0,100]} tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={36} unit="%" />
                  <Tooltip formatter={v => [`${v}%`, 'TRF %']} contentStyle={{ fontSize:12, borderRadius:6 }} />
                  <Bar dataKey="TRF %" radius={[4,4,0,0]}>
                    {top20('trfPct', 'TRF %').map((_, i) => (
                      <Cell key={i} fill={i < 5 ? '#16a34a' : i < 15 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            {activeCard === 'projects' && (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={top20('serviceProjects', 'Projects')} margin={{ left:0, right:16 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ fontSize:12, borderRadius:6 }} />
                  <Bar dataKey="Projects" fill="#16a34a" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {activeCard === 'citation' && (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={top20('citationScore', 'Score')} margin={{ left:0, right:16 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0,50]} tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ fontSize:12, borderRadius:6 }} />
                  <Bar dataKey="Score" radius={[4,4,0,0]}>
                    {top20('citationScore', 'Score').map((d, i) => (
                      <Cell key={i} fill={d.Score >= 40 ? '#16a34a' : d.Score >= 25 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Club Leaderboard</CardTitle>
            <div className="mt-2">
              <input value={lbSearch} onChange={e => { setLbSearch(e.target.value); setLbPage(0) }}
                placeholder="Search club..."
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-slate-400 placeholder-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {lbRows.map(c => {
                const rank     = lbFiltered.indexOf(c)
                const isTop    = rank < 5
                const isBottom = rank >= lbFiltered.length - 5
                return (
                  <div key={c.id}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${isTop ? 'bg-green-50' : isBottom ? 'bg-red-50' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs font-bold w-5 text-center flex-shrink-0 ${isTop ? 'text-green-600' : isBottom ? 'text-red-500' : 'text-slate-400'}`}>
                        {rank + 1}
                      </span>
                      <span className={`text-xs font-semibold truncate ${isTop ? 'text-green-800' : isBottom ? 'text-red-800' : 'text-slate-700'}`}>
                        {c.name}
                      </span>
                    </div>
                    <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${isTop ? 'text-green-700' : isBottom ? 'text-red-600' : 'text-slate-600'}`}>
                      {c.composite}%
                    </span>
                  </div>
                )
              })}
              {lbFiltered.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No clubs match your search.</p>
              )}
            </div>
            <Pagination page={lbSafePage} total={lbFiltered.length} perPage={LB_PER_PAGE} setPage={setLbPage} />
            {!lbSearch && ranked.filter(c => c.composite < 50).length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-red-600">
                  ⚠ {ranked.filter(c => c.composite < 50).length} club(s) below 50%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
