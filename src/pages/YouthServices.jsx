import { useState, useMemo } from 'react'
import { Star, Users, Globe, BookOpen, Home } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import KPICard from '../components/KPICard'
import SectionHeader from '../components/SectionHeader'
import { CLUBS, DISTRICT_TOTALS, ZONE_TOTALS } from '../data/district3192'

// ─── helpers ───────────────────────────────────────────────────────────────────
const ROTARY_BLUE = '#003DA5'
const ROTARY_GOLD = '#F7A81B'

const fmt = (n) => (n ?? 0).toLocaleString()

function shortName(name) {
  return name.length > 18 ? name.slice(0, 16) + '…' : name
}

// ─── sub-components ────────────────────────────────────────────────────────────

function ZoneProgressBar({ label, zoneVal, districtVal, color }) {
  const pct = districtVal > 0 ? Math.min(100, (zoneVal / districtVal) * 100) : 0
  const barColors = {
    blue: 'bg-blue-500',
    gold: 'bg-yellow-400',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  }
  const textColors = {
    blue: 'text-blue-700',
    gold: 'text-yellow-700',
    green: 'text-green-700',
    purple: 'text-purple-700',
  }
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={`text-sm font-bold ${textColors[color]}`}>
          {zoneVal} <span className="text-slate-400 font-normal">/ {districtVal}</span>
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${barColors[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-slate-400 mt-0.5 text-right">
        {pct.toFixed(1)}% of district
      </div>
    </div>
  )
}

// ─── Custom Tooltip for sponsorship bar chart ───────────────────────────────
function SponsorshipTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-800 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: p.fill }} />
          <span className="text-slate-600">{p.name}:</span>
          <span className="font-bold text-slate-800">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── main page ─────────────────────────────────────────────────────────────────
export default function YouthServices() {
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

  const distTotals = DISTRICT_TOTALS

  // KPI values — sum from clubs if zone-specific, else use aggregates
  const kpi = useMemo(() => {
    if (isAll) {
      return {
        newRotaryClubs: distTotals.newRotaryClubs,
        newRotaract: distTotals.newRotaract,
        newInteract: distTotals.newInteract,
        rcc: distTotals.rcc,
      }
    }
    return {
      newRotaryClubs: totals.newRotaryClubs,
      newRotaract: totals.newRotaract,
      newInteract: totals.newInteract,
      rcc: totals.rcc,
    }
  }, [isAll, totals, distTotals])

  // ─ Table expansion state ───────────────────────────────────────────────────
  const [expandedRows, setExpandedRows] = useState(new Set())
  const toggleRow = (id) =>
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  // ─ Chart data — only clubs with sponsorships ──────────────────────────────
  const chartData = useMemo(
    () =>
      clubs
        .map((c) => ({
          name: shortName(c.name),
          fullName: c.name,
          rotaract: c.sponsored.newRotaractClubs.length,
          interact: c.sponsored.newInteractClubs.length,
          rcc: c.sponsored.sponsoredRCC.length,
        }))
        .filter((d) => d.rotaract + d.interact + d.rcc > 0),
    [clubs]
  )

  // ─ Table rows ─────────────────────────────────────────────────────────────
  const tableRows = useMemo(
    () =>
      clubs.map((c) => ({
        id: c.id,
        name: c.name,
        newRotaryClubs: c.sponsored.newRotaryClubs,
        newRotaract: c.sponsored.newRotaractClubs,
        newInteract: c.sponsored.newInteractClubs,
        rcc: c.sponsored.sponsoredRCC,
        total:
          c.sponsored.newRotaryClubs.length +
          c.sponsored.newRotaractClubs.length +
          c.sponsored.newInteractClubs.length +
          c.sponsored.sponsoredRCC.length,
      })),
    [clubs]
  )

  const tableTotals = useMemo(
    () => ({
      newRotaryClubs: tableRows.reduce((s, r) => s + r.newRotaryClubs.length, 0),
      newRotaract: tableRows.reduce((s, r) => s + r.newRotaract.length, 0),
      newInteract: tableRows.reduce((s, r) => s + r.newInteract.length, 0),
      rcc: tableRows.reduce((s, r) => s + r.rcc.length, 0),
      total: tableRows.reduce((s, r) => s + r.total, 0),
    }),
    [tableRows]
  )

  // ─ Sponsor detail cards ────────────────────────────────────────────────────
  const sponsorClubs = useMemo(
    () => clubs.filter((c) => {
      const s = c.sponsored
      return (
        s.newRotaryClubs.length +
        s.newRotaractClubs.length +
        s.newInteractClubs.length +
        s.sponsoredRCC.length > 0
      )
    }),
    [clubs]
  )

  const zoneSuffix = isAll ? '' : ` in Zone ${user.zone}`

  return (
    <div className="space-y-8">
      {/* ── Section Header ── */}
      <SectionHeader
        title="Youth Services & Sponsored Organizations"
        subtitle={`Rotaract, Interact & Rural Community Corps${zoneSuffix}`}
        icon={Star}
      />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="New Rotary Clubs Sponsored"
          value={fmt(kpi.newRotaryClubs)}
          subtitle={isAll ? 'District total' : `of ${distTotals.newRotaryClubs} district total`}
          icon={Globe}
          color="blue"
        />
        <KPICard
          title="New Rotaract Clubs"
          value={fmt(kpi.newRotaract)}
          subtitle={isAll ? 'District total' : `of ${distTotals.newRotaract} district total`}
          icon={Users}
          color="gold"
        />
        <KPICard
          title="New Interact Clubs"
          value={fmt(kpi.newInteract)}
          subtitle={isAll ? 'District total' : `of ${distTotals.newInteract} district total`}
          icon={BookOpen}
          color="green"
        />
        <KPICard
          title="Sponsored RCC"
          value={fmt(kpi.rcc)}
          subtitle={isAll ? 'District total' : `of ${distTotals.rcc} district total`}
          icon={Home}
          color="purple"
        />
      </div>

      {/* ── Zone vs District comparison ── */}
      {!isAll && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">
            Zone {user.zone} vs District — Sponsorship Share
          </h3>
          <ZoneProgressBar
            label="New Rotaract Clubs"
            zoneVal={kpi.newRotaract}
            districtVal={distTotals.newRotaract}
            color="gold"
          />
          <ZoneProgressBar
            label="New Interact Clubs"
            zoneVal={kpi.newInteract}
            districtVal={distTotals.newInteract}
            color="green"
          />
          <ZoneProgressBar
            label="Sponsored RCC"
            zoneVal={kpi.rcc}
            districtVal={distTotals.rcc}
            color="purple"
          />
          <ZoneProgressBar
            label="New Rotary Clubs"
            zoneVal={kpi.newRotaryClubs}
            districtVal={distTotals.newRotaryClubs}
            color="blue"
          />
        </div>
      )}

      {/* ── Sponsorship Breakdown Chart ── */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Per-Club Sponsorship Breakdown
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Only clubs that sponsored at least one organization are shown
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 4, right: 20, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                angle={-30}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip content={<SponsorshipTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="rotaract" name="Rotaract" fill={ROTARY_BLUE} radius={[3, 3, 0, 0]} />
              <Bar dataKey="interact" name="Interact" fill={ROTARY_GOLD} radius={[3, 3, 0, 0]} />
              <Bar dataKey="rcc" name="RCC" fill="#9333ea" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Club-wise Sponsorship Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Club-wise Sponsored Organizations</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click a row to expand and see individual organization names
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Club Name</th>
                <th className="px-4 py-3 text-center font-semibold">New Rotary</th>
                <th className="px-4 py-3 text-center font-semibold">Rotaract</th>
                <th className="px-4 py-3 text-center font-semibold">Interact</th>
                <th className="px-4 py-3 text-center font-semibold">RCC</th>
                <th className="px-4 py-3 text-center font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => {
                const isZero = row.total === 0
                const isExpanded = expandedRows.has(row.id)
                return (
                  <>
                    <tr
                      key={row.id}
                      onClick={() => !isZero && toggleRow(row.id)}
                      className={`border-t border-slate-100 transition-colors ${
                        isZero
                          ? 'bg-slate-50 text-slate-400 cursor-default'
                          : 'hover:bg-blue-50 cursor-pointer'
                      } ${isExpanded ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-2.5 font-medium">
                        <div className="flex items-center gap-2">
                          {!isZero && (
                            <span className="text-blue-400 text-xs">{isExpanded ? '▼' : '▶'}</span>
                          )}
                          <span className={isZero ? 'text-slate-400' : 'text-slate-800'}>
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <CellCount val={row.newRotaryClubs.length} isZero={isZero} />
                      <CellCount val={row.newRotaract.length} isZero={isZero} />
                      <CellCount val={row.newInteract.length} isZero={isZero} />
                      <CellCount val={row.rcc.length} isZero={isZero} />
                      <td className={`px-4 py-2.5 text-center font-bold ${isZero ? 'text-slate-300' : 'text-slate-800'}`}>
                        {row.total || '—'}
                      </td>
                    </tr>
                    {isExpanded && !isZero && (
                      <tr key={`${row.id}-expand`} className="bg-blue-50 border-t border-blue-100">
                        <td colSpan={6} className="px-6 py-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                            {row.newRotaryClubs.length > 0 && (
                              <ExpandCell label="New Rotary Clubs" names={row.newRotaryClubs} color="blue" />
                            )}
                            {row.newRotaract.length > 0 && (
                              <ExpandCell label="Rotaract Clubs" names={row.newRotaract} color="yellow" />
                            )}
                            {row.newInteract.length > 0 && (
                              <ExpandCell label="Interact Clubs" names={row.newInteract} color="green" />
                            )}
                            {row.rcc.length > 0 && (
                              <ExpandCell label="RCC Villages" names={row.rcc} color="purple" />
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
              {/* Totals row */}
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-800">
                <td className="px-4 py-3">District Total</td>
                <td className="px-4 py-3 text-center">{tableTotals.newRotaryClubs}</td>
                <td className="px-4 py-3 text-center">{tableTotals.newRotaract}</td>
                <td className="px-4 py-3 text-center">{tableTotals.newInteract}</td>
                <td className="px-4 py-3 text-center">{tableTotals.rcc}</td>
                <td className="px-4 py-3 text-center">{tableTotals.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Sponsor Detail Cards ── */}
      {sponsorClubs.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-3">Sponsorship Detail by Club</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sponsorClubs.map((club) => {
              const s = club.sponsored
              return (
                <div
                  key={club.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <div
                    className="px-4 py-3 text-white text-sm font-semibold"
                    style={{ backgroundColor: ROTARY_BLUE }}
                  >
                    {club.name}
                    <span className="ml-2 text-xs text-blue-200 font-normal">Zone {club.zone}</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {s.newRotaryClubs.length > 0 && (
                      <PillGroup label="New Rotary Clubs" items={s.newRotaryClubs} color="blue" />
                    )}
                    {s.newRotaractClubs.length > 0 && (
                      <PillGroup label="Rotaract Clubs" items={s.newRotaractClubs} color="gold" />
                    )}
                    {s.newInteractClubs.length > 0 && (
                      <PillGroup label="Interact Clubs" items={s.newInteractClubs} color="green" />
                    )}
                    {s.sponsoredRCC.length > 0 && (
                      <PillGroup label="RCC Villages" items={s.sponsoredRCC} color="purple" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── small helper components ───────────────────────────────────────────────────

function CellCount({ val, isZero }) {
  return (
    <td className={`px-4 py-2.5 text-center ${isZero ? 'text-slate-300' : val > 0 ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
      {val > 0 ? val : '—'}
    </td>
  )
}

function ExpandCell({ label, names, color }) {
  const bg = {
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
  }
  return (
    <div>
      <p className="font-semibold text-slate-600 mb-1">{label}</p>
      <p className={`text-xs px-2 py-1 rounded ${bg[color]}`}>{names.join(', ')}</p>
    </div>
  )
}

function PillGroup({ label, items, color }) {
  const pill = {
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    gold: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    green: 'bg-green-100 text-green-800 border border-green-200',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
  }
  const dot = {
    blue: 'bg-blue-500',
    gold: 'bg-yellow-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  }
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={`w-2 h-2 rounded-full ${dot[color]}`} />
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className="text-xs text-slate-400">({items.length})</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className={`px-2 py-0.5 rounded-full text-xs font-medium ${pill[color]}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
