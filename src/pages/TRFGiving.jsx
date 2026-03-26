import { useState, useMemo } from 'react'
import { Heart, DollarSign, Users, TrendingUp, BarChart2, Award } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'
import KPICard from '../components/KPICard'
import SectionHeader from '../components/SectionHeader'
import { ZONES, ZONE_TOTALS, DISTRICT_TOTALS, CLUBS, getZoneClubs, getZoneInfo } from '../data/district3192'

// ─── Constants ───────────────────────────────────────────────────────────────
const ROTARY_BLUE  = '#003DA5'
const ROTARY_GOLD  = '#F7A81B'
const POLIO_PURPLE = '#7C3AED'
const OTHER_GREEN  = '#059669'

// ─── Formatters ──────────────────────────────────────────────────────────────
const fmtUSD = (v) =>
  v ? `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'

const fmtUSDShort = (v) => {
  if (!v) return '$0'
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`
  return `$${v.toFixed(0)}`
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
          <span className="text-slate-700">{fmtUSD(p.value)}</span>
        </div>
      ))}
      <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-bold">
        <span className="text-slate-700">Total</span>
        <span className="text-slate-900">{fmtUSD(total)}</span>
      </div>
    </div>
  )
}

// ─── Zone Banner ─────────────────────────────────────────────────────────────
function ZoneBanner({ zoneTotal, districtTotal, zoneName }) {
  const pct = districtTotal > 0 ? ((zoneTotal / districtTotal) * 100).toFixed(1) : 0
  return (
    <div
      className="rounded-2xl p-6 text-white mb-6 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${ROTARY_BLUE} 0%, #0052CC 50%, ${ROTARY_GOLD} 100%)` }}
    >
      {/* decorative circle */}
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10 bg-white" />
      <div className="absolute -right-4 bottom-4 w-24 h-24 rounded-full opacity-10 bg-white" />

      <div className="relative z-10">
        <p className="text-sm font-medium text-blue-100 mb-1">Zone Contribution</p>
        <div className="flex items-end gap-4 mb-3">
          <span className="text-5xl font-extrabold tracking-tight">{pct}%</span>
          <div className="mb-1">
            <p className="text-lg font-semibold">{zoneName} of District Total</p>
            <p className="text-blue-100 text-sm">
              {fmtUSD(zoneTotal)} of {fmtUSD(districtTotal)} district-wide
            </p>
          </div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-full h-3 w-full max-w-md">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(pct, 100)}%`, background: ROTARY_GOLD }}
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
    .filter((c) => c.trf.total > 0)
    .sort((a, b) => b.trf.total - a.trf.total)
    .slice(0, 10)

  if (!ranked.length)
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <BarChart2 size={32} className="mb-2 opacity-40" />
        <p className="text-sm">No TRF giving recorded for this zone yet.</p>
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
            <p className="text-xs text-slate-400">{club.trf.donors} donors</p>
          </div>
          <span className="text-sm font-bold text-blue-700">{fmtUSD(club.trf.total)}</span>
        </li>
      ))}
    </ol>
  )
}

// ─── Stacked Bar Chart ────────────────────────────────────────────────────────
function TRFStackedBarChart({ clubs }) {
  const data = clubs
    .filter((c) => c.trf.total > 0)
    .sort((a, b) => b.trf.total - a.trf.total)
    .map((c) => ({
      name: truncate(c.name, 13),
      fullName: c.name,
      'Annual Fund': c.trf.annualFund,
      PolioPlus: c.trf.polioPlus,
      'Other Funds': c.trf.otherFunds,
      Endowment: c.trf.endowment,
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
          tickFormatter={fmtUSDShort}
          tick={{ fontSize: 11, fill: '#64748b' }}
          width={52}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Legend
          iconType="square"
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Bar dataKey="Annual Fund" stackId="trf" fill={ROTARY_BLUE} radius={[0, 0, 0, 0]} />
        <Bar dataKey="PolioPlus"   stackId="trf" fill={POLIO_PURPLE} />
        <Bar dataKey="Other Funds" stackId="trf" fill={OTHER_GREEN} />
        <Bar dataKey="Endowment"   stackId="trf" fill={ROTARY_GOLD} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Zone vs District Comparison ──────────────────────────────────────────────
function ZoneVsDistrictBar({ zoneTotal, districtTotal, label }) {
  const pct = districtTotal > 0 ? Math.min((zoneTotal / districtTotal) * 100, 100) : 0
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider">
        Zone vs District — TRF Comparison
      </h3>
      <div className="space-y-3">
        {/* Zone bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-700">{label} Giving</span>
            <span className="font-bold text-blue-700">{fmtUSD(zoneTotal)}</span>
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
        {/* District bar (always 100%) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-700">District Total</span>
            <span className="font-bold text-amber-600">{fmtUSD(districtTotal)}</span>
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
        {label} contributes {pct.toFixed(2)}% of district total giving
      </p>
    </div>
  )
}

// ─── Detailed Table ───────────────────────────────────────────────────────────
const SORT_FIELDS = {
  name:       (c) => c.name,
  annual:     (c) => c.trf.annualFund,
  polio:      (c) => c.trf.polioPlus,
  other:      (c) => c.trf.otherFunds,
  endowment:  (c) => c.trf.endowment,
  total:      (c) => c.trf.total,
  donors:     (c) => c.trf.donors,
  newDonors:  (c) => c.trf.newDonors,
}

function SortIcon({ field, sortBy, asc }) {
  if (sortBy !== field) return <span className="text-slate-300 ml-1">↕</span>
  return <span className="text-blue-600 ml-1">{asc ? '↑' : '↓'}</span>
}

function TRFTable({ clubs, totals }) {
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

  // Compute zone totals from clubs array
  const sumOf = (key) => clubs.reduce((s, c) => s + (c.trf[key] || 0), 0)
  const totalAnnual   = sumOf('annualFund')
  const totalPolio    = sumOf('polioPlus')
  const totalOther    = sumOf('otherFunds')
  const totalEndow    = sumOf('endowment')
  const totalGiving   = sumOf('total')
  const totalDonors   = sumOf('donors')
  const totalNewDonors = sumOf('newDonors')

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
            <tr>
              {th('Club Name',   'name',      'min-w-[160px]')}
              {th('Annual Fund', 'annual',    'text-right')}
              {th('PolioPlus',   'polio',     'text-right')}
              {th('Other Funds', 'other',     'text-right')}
              {th('Endowment',   'endowment', 'text-right')}
              {th('Total',       'total',     'text-right')}
              {th('Donors',      'donors',    'text-right')}
              {th('New Donors',  'newDonors', 'text-right')}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((club) => (
              <tr key={club.id} className="hover:bg-blue-50/40 transition-colors">
                <td className="px-3 py-2.5 font-medium text-slate-800">{club.name}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{fmtUSD(club.trf.annualFund)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{fmtUSD(club.trf.polioPlus)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{fmtUSD(club.trf.otherFunds)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{fmtUSD(club.trf.endowment)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-blue-700">{fmtUSD(club.trf.total)}</td>
                <td className="px-3 py-2.5 text-right text-slate-600">{club.trf.donors || '—'}</td>
                <td className="px-3 py-2.5 text-right text-slate-600">{club.trf.newDonors || '—'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-800 text-white">
            <tr>
              <td className="px-3 py-3 font-bold text-sm">Zone Total</td>
              <td className="px-3 py-3 text-right font-bold tabular-nums">{fmtUSD(totalAnnual)}</td>
              <td className="px-3 py-3 text-right font-bold tabular-nums">{fmtUSD(totalPolio)}</td>
              <td className="px-3 py-3 text-right font-bold tabular-nums">{fmtUSD(totalOther)}</td>
              <td className="px-3 py-3 text-right font-bold tabular-nums">{fmtUSD(totalEndow)}</td>
              <td className="px-3 py-3 text-right font-bold tabular-nums" style={{ color: ROTARY_GOLD }}>{fmtUSD(totalGiving)}</td>
              <td className="px-3 py-3 text-right font-bold">{totalDonors}</td>
              <td className="px-3 py-3 text-right font-bold">{totalNewDonors}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TRFGiving() {
  const user   = JSON.parse(sessionStorage.getItem('ag_user') || '{}')
  const clubs  = user.zone === 'ALL' ? CLUBS : getZoneClubs(user.zone)
  const totals = user.zone === 'ALL' ? DISTRICT_TOTALS : ZONE_TOTALS[user.zone]
  const zoneInfo = user.zone === 'ALL' ? null : getZoneInfo(user.zone)
  const zoneName = user.zone === 'ALL' ? 'All Zones (District)' : `Zone ${user.zone}`

  // Derive per-club aggregated sums for KPI when zone === ALL
  // For zone users, ZONE_TOTALS has the fields. For ALL, DISTRICT_TOTALS has them.
  const kpiTotal   = totals?.trfTotal  ?? clubs.reduce((s, c) => s + c.trf.total, 0)
  const kpiAnnual  = totals?.trfAnnualFund ?? clubs.reduce((s, c) => s + c.trf.annualFund, 0)
  const kpiPolio   = totals?.trfPolioPlus  ?? clubs.reduce((s, c) => s + c.trf.polioPlus, 0)
  const kpiOther   = (totals?.trfOther ?? totals?.trfOtherFunds) ?? clubs.reduce((s, c) => s + c.trf.otherFunds, 0)
  const kpiDonors  = totals?.donors    ?? clubs.reduce((s, c) => s + c.trf.donors, 0)
  const kpiNew     = totals?.newDonors ?? clubs.reduce((s, c) => s + c.trf.newDonors, 0)

  // For zone-level users, compute annual/polio/other from clubs (ZONE_TOTALS doesn't break them out)
  const zoneAnnual = clubs.reduce((s, c) => s + c.trf.annualFund, 0)
  const zonePolio  = clubs.reduce((s, c) => s + c.trf.polioPlus, 0)
  const zoneOther  = clubs.reduce((s, c) => s + c.trf.otherFunds, 0)
  const zoneEndow  = clubs.reduce((s, c) => s + c.trf.endowment, 0)

  const displayAnnual = user.zone === 'ALL' ? kpiAnnual : zoneAnnual
  const displayPolio  = user.zone === 'ALL' ? kpiPolio  : zonePolio
  const displayOther  = user.zone === 'ALL' ? kpiOther  : zoneOther
  const displayTotal  = kpiTotal

  const districtTotal = DISTRICT_TOTALS.trfTotal
  const zoneTotal     = user.zone === 'ALL' ? districtTotal : (ZONE_TOTALS[user.zone]?.trfTotal ?? clubs.reduce((s, c) => s + c.trf.total, 0))

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Header */}
      <SectionHeader
        title="The Rotary Foundation Giving"
        subtitle="Charitable contributions — Rotary Year 2025-26"
        icon={Heart}
      />

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Giving (USD)"
          value={fmtUSD(displayTotal)}
          icon={DollarSign}
          color="gold"
          subtitle="All TRF funds combined"
        />
        <KPICard
          title="Annual Fund"
          value={fmtUSD(displayAnnual)}
          icon={TrendingUp}
          color="blue"
          subtitle="Unrestricted annual giving"
        />
        <KPICard
          title="PolioPlus Fund"
          value={fmtUSD(displayPolio)}
          icon={Heart}
          color="purple"
          subtitle="Polio eradication"
        />
        <KPICard
          title="Other Funds"
          value={fmtUSD(displayOther)}
          icon={Award}
          color="green"
          subtitle="Designated & special"
        />
        <KPICard
          title="Total Donors"
          value={kpiDonors}
          icon={Users}
          color="blue"
          subtitle={`${kpiDonors} donors, ${kpiNew} new`}
        />
      </div>

      {/* 3. Zone Banner */}
      {user.zone !== 'ALL' && (
        <ZoneBanner
          zoneTotal={zoneTotal}
          districtTotal={districtTotal}
          zoneName={zoneName}
        />
      )}

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
          <TRFStackedBarChart clubs={clubs} />
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">Top Giving Clubs</h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{zoneName}</span>
          </div>
          <Leaderboard clubs={clubs} />
        </div>
      </div>

      {/* 5. Zone vs District */}
      {user.zone !== 'ALL' && (
        <ZoneVsDistrictBar
          zoneTotal={zoneTotal}
          districtTotal={districtTotal}
          label={zoneName}
        />
      )}

      {/* 6. Detailed Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-800">Detailed TRF Giving Table</h3>
          <span className="text-xs text-slate-400">Click column headers to sort</span>
        </div>
        <TRFTable clubs={clubs} totals={totals} />
      </div>
    </div>
  )
}
