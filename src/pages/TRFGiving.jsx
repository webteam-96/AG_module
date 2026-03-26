import { useState, useMemo } from 'react'
import { Heart, DollarSign, Users, TrendingUp, BarChart2, Award } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'
import KPICard from '../components/KPICard'
import SectionHeader from '../components/SectionHeader'
import { CLUBS, AG_TOTALS, AG_NAME } from '../data/realData'

// ─── Constants ───────────────────────────────────────────────────────────────
const ROTARY_BLUE  = '#003DA5'
const ROTARY_GOLD  = '#F7A81B'
const POLIO_PURPLE = '#7C3AED'
const OTHER_GREEN  = '#059669'

// ─── Formatters ──────────────────────────────────────────────────────────────
const fmtINR = (v) =>
  v ? `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '—'

const fmtINRShort = (v) => {
  if (!v) return '₹0'
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}k`
  return `₹${v.toFixed(0)}`
}

const truncate = (str, n = 14) => (str.length > n ? str.slice(0, n - 1) + '…' : str)

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs min-w-[180px]">
      <p className="font-semibold text-slate-800 mb-2 text-sm">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-4 mb-1">
          <span style={{ color: p.fill }} className="font-medium">{p.name}</span>
          <span className="text-slate-700">{fmtINR(p.value)}</span>
        </div>
      ))}
      <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-bold">
        <span className="text-slate-700">Total</span>
        <span className="text-slate-900">{fmtINR(total)}</span>
      </div>
    </div>
  )
}

// ─── AG Banner ────────────────────────────────────────────────────────────────
function AgBanner({ clubsTotal, agName }) {
  return (
    <div
      className="rounded-2xl p-6 text-white mb-6 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${ROTARY_BLUE} 0%, #0052CC 50%, ${ROTARY_GOLD} 100%)` }}
    >
      {/* decorative circles */}
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10 bg-white" />
      <div className="absolute -right-4 bottom-4 w-24 h-24 rounded-full opacity-10 bg-white" />

      <div className="relative z-10">
        <p className="text-sm font-medium text-blue-100 mb-1">My Clubs TRF Summary</p>
        <div className="flex items-end gap-4 mb-3">
          <span className="text-5xl font-extrabold tracking-tight">{fmtINR(clubsTotal)}</span>
          <div className="mb-1">
            <p className="text-lg font-semibold">Total TRF Giving</p>
            <p className="text-blue-100 text-sm">AG: {agName} · {CLUBS.length} clubs</p>
          </div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-full h-3 w-full max-w-md">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{ width: '100%', background: ROTARY_GOLD }}
          />
        </div>
        <p className="text-xs text-blue-100 mt-2">Rotary Year 2025–26 · as of 19 March 2026</p>
      </div>
    </div>
  )
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────
const MEDALS = ['🥇', '🥈', '🥉']

function Leaderboard({ clubs }) {
  const ranked = [...clubs]
    .filter((c) => c.trf.totalINR > 0)
    .sort((a, b) => b.trf.totalINR - a.trf.totalINR)
    .slice(0, 10)

  if (!ranked.length)
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <BarChart2 size={32} className="mb-2 opacity-40" />
        <p className="text-sm">No TRF giving recorded for these clubs yet.</p>
      </div>
    )

  return (
    <ol className="divide-y divide-slate-100">
      {ranked.map((club, i) => (
        <li key={club.id} className="flex items-center gap-3 py-3 px-1 hover:bg-slate-50 rounded-lg transition-colors">
          <span className="w-7 text-center text-lg leading-none select-none">
            {i < 3 ? MEDALS[i] : <span className="text-sm font-bold text-slate-400">#{i + 1}</span>}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-800 text-sm truncate">{club.name}</p>
            <p className="text-xs text-slate-400">{club.members} members</p>
          </div>
          <span className="text-sm font-bold text-blue-700">{fmtINR(club.trf.totalINR)}</span>
        </li>
      ))}
    </ol>
  )
}

// ─── Stacked Bar Chart ────────────────────────────────────────────────────────
function TRFStackedBarChart({ clubs }) {
  const data = clubs
    .filter((c) => c.trf.totalINR > 0)
    .sort((a, b) => b.trf.totalINR - a.trf.totalINR)
    .map((c) => ({
      name: truncate(c.name, 13),
      fullName: c.name,
      'Annual Fund': c.trf.annualINR,
      PolioPlus: c.trf.polioINR,
      Endowment: c.trf.endowment,
      'Other Funds': c.trf.others,
    }))

  if (!data.length)
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        No TRF giving data to display.
      </div>
    )

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 10, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#64748b' }}
          angle={-35}
          textAnchor="end"
          interval={0}
          height={70}
        />
        <YAxis
          tickFormatter={fmtINRShort}
          tick={{ fontSize: 11, fill: '#64748b' }}
          width={60}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Legend
          iconType="square"
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Bar dataKey="Annual Fund" stackId="trf" fill={ROTARY_BLUE} radius={[0, 0, 0, 0]} />
        <Bar dataKey="PolioPlus"   stackId="trf" fill={POLIO_PURPLE} />
        <Bar dataKey="Endowment"   stackId="trf" fill={ROTARY_GOLD} />
        <Bar dataKey="Other Funds" stackId="trf" fill={OTHER_GREEN} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Club vs AG Total Comparison ──────────────────────────────────────────────
function ClubVsAgBar({ clubs, agTotal }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider">
        My Clubs TRF Summary — Per-Club Contribution
      </h3>
      <div className="space-y-3">
        {clubs
          .filter((c) => c.trf.totalINR > 0)
          .sort((a, b) => b.trf.totalINR - a.trf.totalINR)
          .map((club) => {
            const pct = agTotal > 0 ? Math.min((club.trf.totalINR / agTotal) * 100, 100) : 0
            return (
              <div key={club.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{club.name}</span>
                  <span className="font-bold text-blue-700">{fmtINR(club.trf.totalINR)}</span>
                </div>
                <div className="bg-slate-100 rounded-full h-4">
                  <div
                    className="h-4 rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                    style={{ width: `${pct}%`, background: ROTARY_BLUE, minWidth: pct > 0 ? 32 : 0 }}
                  >
                    {pct >= 8 && (
                      <span className="text-white text-[10px] font-bold">{pct.toFixed(1)}%</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        {/* AG Total bar (always 100%) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-700">AG Total (All Clubs)</span>
            <span className="font-bold text-amber-600">{fmtINR(agTotal)}</span>
          </div>
          <div className="bg-slate-100 rounded-full h-4">
            <div
              className="h-4 rounded-full flex items-center justify-end pr-2"
              style={{ width: '100%', background: ROTARY_GOLD }}
            >
              <span className="text-white text-[10px] font-bold">100%</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4 text-right">
        Combined giving across {CLUBS.length} clubs
      </p>
    </div>
  )
}

// ─── Detailed Table ───────────────────────────────────────────────────────────
const SORT_FIELDS = {
  name:      (c) => c.name,
  annual:    (c) => c.trf.annualINR,
  polio:     (c) => c.trf.polioINR,
  endowment: (c) => c.trf.endowment,
  other:     (c) => c.trf.others,
  total:     (c) => c.trf.totalINR,
}

function SortIcon({ field, sortBy, asc }) {
  if (sortBy !== field) return <span className="text-slate-300 ml-1">↕</span>
  return <span className="text-blue-600 ml-1">{asc ? '↑' : '↓'}</span>
}

function TRFTable({ clubs }) {
  const [sortBy, setSortBy] = useState('total')
  const [asc, setAsc] = useState(false)

  const sorted = useMemo(() => {
    const fn = SORT_FIELDS[sortBy] || SORT_FIELDS.total
    return [...clubs].sort((a, b) => {
      const va = fn(a), vb = fn(b)
      if (typeof va === 'string') return asc ? va.localeCompare(vb) : vb.localeCompare(va)
      return asc ? va - vb : vb - va
    })
  }, [clubs, sortBy, asc])

  const handleSort = (f) => {
    if (sortBy === f) setAsc((v) => !v)
    else { setSortBy(f); setAsc(false) }
  }

  const th = (label, field, extraCls = '') => (
    <th
      key={field}
      onClick={() => handleSort(field)}
      className={`px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:bg-slate-100 ${extraCls}`}
    >
      {label}<SortIcon field={field} sortBy={sortBy} asc={asc} />
    </th>
  )

  const sumOf = (key) => clubs.reduce((s, c) => s + (c.trf[key] || 0), 0)
  const totalAnnual   = sumOf('annualINR')
  const totalPolio    = sumOf('polioINR')
  const totalEndow    = sumOf('endowment')
  const totalOther    = sumOf('others')
  const totalGiving   = sumOf('totalINR')

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
            <tr>
              {th('Club Name',    'name',      'min-w-[160px]')}
              {th('Annual Fund',  'annual',    'text-right')}
              {th('PolioPlus',    'polio',     'text-right')}
              {th('Endowment',    'endowment', 'text-right')}
              {th('Other Funds',  'other',     'text-right')}
              {th('Total (INR)',  'total',     'text-right')}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((club) => (
              <tr key={club.id} className="hover:bg-blue-50/40 transition-colors">
                <td className="px-3 py-2.5 font-medium text-slate-800">{club.name}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{fmtINR(club.trf.annualINR)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{fmtINR(club.trf.polioINR)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{fmtINR(club.trf.endowment)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{fmtINR(club.trf.others)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-blue-700">{fmtINR(club.trf.totalINR)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-800 text-white">
            <tr>
              <td className="px-3 py-3 font-bold text-sm">AG Total</td>
              <td className="px-3 py-3 text-right font-bold tabular-nums">{fmtINR(totalAnnual)}</td>
              <td className="px-3 py-3 text-right font-bold tabular-nums">{fmtINR(totalPolio)}</td>
              <td className="px-3 py-3 text-right font-bold tabular-nums">{fmtINR(totalEndow)}</td>
              <td className="px-3 py-3 text-right font-bold tabular-nums">{fmtINR(totalOther)}</td>
              <td className="px-3 py-3 text-right font-bold tabular-nums" style={{ color: ROTARY_GOLD }}>{fmtINR(totalGiving)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TRFGiving() {
  const agTotal   = AG_TOTALS.totalTRF_INR
  const agTotalUSD = AG_TOTALS.totalTRF_USD

  // Compute per-club aggregates
  const totalAnnualINR = CLUBS.reduce((s, c) => s + (c.trf.annualINR || 0), 0)
  const totalPolioINR  = CLUBS.reduce((s, c) => s + (c.trf.polioINR  || 0), 0)
  const totalOtherINR  = CLUBS.reduce((s, c) => s + (c.trf.others    || 0), 0)

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Header */}
      <SectionHeader
        title="The Rotary Foundation Giving"
        subtitle={`Charitable contributions — Rotary Year 2025-26 · AG: ${AG_NAME}`}
        icon={Heart}
      />

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Giving (INR)"
          value={fmtINR(agTotal)}
          icon={DollarSign}
          color="gold"
          subtitle="All TRF funds combined"
        />
        <KPICard
          title="Annual Fund"
          value={fmtINR(totalAnnualINR)}
          icon={TrendingUp}
          color="blue"
          subtitle="Unrestricted annual giving"
        />
        <KPICard
          title="PolioPlus Fund"
          value={fmtINR(totalPolioINR)}
          icon={Heart}
          color="purple"
          subtitle="Polio eradication"
        />
        <KPICard
          title="Other / Endowment"
          value={fmtINR(totalOtherINR)}
          icon={Award}
          color="green"
          subtitle="Designated & special"
        />
      </div>

      {/* 3. AG Banner */}
      <AgBanner clubsTotal={agTotal} agName={AG_NAME} />

      {/* 4. Chart + Leaderboard side-by-side */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Stacked Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800">TRF Giving Breakdown by Club</h3>
              <p className="text-xs text-slate-400 mt-0.5">Stacked by fund type · clubs with giving only</p>
            </div>
            <BarChart2 size={18} className="text-slate-300" />
          </div>
          <TRFStackedBarChart clubs={CLUBS} />
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">Top Giving Clubs</h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">My Clubs</span>
          </div>
          <Leaderboard clubs={CLUBS} />
        </div>
      </div>

      {/* 5. Club vs AG total comparison bars */}
      <ClubVsAgBar clubs={CLUBS} agTotal={agTotal} />

      {/* 6. Detailed Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-800">Detailed TRF Giving Table</h3>
          <span className="text-xs text-slate-400">Click column headers to sort</span>
        </div>
        <TRFTable clubs={CLUBS} />
      </div>
    </div>
  )
}
