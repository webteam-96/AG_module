import { useState, useMemo } from 'react'
import {
  TrendingUp, Users, UserCheck, Globe, BarChart2, ChevronUp, ChevronDown
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts'
import { ZONES, ZONE_TOTALS, DISTRICT_TOTALS, CLUBS, getZoneClubs, getZoneInfo } from '../data/district3192'
import KPICard from '../components/KPICard'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'

// ─── constants ───────────────────────────────────────────────────────────────

const ROTARY_BLUE = '#003DA5'
const ROTARY_GOLD = '#F7A81B'

// ─── helpers ────────────────────────────────────────────────────────────────

const isNewClub = (club) => {
  if (club.isNew) return true
  const year = parseInt(club.charterDate?.split('-').at(-1) ?? '0', 10)
  return year >= 2023
}

const fmtPct = (n) => `${Number(n).toFixed(2)}%`
const fmtInt = (n) => Number(n).toLocaleString('en-IN')

// ─── Comparison bar component ─────────────────────────────────────────────────

const ComparisonBar = ({ label, zoneValue, districtValue, suffix = '%', zoneLabel, districtLabel = 'District' }) => {
  const maxVal = Math.max(zoneValue, districtValue, 1)
  const zoneWidth = Math.round((zoneValue / maxVal) * 100)
  const distWidth = Math.round((districtValue / maxVal) * 100)

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <div className="space-y-1.5">
        {/* Zone bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-16 text-right shrink-0">{zoneLabel || 'Zone'}</span>
          <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
              style={{ width: `${zoneWidth}%`, backgroundColor: ROTARY_BLUE, minWidth: zoneValue > 0 ? '2rem' : '0' }}
            >
              <span className="text-[10px] font-bold text-white">{Number(zoneValue).toFixed(2)}{suffix}</span>
            </div>
          </div>
        </div>
        {/* District bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-16 text-right shrink-0">{districtLabel}</span>
          <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
              style={{ width: `${distWidth}%`, backgroundColor: ROTARY_GOLD, minWidth: districtValue > 0 ? '2rem' : '0' }}
            >
              <span className="text-[10px] font-bold text-slate-800">{Number(districtValue).toFixed(2)}{suffix}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Donut centre label ───────────────────────────────────────────────────────

const DonutCentreLabel = ({ cx, cy, femalePct }) => (
  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
    <tspan x={cx} dy="-0.4em" className="text-xl" style={{ fontSize: 20, fontWeight: 700, fill: ROTARY_GOLD }}>
      {Number(femalePct).toFixed(1)}%
    </tspan>
    <tspan x={cx} dy="1.4em" style={{ fontSize: 10, fill: '#64748b' }}>Female</tspan>
  </text>
)

// ─── Growth cell colour ───────────────────────────────────────────────────────

const growthCellClass = (g) => {
  if (g < 0) return 'bg-red-50 text-red-700 font-semibold'
  if (g >= 50) return 'bg-green-100 text-green-800 font-bold'
  return 'text-slate-700'
}

const regCellClass = (r) => {
  if (r < 10) return 'bg-red-50 text-red-700 font-semibold'
  if (r >= 90) return 'bg-green-100 text-green-800 font-bold'
  return 'text-slate-700'
}

// ─── Sort hook ────────────────────────────────────────────────────────────────

const useSortable = (data, defaultKey = 'current', defaultDir = 'desc') => {
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
  const user = JSON.parse(sessionStorage.getItem('ag_user') || '{}')
  const zoneId = user.zone || 'ALL'

  const clubs = useMemo(
    () => (zoneId === 'ALL' ? CLUBS : getZoneClubs(zoneId)),
    [zoneId]
  )

  // Aggregate zone/scope totals from live club data
  const scopeTotals = useMemo(() => {
    const atJuly = clubs.reduce((s, c) => s + c.membership.atJuly, 0)
    const current = clubs.reduce((s, c) => s + c.membership.current, 0)
    const female = clubs.reduce((s, c) => s + c.membership.female, 0)
    const myRotary = clubs.reduce((s, c) => s + c.membership.myRotary, 0)
    return {
      atJuly,
      current,
      growth: atJuly > 0 ? ((current - atJuly) / atJuly) * 100 : 0,
      female,
      femalePercent: current > 0 ? (female / current) * 100 : 0,
      myRotary,
      myRotaryPercent: current > 0 ? (myRotary / current) * 100 : 0,
    }
  }, [clubs])

  // Top-10 clubs by current members for bar chart
  const top10 = useMemo(
    () => [...clubs]
      .sort((a, b) => b.membership.current - a.membership.current)
      .slice(0, 10)
      .map(c => ({
        name: c.name.length > 10 ? c.name.slice(0, 10) + '…' : c.name,
        atJuly: c.membership.atJuly,
        current: c.membership.current,
      })),
    [clubs]
  )

  // Donut data
  const donutData = useMemo(() => {
    const male = scopeTotals.current - scopeTotals.female
    return [
      { name: 'Male', value: male },
      { name: 'Female', value: scopeTotals.female },
    ]
  }, [scopeTotals])

  // Table rows
  const tableRows = useMemo(() =>
    clubs.map(c => ({
      id: c.id,
      name: c.name,
      atJuly: c.membership.atJuly,
      current: c.membership.current,
      change: c.membership.current - c.membership.atJuly,
      growth: c.membership.growth,
      female: c.membership.female,
      femalePercent: c.membership.femalePercent,
      myRotary: c.membership.myRotary,
      myRotaryPercent: c.membership.myRotaryPercent,
      isNew: isNewClub(c),
    })),
    [clubs]
  )

  const { sorted: sortedRows, sortKey, sortDir, toggleSort } = useSortable(tableRows, 'current', 'desc')

  const zoneLabel = zoneId === 'ALL' ? 'District' : `Zone ${zoneId}`

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 1 ── Section Header */}
        <SectionHeader
          title="Membership Analytics"
          subtitle={`${zoneLabel} · ${clubs.length} clubs · Data as of 19 March 2026`}
          icon={TrendingUp}
        />

        {/* 2 ── KPI summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Members at July"
            value={fmtInt(scopeTotals.atJuly)}
            subtitle="Start of Rotary Year"
            icon={Users}
            color="blue"
          />
          <KPICard
            title="Current Members"
            value={fmtInt(scopeTotals.current)}
            subtitle={`Net change: +${fmtInt(scopeTotals.current - scopeTotals.atJuly)}`}
            icon={TrendingUp}
            color="green"
            trend={scopeTotals.growth != null ? parseFloat(scopeTotals.growth.toFixed(2)) : undefined}
          />
          <KPICard
            title="Female Members"
            value={fmtInt(scopeTotals.female)}
            subtitle={`${scopeTotals.femalePercent.toFixed(1)}% of total`}
            icon={UserCheck}
            color="purple"
            trend={parseFloat((scopeTotals.femalePercent - DISTRICT_TOTALS.femalePercent).toFixed(2))}
          />
          <KPICard
            title="MyRotary Registered"
            value={fmtInt(scopeTotals.myRotary)}
            subtitle={`${scopeTotals.myRotaryPercent.toFixed(1)}% of members`}
            icon={Globe}
            color="gold"
            trend={parseFloat((scopeTotals.myRotaryPercent - DISTRICT_TOTALS.myRotaryPercent).toFixed(2))}
          />
        </div>

        {/* 3 ── Zone vs District comparison */}
        {zoneId !== 'ALL' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <BarChart2 size={15} className="text-blue-600" />
              Zone {zoneId} vs District Benchmark
            </h3>
            <div className="flex items-center gap-6 mb-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: ROTARY_BLUE }} />
                Zone {zoneId}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: ROTARY_GOLD }} />
                District
              </span>
            </div>
            <ComparisonBar
              label="Membership Growth %"
              zoneValue={scopeTotals.growth}
              districtValue={DISTRICT_TOTALS.growth}
              zoneLabel={`Zone ${zoneId}`}
            />
            <ComparisonBar
              label="Female Members %"
              zoneValue={scopeTotals.femalePercent}
              districtValue={DISTRICT_TOTALS.femalePercent}
              zoneLabel={`Zone ${zoneId}`}
            />
            <ComparisonBar
              label="MyRotary Registration %"
              zoneValue={scopeTotals.myRotaryPercent}
              districtValue={DISTRICT_TOTALS.myRotaryPercent}
              zoneLabel={`Zone ${zoneId}`}
            />
          </div>
        )}

        {/* For DG — show all-zone comparison */}
        {zoneId === 'ALL' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <BarChart2 size={15} className="text-blue-600" />
              Zone-by-Zone Growth vs District ({fmtPct(DISTRICT_TOTALS.growth)})
            </h3>
            <div className="space-y-1">
              {Object.entries(ZONE_TOTALS).map(([zid, zt]) => (
                <ComparisonBar
                  key={zid}
                  label=""
                  zoneValue={zt.growth}
                  districtValue={DISTRICT_TOTALS.growth}
                  zoneLabel={`Zone ${zid}`}
                  districtLabel="District"
                />
              ))}
            </div>
          </div>
        )}

        {/* 4 + 5 ── Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Grouped bar chart — Top 10 clubs */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Top 10 Clubs by Current Members
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={top10} margin={{ top: 4, right: 8, left: 0, bottom: 32 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={52}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={36} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  formatter={(val) => <span style={{ color: '#475569' }}>{val}</span>}
                />
                <Bar dataKey="atJuly" name="At July" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="current" name="Current" fill={ROTARY_BLUE} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut chart — Female vs Male */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col">
            <h3 className="text-sm font-bold text-slate-700 mb-2">
              Gender Breakdown
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    <Cell fill={ROTARY_BLUE} />
                    <Cell fill={ROTARY_GOLD} />
                  </Pie>
                  <DonutCentreLabel
                    cx="50%"
                    cy="50%"
                    femalePct={scopeTotals.femalePercent}
                  />
                  <Tooltip
                    formatter={(v) => [fmtInt(v), '']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: ROTARY_BLUE }} />
                Male ({fmtInt(scopeTotals.current - scopeTotals.female)})
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: ROTARY_GOLD }} />
                Female ({fmtInt(scopeTotals.female)})
              </span>
            </div>
          </div>
        </div>

        {/* 6 ── Detailed sortable table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Detailed Membership Table</h3>
            <span className="text-xs text-slate-400">Click headers to sort</span>
          </div>
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                <tr>
                  <Th label="Club Name"     colKey="name"             sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="min-w-[160px]" />
                  <Th label="Jul"           colKey="atJuly"           sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="Current"       colKey="current"          sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="Δ"             colKey="change"           sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="Growth %"      colKey="growth"           sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="Female"        colKey="female"           sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="F %"           colKey="femalePercent"    sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="MyRotary"      colKey="myRotary"         sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="Reg %"         colKey="myRotaryPercent"  sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-50 hover:bg-blue-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  >
                    <td className="px-3 py-2 font-medium text-slate-800 max-w-[200px]">
                      <span className="block truncate" title={row.name}>{row.name}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-600 tabular-nums text-right">{fmtInt(row.atJuly)}</td>
                    <td className="px-3 py-2 font-semibold text-slate-800 tabular-nums text-right">{fmtInt(row.current)}</td>
                    <td className={`px-3 py-2 tabular-nums text-right ${row.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {row.change >= 0 ? '+' : ''}{fmtInt(row.change)}
                    </td>
                    <td className={`px-3 py-2 tabular-nums text-right rounded ${growthCellClass(row.growth)}`}>
                      {row.growth >= 0 ? '▲' : '▼'} {Math.abs(row.growth).toFixed(2)}%
                    </td>
                    <td className="px-3 py-2 text-slate-600 tabular-nums text-right">{fmtInt(row.female)}</td>
                    <td className="px-3 py-2 text-slate-600 tabular-nums text-right">{row.femalePercent.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-slate-600 tabular-nums text-right">{fmtInt(row.myRotary)}</td>
                    <td className={`px-3 py-2 tabular-nums text-right rounded ${regCellClass(row.myRotaryPercent)}`}>
                      {row.myRotaryPercent.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2">
                      {row.isNew
                        ? <StatusBadge status="new" />
                        : row.growth >= 50
                          ? <StatusBadge status="growing" />
                          : row.growth < 0
                            ? <StatusBadge status="declining" />
                            : <StatusBadge status="stable" />
                      }
                    </td>
                  </tr>
                ))}

                {/* Zone totals row */}
                <tr className="bg-[#003DA5]/5 border-t-2 border-[#003DA5]/30 font-bold text-slate-800">
                  <td className="px-3 py-2.5 text-[#003DA5]">
                    {zoneId === 'ALL' ? 'District Total' : `Zone ${zoneId} Total`}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-right">{fmtInt(scopeTotals.atJuly)}</td>
                  <td className="px-3 py-2.5 tabular-nums text-right">{fmtInt(scopeTotals.current)}</td>
                  <td className={`px-3 py-2.5 tabular-nums text-right ${scopeTotals.current - scopeTotals.atJuly >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {scopeTotals.current - scopeTotals.atJuly >= 0 ? '+' : ''}{fmtInt(scopeTotals.current - scopeTotals.atJuly)}
                  </td>
                  <td className={`px-3 py-2.5 tabular-nums text-right ${growthCellClass(scopeTotals.growth)}`}>
                    {scopeTotals.growth >= 0 ? '▲' : '▼'} {Math.abs(scopeTotals.growth).toFixed(2)}%
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-right">{fmtInt(scopeTotals.female)}</td>
                  <td className="px-3 py-2.5 tabular-nums text-right">{scopeTotals.femalePercent.toFixed(1)}%</td>
                  <td className="px-3 py-2.5 tabular-nums text-right">{fmtInt(scopeTotals.myRotary)}</td>
                  <td className="px-3 py-2.5 tabular-nums text-right">{scopeTotals.myRotaryPercent.toFixed(1)}%</td>
                  <td className="px-3 py-2.5"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 7 ── Footnote / color legend */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 flex flex-wrap gap-x-6 gap-y-1.5">
          <span className="font-semibold text-slate-600 mr-1">Color legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-300 inline-block" />
            Red = &lt;0% growth or &lt;10% MyRotary registration
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-300 inline-block" />
            Green = ≥50% growth or ≥90% MyRotary registration
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-300 inline-block" />
            Blue badge = New Club (chartered ≥2023)
          </span>
        </div>

      </div>
    </div>
  )
}
