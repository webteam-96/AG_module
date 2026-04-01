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

const EVENT_COLORS = {
  Meeting:  { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  Service:  { bg: 'bg-red-50',    text: 'text-red-700'    },
  TRF:      { bg: 'bg-amber-50',  text: 'text-amber-700'  },
  'New Gen':{ bg: 'bg-purple-50', text: 'text-purple-700' },
  District: { bg: 'bg-slate-100', text: 'text-slate-600'  },
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

const trfPct = Math.round((CLUB_STATS.trfRaised / CLUB_STATS.trfGoal) * 100)
const citationPct = Math.round((CLUB_STATS.districtCitationScore / CLUB_STATS.districtCitationMax) * 100)

export default function Overview() {
  return (
    <div className="space-y-4">

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Total Members"     value={CLUB_STATS.totalMembers}          sub="▲ 8 new this year"        subColor="up"   accent="#003DA5" />
        <StatCard label="Avg Attendance"    value={`${CLUB_STATS.avgAttendance}%`}   sub="▲ 4% vs last month"      subColor="up"   accent="#16a34a" />
        <StatCard label="TRF Contribution"  value={fmtINR(CLUB_STATS.trfRaised)}     sub={`${trfPct}% of goal`}    subColor="muted" accent="#ca8a04" />
        <StatCard label="Service Projects"  value={CLUB_STATS.serviceProjects}       sub="▲ 3 this quarter"        subColor="up"   accent="#9333ea" />
        <StatCard label="District Citation" value={`${citationPct}%`}               sub={`${CLUB_STATS.districtCitationScore}/${CLUB_STATS.districtCitationMax} pts`} subColor="muted" accent="#e11d48" />
        <StatCard label="Active Members"    value={CLUB_STATS.activeMembers}         sub="90% of total"            subColor="muted" accent="#0891b2" />
      </div>

      {/* Row 1: 4 analytics cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">

        {/* Membership Mix Donut */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-[12px]">Membership Mix</CardTitle>
            <CardDescription className="text-[10px]">By category</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="flex items-center gap-3">
              <ResponsiveContainer width={90} height={90}>
                <PieChart>
                  <Pie data={membershipPie} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={2}>
                    {membershipPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 flex-1">
                {membershipPie.map(d => (
                  <div key={d.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                      <span className="text-[10px] text-slate-500">{d.name}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 tabular-nums">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TRF Goal */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-[12px]">TRF Goal</CardTitle>
            <CardDescription className="text-[10px]">{fmtINR(CLUB_STATS.trfGoal)} target this year</CardDescription>
          </CardHeader>
          <CardContent className="pt-3 pb-3 space-y-3">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-extrabold text-amber-600 tabular-nums">{trfPct}%</span>
              <span className="text-[10px] text-slate-400 mb-1">{fmtINR(CLUB_STATS.trfRaised)} raised</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${trfPct}%` }} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">PHF Contributors</span>
                <span className="font-semibold text-slate-700">{CLUB_STATS.phfContributors}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Remaining</span>
                <span className="font-semibold text-red-600">{fmtINR(CLUB_STATS.trfGoal - CLUB_STATS.trfRaised)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Bars */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-[12px]">Meeting Attendance</CardTitle>
            <CardDescription className="text-[10px]">Last 6 meetings</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-2">
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={ATTENDANCE_DATA} barSize={14}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Attendance']}
                  contentStyle={{ fontSize: 10, borderRadius: 6 }}
                />
                <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
                  {ATTENDANCE_DATA.map((d, i) => (
                    <Cell key={i} fill={attendanceBg(d.pct)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-3 mt-1">
              <span className="text-[9px] text-slate-400">Avg <b className="text-slate-700">{CLUB_STATS.avgAttendance}%</b></span>
              <span className="text-[9px] text-slate-400">Best <b className="text-green-600">82%</b></span>
              <span className="text-[9px] text-slate-400">Low <b className="text-red-600">60%</b></span>
            </div>
          </CardContent>
        </Card>

        {/* District Citation */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-[12px]">District Citation</CardTitle>
            <CardDescription className="text-[10px]">{CLUB_STATS.districtCitationScore} / {CLUB_STATS.districtCitationMax} points</CardDescription>
          </CardHeader>
          <CardContent className="pt-3 pb-3 space-y-2">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-extrabold text-rose-600 tabular-nums">{citationPct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-rose-500" style={{ width: `${citationPct}%` }} />
            </div>
            <div className="space-y-1 mt-2">
              {CITATION_CHECKLIST.slice(0, 3).map(c => (
                <div key={c.criterion} className="flex justify-between text-[10px]">
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

        {/* Member Growth */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-[12px]">Member Growth Trend</CardTitle>
            <CardDescription className="text-[10px]">Monthly headcount — RY 2025–26</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={MEMBER_GROWTH}>
                <defs>
                  <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#003DA5" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#003DA5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[130, 145]} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                <Area
                  type="monotone" dataKey="members" stroke="#003DA5" strokeWidth={2}
                  fill="url(#memberGrad)" dot={{ r: 3, fill: '#003DA5', strokeWidth: 1.5, stroke: 'white' }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              <span className="text-[9.5px] text-slate-400">Start of year <b className="text-slate-700">134</b></span>
              <span className="text-[9.5px] text-slate-400">New <b className="text-green-600">+{CLUB_STATS.newMembersThisYear}</b></span>
              <span className="text-[9.5px] text-slate-400">Left <b className="text-red-600">-{CLUB_STATS.terminatedThisYear}</b></span>
              <span className="text-[9.5px] text-slate-400">Net growth <b className="text-blue-700">+{((CLUB_STATS.newMembersThisYear / 134) * 100).toFixed(1)}%</b></span>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Upcoming Events</CardTitle>
            </div>
            <button className="text-[10px] text-blue-700 font-medium hover:bg-blue-50 px-2 py-1 rounded">View all</button>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-50">
            {EVENTS.map(ev => {
              const d = ev.date.split('-')[2]
              const mon = new Date(ev.date).toLocaleString('default', { month: 'short' })
              const col = EVENT_COLORS[ev.type] ?? EVENT_COLORS.District
              return (
                <div key={ev.id} className="flex gap-2.5 py-2 items-center">
                  <div className="w-9 text-center bg-slate-50 rounded-lg py-1 flex-shrink-0">
                    <p className="text-[7.5px] font-bold text-slate-400 uppercase">{mon}</p>
                    <p className="text-[15px] font-extrabold text-slate-800 leading-tight">{d}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11.5px] font-semibold text-slate-800 truncate">{ev.name}</p>
                    <p className="text-[9.5px] text-slate-400">{ev.time} · {ev.venue}</p>
                  </div>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${col.bg} ${col.text}`}>{ev.type}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Avenue progress + BOD + Announcements */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">

        {/* Avenue of Service */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Avenue of Service</CardTitle>
              <CardDescription className="text-[10px]">Project completion this RY</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {AVENUE_DATA.map(a => (
              <div key={a.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10.5px] font-medium text-slate-600">{a.name}</span>
                  <span className="text-[10px] text-slate-400 tabular-nums">{a.completed}/{a.target}</span>
                </div>
                <div className="h-[5px] bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(a.completed / a.target) * 100}%`, background: a.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Board of Directors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Board of Directors</CardTitle>
              <CardDescription className="text-[10px]">RY 2025–26</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-50">
            {BOARD.map(m => (
              <div key={m.name} className="flex items-center gap-2.5 py-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: m.color }}
                >{m.initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-semibold text-slate-800 truncate">{m.name}</p>
                  <p className="text-[9.5px] text-slate-400">{m.role}</p>
                </div>
                <span className="text-[9.5px] text-blue-700 font-medium">{m.mobile}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[12px]">Announcements</CardTitle>
            <button className="text-[10px] text-blue-700 font-medium hover:bg-blue-50 px-2 py-1 rounded">View all</button>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-50">
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} className="flex gap-2.5 py-2.5 items-start">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: ANN_COLORS[a.priority] }} />
                <div>
                  <p className="text-[10.5px] text-slate-600 leading-snug">{a.text}</p>
                  <p className="text-[9px] text-slate-400 mt-1">{a.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
