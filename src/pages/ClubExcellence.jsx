import { useState, useMemo } from 'react'
import { Award, CheckCircle, XCircle, AlertTriangle, Target, IndianRupee } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import KPICard from '../components/KPICard'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'
import { ZONES, ZONE_TOTALS, DISTRICT_TOTALS, CLUBS, getZoneClubs, getZoneInfo } from '../data/district3192'

// ─── Constants ────────────────────────────────────────────────────────────────
const GREEN  = '#059669'
const AMBER  = '#D97706'
const RED    = '#DC2626'
const GRAY   = '#94A3B8'
const BLUE   = '#003DA5'

// ─── Formatters ───────────────────────────────────────────────────────────────
/**
 * Format a number in Indian numbering system with ₹ prefix.
 * e.g. 182876.40 → "₹1,82,876"
 */
const fmtINR = (v) => {
  if (!v) return '—'
  const n = Math.round(Number(v))
  // Indian grouping: last 3 digits then groups of 2
  const s = n.toString()
  if (s.length <= 3) return `₹${s}`
  const last3 = s.slice(-3)
  const rest   = s.slice(0, -3)
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return `₹${grouped},${last3}`
}

const pctLabel = (num, den) => (den > 0 ? `${((num / den) * 100).toFixed(0)}%` : '0%')

// ─── Donut chart custom label ─────────────────────────────────────────────────
function DonutCenterLabel({ viewBox, earned, total }) {
  const { cx, cy } = viewBox
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} dy="-0.4em" fontSize="22" fontWeight="700" fill="#1e293b">
        {earned}
      </tspan>
      <tspan x={cx} dy="1.4em" fontSize="12" fill="#64748b">
        of {total} clubs
      </tspan>
    </text>
  )
}

// ─── Award Donut Chart ────────────────────────────────────────────────────────
function AwardDonut({ clubs }) {
  const earned  = clubs.filter((c) => c.excellence.awardEarned).length
  const newClub = clubs.filter((c) => !c.excellence.julyInvoice && !c.excellence.janInvoice && c.excellence.goalsSet === 0).length
  const noAward = clubs.length - earned - newClub

  const data = [
    { name: 'Award Earned', value: earned,  color: GREEN },
    { name: 'No Award',     value: noAward, color: GRAY  },
    { name: 'New Club N/A', value: newClub, color: BLUE  },
  ].filter((d) => d.value > 0)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="text-base font-semibold text-slate-800 mb-1">Award Status</h3>
      <p className="text-xs text-slate-400 mb-4">Club Excellence Award distribution</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
            <DonutCenterLabel earned={earned} total={clubs.length} />
          </Pie>
          <Tooltip
            formatter={(v, n) => [v, n]}
            contentStyle={{ borderRadius: 10, fontSize: 12 }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Invoice Compliance Bars ──────────────────────────────────────────────────
function InvoiceComplianceBars({ clubs, totals }) {
  const total     = clubs.length
  const julyPaid  = clubs.filter((c) => c.excellence.julyInvoice).length
  const janPaid   = clubs.filter((c) => c.excellence.janInvoice).length
  const julyPct   = total > 0 ? (julyPaid / total) * 100 : 0
  const janPct    = total > 0 ? (janPaid / total)  * 100 : 0

  const Bar = ({ label, paid, tot, pct }) => (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-xs font-semibold text-slate-500">{paid} / {tot} clubs</span>
      </div>
      <div className="bg-slate-100 rounded-full h-7 relative overflow-hidden">
        <div
          className="h-full rounded-full flex items-center justify-end px-3 transition-all duration-700"
          style={{ width: `${Math.max(pct, 4)}%`, background: pct >= 80 ? GREEN : pct >= 50 ? AMBER : RED }}
        >
          {pct >= 15 && (
            <span className="text-white text-xs font-bold">{pct.toFixed(0)}%</span>
          )}
        </div>
        {pct < 15 && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold">{pct.toFixed(0)}%</span>
        )}
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="text-base font-semibold text-slate-800 mb-1">Invoice Compliance</h3>
      <p className="text-xs text-slate-400 mb-4">Rotary Year 2025–26 invoices paid</p>
      <div className="flex flex-col sm:flex-row gap-5">
        <Bar label="July Invoice"    paid={julyPaid} tot={total} pct={julyPct} />
        <Bar label="January Invoice" paid={janPaid}  tot={total} pct={janPct}  />
      </div>
    </div>
  )
}

// ─── Goals Progress Panel ─────────────────────────────────────────────────────
function GoalsProgress({ clubs }) {
  const withGoals = clubs
    .filter((c) => c.excellence.goalsSet > 0)
    .sort((a, b) => {
      const pa = a.excellence.goalsCompleted / a.excellence.goalsSet
      const pb = b.excellence.goalsCompleted / b.excellence.goalsSet
      return pb - pa
    })

  if (!withGoals.length)
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-1">Goals Completion</h3>
        <p className="text-xs text-slate-400 mt-2">No clubs with goals set in this zone.</p>
      </div>
    )

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="text-base font-semibold text-slate-800 mb-1">Goals Completion per Club</h3>
      <p className="text-xs text-slate-400 mb-4">Green ≥ 80% · Amber 40–79% · Red &lt; 40%</p>
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {withGoals.map((club) => {
          const pct = (club.excellence.goalsCompleted / club.excellence.goalsSet) * 100
          const color = pct >= 80 ? GREEN : pct >= 40 ? AMBER : RED
          return (
            <div key={club.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-700 truncate max-w-[180px]">{club.name}</span>
                <span className="text-xs text-slate-500 shrink-0 ml-2">
                  {club.excellence.goalsCompleted}/{club.excellence.goalsSet}
                </span>
              </div>
              <div className="bg-slate-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(pct, 100)}%`, background: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Invoice chip helper ──────────────────────────────────────────────────────
function InvoiceChip({ paid, na }) {
  if (na) return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border bg-slate-100 text-slate-500 border-slate-200 font-medium">
      N/A
    </span>
  )
  return paid ? (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border bg-green-100 text-green-700 border-green-300 font-medium">
      <CheckCircle size={11} /> Paid
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border bg-red-100 text-red-700 border-red-300 font-medium">
      <XCircle size={11} /> Unpaid
    </span>
  )
}

// ─── Completion % Cell ────────────────────────────────────────────────────────
function CompletionCell({ goalsSet, goalsCompleted }) {
  if (!goalsSet) return <span className="text-slate-400 text-xs">—</span>
  const pct = (goalsCompleted / goalsSet) * 100
  const bg  = pct >= 80 ? 'bg-green-100 text-green-700' : pct >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
  return (
    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${bg}`}>
      {pct.toFixed(0)}%
    </span>
  )
}

// ─── Main Compliance Table ────────────────────────────────────────────────────
const TABLE_COLS = [
  { key: 'name',       label: 'Club Name',    sortFn: (c) => c.name },
  { key: 'july',       label: 'July Invoice', sortFn: (c) => c.excellence.julyInvoice ? 1 : 0 },
  { key: 'jan',        label: 'Jan Invoice',  sortFn: (c) => c.excellence.janInvoice  ? 1 : 0 },
  { key: 'goalsSet',   label: 'Goals Set',    sortFn: (c) => c.excellence.goalsSet },
  { key: 'completed',  label: 'Completed',    sortFn: (c) => c.excellence.goalsCompleted },
  { key: 'pct',        label: 'Completion%',  sortFn: (c) => c.excellence.goalsSet ? (c.excellence.goalsCompleted / c.excellence.goalsSet) : -1 },
  { key: 'award',      label: 'Award',        sortFn: (c) => c.excellence.awardEarned ? 1 : 0 },
  { key: 'dues',       label: 'Dues (INR)',   sortFn: (c) => c.excellence.duesOutstanding },
]

function SortIcon({ col, sortBy, asc }) {
  if (sortBy !== col) return <span className="text-slate-300 ml-1">↕</span>
  return <span className="text-blue-600 ml-1">{asc ? '↑' : '↓'}</span>
}

function ComplianceTable({ clubs }) {
  const [sortBy, setSortBy] = useState('name')
  const [asc,    setAsc]    = useState(true)

  const sorted = useMemo(() => {
    const col = TABLE_COLS.find((c) => c.key === sortBy)
    if (!col) return clubs
    return [...clubs].sort((a, b) => {
      const va = col.sortFn(a), vb = col.sortFn(b)
      if (typeof va === 'string') return asc ? va.localeCompare(vb) : vb.localeCompare(va)
      return asc ? va - vb : vb - va
    })
  }, [clubs, sortBy, asc])

  const toggle = (key) => {
    if (sortBy === key) setAsc((v) => !v)
    else { setSortBy(key); setAsc(true) }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
            <tr>
              {TABLE_COLS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggle(col.key)}
                  className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:bg-slate-100"
                >
                  {col.label}<SortIcon col={col.key} sortBy={sortBy} asc={asc} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((club) => {
              const hasDues  = club.excellence.duesOutstanding > 0
              const hasAward = club.excellence.awardEarned
              const rowBorder = hasDues
                ? 'border-l-4 border-l-red-400'
                : hasAward
                ? 'border-l-4 border-l-green-400'
                : 'border-l-4 border-l-transparent'

              return (
                <tr
                  key={club.id}
                  className={`hover:bg-slate-50/60 transition-colors ${rowBorder}`}
                >
                  {/* Club Name */}
                  <td className="px-3 py-2.5 font-medium text-slate-800 min-w-[160px]">
                    {club.name}
                  </td>
                  {/* July Invoice */}
                  <td className="px-3 py-2.5">
                    <InvoiceChip paid={club.excellence.julyInvoice} />
                  </td>
                  {/* Jan Invoice */}
                  <td className="px-3 py-2.5">
                    <InvoiceChip paid={club.excellence.janInvoice} />
                  </td>
                  {/* Goals Set */}
                  <td className="px-3 py-2.5 text-center text-slate-600">
                    {club.excellence.goalsSet || <span className="text-slate-300">—</span>}
                  </td>
                  {/* Goals Completed */}
                  <td className="px-3 py-2.5 text-center text-slate-600">
                    {club.excellence.goalsCompleted || <span className="text-slate-300">—</span>}
                  </td>
                  {/* Completion % */}
                  <td className="px-3 py-2.5 text-center">
                    <CompletionCell
                      goalsSet={club.excellence.goalsSet}
                      goalsCompleted={club.excellence.goalsCompleted}
                    />
                  </td>
                  {/* Award */}
                  <td className="px-3 py-2.5">
                    <StatusBadge status={club.excellence.awardEarned ? 'award' : 'no-award'} />
                  </td>
                  {/* Dues */}
                  <td className="px-3 py-2.5 text-right">
                    {hasDues ? (
                      <span className="font-bold text-red-600 tabular-nums">
                        {fmtINR(club.excellence.duesOutstanding)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle size={11} /> Clear
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Dues Summary Panel ───────────────────────────────────────────────────────
function DuesSummaryPanel({ clubs }) {
  const withDues = clubs
    .filter((c) => c.excellence.duesOutstanding > 0)
    .sort((a, b) => b.excellence.duesOutstanding - a.excellence.duesOutstanding)

  const total = withDues.reduce((s, c) => s + c.excellence.duesOutstanding, 0)

  if (!withDues.length)
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
        <CheckCircle size={20} className="text-green-600 shrink-0" />
        <div>
          <p className="font-semibold text-green-800">All dues cleared!</p>
          <p className="text-sm text-green-600">No clubs with outstanding dues in this zone.</p>
        </div>
      </div>
    )

  return (
    <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
      <div className="bg-red-50 border-b border-red-200 px-5 py-3 flex items-center gap-2">
        <AlertTriangle size={16} className="text-red-600 shrink-0" />
        <h3 className="text-sm font-semibold text-red-800">
          Dues Outstanding — {withDues.length} club{withDues.length > 1 ? 's' : ''}
        </h3>
      </div>
      <ul className="divide-y divide-slate-100">
        {withDues.map((club, i) => (
          <li key={club.id} className="flex items-center justify-between px-5 py-3 hover:bg-red-50/40 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 w-5 text-right">{i + 1}.</span>
              <div>
                <p className="text-sm font-medium text-slate-800">{club.name}</p>
                <p className="text-xs text-slate-400">Zone {club.zone}</p>
              </div>
            </div>
            <span className="font-bold text-red-600 tabular-nums text-sm">
              {fmtINR(club.excellence.duesOutstanding)}
            </span>
          </li>
        ))}
      </ul>
      <div className="bg-red-600 px-5 py-3 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">Total Outstanding</span>
        <span className="text-white font-extrabold text-base tabular-nums">{fmtINR(total)}</span>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClubExcellence() {
  const user   = JSON.parse(sessionStorage.getItem('ag_user') || '{}')
  const clubs  = user.zone === 'ALL' ? CLUBS : getZoneClubs(user.zone)
  const totals = user.zone === 'ALL' ? DISTRICT_TOTALS : ZONE_TOTALS[user.zone]

  const total       = clubs.length
  const julyPaid    = clubs.filter((c) => c.excellence.julyInvoice).length
  const janPaid     = clubs.filter((c) => c.excellence.janInvoice).length
  const goalsSetCnt = clubs.filter((c) => c.excellence.goalsSet > 0).length
  const goalsCompl  = clubs.filter((c) => c.excellence.goalsSet > 0 && c.excellence.goalsCompleted === c.excellence.goalsSet).length
  const awardCnt    = clubs.filter((c) => c.excellence.awardEarned).length
  const duesCnt     = clubs.filter((c) => c.excellence.duesOutstanding > 0).length
  const duesTotal   = clubs.reduce((s, c) => s + c.excellence.duesOutstanding, 0)

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Header */}
      <SectionHeader
        title="Club Excellence & Compliance"
        subtitle="Award tracking, invoice status, goals completion — Rotary Year 2025-26"
        icon={Award}
      />

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="July Invoice Paid"
          value={julyPaid}
          icon={CheckCircle}
          color="green"
          subtitle={`of ${total} clubs`}
        />
        <KPICard
          title="Jan Invoice Paid"
          value={janPaid}
          icon={CheckCircle}
          color="green"
          subtitle={`of ${total} clubs`}
        />
        <KPICard
          title="Goals Set"
          value={goalsSetCnt}
          icon={Target}
          color="blue"
          subtitle={`${goalsSetCnt} of ${total} clubs`}
        />
        <KPICard
          title="Goals Completed"
          value={goalsCompl}
          icon={Award}
          color="gold"
          subtitle="Clubs with all goals done"
        />
        <KPICard
          title="Award Earned"
          value={awardCnt}
          icon={Award}
          color="green"
          subtitle={`${awardCnt} of ${total} clubs`}
        />
        <KPICard
          title="Dues Outstanding"
          value={duesCnt}
          icon={AlertTriangle}
          color={duesCnt > 0 ? 'red' : 'green'}
          subtitle={duesCnt > 0 ? `${duesCnt} clubs · ${fmtINR(duesTotal)}` : 'All clubs clear'}
        />
      </div>

      {/* 3. Donut + Invoice Bars + Goals Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AwardDonut clubs={clubs} />
        <InvoiceComplianceBars clubs={clubs} totals={totals} />
        <GoalsProgress clubs={clubs} />
      </div>

      {/* 4. Compliance Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-800">Club Compliance Detail</h3>
          <span className="text-xs text-slate-400">Click column headers to sort</span>
        </div>
        <ComplianceTable clubs={clubs} />
      </div>

      {/* 5. Dues Summary Panel */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Dues Summary</h3>
        <DuesSummaryPanel clubs={clubs} />
      </div>
    </div>
  )
}
