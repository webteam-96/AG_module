import { useState, useMemo } from 'react'
import {
  Briefcase, Users, Clock, DollarSign, ChevronUp, ChevronDown,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell,
} from 'recharts'
import KPICard from '../components/KPICard'
import SectionHeader from '../components/SectionHeader'
import { CLUBS, DISTRICT_TOTALS, ZONE_TOTALS } from '../data/district3192'

// ─── constants ────────────────────────────────────────────────────────────────
const ROTARY_BLUE = '#003DA5'
const ROTARY_GOLD = '#F7A81B'

// ─── formatters ───────────────────────────────────────────────────────────────
const fmt = (n) => (n ?? 0).toLocaleString()
const fmtUSD = (n) => {
  if (!n) return '$0'
  return '$' + Math.round(n).toLocaleString('en-US')
}
const pct = (val, total) =>
  total > 0 ? ((val / total) * 100).toFixed(1) + '% of district' : '—'

// ─── custom tooltips ──────────────────────────────────────────────────────────
function ProjectsTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-slate-800 mb-2">{d.fullName}</p>
      <div className="space-y-1">
        <Row label="Projects" val={d.projects} />
        <Row label="Volunteers" val={fmt(d.volunteers)} />
        <Row label="Man-hours" val={fmt(d.manHours)} />
        <Row label="Cost" val={fmtUSD(d.cost)} />
      </div>
    </div>
  )
}

function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-slate-800 mb-2">{d.name}</p>
      <div className="space-y-1">
        <Row label="Volunteers" val={fmt(d.volunteers)} />
        <Row label="Man-hours" val={fmt(d.manHours)} />
        <Row label="Cost" val={fmtUSD(d.cost)} />
        <Row label="Projects" val={d.projects} />
      </div>
    </div>
  )
}

function Row({ label, val }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{val}</span>
    </div>
  )
}

// ─── sortable header ─────────────────────────────────────────────────────────
function SortTh({ col, label, sortKey, onSort }) {
  const active = sortKey.key === col
  return (
    <th
      className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors whitespace-nowrap"
      onClick={() => onSort(col)}
    >
      <div className="flex items-center gap-1">
        {label}
        <span className="text-slate-300">
          {active
            ? sortKey.dir === 'desc'
              ? <ChevronDown size={14} className="text-blue-500" />
              : <ChevronUp size={14} className="text-blue-500" />
            : <ChevronDown size={14} />}
        </span>
      </div>
    </th>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function ServiceProjects() {
  const user = JSON.parse(sessionStorage.getItem('ag_user') || '{}')
  const isAll = user.zone === 'ALL'

  const clubs = useMemo(
    () => (isAll ? CLUBS : CLUBS.filter((c) => c.zone === user.zone)),
    [isAll, user.zone]
  )

  const totals = useMemo(
    () => (isAll ? DISTRICT_TOTALS : ZONE_TOTALS[user.zone]),
    [isAll, user.zone]
  )

  const dist = DISTRICT_TOTALS

  // ─ aggregate from visible clubs ───────────────────────────────────────────
  const zoneAgg = useMemo(() => {
    if (isAll) {
      return {
        projects: dist.projects,
        volunteers: dist.volunteers,
        manHours: dist.manHours,
        cost: dist.projectCost,
      }
    }
    return {
      projects: totals.projects,
      volunteers: totals.volunteers,
      manHours: totals.manHours,
      cost: totals.projectCost,
    }
  }, [isAll, totals, dist])

  // ─ sort state ──────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState({ key: 'projects', dir: 'desc' })

  const handleSort = (col) => {
    setSortKey((prev) =>
      prev.key === col
        ? { key: col, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
        : { key: col, dir: 'desc' }
    )
  }

  // ─ table rows ─────────────────────────────────────────────────────────────
  const tableRows = useMemo(() => {
    const rows = clubs.map((c) => ({
      id: c.id,
      name: c.name,
      zone: c.zone,
      projects: c.serviceProjects.projects,
      volunteers: c.serviceProjects.volunteers,
      manHours: c.serviceProjects.manHours,
      cost: c.serviceProjects.cost,
      efficiency:
        c.serviceProjects.projects > 0
          ? Math.round(c.serviceProjects.manHours / c.serviceProjects.projects)
          : 0,
    }))

    rows.sort((a, b) => {
      const v = sortKey.dir === 'desc' ? b[sortKey.key] - a[sortKey.key] : a[sortKey.key] - b[sortKey.key]
      return v
    })

    return rows
  }, [clubs, sortKey])

  const topClub = useMemo(
    () => clubs.reduce(
      (best, c) => (c.serviceProjects.projects > best.serviceProjects.projects ? c : best),
      clubs[0] || {}
    ),
    [clubs]
  )

  // ─ horizontal bar chart data ───────────────────────────────────────────────
  const barData = useMemo(
    () =>
      clubs
        .filter((c) => c.serviceProjects.projects > 0)
        .sort((a, b) => b.serviceProjects.projects - a.serviceProjects.projects)
        .map((c) => ({
          fullName: c.name,
          name: c.name.length > 22 ? c.name.slice(0, 20) + '…' : c.name,
          projects: c.serviceProjects.projects,
          volunteers: c.serviceProjects.volunteers,
          manHours: c.serviceProjects.manHours,
          cost: c.serviceProjects.cost,
        })),
    [clubs]
  )

  // ─ scatter data ────────────────────────────────────────────────────────────
  const scatterData = useMemo(
    () =>
      clubs
        .filter(
          (c) =>
            c.serviceProjects.volunteers > 0 ||
            c.serviceProjects.manHours > 0 ||
            c.serviceProjects.projects > 0
        )
        .map((c) => ({
          name: c.name,
          volunteers: c.serviceProjects.volunteers,
          manHours: c.serviceProjects.manHours,
          cost: c.serviceProjects.cost,
          projects: c.serviceProjects.projects,
          // bubble size scaled to cost — min 80, max 2000
          z: Math.max(80, Math.min(2000, (c.serviceProjects.cost / 1000) * 40 + 80)),
        })),
    [clubs]
  )

  const barHeight = Math.max(260, barData.length * 32)
  const zoneSuffix = isAll ? '' : ` — Zone ${user.zone}`

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <SectionHeader
        title={`Service Projects${zoneSuffix}`}
        subtitle="Project counts, volunteer engagement, and community impact"
        icon={Briefcase}
      />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Projects"
          value={fmt(zoneAgg.projects)}
          subtitle={isAll ? 'District total' : pct(zoneAgg.projects, dist.projects)}
          icon={Briefcase}
          color="blue"
        />
        <KPICard
          title="Total Volunteers"
          value={fmt(zoneAgg.volunteers)}
          subtitle={isAll ? 'District total' : pct(zoneAgg.volunteers, dist.volunteers)}
          icon={Users}
          color="green"
        />
        <KPICard
          title="Total Man-Hours"
          value={fmt(zoneAgg.manHours)}
          subtitle={isAll ? 'District total' : pct(zoneAgg.manHours, dist.manHours)}
          icon={Clock}
          color="purple"
        />
        <KPICard
          title="Total Cost (USD)"
          value={fmtUSD(zoneAgg.cost)}
          subtitle={isAll ? 'District total' : pct(zoneAgg.cost, dist.projectCost)}
          icon={DollarSign}
          color="gold"
        />
      </div>

      {/* ── Zone Contribution Banner ── */}
      <div
        className="rounded-xl p-5 text-white"
        style={{ background: `linear-gradient(135deg, ${ROTARY_BLUE} 0%, #0052cc 100%)` }}
      >
        <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
          {isAll ? 'District' : `Zone ${user.zone}`} Contribution Summary
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Projects', val: fmt(zoneAgg.projects), icon: Briefcase },
            { label: 'Volunteers', val: fmt(zoneAgg.volunteers), icon: Users },
            { label: 'Man-Hours', val: fmt(zoneAgg.manHours), icon: Clock },
            { label: 'Cost (USD)', val: fmtUSD(zoneAgg.cost), icon: DollarSign },
          ].map(({ label, val, icon: Icon }) => (
            <div
              key={label}
              className="bg-white/10 rounded-lg px-4 py-3 flex items-center gap-3 backdrop-blur-sm"
            >
              <Icon size={18} className="text-yellow-300 flex-shrink-0" />
              <div>
                <div className="text-lg font-bold leading-tight">{val}</div>
                <div className="text-blue-200 text-xs">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Projects by Club (Horizontal Bar) ── */}
      {barData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-1">Projects by Club</h3>
          <p className="text-xs text-slate-500 mb-4">
            Clubs with at least 1 project, sorted by count
          </p>
          <ResponsiveContainer width="100%" height={barHeight}>
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 4, right: 40, left: 10, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#64748b' }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={{ fontSize: 11, fill: '#475569' }}
              />
              <Tooltip content={<ProjectsTooltip />} />
              <Bar dataKey="projects" name="Projects" fill={ROTARY_BLUE} radius={[0, 4, 4, 0]}>
                {barData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.fullName === topClub?.name ? ROTARY_GOLD : ROTARY_BLUE}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {topClub && (
            <p className="text-xs text-slate-400 mt-2">
              <span className="text-yellow-600 font-semibold">Gold bar</span> = top performer:{' '}
              <span className="font-medium text-slate-600">{topClub.name}</span> with{' '}
              {topClub.serviceProjects?.projects} projects
            </p>
          )}
        </div>
      )}

      {/* ── Bubble / Scatter: Effort vs Impact ── */}
      {scatterData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Effort vs Impact — Volunteer Scatter View
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            X = Volunteers · Y = Man-Hours · Bubble size ≈ Cost (USD)
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                type="number"
                dataKey="volunteers"
                name="Volunteers"
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Volunteers', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis
                type="number"
                dataKey="manHours"
                name="Man-Hours"
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Man-Hours', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#94a3b8' }}
              />
              <ZAxis type="number" dataKey="z" range={[60, 800]} />
              <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={scatterData} name="Clubs">
                {scatterData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.name === topClub?.name ? ROTARY_GOLD : ROTARY_BLUE}
                    fillOpacity={0.75}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Sortable Detailed Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Detailed Projects Table</h3>
          <p className="text-xs text-slate-500 mt-0.5">Click any column header to sort</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Club Name</th>
                <SortTh col="projects" label="Projects" sortKey={sortKey} onSort={handleSort} />
                <SortTh col="volunteers" label="Volunteers" sortKey={sortKey} onSort={handleSort} />
                <SortTh col="manHours" label="Man-Hours" sortKey={sortKey} onSort={handleSort} />
                <SortTh col="cost" label="Cost (USD)" sortKey={sortKey} onSort={handleSort} />
                <SortTh col="efficiency" label="Efficiency (hrs/proj)" sortKey={sortKey} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => {
                const isZero = row.projects === 0 && row.volunteers === 0
                const isTop = row.id === topClub?.id
                return (
                  <tr
                    key={row.id}
                    className={`border-t border-slate-100 transition-colors ${
                      isZero ? 'bg-slate-50' : 'hover:bg-slate-50'
                    }`}
                    style={isTop ? { borderLeft: `4px solid ${ROTARY_GOLD}` } : {}}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {isTop && (
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded text-white"
                            style={{ backgroundColor: ROTARY_GOLD, color: '#1a1a1a' }}
                          >
                            Top
                          </span>
                        )}
                        <span className={`font-medium ${isZero ? 'text-slate-400' : 'text-slate-800'}`}>
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <NumCell val={row.projects} isZero={isZero} bold />
                    <NumCell val={row.volunteers} isZero={isZero} format={fmt} />
                    <NumCell val={row.manHours} isZero={isZero} format={fmt} />
                    <NumCell val={row.cost} isZero={isZero} format={fmtUSD} />
                    <td className={`px-4 py-2.5 text-center ${isZero ? 'text-slate-300' : 'text-slate-600'}`}>
                      {row.projects > 0 ? row.efficiency : '—'}
                    </td>
                  </tr>
                )
              })}
              {/* Totals row */}
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-800">
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3 text-center">{fmt(zoneAgg.projects)}</td>
                <td className="px-4 py-3 text-center">{fmt(zoneAgg.volunteers)}</td>
                <td className="px-4 py-3 text-center">{fmt(zoneAgg.manHours)}</td>
                <td className="px-4 py-3 text-center">{fmtUSD(zoneAgg.cost)}</td>
                <td className="px-4 py-3 text-center text-slate-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── table cell ───────────────────────────────────────────────────────────────
function NumCell({ val, isZero, bold = false, format }) {
  const display = val === 0 ? '—' : format ? format(val) : val
  return (
    <td
      className={`px-4 py-2.5 text-center ${
        isZero || val === 0
          ? 'text-slate-300'
          : bold
          ? 'font-bold text-slate-800'
          : 'text-slate-700'
      }`}
    >
      {display}
    </td>
  )
}
