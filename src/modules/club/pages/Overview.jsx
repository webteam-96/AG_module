import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import StatCard from '../components/StatCard'
import {
  CLUB_STATS, MEMBER_GROWTH, ATTENDANCE_DATA, AVENUE_DATA,
  EVENTS, CITATION_CHECKLIST, fmtINR, attendanceBg,
} from '../data/clubData'

// Import tab content components
import DirectoryTab     from './Directory'
import PastPresidents   from './PastPresidents'
import BoardOfDirectors from './BoardOfDirectors'
import Marketplace      from './Marketplace'
import RotaryNetwork    from './RotaryNetwork'

/* ─── Tab definitions ──────────────────────────────────────────────── */
const TABS = [
  { id: 'overview',      label: 'Overview'          },
  { id: 'directory',     label: 'Directory'         },
  { id: 'pastpresidents',label: 'Past Presidents'   },
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
  const [trfGoal, setTrfGoal] = useState(null)
  const [trfInput, setTrfInput] = useState('')
  const [serviceGoal, setServiceGoal] = useState(null)
  const [serviceInput, setServiceInput] = useState('')
  const [memberFilter, setMemberFilter] = useState('all')

  const trfPct = trfGoal ? Math.round((CLUB_STATS.trfRaised / trfGoal) * 100) : 0

  return (
    <div className="space-y-5">

      {/* Status alerts — single bar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
        {/* Rotary sync */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
          <span className="text-xs font-semibold text-amber-700 whitespace-nowrap">Rotary.org Sync: Disabled</span>
          <button className="text-xs font-bold text-white px-3 py-1 rounded-md flex-shrink-0" style={{ backgroundColor: '#ca8a04' }}>Submit</button>
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
        <StatCard label="District Citation" value={`${CLUB_STATS.districtCitationScore} pts`} sub={`of ${CLUB_STATS.districtCitationMax} max`} subColor="muted" accent="#e11d48" />
      </div>

      {/* Row 1: 4 analytics cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">

        {/* Avenue of Service */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">Avenue of Service</CardTitle>
            <CardDescription className="text-xs">Project completion this RY</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3 space-y-2.5">
            {AVENUE_DATA.map(a => (
              <div key={a.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-slate-700 truncate">{a.name}</span>
                  <span className="text-xs text-slate-500 tabular-nums ml-1">{a.completed}/{a.target}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(a.completed / a.target) * 100}%`, background: a.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* TRF Goal */}
        <Card>
          <CardHeader className="pb-1 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-sm">TRF Goal</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {trfGoal ? `${fmtINR(trfGoal)} target this year` : 'Set your contribution target'}
              </CardDescription>
            </div>
            {trfGoal && (
              <button onClick={() => { setTrfGoal(null); setTrfInput('') }} className="text-[11px] text-slate-400 hover:text-slate-600 font-medium mt-0.5 flex-shrink-0">Edit</button>
            )}
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            {trfGoal === null ? (
              <form onSubmit={e => { e.preventDefault(); if (Number(trfInput) > 0) { setTrfGoal(Number(trfInput)); setTrfInput('') } }} className="space-y-2">
                <input type="number" placeholder="Enter goal amount (₹)" value={trfInput} onChange={e => setTrfInput(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                <button type="submit" className="w-full text-sm font-bold text-white py-2 rounded-lg" style={{ background: '#ca8a04' }}>Set TRF Goal</button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-extrabold text-amber-600 tabular-nums">{trfPct}%</span>
                  <span className="text-xs text-slate-500 mb-1">{fmtINR(CLUB_STATS.trfRaised)} raised</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(trfPct, 100)}%` }} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Annual Fund</span>
                    <span className="font-semibold text-slate-700">{fmtINR(CLUB_STATS.trfAnnualFund)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Polio Plus</span>
                    <span className="font-semibold text-slate-700">{fmtINR(CLUB_STATS.trfPolioPlus)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">PHF</span>
                    <span className="font-semibold text-slate-700">{CLUB_STATS.phfContributors} contributors</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">PHS</span>
                    <span className="font-semibold text-slate-700">{CLUB_STATS.trfPHS} members</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Major Donor</span>
                    <span className="font-semibold text-slate-700">{CLUB_STATS.trfMajorDonors}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-slate-100 pt-1.5 mt-0.5">
                    <span className="text-slate-500">Remaining</span>
                    <span className="font-semibold text-red-600">{fmtINR(trfGoal - CLUB_STATS.trfRaised)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meeting Attendance */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">Meeting Attendance</CardTitle>
                <CardDescription className="text-xs">Last 6 sessions</CardDescription>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">▲ 4% YoY</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            {/* Big avg stat */}
            <div className="flex items-end gap-1.5 mb-3">
              <span className="text-4xl font-extrabold text-slate-900 tabular-nums leading-none">{CLUB_STATS.avgAttendance}</span>
              <span className="text-lg font-bold text-slate-400 mb-0.5">%</span>
              <span className="text-xs text-slate-400 mb-1 ml-1">avg</span>
            </div>
            {/* Session bars — custom HTML */}
            <div className="flex items-end gap-1.5 h-14 mb-2">
              {ATTENDANCE_DATA.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: attendanceBg(d.pct) }}>{d.pct}</span>
                  <div className="w-full rounded-t-sm" style={{ height: `${(d.pct / 100) * 36}px`, backgroundColor: attendanceBg(d.pct), minHeight: 4 }} />
                </div>
              ))}
            </div>
            <div className="flex items-end gap-1.5">
              {ATTENDANCE_DATA.map((d, i) => (
                <div key={i} className="flex-1 text-center">
                  <span className="text-[9px] text-slate-400 leading-none">{d.date.split(' ')[1]}</span>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex gap-3 mt-3 pt-2.5 border-t border-slate-100">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-[11px] text-slate-500">Good ≥75%</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[11px] text-slate-500">Avg ≥65%</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[11px] text-slate-500">Low</span></div>
            </div>
          </CardContent>
        </Card>

        {/* District Citation */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">District Citation</CardTitle>
                <CardDescription className="text-xs">RY 2026–27 scorecard</CardDescription>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">{citationPct}%</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            {/* Ring + score */}
            <div className="flex items-center gap-4 mb-3">
              <div className="relative flex-shrink-0">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#f43f5e" strokeWidth="7"
                    strokeDasharray={`${2 * Math.PI * 28 * citationPct / 100} ${2 * Math.PI * 28}`}
                    strokeLinecap="round" transform="rotate(-90 36 36)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-extrabold text-rose-600 leading-none tabular-nums">{CLUB_STATS.districtCitationScore}</span>
                  <span className="text-[9px] text-slate-400 leading-none mt-0.5">/{CLUB_STATS.districtCitationMax}</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {CITATION_CHECKLIST.map(c => (
                  <div key={c.criterion} className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: c.status === 'done' ? '#16a34a' : c.status === 'partial' ? '#f59e0b' : '#ef4444' }} />
                      <span className="text-[11px] text-slate-600 truncate">{c.criterion.split(' ')[0]}</span>
                    </div>
                    <span className="text-[11px] font-bold tabular-nums flex-shrink-0"
                      style={{ color: c.status === 'done' ? '#16a34a' : c.status === 'partial' ? '#f59e0b' : '#ef4444' }}>
                      {c.earned}/{c.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-[11px] text-slate-500">Complete</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[11px] text-slate-500">Partial</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[11px] text-slate-500">Incomplete</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Member Growth + Events */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-sm">Membership</CardTitle>
                <CardDescription className="text-xs">RY 2026–27 analysis</CardDescription>
              </div>
              {/* Filter tabs */}
              <div className="flex gap-1 flex-wrap">
                {[
                  { key: 'all',      label: 'All',       color: '#003DA5' },
                  { key: 'male',     label: 'Male',      color: '#0891b2' },
                  { key: 'female',   label: 'Female',    color: '#e11d48' },
                  { key: 'honorary', label: 'Honorary',  color: '#9333ea' },
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
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: 'Male',     value: 95, new: 5, color: '#0891b2', key: 'male'     },
                { label: 'Female',   value: 28, new: 3, color: '#e11d48', key: 'female'   },
                { label: 'Honorary', value: 19, new: 0, color: '#9333ea', key: 'honorary' },
              ].map(s => (
                <div key={s.key}
                  onClick={() => setMemberFilter(memberFilter === s.key ? 'all' : s.key)}
                  className="rounded-lg px-3 py-2 cursor-pointer transition-all border"
                  style={memberFilter === s.key || memberFilter === 'all'
                    ? { borderColor: s.color, background: s.color + '10' }
                    : { borderColor: '#e2e8f0', background: '#f8fafc', opacity: 0.5 }}>
                  <p className="text-xs font-medium text-slate-500">{s.label}</p>
                  <p className="text-xl font-extrabold tabular-nums leading-tight" style={{ color: s.color }}>{s.value}</p>
                  {s.new > 0 && <p className="text-[10px] text-green-600 font-semibold">+{s.new} new</p>}
                  {s.new === 0 && <p className="text-[10px] text-slate-400">No change</p>}
                </div>
              ))}
            </div>
            {/* Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={MEMBER_GROWTH}>
                <defs>
                  {[
                    { id: 'gradMale', color: '#0891b2' },
                    { id: 'gradFem',  color: '#e11d48' },
                    { id: 'gradHon',  color: '#9333ea' },
                  ].map(g => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={g.color} stopOpacity={0.12} />
                      <stop offset="100%" stopColor={g.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                {[
                  { key: 'male',     stroke: '#0891b2', fill: 'url(#gradMale)', name: 'Male'     },
                  { key: 'female',   stroke: '#e11d48', fill: 'url(#gradFem)',  name: 'Female'   },
                  { key: 'honorary', stroke: '#9333ea', fill: 'url(#gradHon)',  name: 'Honorary' },
                ].map(({ key, stroke, fill, name }) => {
                  const active = memberFilter === 'all' || memberFilter === key
                  return (
                    <Area key={key} type="monotone" dataKey={key} stroke={stroke} name={name}
                      strokeWidth={active ? 2.5 : 1}
                      strokeOpacity={active ? 1 : 0.2}
                      fill={active ? fill : 'transparent'}
                      dot={active ? { r: 3, fill: stroke, strokeWidth: 1.5, stroke: 'white' } : false}
                      activeDot={{ r: 5 }} />
                  )
                })}
              </AreaChart>
            </ResponsiveContainer>
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
      {activeTab === 'pastpresidents' && <PastPresidents />}
      {activeTab === 'board'          && <BoardOfDirectors />}
      {activeTab === 'marketplace'    && <Marketplace />}
      {activeTab === 'network'        && <RotaryNetwork />}
    </div>
  )
}
