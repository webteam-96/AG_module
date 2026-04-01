import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import StatCard from '../components/StatCard'
import {
  CLUB_STATS, MEMBER_GROWTH, ATTENDANCE_DATA, AVENUE_DATA,
  ANNOUNCEMENTS, EVENTS, BOARD, CITATION_CHECKLIST, fmtINR, attendanceBg,
} from '../data/clubData'

// Import tab content components
import DirectoryTab     from './Directory'
import PastPresidents   from './PastPresidents'
import BoardOfDirectors from './BoardOfDirectors'
import Marketplace      from './Marketplace'
import WebsiteData      from './WebsiteData'
import RotaryNetwork    from './RotaryNetwork'

/* ─── Tab definitions ──────────────────────────────────────────────── */
const TABS = [
  { id: 'overview',      label: 'Overview'          },
  { id: 'directory',     label: 'Directory'         },
  { id: 'pastpresidents',label: 'Past Presidents'   },
  { id: 'board',         label: 'Board of Directors'},
  { id: 'marketplace',   label: 'Marketplace'       },
  { id: 'website',       label: 'Website Data'      },
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

const ANN_COLORS = {
  urgent: '#f59e0b',
  normal: '#003DA5',
  info:   '#16a34a',
  action: '#e11d48',
}

const membershipPie = [
  { name: 'Full',      value: CLUB_STATS.fullMembers,      fill: '#003DA5' },
  { name: 'Associate', value: CLUB_STATS.associateMembers, fill: '#60a5fa' },
  { name: 'Honorary',  value: CLUB_STATS.honoraryMembers,  fill: '#bfdbfe' },
]

const trfPct      = Math.round((CLUB_STATS.trfRaised / CLUB_STATS.trfGoal) * 100)
const citationPct = Math.round((CLUB_STATS.districtCitationScore / CLUB_STATS.districtCitationMax) * 100)

function OverviewContent({ setActiveTab }) {
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
          <button onClick={() => setActiveTab('website')} className="text-xs font-bold text-white px-3 py-1 rounded-md flex-shrink-0" style={{ backgroundColor: '#e11d48' }}>Renew Now</button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Total Members"     value={CLUB_STATS.totalMembers}          sub="▲ 8 new this year"        subColor="up"    accent="#003DA5" />
        <StatCard label="Avg Attendance"    value={`${CLUB_STATS.avgAttendance}%`}   sub="▲ 4% vs last month"       subColor="up"    accent="#16a34a" />
        <StatCard label="TRF Contribution"  value={fmtINR(CLUB_STATS.trfRaised)}     sub={`${trfPct}% of goal`}     subColor="muted" accent="#ca8a04" />
        <StatCard label="Service Projects"  value={CLUB_STATS.serviceProjects}       sub="▲ 3 this quarter"         subColor="up"    accent="#9333ea" />
        <StatCard label="District Citation" value={`${citationPct}%`}               sub={`${CLUB_STATS.districtCitationScore}/${CLUB_STATS.districtCitationMax} pts`} subColor="muted" accent="#e11d48" />
        <StatCard label="Active Members"    value={CLUB_STATS.activeMembers}         sub="90% of total"             subColor="muted" accent="#0891b2" />
      </div>

      {/* Row 1: 4 analytics cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">

        {/* Membership Mix Donut */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">Membership Mix</CardTitle>
            <CardDescription className="text-xs">By category</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="flex items-center gap-3">
              <ResponsiveContainer width={90} height={90}>
                <PieChart>
                  <Pie data={membershipPie} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={2}>
                    {membershipPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {membershipPie.map(d => (
                  <div key={d.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                      <span className="text-xs text-slate-600">{d.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 tabular-nums">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TRF Goal */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">TRF Goal</CardTitle>
            <CardDescription className="text-xs">{fmtINR(CLUB_STATS.trfGoal)} target this year</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3 space-y-3">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold text-amber-600 tabular-nums">{trfPct}%</span>
              <span className="text-xs text-slate-500 mb-1">{fmtINR(CLUB_STATS.trfRaised)} raised</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${trfPct}%` }} />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">PHF Contributors</span>
                <span className="font-semibold text-slate-700">{CLUB_STATS.phfContributors}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Remaining</span>
                <span className="font-semibold text-red-600">{fmtINR(CLUB_STATS.trfGoal - CLUB_STATS.trfRaised)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Bars */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">Meeting Attendance</CardTitle>
            <CardDescription className="text-xs">Last 6 meetings</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-2">
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={ATTENDANCE_DATA} barSize={16}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip formatter={(v) => [`${v}%`, 'Attendance']} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
                  {ATTENDANCE_DATA.map((d, i) => <Cell key={i} fill={attendanceBg(d.pct)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-3 mt-1">
              <span className="text-xs text-slate-500">Avg <b className="text-slate-700">{CLUB_STATS.avgAttendance}%</b></span>
              <span className="text-xs text-slate-500">Best <b className="text-green-600">82%</b></span>
              <span className="text-xs text-slate-500">Low <b className="text-red-600">60%</b></span>
            </div>
          </CardContent>
        </Card>

        {/* District Citation */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">District Citation</CardTitle>
            <CardDescription className="text-xs">{CLUB_STATS.districtCitationScore} / {CLUB_STATS.districtCitationMax} points</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3 space-y-2">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold text-rose-600 tabular-nums">{citationPct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-rose-500" style={{ width: `${citationPct}%` }} />
            </div>
            <div className="space-y-1.5 mt-1">
              {CITATION_CHECKLIST.slice(0, 3).map(c => (
                <div key={c.criterion} className="flex justify-between text-xs">
                  <span className="text-slate-500 truncate">{c.criterion}</span>
                  <span className={c.status === 'done' ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>
                    {c.status === 'done' ? '✓' : '~'} {c.earned}/{c.points}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Member Growth + Events */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Member Growth Trend</CardTitle>
            <CardDescription className="text-xs">Monthly headcount — RY 2026–27</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={MEMBER_GROWTH}>
                <defs>
                  <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#003DA5" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#003DA5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[130, 145]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Area type="monotone" dataKey="members" stroke="#003DA5" strokeWidth={2}
                  fill="url(#memberGrad)" dot={{ r: 3, fill: '#003DA5', strokeWidth: 1.5, stroke: 'white' }}
                  activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-slate-500">Start of year <b className="text-slate-700">134</b></span>
              <span className="text-xs text-slate-500">New <b className="text-green-600">+{CLUB_STATS.newMembersThisYear}</b></span>
              <span className="text-xs text-slate-500">Left <b className="text-red-600">-{CLUB_STATS.terminatedThisYear}</b></span>
              <span className="text-xs text-slate-500">Net growth <b className="text-blue-700">+{((CLUB_STATS.newMembersThisYear / 134) * 100).toFixed(1)}%</b></span>
            </div>
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

      {/* Row 3: Avenue + BOD + Announcements */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avenue of Service</CardTitle>
            <CardDescription className="text-xs">Project completion this RY</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {AVENUE_DATA.map(a => (
              <div key={a.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-slate-700">{a.name}</span>
                  <span className="text-xs text-slate-500 tabular-nums">{a.completed}/{a.target}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(a.completed / a.target) * 100}%`, background: a.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Board of Directors</CardTitle>
            <CardDescription className="text-xs">RY 2026–27</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-100">
            {BOARD.map(m => (
              <div key={m.name} className="flex items-center gap-3 py-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: m.color }}>{m.initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.role}</p>
                </div>
                <span className="text-xs text-blue-700 font-medium">{m.mobile}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Announcements</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-100">
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} className="flex gap-3 py-3 items-start">
                <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: ANN_COLORS[a.priority] }} />
                <div>
                  <p className="text-xs text-slate-700 leading-snug">{a.text}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{a.date}</p>
                </div>
              </div>
            ))}
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
      {activeTab === 'overview'       && <OverviewContent setActiveTab={setActiveTab} />}
      {activeTab === 'directory'      && <DirectoryTab />}
      {activeTab === 'pastpresidents' && <PastPresidents />}
      {activeTab === 'board'          && <BoardOfDirectors />}
      {activeTab === 'marketplace'    && <Marketplace />}
      {activeTab === 'website'        && <WebsiteData />}
      {activeTab === 'network'        && <RotaryNetwork />}
    </div>
  )
}
