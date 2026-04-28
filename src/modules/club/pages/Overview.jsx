import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  AreaChart, Area,
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import StatCard from '../components/StatCard'
import {
  CLUB_STATS, MEMBER_GROWTH, ATTENDANCE_DATA, AVENUE_DATA,
  EVENTS, CITATION_CHECKLIST, fmtINR, attendanceBg,
} from '../data/clubData'

// Import tab content components
import DirectoryTab     from './Directory'
import BoardOfDirectors from './BoardOfDirectors'
import Marketplace      from './Marketplace'
import RotaryNetwork    from './RotaryNetwork'

/* ─── Tab definitions ──────────────────────────────────────────────── */
const TABS = [
  { id: 'overview',      label: 'Overview'          },
  { id: 'directory',     label: 'Directory'         },
  { id: 'board',         label: 'Board of Directors'},
  { id: 'marketplace',   label: 'Marketplace'       },
  { id: 'network',       label: 'Rotary Network'    },
]

/* ─── Overview tab content ─────────────────────────────────────────── */
const EVENT_COLORS = {
  Meeting:   { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  Service:   { bg: 'bg-red-50',    text: 'text-red-700'    },
  TRF:       { bg: 'bg-amber-50',  text: 'text-amber-700'  },
  'New Gen': { bg: 'bg-purple-50', text: 'text-purple-700' },
  District:  { bg: 'bg-slate-100', text: 'text-slate-600'  },
}



const citationPct = Math.round((CLUB_STATS.districtCitationScore / CLUB_STATS.districtCitationMax) * 100)

function OverviewContent() {
  const navigate = useNavigate()
  const [trfGoal, setTrfGoal] = useState(CLUB_STATS.trfGoal)
  const [trfInput, setTrfInput] = useState('')
  const [serviceGoal, setServiceGoal] = useState(null)
  const [serviceInput, setServiceInput] = useState('')
  const [memberFilter, setMemberFilter] = useState('all')
  const [activeCard, setActiveCard]     = useState('membership')

  const trfPct = trfGoal ? Math.round((CLUB_STATS.trfRaised / trfGoal) * 100) : 0

  /* ── Card click wrapper ─────────────────────────────────────────── */
  function CardWrapper({ id, children }) {
    const isActive = activeCard === id
    return (
      <div
        onClick={() => setActiveCard(id)}
        className="cursor-pointer rounded-[inherit] transition-all"
        style={isActive ? { outline: '2px solid #003DA5', outlineOffset: '2px', borderRadius: '0.75rem' } : {}}
      >
        {children}
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Status alerts — single bar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
        {/* Rotary sync */}
        <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
          <span className="text-xs font-semibold text-amber-700 whitespace-nowrap">Rotary.org Sync: Disabled</span>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <span className="text-xs text-amber-600">
            To enable: go to <span className="font-semibold">rotary.org</span> → My Rotary → Club Administration → Enable Data Sync → enter your Club ID
          </span>
        </div>
        <div className="w-px h-5 bg-slate-300 flex-shrink-0 hidden sm:block" />
        {/* Website overdue */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <span className="text-xs font-semibold text-red-700 whitespace-nowrap">Integrated Club Website: Over Due</span>
          <span className="text-xs text-red-400 whitespace-nowrap">· Expiry 31/01/2026</span>
          <button onClick={() => navigate('/clubdashboard/website')} className="text-xs font-bold text-white px-3 py-1 rounded-md flex-shrink-0" style={{ backgroundColor: '#e11d48' }}>Renew Now</button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatCard label="Total Members"     value={CLUB_STATS.totalMembers}          sub="▲ 8 new this year"        subColor="up"    accent="#003DA5" />
        <StatCard label="Avg Attendance"    value={`${CLUB_STATS.avgAttendance}%`}   sub="▲ 4% vs last month"       subColor="up"    accent="#16a34a" />
        {trfGoal === null ? (
          <div className="bg-white rounded-xl border border-dashed border-amber-300 px-4 py-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: '#ca8a04' }} />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">TRF Contribution</p>
            <p className="text-sm text-amber-600 font-medium">Goal not set</p>
            <form onSubmit={e => { e.preventDefault(); if (Number(trfInput) > 0) { setTrfGoal(Number(trfInput)); setTrfInput('') } }} className="flex gap-1.5 mt-2">
              <input type="number" placeholder="₹ amount" value={trfInput} onChange={e => setTrfInput(e.target.value)} className="flex-1 min-w-0 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-400" />
              <button type="submit" className="text-xs font-bold text-white px-2 py-1 rounded flex-shrink-0" style={{ background: '#ca8a04' }}>Set</button>
            </form>
          </div>
        ) : (
          <StatCard label="TRF Contribution" value={fmtINR(CLUB_STATS.trfRaised)} sub={`${trfPct}% of ${fmtINR(trfGoal)}`} subColor="muted" accent="#ca8a04" />
        )}
        {serviceGoal === null ? (
          <div className="bg-white rounded-xl border border-dashed border-purple-300 px-4 py-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: '#9333ea' }} />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Service Projects</p>
            <p className="text-sm text-purple-600 font-medium">Goal not set</p>
            <form onSubmit={e => { e.preventDefault(); if (Number(serviceInput) > 0) { setServiceGoal(Number(serviceInput)); setServiceInput('') } }} className="flex gap-1.5 mt-2">
              <input type="number" placeholder="No. of projects" value={serviceInput} onChange={e => setServiceInput(e.target.value)} className="flex-1 min-w-0 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-purple-400" />
              <button type="submit" className="text-xs font-bold text-white px-2 py-1 rounded flex-shrink-0" style={{ background: '#9333ea' }}>Set</button>
            </form>
          </div>
        ) : (
          <StatCard label="Service Projects" value={`${CLUB_STATS.serviceProjects}/${serviceGoal}`} sub="▲ 3 this quarter" subColor="up" accent="#9333ea" />
        )}
        <StatCard label="District Citation" value={`${CLUB_STATS.districtCitationScore} pts`} accent="#e11d48" />
      </div>

      {/* Row 1: 4 analytics cards — equal height */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 items-stretch">

        {/* 1 — Membership */}
        <CardWrapper id="membership"><Card className="h-full flex flex-col overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">Membership</CardTitle>
                <CardDescription className="text-xs">RY 2026–27 snapshot</CardDescription>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">+{CLUB_STATS.newMembersThisYear} new</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-end gap-1.5 mb-3">
                <span className="text-4xl font-extrabold text-slate-900 tabular-nums leading-none">{CLUB_STATS.totalMembers}</span>
                <span className="text-xs text-slate-400 mb-1 ml-1">total members</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label:'Active',    value: CLUB_STATS.activeMembers,                           color:'#003DA5' },
                  { label:'Male',      value: 95,                                                 color:'#0891b2' },
                  { label:'Female',    value: 28,                                                 color:'#e11d48' },
                  { label:'Honorary',  value: CLUB_STATS.honoraryMembers,                         color:'#9333ea' },
                  { label:'Associate', value: CLUB_STATS.associateMembers,                        color:'#0891b2' },
                  { label:'Inactive',  value: CLUB_STATS.totalMembers - CLUB_STATS.activeMembers, color:'#94a3b8' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-slate-500">{s.label}</span>
                      <span className="text-xs font-semibold tabular-nums" style={{ color: s.color }}>{s.value}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${(s.value/CLUB_STATS.totalMembers)*100}%`, backgroundColor: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Terminated this RY</span>
              <span className="text-xs font-semibold text-slate-700">{CLUB_STATS.terminatedThisYear}</span>
            </div>
          </CardContent>
        </Card></CardWrapper>

        {/* 2 — TRF Goal */}
        <CardWrapper id="trf"><Card className="h-full flex flex-col">
          <CardHeader className="pb-0 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-sm">TRF Goal</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {trfGoal ? `${fmtINR(trfGoal)} target this year` : 'Set your contribution target'}
              </CardDescription>
            </div>
            {trfGoal && (
              <button onClick={e => { e.stopPropagation(); setTrfGoal(null); setTrfInput('') }}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-medium mt-0.5 flex-shrink-0">Edit</button>
            )}
          </CardHeader>
          <CardContent className="pt-3 flex-1 flex flex-col justify-between">
            {trfGoal === null ? (
              <form onSubmit={e => { e.preventDefault(); if (Number(trfInput) > 0) { setTrfGoal(Number(trfInput)); setTrfInput('') } }}
                className="flex-1 flex flex-col justify-center space-y-3">
                <input type="number" placeholder="Enter goal amount (₹)" value={trfInput}
                  onChange={e => setTrfInput(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                <button type="submit" className="w-full text-sm font-bold text-white py-2.5 rounded-lg" style={{ background:'#ca8a04' }}>
                  Set TRF Goal
                </button>
              </form>
            ) : (
              <>
                <div className="flex flex-col items-center mb-4">
                  <div className="relative">
                    <svg width="110" height="110" viewBox="0 0 110 110">
                      <circle cx="55" cy="55" r="44" fill="none" stroke="#fef3c7" strokeWidth="10" />
                      <circle cx="55" cy="55" r="44" fill="none" stroke="#f59e0b" strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 44 * Math.min(trfPct,100) / 100} ${2 * Math.PI * 44}`}
                        strokeLinecap="round" transform="rotate(-90 55 55)" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-amber-600 leading-none tabular-nums">{trfPct}%</span>
                      <span className="text-xs text-slate-400 mt-1">of goal</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-800 mt-2 tabular-nums">{fmtINR(CLUB_STATS.trfRaised)} raised</p>
                </div>
                <div className="flex-1 space-y-2.5">
                  {[
                    { label:'Annual Fund',  value: CLUB_STATS.trfAnnualFund,   max: CLUB_STATS.trfGoal, color:'#003DA5', display: fmtINR(CLUB_STATS.trfAnnualFund)       },
                    { label:'PHF',          value: CLUB_STATS.phfContributors, max: 30,                 color:'#9333ea', display: `${CLUB_STATS.phfContributors} members` },
                    { label:'PHSM',         value: CLUB_STATS.trfPhsm,         max: 5,                  color:'#0891b2', display: `${CLUB_STATS.trfPhsm} members`         },
                    { label:'Major Donors', value: CLUB_STATS.trfMajorDonors,  max: 5,                  color:'#ca8a04', display: `${CLUB_STATS.trfMajorDonors}`          },
                    { label:'EPF',          value: CLUB_STATS.trfEPF,          max: 5,                  color:'#f59e0b', display: `${CLUB_STATS.trfEPF}`                   },
                    { label:'Endowment',    value: CLUB_STATS.trfEndowment,    max: 5,                  color:'#e11d48', display: `${CLUB_STATS.trfEndowment}`             },
                  ].map(r => (
                    <div key={r.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-500">{r.label}</span>
                        <span className="text-xs font-semibold tabular-nums" style={{ color: r.color }}>{r.display}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width:`${Math.min((r.value/r.max)*100,100)}%`, backgroundColor: r.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs border-t border-slate-100 pt-3 mt-3">
                  <span className="text-slate-500">Remaining to goal</span>
                  <span className="font-bold text-red-600 tabular-nums">{fmtINR(trfGoal - CLUB_STATS.trfRaised)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card></CardWrapper>

        {/* 3 — Service Projects */}
        <CardWrapper id="avenue"><Card className="h-full flex flex-col">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">Service Projects & Public Image</CardTitle>
            <CardDescription className="text-xs">Project completion this RY</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              {AVENUE_DATA.map(a => (
                <div key={a.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 truncate">{a.name}</span>
                    <span className="text-xs font-semibold tabular-nums ml-1" style={{ color: a.color }}>{a.completed}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${(a.completed / a.target) * 100}%`, background: a.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Total projects</span>
              <span className="text-sm font-extrabold text-slate-800 tabular-nums">
                {AVENUE_DATA.reduce((s, a) => s + a.completed, 0)}
              </span>
            </div>
          </CardContent>
        </Card></CardWrapper>

        {/* 4 — District Citation */}
        <CardWrapper id="citation"><Card className="h-full flex flex-col overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm">District Citation</CardTitle>
            <CardDescription className="text-xs">RY 2026–27 scorecard</CardDescription>
          </CardHeader>
          <CardContent className="pt-3 flex-1 flex flex-col justify-between">
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="44" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle cx="55" cy="55" r="44" fill="none" stroke="#f43f5e" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 44 * citationPct / 100} ${2 * Math.PI * 44}`}
                    strokeLinecap="round" transform="rotate(-90 55 55)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-rose-600 leading-none tabular-nums">{CLUB_STATS.districtCitationScore}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {CITATION_CHECKLIST.map(c => {
                const color = c.status === 'done' ? '#16a34a' : c.status === 'partial' ? '#f59e0b' : '#ef4444'
                const pct   = Math.round((c.earned / c.points) * 100)
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
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
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
        </Card></CardWrapper>
      </div>

      {/* Row 2: Dynamic chart + Events */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-sm">
                  { activeCard === 'avenue'    ? 'Service Projects & Public Image'
                  : activeCard === 'trf'       ? 'TRF Contribution — Breakdown'
                  : activeCard === 'membership'? 'Membership — Growth Analysis'
                  :                             'District Citation — Scorecard' }
                </CardTitle>
                <CardDescription className="text-xs">
                  { activeCard === 'avenue'    ? 'Completed projects per avenue this RY'
                  : activeCard === 'trf'       ? 'Fund-wise contribution vs goal'
                  : activeCard === 'membership'? 'RY 2026–27 member trend'
                  :                             'Points earned per criterion' }
                </CardDescription>
              </div>
              {/* Membership filter tabs (only visible for membership card) */}
              {activeCard === 'membership' && (
                <div className="flex gap-1 flex-wrap">
                  {[
                    { key:'all',      label:'All',      color:'#003DA5' },
                    { key:'male',     label:'Male',     color:'#0891b2' },
                    { key:'female',   label:'Female',   color:'#e11d48' },
                    { key:'honorary', label:'Honorary', color:'#9333ea' },
                  ].map(f => (
                    <button key={f.key} onClick={() => setMemberFilter(f.key)}
                      className="px-3 py-1 rounded-md text-xs font-semibold transition-all"
                      style={memberFilter === f.key
                        ? { backgroundColor: f.color, color: '#fff' }
                        : { backgroundColor: '#f1f5f9', color: '#64748b' }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">

            {/* ── MEMBERSHIP chart ─────────────────────────────── */}
            {activeCard === 'membership' && (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label:'Male',     value:95, new:5, color:'#0891b2', key:'male'     },
                    { label:'Female',   value:28, new:3, color:'#e11d48', key:'female'   },
                    { label:'Honorary', value:19, new:0, color:'#9333ea', key:'honorary' },
                  ].map(s => (
                    <div key={s.key} onClick={() => setMemberFilter(memberFilter === s.key ? 'all' : s.key)}
                      className="rounded-lg px-3 py-2 cursor-pointer transition-all border"
                      style={memberFilter === s.key || memberFilter === 'all'
                        ? { borderColor: s.color, background: s.color + '10' }
                        : { borderColor: '#e2e8f0', background: '#f8fafc', opacity: 0.5 }}>
                      <p className="text-xs font-medium text-slate-500">{s.label}</p>
                      <p className="text-xl font-extrabold tabular-nums leading-tight" style={{ color: s.color }}>{s.value}</p>
                      {s.new > 0 ? <p className="text-[10px] text-green-600 font-semibold">+{s.new} new</p>
                                 : <p className="text-[10px] text-slate-400">No change</p>}
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={MEMBER_GROWTH}>
                    <defs>
                      {[['gradMale','#0891b2'],['gradFem','#e11d48'],['gradHon','#9333ea']].map(([id,c]) => (
                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={c} stopOpacity={0.12} />
                          <stop offset="100%" stopColor={c} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ fontSize:12, borderRadius:6 }} />
                    {[
                      { key:'male',     stroke:'#0891b2', fill:'url(#gradMale)', name:'Male'     },
                      { key:'female',   stroke:'#e11d48', fill:'url(#gradFem)',  name:'Female'   },
                      { key:'honorary', stroke:'#9333ea', fill:'url(#gradHon)',  name:'Honorary' },
                    ].map(({ key, stroke, fill, name }) => {
                      const on = memberFilter === 'all' || memberFilter === key
                      return (
                        <Area key={key} type="monotone" dataKey={key} stroke={stroke} name={name}
                          strokeWidth={on ? 2.5 : 1} strokeOpacity={on ? 1 : 0.2}
                          fill={on ? fill : 'transparent'}
                          dot={on ? { r:3, fill:stroke, strokeWidth:1.5, stroke:'white' } : false}
                          activeDot={{ r:5 }} />
                      )
                    })}
                  </AreaChart>
                </ResponsiveContainer>
              </>
            )}

            {/* ── AVENUE OF SERVICE chart ───────────────────────── */}
            {activeCard === 'avenue' && (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={AVENUE_DATA} layout="vertical" margin={{ left:8, right:24 }}>
                  <CartesianGrid horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={130} tick={{ fontSize:11, fill:'#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize:12, borderRadius:6 }} />
                  <Bar dataKey="completed" name="Completed" radius={[0,4,4,0]}>
                    {AVENUE_DATA.map((a, i) => <Cell key={i} fill={a.color} />)}
                  </Bar>
                  <Bar dataKey="target" name="Target" radius={[0,4,4,0]} fill="#f1f5f9" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* ── TRF chart ─────────────────────────────────────── */}
            {activeCard === 'trf' && (() => {
              const trfData = [
                { name:'Annual Fund', value: CLUB_STATS.trfAnnualFund,                                                      color:'#003DA5' },
                { name:'PHF / PHSM',  value: (CLUB_STATS.phfContributors + CLUB_STATS.trfPhsm) * 10000,                    color:'#9333ea' },
                { name:'EPF / Endow', value: CLUB_STATS.trfRaised - CLUB_STATS.trfAnnualFund - (CLUB_STATS.phfContributors + CLUB_STATS.trfPhsm) * 10000, color:'#f59e0b' },
              ]
              return (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {trfData.map(t => (
                      <div key={t.name} className="rounded-lg px-3 py-2 border border-slate-100" style={{ background: t.color + '10' }}>
                        <p className="text-[11px] text-slate-500">{t.name}</p>
                        <p className="text-lg font-extrabold tabular-nums" style={{ color: t.color }}>{fmtINR(t.value)}</p>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={trfData} margin={{ left:0, right:16 }}>
                      <CartesianGrid vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={48} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ fontSize:12, borderRadius:6 }} formatter={v => fmtINR(v)} />
                      <Bar dataKey="value" name="Amount" radius={[4,4,0,0]}>
                        {trfData.map((t, i) => <Cell key={i} fill={t.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )
            })()}

            {/* ── DISTRICT CITATION chart ───────────────────────── */}
            {activeCard === 'citation' && (() => {
              const citData = CITATION_CHECKLIST.map(c => ({
                name:   c.criterion.split(' ')[0],
                earned: c.earned,
                max:    c.points,
                color:  c.status === 'done' ? '#16a34a' : c.status === 'partial' ? '#f59e0b' : '#ef4444',
              }))
              return (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={citData} margin={{ left:0, right:16 }}>
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip contentStyle={{ fontSize:12, borderRadius:6 }} />
                    <Legend wrapperStyle={{ fontSize:11 }} />
                    <Bar dataKey="earned" name="Earned" radius={[4,4,0,0]}>
                      {citData.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Bar>
                    <Bar dataKey="max" name="Max" fill="#f1f5f9" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )
            })()}

          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-100">
            {EVENTS.map(ev => {
              const d   = ev.date.split('-')[2]
              const mon = new Date(ev.date).toLocaleString('default', { month: 'short' })
              const col = EVENT_COLORS[ev.type] ?? EVENT_COLORS.District
              return (
                <div key={ev.id} className="flex gap-3 py-2.5 items-center">
                  <div className="w-10 text-center bg-slate-50 rounded-lg py-1 flex-shrink-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{mon}</p>
                    <p className="text-base font-extrabold text-slate-800 leading-tight">{d}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{ev.name}</p>
                    <p className="text-xs text-slate-400">{ev.time} · {ev.venue}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${col.bg} ${col.text}`}>{ev.type}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

/* ─── Main export ──────────────────────────────────────────────────── */
export default function Overview() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-0">

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap mb-5 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-[#1e3a5f] shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            style={activeTab === tab.id ? { backgroundColor: '#F7A81B' } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview'       && <OverviewContent />}
      {activeTab === 'directory'      && <DirectoryTab />}
      {activeTab === 'board'          && <BoardOfDirectors />}
      {activeTab === 'marketplace'    && <Marketplace />}
      {activeTab === 'network'        && <RotaryNetwork />}
    </div>
  )
}
