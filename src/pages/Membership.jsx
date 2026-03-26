import { useState, useMemo } from 'react'
import {
  TrendingUp, Users, UserCheck, Globe, BarChart2, ChevronUp, ChevronDown,
  BookOpen, ClipboardList
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts'
import { CLUBS, AG_TOTALS } from '@/data/realData'
import KPICard from '../components/KPICard'
import SectionHeader from '../components/SectionHeader'

// ─── constants ───────────────────────────────────────────────────────────────

const ROTARY_BLUE = '#003DA5'
const ROTARY_GOLD = '#F7A81B'
const ROTARY_TEAL = '#00A9CE'
const ROTARY_EARTH = '#6B7280'

const CLUB_COLORS = [ROTARY_BLUE, ROTARY_GOLD, ROTARY_TEAL, '#10B981']

// ─── helpers ─────────────────────────────────────────────────────────────────

const fmtInt = (n) => Number(n).toLocaleString('en-IN')

// ─── Comparison bar component ─────────────────────────────────────────────────

const ComparisonBar = ({ label, clubValue, avgValue, suffix = '', clubLabel, avgLabel = 'AG Avg' }) => {
  const maxVal = Math.max(clubValue, avgValue, 1)
  const clubWidth = Math.round((clubValue / maxVal) * 100)
  const avgWidth = Math.round((avgValue / maxVal) * 100)

  return (
    <div className="mb-4">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
      )}
      <div className="space-y-1.5">
        {/* Club bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-32 text-right shrink-0 truncate" title={clubLabel}>{clubLabel}</span>
          <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
              style={{ width: `${clubWidth}%`, backgroundColor: ROTARY_BLUE, minWidth: clubValue > 0 ? '2rem' : '0' }}
            >
              <span className="text-[10px] font-bold text-white">{fmtInt(clubValue)}{suffix}</span>
            </div>
          </div>
        </div>
        {/* Average bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-32 text-right shrink-0">{avgLabel}</span>
          <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
              style={{ width: `${avgWidth}%`, backgroundColor: ROTARY_GOLD, minWidth: avgValue > 0 ? '2rem' : '0' }}
            >
              <span className="text-[10px] font-bold text-slate-800">{Number(avgValue).toFixed(1)}{suffix}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sort hook ────────────────────────────────────────────────────────────────

const useSortable = (data, defaultKey = 'members', defaultDir = 'desc') => {
  const [sortKey, setSortKey] = useState(defaultKey)
  const [sortDir, setSortDir] = useState(defaultDir)

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[sortKey] ?? 0
      const bv = b[sortKey] ?? 0
      const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  return { sorted, sortKey, sortDir, toggleSort }
}

// ─── Table header cell ────────────────────────────────────────────────────────

const Th = ({ label, colKey, sortKey, sortDir, onSort, className = '' }) => (
  <th
    onClick={() => onSort(colKey)}
    className={`px-3 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap hover:bg-slate-100 transition-colors ${className}`}
  >
    <span className="inline-flex items-center gap-1">
      {label}
      {sortKey === colKey
        ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
        : <span className="opacity-0 group-hover:opacity-30"><ChevronDown size={12} /></span>
      }
    </span>
  </th>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Membership() {
  // Per-club table rows derived from CLUBS
  const tableRows = useMemo(() =>
    CLUBS.map((c) => ({
      id: c.id,
      name: c.name,
      members: c.members,
      meetings: c.meetings,
      totalProjects: c.totalProjects,
      projectRank: c.projectRank,
      trf: c.trf?.totalINR ?? 0,
      ocv: c.ocv ?? 0,
    })),
    []
  )

  const { sorted: sortedRows, sortKey, sortDir, toggleSort } = useSortable(tableRows, 'members', 'desc')

  // Averages across clubs
  const avgMembers = AG_TOTALS.totalMembers / CLUBS.length
  const avgMeetings = AG_TOTALS.totalMeetings / CLUBS.length
  const avgProjects = AG_TOTALS.totalProjects / CLUBS.length

  // Chart data — members per club
  const membersChartData = useMemo(() =>
    CLUBS.map((c, i) => ({
      name: c.name.length > 14 ? c.name.slice(0, 14) + '…' : c.name,
      fullName: c.name,
      members: c.members,
      meetings: c.meetings,
      projects: c.totalProjects,
      color: CLUB_COLORS[i % CLUB_COLORS.length],
    })),
    []
  )

  // Pie data — members distribution
  const pieData = useMemo(() =>
    CLUBS.map((c, i) => ({
      name: c.name,
      value: c.members,
      color: CLUB_COLORS[i % CLUB_COLORS.length],
    })),
    []
  )

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 1 ── Section Header */}
        <SectionHeader
          title="Membership Overview"
          subtitle={`All 4 Clubs · AG: ${CLUBS[0]?.ag ?? 'Anita C Murgai'} · Data as of 26 March 2026`}
          icon={TrendingUp}
        />

        {/* 2 ── KPI summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Members"
            value={fmtInt(AG_TOTALS.totalMembers)}
            subtitle={`Across ${CLUBS.length} clubs`}
            icon={Users}
            color="blue"
          />
          <KPICard
            title="Total Meetings"
            value={fmtInt(AG_TOTALS.totalMeetings)}
            subtitle={`Avg ${(AG_TOTALS.totalMeetings / CLUBS.length).toFixed(1)} per club`}
            icon={BookOpen}
            color="green"
          />
          <KPICard
            title="Total Projects"
            value={fmtInt(AG_TOTALS.totalProjects)}
            subtitle={`Avg ${(AG_TOTALS.totalProjects / CLUBS.length).toFixed(1)} per club`}
            icon={ClipboardList}
            color="purple"
          />
          <KPICard
            title="TRF Contributions"
            value={`₹${fmtInt(AG_TOTALS.totalTRF_INR)}`}
            subtitle="Total TRF contribution"
            icon={Globe}
            color="gold"
          />
        </div>

        {/* 3 ── Club-by-Club Comparison (grouped bar chart) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
            <BarChart2 size={15} className="text-blue-600" />
            Club-by-Club Comparison
          </h3>
          <p className="text-xs text-slate-400 mb-4">Members · Meetings · Projects side by side</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={CLUBS.map(c => ({
                name: c.name.replace('Navi Mumbai', 'NM').replace('New Bombay Seaside', 'NB Seaside').replace('-Palm Beach', ' PB').replace(' Flamingo City', ' FC'),
                fullName: c.name,
                Members: c.members,
                Meetings: c.meetings,
                Projects: c.totalProjects,
              }))}
              margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
              barCategoryGap="25%"
              barGap={3}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} width={32} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="Members" fill={ROTARY_BLUE} radius={[3,3,0,0]} />
              <Bar dataKey="Meetings" fill={ROTARY_GOLD} radius={[3,3,0,0]} />
              <Bar dataKey="Projects" fill={ROTARY_TEAL} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4 ── Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Grouped bar chart — Members / Meetings / Projects */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Club Activity at a Glance
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={membersChartData} margin={{ top: 4, right: 8, left: 0, bottom: 40 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={56}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={36} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(val, name, props) => [fmtInt(val), name]}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName ?? label}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  formatter={(val) => <span style={{ color: '#475569' }}>{val}</span>}
                />
                <Bar dataKey="members"  name="Members"  fill={ROTARY_BLUE}  radius={[3, 3, 0, 0]} />
                <Bar dataKey="meetings" name="Meetings" fill={ROTARY_GOLD}  radius={[3, 3, 0, 0]} />
                <Bar dataKey="projects" name="Projects" fill={ROTARY_TEAL}  radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut chart — Members distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col">
            <h3 className="text-sm font-bold text-slate-700 mb-2">
              Members Distribution
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
                    <tspan x="50%" dy="-0.4em" style={{ fontSize: 18, fontWeight: 700, fill: ROTARY_BLUE }}>
                      {AG_TOTALS.totalMembers}
                    </tspan>
                    <tspan x="50%" dy="1.4em" style={{ fontSize: 10, fill: '#64748b' }}>Members</tspan>
                  </text>
                  <Tooltip
                    formatter={(v, name) => [fmtInt(v) + ' members', name]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              {pieData.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-3 h-3 rounded-full inline-block shrink-0" style={{ background: d.color }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 5 ── Detailed sortable table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Club-wise Detail</h3>
            <span className="text-xs text-slate-400">Click headers to sort</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                <tr>
                  <Th label="Club Name"      colKey="name"         sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="min-w-[180px]" />
                  <Th label="Members"        colKey="members"      sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="Meetings"       colKey="meetings"     sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="Projects"       colKey="totalProjects" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="TRF (INR)"      colKey="trf"          sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="OCV"            colKey="ocv"          sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="District Rank"  colKey="projectRank"  sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-50 hover:bg-blue-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  >
                    <td className="px-3 py-2 font-medium text-slate-800 max-w-[220px]">
                      <span className="block truncate" title={row.name}>{row.name}</span>
                    </td>
                    <td className="px-3 py-2 font-semibold text-slate-800 tabular-nums text-right">{fmtInt(row.members)}</td>
                    <td className="px-3 py-2 text-slate-600 tabular-nums text-right">{fmtInt(row.meetings)}</td>
                    <td className="px-3 py-2 text-slate-600 tabular-nums text-right">{fmtInt(row.totalProjects)}</td>
                    <td className="px-3 py-2 text-slate-600 tabular-nums text-right">₹{fmtInt(row.trf)}</td>
                    <td className="px-3 py-2 text-slate-600 tabular-nums text-right">{fmtInt(row.ocv)}</td>
                    <td className="px-3 py-2 text-slate-600 tabular-nums text-right">
                      {row.projectRank
                        ? <span className="inline-flex items-center gap-1">#{fmtInt(row.projectRank)} <span className="text-slate-400">/ {fmtInt(AG_TOTALS.totalClubsInDistrict)}</span></span>
                        : '—'
                      }
                    </td>
                  </tr>
                ))}

                {/* AG totals row */}
                <tr className="bg-[#003DA5]/5 border-t-2 border-[#003DA5]/30 font-bold text-slate-800">
                  <td className="px-3 py-2.5 text-[#003DA5]">AG Total (4 Clubs)</td>
                  <td className="px-3 py-2.5 tabular-nums text-right">{fmtInt(AG_TOTALS.totalMembers)}</td>
                  <td className="px-3 py-2.5 tabular-nums text-right">{fmtInt(AG_TOTALS.totalMeetings)}</td>
                  <td className="px-3 py-2.5 tabular-nums text-right">{fmtInt(AG_TOTALS.totalProjects)}</td>
                  <td className="px-3 py-2.5 tabular-nums text-right">₹{fmtInt(AG_TOTALS.totalTRF_INR)}</td>
                  <td className="px-3 py-2.5 tabular-nums text-right">{fmtInt(AG_TOTALS.totalOCV)}</td>
                  <td className="px-3 py-2.5"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6 ── Beneficiaries & Impact summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(AG_TOTALS.totalBeneficiaries).map(([key, val], i) => {
            const club = CLUBS.find(c => c.name.toLowerCase().replace(/\s+/g, '').includes(key.toLowerCase().replace(/\s+/g, '')))
            const label = club?.name ?? key.charAt(0).toUpperCase() + key.slice(1)
            return (
              <div
                key={key}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-1"
              >
                <span className="text-xs text-slate-500 font-medium truncate" title={label}>{label}</span>
                <span className="text-xl font-bold tabular-nums" style={{ color: CLUB_COLORS[i % CLUB_COLORS.length] }}>
                  {fmtInt(val)}
                </span>
                <span className="text-xs text-slate-400">beneficiaries</span>
              </div>
            )
          })}
        </div>

        {/* 7 ── Footnote */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 flex flex-wrap gap-x-6 gap-y-1.5">
          <span className="font-semibold text-slate-600 mr-1">Notes:</span>
          <span>Members = active members as reported to RI · Meetings = CMR-reported meetings (Jul 2025 – Mar 2026)</span>
          <span>District rank based on total projects among {fmtInt(AG_TOTALS.totalClubsInDistrict)} clubs in District {CLUBS[0]?.district ?? 3142}</span>
        </div>

      </div>
    </div>
  )
}
