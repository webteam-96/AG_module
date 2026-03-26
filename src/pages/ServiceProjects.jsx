import { useState, useMemo } from 'react'
import {
  Briefcase, Users, Clock, IndianRupee, ChevronUp, ChevronDown,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import KPICard from '../components/KPICard'
import SectionHeader from '../components/SectionHeader'
import { CLUBS, AG_TOTALS } from '../data/realData'

// ─── constants ────────────────────────────────────────────────────────────────
const ROTARY_BLUE = '#003DA5'
const ROTARY_GOLD = '#F7A81B'

const CLUB_COLORS = {
  'Navi Mumbai':             '#003DA5',
  'Navi Mumbai Flamingo City': '#0052cc',
  'Navi Mumbai-Palm Beach':  '#1a6bde',
  'New Bombay Seaside':      '#4d8ef0',
}

const MONTH_ORDER = [
  'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025',
  'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026',
]

const MONTH_SHORT = {
  'Jul 2025': 'Jul', 'Aug 2025': 'Aug', 'Sep 2025': 'Sep',
  'Oct 2025': 'Oct', 'Nov 2025': 'Nov', 'Dec 2025': 'Dec',
  'Jan 2026': 'Jan', 'Feb 2026': 'Feb', 'Mar 2026': 'Mar',
}

// ─── formatters ───────────────────────────────────────────────────────────────
const fmt = (n) => (n ?? 0).toLocaleString('en-IN')
const fmtINR = (n) => {
  if (!n && n !== 0) return '₹0'
  return '₹' + Math.round(n).toLocaleString('en-IN')
}
const fmtDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── tooltip components ───────────────────────────────────────────────────────
function ClubBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-slate-800 mb-1">{d.fullName}</p>
      <p className="text-slate-600">
        <span className="text-slate-400">Projects: </span>
        <span className="font-bold text-blue-700">{d.projects}</span>
      </p>
    </div>
  )
}

function MonthTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs min-w-[140px]">
      <p className="font-semibold text-slate-800 mb-1">{label}</p>
      <p className="text-slate-600">
        <span className="text-slate-400">Projects: </span>
        <span className="font-bold text-blue-700">{payload[0]?.value}</span>
      </p>
    </div>
  )
}

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs min-w-[200px]">
      <p className="font-semibold text-slate-800 mb-1">{d.fullCategory}</p>
      <p className="text-slate-600">
        <span className="text-slate-400">Projects: </span>
        <span className="font-bold text-blue-700">{d.count}</span>
      </p>
    </div>
  )
}

// ─── helper ───────────────────────────────────────────────────────────────────
function Row({ label, val }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{val}</span>
    </div>
  )
}

// ─── sortable header ──────────────────────────────────────────────────────────
function SortTh({ col, label, sortKey, onSort, align = 'left' }) {
  const active = sortKey.key === col
  return (
    <th
      className={`px-3 py-3 font-semibold cursor-pointer select-none hover:bg-slate-100 transition-colors whitespace-nowrap text-${align}`}
      onClick={() => onSort(col)}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : ''}`}>
        {label}
        <span className="text-slate-300">
          {active
            ? sortKey.dir === 'desc'
              ? <ChevronDown size={13} className="text-blue-500" />
              : <ChevronUp size={13} className="text-blue-500" />
            : <ChevronDown size={13} />}
        </span>
      </div>
    </th>
  )
}

// ─── club badge ───────────────────────────────────────────────────────────────
function ClubBadge({ name }) {
  const color = CLUB_COLORS[name] ?? ROTARY_BLUE
  const initials = name
    .split(' ')
    .filter((w) => w.length > 2 && !/^(of|the|at|in|and)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-white text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: color }}
    >
      {initials && (
        <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold">
          {initials}
        </span>
      )}
      {name}
    </span>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function ServiceProjects() {
  const [sortKey, setSortKey] = useState({ key: 'date', dir: 'desc' })
  const [searchQuery, setSearchQuery] = useState('')

  const handleSort = (col) => {
    setSortKey((prev) =>
      prev.key === col
        ? { key: col, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
        : { key: col, dir: col === 'date' ? 'desc' : 'desc' }
    )
  }

  // ─ KPI aggregates ──────────────────────────────────────────────────────────
  const totalProjects = useMemo(
    () => CLUBS.reduce((sum, c) => sum + (c.totalProjects ?? 0), 0),
    []
  )

  // ─ bar chart: projects per club ────────────────────────────────────────────
  const clubBarData = useMemo(
    () =>
      [...CLUBS]
        .sort((a, b) => (b.totalProjects ?? 0) - (a.totalProjects ?? 0))
        .map((c) => ({
          fullName: c.name,
          name: c.name.length > 24 ? c.name.slice(0, 22) + '…' : c.name,
          projects: c.totalProjects ?? 0,
        })),
    []
  )

  const topClub = useMemo(
    () => [...CLUBS].sort((a, b) => (b.totalProjects ?? 0) - (a.totalProjects ?? 0))[0],
    []
  )

  // ─ monthly trend: aggregate all clubs ──────────────────────────────────────
  const monthlyTrendData = useMemo(() => {
    const map = {}
    MONTH_ORDER.forEach((m) => { map[m] = 0 })
    CLUBS.forEach((club) => {
      ;(club.monthly ?? []).forEach((row) => {
        if (map[row.month] !== undefined) {
          map[row.month] += row.projects ?? 0
        }
      })
    })
    return MONTH_ORDER.map((m) => ({
      month: MONTH_SHORT[m],
      fullMonth: m,
      projects: map[m],
    }))
  }, [])

  // ─ category breakdown ──────────────────────────────────────────────────────
  const categoryData = useMemo(() => {
    const counts = {}
    CLUBS.forEach((club) => {
      ;(club.projects ?? []).forEach((p) => {
        const cat = p.category ?? 'Unknown'
        // Normalise: strip parenthetical subcategories for cleaner grouping
        const base = cat.replace(/\s*\(.*?\)\s*/g, '').trim() || cat.trim()
        counts[base] = (counts[base] ?? 0) + 1
      })
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([cat, count]) => ({
        fullCategory: cat,
        name: cat.length > 28 ? cat.slice(0, 26) + '…' : cat,
        count,
      }))
  }, [])

  // ─ all projects flat list ──────────────────────────────────────────────────
  const allProjects = useMemo(() => {
    const rows = []
    CLUBS.forEach((club) => {
      ;(club.projects ?? []).forEach((p) => {
        rows.push({
          club: club.name,
          date: p.date ?? '',
          category: p.category ?? '—',
          title: p.title ?? '—',
          cost: p.cost ?? 0,
          beneficiaries: p.beneficiaries ?? 0,
          manHours: p.manHours ?? 0,
          funding: p.funding ?? '—',
          rotarians: p.rotarians ?? 0,
        })
      })
    })
    return rows
  }, [])

  // ─ filtered + sorted table rows ───────────────────────────────────────────
  const tableRows = useMemo(() => {
    const q = searchQuery.toLowerCase()
    const filtered = q
      ? allProjects.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.club.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q)
        )
      : allProjects

    return [...filtered].sort((a, b) => {
      const { key, dir } = sortKey
      let va = a[key]
      let vb = b[key]

      if (key === 'date') {
        va = va ? new Date(va).getTime() : 0
        vb = vb ? new Date(vb).getTime() : 0
      } else if (typeof va === 'string') {
        va = va.toLowerCase()
        vb = vb.toLowerCase()
        return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      }

      return dir === 'desc' ? vb - va : va - vb
    })
  }, [allProjects, sortKey, searchQuery])

  const barHeight = Math.max(160, clubBarData.length * 40)

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <SectionHeader
        title="Service Projects"
        subtitle="Project activity, community impact, and monthly trends — AG Group (4 clubs)"
        icon={Briefcase}
      />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Projects"
          value={fmt(totalProjects)}
          subtitle="Across all 4 clubs"
          icon={Briefcase}
          color="blue"
        />
        <KPICard
          title="Total Beneficiaries"
          value={fmt(AG_TOTALS.grandTotalBeneficiaries)}
          subtitle="People directly served"
          icon={Users}
          color="green"
        />
        <KPICard
          title="Total Man Hours"
          value={fmt(AG_TOTALS.grandTotalManHours)}
          subtitle="Volunteer hours logged"
          icon={Clock}
          color="purple"
        />
        <KPICard
          title="Total Cost (INR)"
          value={fmtINR(AG_TOTALS.grandTotalProjectCost)}
          subtitle="Combined project spend"
          icon={IndianRupee}
          color="gold"
        />
      </div>

      {/* ── Summary Banner ── */}
      <div
        className="rounded-xl p-5 text-white"
        style={{ background: `linear-gradient(135deg, ${ROTARY_BLUE} 0%, #0052cc 100%)` }}
      >
        <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
          AG Group Impact Summary — Jul 2025 to Mar 2026
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Projects', val: fmt(totalProjects), icon: Briefcase },
            { label: 'Beneficiaries', val: fmt(AG_TOTALS.grandTotalBeneficiaries), icon: Users },
            { label: 'Man Hours', val: fmt(AG_TOTALS.grandTotalManHours), icon: Clock },
            { label: 'Cost (INR)', val: fmtINR(AG_TOTALS.grandTotalProjectCost), icon: IndianRupee },
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

      {/* ── Two charts side by side ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Projects by Club */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-1">Projects by Club</h3>
          <p className="text-xs text-slate-500 mb-4">Total projects submitted per club</p>
          <ResponsiveContainer width="100%" height={barHeight}>
            <BarChart
              data={clubBarData}
              layout="vertical"
              margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
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
                width={170}
                tick={{ fontSize: 11, fill: '#475569' }}
              />
              <Tooltip content={<ClubBarTooltip />} />
              <Bar dataKey="projects" name="Projects" radius={[0, 4, 4, 0]}>
                {clubBarData.map((entry, idx) => (
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
              <span className="text-yellow-600 font-semibold">Gold bar</span> = top club:{' '}
              <span className="font-medium text-slate-600">{topClub.name}</span> with{' '}
              {topClub.totalProjects} projects
            </p>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-1">Monthly Projects Trend</h3>
          <p className="text-xs text-slate-500 mb-4">
            Combined project count across all clubs (Jul 2025 – Mar 2026)
          </p>
          <ResponsiveContainer width="100%" height={barHeight}>
            <BarChart
              data={monthlyTrendData}
              margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                allowDecimals={false}
              />
              <Tooltip content={<MonthTooltip />} />
              <Bar dataKey="projects" name="Projects" fill={ROTARY_BLUE} radius={[4, 4, 0, 0]}>
                {monthlyTrendData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.projects === Math.max(...monthlyTrendData.map((d) => d.projects))
                      ? ROTARY_GOLD
                      : ROTARY_BLUE}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-2">
            <span className="text-yellow-600 font-semibold">Gold bar</span> = peak month
          </p>
        </div>
      </div>

      {/* ── Category Breakdown ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-1">Top 10 Project Categories</h3>
        <p className="text-xs text-slate-500 mb-4">
          Projects grouped by service category across all clubs
        </p>
        <ResponsiveContainer width="100%" height={Math.max(200, categoryData.length * 36)}>
          <BarChart
            data={categoryData}
            layout="vertical"
            margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
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
              width={210}
              tick={{ fontSize: 11, fill: '#475569' }}
            />
            <Tooltip content={<CategoryTooltip />} />
            <Bar dataKey="count" name="Projects" fill={ROTARY_BLUE} radius={[0, 4, 4, 0]}>
              {categoryData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={idx === 0 ? ROTARY_GOLD : idx < 3 ? '#1a6bde' : ROTARY_BLUE}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Detailed Projects Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-800">All Projects — Detailed View</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {tableRows.length} of {allProjects.length} projects · Click column header to sort
            </p>
          </div>
          <input
            type="text"
            placeholder="Search projects, clubs, categories…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
              <tr>
                <SortTh col="club" label="Club" sortKey={sortKey} onSort={handleSort} />
                <SortTh col="date" label="Date" sortKey={sortKey} onSort={handleSort} />
                <SortTh col="category" label="Category" sortKey={sortKey} onSort={handleSort} />
                <th className="px-3 py-3 text-left font-semibold">Title</th>
                <SortTh col="cost" label="Cost (INR)" sortKey={sortKey} onSort={handleSort} align="right" />
                <SortTh col="beneficiaries" label="Beneficiaries" sortKey={sortKey} onSort={handleSort} align="right" />
                <SortTh col="manHours" label="Man Hours" sortKey={sortKey} onSort={handleSort} align="right" />
                <SortTh col="funding" label="Funding" sortKey={sortKey} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  {/* Club */}
                  <td className="px-3 py-2.5">
                    <ClubBadge name={row.club} />
                  </td>

                  {/* Date */}
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap text-xs">
                    {fmtDate(row.date)}
                  </td>

                  {/* Category */}
                  <td className="px-3 py-2.5 text-slate-600 text-xs max-w-[180px]">
                    <span
                      className="inline-block"
                      title={row.category}
                    >
                      {row.category.length > 32
                        ? row.category.slice(0, 30) + '…'
                        : row.category}
                    </span>
                  </td>

                  {/* Title */}
                  <td className="px-3 py-2.5 text-slate-800 font-medium max-w-[260px]">
                    <span title={row.title}>
                      {row.title.length > 48 ? row.title.slice(0, 46) + '…' : row.title}
                    </span>
                  </td>

                  {/* Cost */}
                  <td className="px-3 py-2.5 text-right text-slate-700 whitespace-nowrap tabular-nums">
                    {row.cost > 0 ? fmtINR(row.cost) : <span className="text-slate-300">—</span>}
                  </td>

                  {/* Beneficiaries */}
                  <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">
                    {row.beneficiaries > 0
                      ? fmt(row.beneficiaries)
                      : <span className="text-slate-300">—</span>}
                  </td>

                  {/* Man Hours */}
                  <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">
                    {row.manHours > 0
                      ? fmt(row.manHours)
                      : <span className="text-slate-300">—</span>}
                  </td>

                  {/* Funding */}
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        row.funding === 'Global Grant'
                          ? 'bg-amber-100 text-amber-700'
                          : row.funding === 'Self Funded'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {row.funding}
                    </span>
                  </td>
                </tr>
              ))}

              {tableRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400 text-sm">
                    No projects match your search.
                  </td>
                </tr>
              )}
            </tbody>

            {/* Totals footer */}
            {tableRows.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-800 text-xs">
                  <td className="px-3 py-3" colSpan={4}>
                    Totals ({tableRows.length} projects)
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {fmtINR(tableRows.reduce((s, r) => s + r.cost, 0))}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {fmt(tableRows.reduce((s, r) => s + r.beneficiaries, 0))}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {fmt(tableRows.reduce((s, r) => s + r.manHours, 0))}
                  </td>
                  <td className="px-3 py-3 text-slate-400">—</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
