import { useState, useMemo } from 'react'
import { Star, Users, Globe, BookOpen, Home } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import KPICard from '../components/KPICard'
import SectionHeader from '../components/SectionHeader'
import { CLUBS } from '../data/realData'

// ─── helpers ───────────────────────────────────────────────────────────────────
const ROTARY_BLUE = '#003DA5'
const ROTARY_GOLD = '#F7A81B'

const fmt = (n) => (n ?? 0).toLocaleString()

function shortName(name) {
  return name.length > 18 ? name.slice(0, 16) + '…' : name
}

// ─── sub-components ────────────────────────────────────────────────────────────

function ClubProgressBar({ label, clubVal, totalVal, color }) {
  const pct = totalVal > 0 ? Math.min(100, (clubVal / totalVal) * 100) : 0
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
          {clubVal} <span className="text-slate-400 font-normal">/ {totalVal} total</span>
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${barColors[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-slate-400 mt-0.5 text-right">
        {pct.toFixed(1)}% of all clubs
      </div>
    </div>
  )
}

// ─── Custom Tooltip ─────────────────────────────────────────────────────────
function NewGenTooltip({ active, payload, label }) {
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
  // ─ Aggregate KPI values from all clubs ──────────────────────────────────────
  const kpi = useMemo(() => ({
    newGenerationService: CLUBS.reduce((s, c) => s + (c.newGenerationService || 0), 0),
    vocationalService:    CLUBS.reduce((s, c) => s + (c.vocationalService    || 0), 0),
    internationalService: CLUBS.reduce((s, c) => s + (c.internationalService || 0), 0),
    totalProjects:        CLUBS.reduce((s, c) => s + (c.totalProjects        || 0), 0),
  }), [])

  // ─ Table expansion state ───────────────────────────────────────────────────
  const [expandedRows, setExpandedRows] = useState(new Set())
  const toggleRow = (id) =>
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  // ─ Chart data — new generation service count per club ─────────────────────
  const chartData = useMemo(
    () =>
      CLUBS
        .map((c) => ({
          name: shortName(c.name),
          fullName: c.name,
          newGeneration: c.newGenerationService || 0,
          vocational:    c.vocationalService    || 0,
          international: c.internationalService || 0,
        }))
        .filter((d) => d.newGeneration + d.vocational + d.international > 0),
    []
  )

  // ─ Table rows ─────────────────────────────────────────────────────────────
  const tableRows = useMemo(
    () =>
      CLUBS.map((c) => ({
        id:   c.id,
        name: c.name,
        newGenerationService: c.newGenerationService || 0,
        vocationalService:    c.vocationalService    || 0,
        internationalService: c.internationalService || 0,
        totalProjects:        c.totalProjects        || 0,
        members:              c.members              || 0,
      })),
    []
  )

  const tableTotals = useMemo(
    () => ({
      newGenerationService: tableRows.reduce((s, r) => s + r.newGenerationService, 0),
      vocationalService:    tableRows.reduce((s, r) => s + r.vocationalService,    0),
      internationalService: tableRows.reduce((s, r) => s + r.internationalService, 0),
      totalProjects:        tableRows.reduce((s, r) => s + r.totalProjects,        0),
    }),
    [tableRows]
  )

  // ─ Clubs with new generation service activity ─────────────────────────────
  const activeClubs = useMemo(
    () => CLUBS.filter((c) => (c.newGenerationService || 0) > 0),
    []
  )

  return (
    <div className="space-y-8">
      {/* ── Section Header ── */}
      <SectionHeader
        title="Youth & New Generation Services"
        subtitle="New generation service activities across all 4 clubs — Rotary Year 2025-26"
        icon={Star}
      />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="New Generation Service"
          value={fmt(kpi.newGenerationService)}
          subtitle={`across ${CLUBS.length} clubs`}
          icon={Star}
          color="gold"
        />
        <KPICard
          title="Vocational Service"
          value={fmt(kpi.vocationalService)}
          subtitle={`across ${CLUBS.length} clubs`}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="International Service"
          value={fmt(kpi.internationalService)}
          subtitle={`across ${CLUBS.length} clubs`}
          icon={Globe}
          color="green"
        />
        <KPICard
          title="Total Projects"
          value={fmt(kpi.totalProjects)}
          subtitle="all service categories"
          icon={BookOpen}
          color="purple"
        />
      </div>

      {/* ── Per-Club New Generation Service Bars ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-4">
          Per-Club New Generation Service Count
        </h3>
        {CLUBS.map((club) => (
          <ClubProgressBar
            key={club.id}
            label={club.name}
            clubVal={club.newGenerationService || 0}
            totalVal={kpi.newGenerationService || 1}
            color="gold"
          />
        ))}
      </div>

      {/* ── Service Breakdown Chart ── */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Per-Club Service Breakdown
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            New generation, vocational and international service activities per club
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
              <Tooltip content={<NewGenTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="newGeneration" name="New Generation" fill={ROTARY_GOLD}   radius={[3, 3, 0, 0]} />
              <Bar dataKey="vocational"    name="Vocational"     fill={ROTARY_BLUE}   radius={[3, 3, 0, 0]} />
              <Bar dataKey="international" name="International"  fill="#9333ea"       radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Club-wise Service Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Club-wise Service Activity</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Service category counts per club · Rotary Year 2025-26
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Club Name</th>
                <th className="px-4 py-3 text-center font-semibold">New Generation</th>
                <th className="px-4 py-3 text-center font-semibold">Vocational</th>
                <th className="px-4 py-3 text-center font-semibold">International</th>
                <th className="px-4 py-3 text-center font-semibold">Total Projects</th>
                <th className="px-4 py-3 text-center font-semibold">Members</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => {
                const isZero = row.newGenerationService + row.vocationalService + row.internationalService === 0
                return (
                  <tr
                    key={row.id}
                    className={`border-t border-slate-100 transition-colors ${
                      isZero
                        ? 'bg-slate-50 text-slate-400 cursor-default'
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    <td className="px-4 py-2.5 font-medium">
                      <span className={isZero ? 'text-slate-400' : 'text-slate-800'}>
                        {row.name}
                      </span>
                    </td>
                    <CellCount val={row.newGenerationService} isZero={isZero} />
                    <CellCount val={row.vocationalService}    isZero={isZero} />
                    <CellCount val={row.internationalService} isZero={isZero} />
                    <td className={`px-4 py-2.5 text-center font-bold ${isZero ? 'text-slate-300' : 'text-slate-800'}`}>
                      {row.totalProjects || '—'}
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-600">
                      {row.members}
                    </td>
                  </tr>
                )
              })}
              {/* Totals row */}
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-800">
                <td className="px-4 py-3">All Clubs Total</td>
                <td className="px-4 py-3 text-center">{tableTotals.newGenerationService}</td>
                <td className="px-4 py-3 text-center">{tableTotals.vocationalService}</td>
                <td className="px-4 py-3 text-center">{tableTotals.internationalService}</td>
                <td className="px-4 py-3 text-center">{tableTotals.totalProjects}</td>
                <td className="px-4 py-3 text-center">
                  {CLUBS.reduce((s, c) => s + (c.members || 0), 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Club Detail Cards for active clubs ── */}
      {activeClubs.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-3">
            New Generation Service Detail by Club
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {CLUBS.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <div
                  className="px-4 py-3 text-white text-sm font-semibold"
                  style={{ backgroundColor: ROTARY_BLUE }}
                >
                  {club.name}
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <StatRow label="New Generation"  value={club.newGenerationService || 0} color="gold"   />
                  <StatRow label="Vocational"       value={club.vocationalService    || 0} color="blue"   />
                  <StatRow label="International"    value={club.internationalService || 0} color="purple" />
                  <StatRow label="Total Projects"   value={club.totalProjects        || 0} color="green"  />
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                    {club.members} members · {club.meetings} meetings
                  </div>
                </div>
              </div>
            ))}
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

function StatRow({ label, value, color }) {
  const textColors = {
    blue:   'text-blue-700',
    gold:   'text-yellow-700',
    green:  'text-green-700',
    purple: 'text-purple-700',
  }
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-600">{label}</span>
      <span className={`font-bold ${value > 0 ? textColors[color] : 'text-slate-300'}`}>
        {value > 0 ? value : '—'}
      </span>
    </div>
  )
}
