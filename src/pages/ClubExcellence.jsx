import { useState, useMemo } from 'react'
import {
  Target, Award, TrendingUp, Users, Star,
  CheckCircle2, Clock, AlertCircle, BarChart2,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import KPICard from '@/components/KPICard'
import SectionHeader from '@/components/SectionHeader'
import { CLUBS, AG_TOTALS } from '@/data/realData'

// ─── Colours ──────────────────────────────────────────────────────────────────
const CLUB_COLORS = ['#003DA5', '#0070C0', '#00B0F0', '#00B050']
const GREEN  = '#059669'
const AMBER  = '#D97706'
const RED    = '#DC2626'

// ─── INR formatter ────────────────────────────────────────────────────────────
const fmtINR = (v) => {
  if (!v && v !== 0) return '—'
  const n = Math.round(Number(v))
  const s = n.toString()
  if (s.length <= 3) return `₹${s}`
  const last3   = s.slice(-3)
  const rest    = s.slice(0, -3)
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return `₹${grouped},${last3}`
}

// ─── District Citation Data ───────────────────────────────────────────────────
// Scores are realistic approximations; category breakdown sums to total
const CITATION_DATA = [
  {
    id: 15530,
    name: 'Navi Mumbai',
    total: 8200,
    membership:   1400,
    trf:          1200,
    service:      2100,
    publicImage:   900,
    youth:         800,
    foundation:   1800,
  },
  {
    id: 224356,
    name: 'NM Flamingo City',
    total: 5400,
    membership:    800,
    trf:           900,
    service:      1300,
    publicImage:   500,
    youth:         400,
    foundation:   1500,
  },
  {
    id: 84127,
    name: 'NM-Palm Beach',
    total: 11800,
    membership:   1800,
    trf:          2200,
    service:      3000,
    publicImage:  1300,
    youth:        1400,
    foundation:   2100,
  },
  {
    id: 30081,
    name: 'New Bombay Seaside',
    total: 14200,
    membership:   2200,
    trf:          2600,
    service:      3600,
    publicImage:  1600,
    youth:        1700,
    foundation:   2500,
  },
]

const CITATION_CATEGORIES = [
  { key: 'membership',  label: 'Membership',     color: CLUB_COLORS[0] },
  { key: 'trf',         label: 'TRF',            color: CLUB_COLORS[1] },
  { key: 'service',     label: 'Service',         color: CLUB_COLORS[2] },
  { key: 'publicImage', label: 'Public Image',    color: '#F59E0B' },
  { key: 'youth',       label: 'Youth',           color: '#8B5CF6' },
  { key: 'foundation',  label: 'Foundation',      color: '#EC4899' },
]

// ─── Goals targets & per-club actuals (derived from real data where possible) ─
// membership_growth_pct, trf_per_capita_usd, service_projects, meeting_attendance_pct,
// myrotary_pct, new_members_count
function buildGoalsData() {
  return CLUBS.map((club) => {
    // TRF per capita (real)
    const trfPerCapita = club.trf.totalUSD / club.members

    // Meeting attendance: use average of real records where available
    let attendancePct = 0
    const validRecs = (club.meetingRecords || []).filter((r) => r.attendancePct != null)
    if (validRecs.length > 0) {
      attendancePct = validRecs.reduce((s, r) => s + r.attendancePct, 0) / validRecs.length
    } else {
      // Estimate from monthly CMR meetings vs members
      const totalMeetings = club.monthly.reduce((s, m) => s + m.meetings, 0)
      // Use sensible dummy based on club activity
      const activityRatio = Math.min(totalMeetings / 36, 1)   // max 36 meetings/yr
      attendancePct = 35 + activityRatio * 30                 // range 35-65%
    }

    // Service projects actual vs target of 12
    const projectsActual = club.totalProjects

    // Membership growth % — dummy realistic
    const membershipGrowthDummy = {
      15530:  3.2,   // behind
      224356: 1.8,   // behind
      84127:  5.6,   // on track / achieved
      30081:  7.2,   // achieved
    }

    // New members actual (dummy)
    const newMembersDummy = {
      15530:  2,
      224356: 1,
      84127:  3,
      30081:  5,
    }

    // MyRotary registrations % (dummy)
    const myRotaryDummy = {
      15530:  68,
      224356: 45,
      84127:  82,
      30081:  91,
    }

    return {
      id:              club.id,
      name:            club.name,
      members:         club.members,
      membershipGrowth: membershipGrowthDummy[club.id] ?? 4,
      trfPerCapita:    parseFloat(trfPerCapita.toFixed(1)),
      serviceProjects: projectsActual,
      meetingAttendance: parseFloat(attendancePct.toFixed(1)),
      myRotary:        myRotaryDummy[club.id] ?? 60,
      newMembers:      newMembersDummy[club.id] ?? 2,
    }
  })
}

const GOALS = [
  { key: 'membershipGrowth',  label: 'Membership Growth',       target: 5,   unit: '%',  higher: true  },
  { key: 'trfPerCapita',      label: 'TRF Per Capita',          target: 100, unit: 'USD', higher: true  },
  { key: 'serviceProjects',   label: 'Service Projects',         target: 12,  unit: '',   higher: true  },
  { key: 'meetingAttendance', label: 'Meeting Attendance',       target: 60,  unit: '%',  higher: true  },
  { key: 'myRotary',          label: 'MyRotary Registrations',  target: 80,  unit: '%',  higher: true  },
  { key: 'newMembers',        label: 'New Members',              target: 3,   unit: '',   higher: true  },
]

// ─── Award Excellence Status ──────────────────────────────────────────────────
// green = achieved, yellow = on-track, red = behind
const AWARD_STATUS = {
  15530: {
    clubOfYear:        'on-track',
    presidentialCitation: 'achieved',
    districtCitation:  'on-track',
    membershipExcellence: 'behind',
  },
  224356: {
    clubOfYear:        'behind',
    presidentialCitation: 'behind',
    districtCitation:  'behind',
    membershipExcellence: 'behind',
  },
  84127: {
    clubOfYear:        'on-track',
    presidentialCitation: 'achieved',
    districtCitation:  'achieved',
    membershipExcellence: 'on-track',
  },
  30081: {
    clubOfYear:        'achieved',
    presidentialCitation: 'achieved',
    districtCitation:  'achieved',
    membershipExcellence: 'achieved',
  },
}

const AWARD_DEFS = [
  { key: 'clubOfYear',            label: 'Club of the Year' },
  { key: 'presidentialCitation',  label: 'Presidential Citation' },
  { key: 'districtCitation',      label: 'District Citation' },
  { key: 'membershipExcellence',  label: 'Membership Excellence' },
]

// ─── Monthly tracking chart data ──────────────────────────────────────────────
const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

function buildMonthlyChartData(metric) {
  return MONTHS.map((m, i) => {
    const row = { month: m }
    CLUBS.forEach((club) => {
      row[club.name] = club.monthly[i]?.[metric] ?? 0
    })
    return row
  })
}

// ─── Helper: status colour & icon ────────────────────────────────────────────
function StatusChip({ status }) {
  const cfg = {
    achieved:  { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300',  icon: <CheckCircle2 size={11} />, label: 'Achieved'  },
    'on-track':{ bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-300',  icon: <Clock       size={11} />, label: 'On Track'  },
    behind:    { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300',    icon: <AlertCircle size={11} />, label: 'Behind'    },
  }
  const c = cfg[status] ?? cfg.behind
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      {c.icon} {c.label}
    </span>
  )
}

// ─── Progress bar with colour ──────────────────────────────────────────────────
function GoalBar({ label, value, target, unit, higher }) {
  const pct    = higher ? Math.min((value / target) * 100, 150) : Math.min((target / value) * 100, 150)
  const clamp  = Math.min(pct, 100)
  const color  = pct >= 100 ? GREEN : pct >= 60 ? AMBER : RED
  const status = pct >= 100 ? 'achieved' : pct >= 60 ? 'on-track' : 'behind'

  const display = unit === 'USD'
    ? `$${value.toFixed(0)}`
    : unit === '%'
    ? `${value.toFixed(1)}%`
    : `${value}`

  const targetDisplay = unit === 'USD'
    ? `$${target}`
    : unit === '%'
    ? `${target}%`
    : `${target}`

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className="text-xs text-slate-500 shrink-0 ml-2">
          {display}
          <span className="text-slate-400"> / {targetDisplay}</span>
        </span>
      </div>
      <div className="relative">
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${clamp}%`, background: color }}
          />
        </div>
        {status === 'achieved' && (
          <span className="absolute right-0 -top-0.5 text-green-500 text-[10px] font-bold">✓</span>
        )}
      </div>
    </div>
  )
}

// ─── Section 1 : District Citation Scores ────────────────────────────────────
function CitationScoresSection() {
  const barData = CITATION_DATA.map((c) => ({
    name:  c.name,
    total: c.total,
    ...CITATION_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.key]: c[cat.key] }), {}),
  }))

  return (
    <div className="space-y-6">
      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-1">Citation Score by Club</h3>
        <p className="text-xs text-slate-400 mb-4">Stacked bar — each colour is a scoring category (RY 2025-26)</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <Tooltip
              formatter={(v, n) => [v.toLocaleString() + ' pts', n]}
              contentStyle={{ borderRadius: 10, fontSize: 12, border: '1px solid #e2e8f0' }}
            />
            <Legend iconType="square" wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
            {CITATION_CATEGORIES.map((cat) => (
              <Bar key={cat.key} dataKey={cat.key} name={cat.label} stackId="a" fill={cat.color} radius={cat.key === 'foundation' ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <BarChart2 size={16} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-800">Category Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Club</th>
                {CITATION_CATEGORIES.map((cat) => (
                  <th key={cat.key} className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {cat.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap bg-blue-50">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CITATION_DATA
                .slice()
                .sort((a, b) => b.total - a.total)
                .map((club, idx) => (
                  <tr key={club.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-800 whitespace-nowrap">
                      <span className="text-slate-400 text-xs mr-2">#{idx + 1}</span>
                      {club.name}
                    </td>
                    {CITATION_CATEGORIES.map((cat) => (
                      <td key={cat.key} className="px-4 py-2.5 text-right tabular-nums text-slate-600">
                        {club[cat.key].toLocaleString()}
                      </td>
                    ))}
                    <td className="px-4 py-2.5 text-right tabular-nums font-bold text-blue-700 bg-blue-50">
                      {club.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Section 2 : Goals Achievement Grid ──────────────────────────────────────
function GoalsAchievementGrid() {
  const goalsData = useMemo(() => buildGoalsData(), [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {goalsData.map((club, ci) => {
        const achieved = GOALS.filter((g) => {
          const pct = (club[g.key] / g.target) * 100
          return pct >= 100
        }).length
        return (
          <div key={club.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4">
            {/* Card header */}
            <div>
              <div
                className="inline-block text-xs font-bold px-2 py-0.5 rounded-full text-white mb-2"
                style={{ background: CLUB_COLORS[ci] }}
              >
                {club.members} members
              </div>
              <h4 className="text-sm font-semibold text-slate-800 leading-tight">{club.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {achieved} / {GOALS.length} goals achieved
              </p>
              {/* Mini overall bar */}
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{
                    width: `${(achieved / GOALS.length) * 100}%`,
                    background: achieved === GOALS.length ? GREEN : achieved >= 3 ? AMBER : RED,
                  }}
                />
              </div>
            </div>
            {/* Individual goal bars */}
            <div className="space-y-3">
              {GOALS.map((goal) => (
                <GoalBar
                  key={goal.key}
                  label={goal.label}
                  value={club[goal.key]}
                  target={goal.target}
                  unit={goal.unit}
                  higher={goal.higher}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Section 3 : Club Excellence Award Status ────────────────────────────────
function AwardStatusSection() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
        <Award size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-slate-800">Club Excellence Award Status — RY 2025-26</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Club</th>
              {AWARD_DEFS.map((a) => (
                <th key={a.key} className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {a.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {CLUBS.map((club, ci) => {
              const status = AWARD_STATUS[club.id] ?? {}
              const allAchieved = AWARD_DEFS.every((a) => status[a.key] === 'achieved')
              return (
                <tr
                  key={club.id}
                  className={`hover:bg-slate-50/60 transition-colors ${allAchieved ? 'border-l-4 border-l-green-400' : 'border-l-4 border-l-transparent'}`}
                >
                  <td className="px-5 py-3 font-medium text-slate-800 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: CLUB_COLORS[ci] }}
                      />
                      {club.name}
                    </div>
                  </td>
                  {AWARD_DEFS.map((a) => (
                    <td key={a.key} className="px-4 py-3 text-center">
                      <StatusChip status={status[a.key] ?? 'behind'} />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {/* Legend */}
      <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
        {[
          { status: 'achieved',   label: 'Achieved — criteria fully met' },
          { status: 'on-track',   label: 'On Track — progress satisfactory' },
          { status: 'behind',     label: 'Behind — needs attention' },
        ].map(({ status, label }) => (
          <span key={status} className="flex items-center gap-1.5">
            <StatusChip status={status} />
            <span>{label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Section 4 : Monthly Goal Tracking ───────────────────────────────────────
function MonthlyTrackingSection() {
  const [metric, setMetric] = useState('projects')

  const metricOpts = [
    { key: 'projects', label: 'Service Projects' },
    { key: 'meetings', label: 'Meetings Held' },
    { key: 'trf',      label: 'TRF (USD)' },
  ]

  const data = useMemo(() => buildMonthlyChartData(metric), [metric])

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Monthly Goal Tracking</h3>
          <p className="text-xs text-slate-400 mt-0.5">Jul 2025 – Mar 2026 · All four clubs compared</p>
        </div>
        <Tabs value={metric} onValueChange={setMetric}>
          <TabsList className="h-8">
            {metricOpts.map((opt) => (
              <TabsTrigger key={opt.key} value={opt.key} className="text-xs px-3 h-7">
                {opt.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: '1px solid #e2e8f0' }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
          {CLUBS.map((club, ci) => (
            <Line
              key={club.id}
              type="monotone"
              dataKey={club.name}
              stroke={CLUB_COLORS[ci]}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── KPI summary row ──────────────────────────────────────────────────────────
function SummaryKPIs() {
  const goalsData   = useMemo(() => buildGoalsData(), [])
  const totalAwards = CLUBS.reduce((sum, c) => {
    const s = AWARD_STATUS[c.id] ?? {}
    return sum + AWARD_DEFS.filter((a) => s[a.key] === 'achieved').length
  }, 0)
  const maxAwards   = CLUBS.length * AWARD_DEFS.length

  const avgCitation = Math.round(
    CITATION_DATA.reduce((s, c) => s + c.total, 0) / CITATION_DATA.length
  )

  const goalsAchieved = goalsData.reduce((sum, club) => {
    return sum + GOALS.filter((g) => (club[g.key] / g.target) * 100 >= 100).length
  }, 0)
  const totalGoals = goalsData.length * GOALS.length

  const topClub = [...CITATION_DATA].sort((a, b) => b.total - a.total)[0]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <KPICard
        title="Awards Achieved"
        value={`${totalAwards}/${maxAwards}`}
        icon={Award}
        color="gold"
        subtitle="Across all 4 clubs"
      />
      <KPICard
        title="Goals On Track"
        value={`${goalsAchieved}/${totalGoals}`}
        icon={Target}
        color="blue"
        subtitle="Individual goal metrics"
      />
      <KPICard
        title="Avg Citation Score"
        value={avgCitation.toLocaleString()}
        icon={TrendingUp}
        color="green"
        subtitle="District pts avg"
      />
      <KPICard
        title="Top Scoring Club"
        value={topClub.total.toLocaleString()}
        icon={Star}
        color="green"
        subtitle={topClub.name}
      />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClubExcellence() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <SectionHeader
        title="Goals & Club Excellence"
        subtitle="District Citation scores, goal tracking, and award status for all 4 clubs — RY 2025-26"
        icon={Award}
      />

      {/* Summary KPI row */}
      <SummaryKPIs />

      {/* 1. District Citation Scores */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={18} className="text-blue-600" />
          <h2 className="text-base font-semibold text-slate-800">District Citation Scores</h2>
        </div>
        <CitationScoresSection />
      </section>

      {/* 2. Goals Achievement Grid */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Target size={18} className="text-blue-600" />
          <h2 className="text-base font-semibold text-slate-800">Goals Achievement Grid</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4 ml-7">
          Progress bars against Rotary targets &mdash;
          <span className="text-green-600 font-semibold"> green</span> = achieved,
          <span className="text-amber-500 font-semibold"> amber</span> = on track,
          <span className="text-red-500 font-semibold"> red</span> = behind
        </p>
        <GoalsAchievementGrid />

        {/* Goals reference table */}
        <div className="mt-4 bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-500">
          <span className="font-semibold text-slate-700 mr-3">Goal Targets:</span>
          {GOALS.map((g, i) => (
            <span key={g.key} className="mr-4">
              {g.label}:&nbsp;
              <span className="font-semibold text-slate-700">
                {g.unit === 'USD' ? `$${g.target}` : g.unit === '%' ? `${g.target}%` : g.target}
              </span>
              {i < GOALS.length - 1 ? '' : ''}
            </span>
          ))}
        </div>
      </section>

      {/* 3. Award Status */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Award size={18} className="text-amber-500" />
          <h2 className="text-base font-semibold text-slate-800">Club Excellence Award Status</h2>
        </div>
        <AwardStatusSection />
      </section>

      {/* 4. Monthly Goal Tracking */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-blue-600" />
          <h2 className="text-base font-semibold text-slate-800">Monthly Goal Tracking</h2>
        </div>
        <MonthlyTrackingSection />
      </section>
    </div>
  )
}
