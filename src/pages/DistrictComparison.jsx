import { useMemo } from 'react'
import { BarChart3, Info, Trophy, Star, TrendingUp, DollarSign, Briefcase, CheckCircle } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip as RechartTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip,
} from 'recharts'
import SectionHeader from '../components/SectionHeader'
import { ZONES, ZONE_TOTALS, DISTRICT_TOTALS } from '../data/district3192'

// ─── constants ────────────────────────────────────────────────────────────────
const ROTARY_BLUE = '#003DA5'
const ROTARY_GOLD = '#F7A81B'
const ZONE_PALETTE = [
  '#003DA5', '#0052cc', '#1668e8', '#2196f3',
  '#64b5f6', '#90caf9', '#bbdefb',
]

// ─── formatters ───────────────────────────────────────────────────────────────
const fmtUSD = (n) => (n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n)}`)
const fmtPct = (n) => (n != null ? n.toFixed(1) + '%' : '—')
const fmtN = (n) => (n ?? 0).toLocaleString()

// ─── zone rank score ──────────────────────────────────────────────────────────
// Rank score = simple (growthRank + trfRank + awardsRank) / 3, lower = better
function computeRankScores(zoneIds) {
  const zones = zoneIds.map((id) => ({ id, ...ZONE_TOTALS[id] }))

  const rank = (arr, key, higher = true) => {
    const sorted = [...arr].sort((a, b) =>
      higher ? b[key] - a[key] : a[key] - b[key]
    )
    const map = {}
    sorted.forEach((z, i) => { map[z.id] = i + 1 })
    return map
  }

  const gRank = rank(zones, 'growth')
  const tRank = rank(zones, 'trfTotal')
  const aRank = rank(zones, 'awards')

  return zones.reduce((acc, z) => {
    acc[z.id] = Math.round(((gRank[z.id] + tRank[z.id] + aRank[z.id]) / 3) * 10) / 10
    return acc
  }, {})
}

// ─── normalize values for radar 0-100 ────────────────────────────────────────
function normalizeZones() {
  const ids = ZONES.map((z) => z.id)
  const zones = ids.map((id) => ({ id, ...ZONE_TOTALS[id] }))

  const maxOf = (key) => Math.max(...zones.map((z) => z[key] ?? 0)) || 1

  const maxGrowth = maxOf('growth')
  const maxTrf = maxOf('trfTotal')
  const maxAwardsPct = maxOf('awards')  // use raw awards count
  const maxMyRotary = maxOf('myRotaryPercent')
  const maxProjectsPerClub = Math.max(...zones.map((z) => (z.clubs > 0 ? z.projects / z.clubs : 0))) || 1
  const maxYouth = Math.max(...zones.map((z) => (z.newRotaract + z.newInteract + z.rcc) || 0)) || 1

  return ids.map((id) => {
    const z = ZONE_TOTALS[id]
    return {
      id,
      'Membership Growth': Math.round(Math.max(0, (z.growth / maxGrowth) * 100)),
      'TRF Giving Index': Math.round((z.trfTotal / maxTrf) * 100),
      'Awards %': Math.round(((z.awards / z.clubs) * 100 / (maxAwardsPct / Math.max(...ZONES.map((_z) => ZONE_TOTALS[_z.id].clubs)))) * 100) || 0,
      'MyRotary %': Math.round((z.myRotaryPercent / maxMyRotary) * 100),
      'Projects/Club': Math.round(((z.projects / z.clubs) / maxProjectsPerClub) * 100),
      'New Youth Orgs': Math.round(((z.newRotaract + z.newInteract + z.rcc) / maxYouth) * 100),
    }
  })
}

// ─── Radar Tooltip ────────────────────────────────────────────────────────────
function RadarTip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow p-2 text-xs">
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: p.stroke }} />
          <span className="text-slate-600">Zone {p.dataKey}:</span>
          <span className="font-bold text-slate-800">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function DistrictComparison() {
  const user = JSON.parse(sessionStorage.getItem('ag_user') || '{}')
  const myZone = user.zone === 'ALL' ? null : user.zone
  const zoneIds = ZONES.map((z) => z.id)

  const rankScores = useMemo(() => computeRankScores(zoneIds), [])
  const radarData = useMemo(() => normalizeZones(), [])

  // ─ build ranking table rows ────────────────────────────────────────────────
  const rankRows = useMemo(
    () =>
      zoneIds.map((id) => {
        const z = ZONE_TOTALS[id]
        const zoneInfo = ZONES.find((zi) => zi.id === id)
        const awardsPct = z.clubs > 0 ? ((z.awards / z.clubs) * 100).toFixed(1) : '0.0'
        return {
          id,
          ambassador: zoneInfo?.ambassador ?? '—',
          clubs: z.clubs,
          members: z.membersCurrent,
          growth: z.growth,
          trf: z.trfTotal,
          projects: z.projects,
          awards: z.awards,
          awardsPct,
          rankScore: rankScores[id],
        }
      }).sort((a, b) => a.rankScore - b.rankScore),
    [rankScores, zoneIds]
  )

  // ─ determine extremes ─────────────────────────────────────────────────────
  const maxGrowthZone = rankRows.reduce((m, r) => (r.growth > m.growth ? r : m), rankRows[0])
  const minGrowthZone = rankRows.reduce((m, r) => (r.growth < m.growth ? r : m), rankRows[0])
  const maxTrfZone = rankRows.reduce((m, r) => (r.trf > m.trf ? r : m), rankRows[0])
  const maxAwardsZone = rankRows.reduce((m, r) => (r.awards > m.awards ? r : m), rankRows[0])
  const maxProjectsZone = rankRows.reduce((m, r) => (r.projects > m.projects ? r : m), rankRows[0])
  const maxAwardsPctZone = rankRows.reduce(
    (m, r) => (parseFloat(r.awardsPct) > parseFloat(m.awardsPct) ? r : m),
    rankRows[0]
  )

  // ─ leaderboard cards data ─────────────────────────────────────────────────
  const myZoneData = myZone ? rankRows.find((r) => r.id === myZone) : null

  const leaderboards = [
    {
      title: 'Top TRF Giving',
      icon: DollarSign,
      color: 'gold',
      zone: maxTrfZone?.id,
      value: fmtUSD(maxTrfZone?.trf ?? 0),
      myValue: myZoneData ? fmtUSD(myZoneData.trf) : null,
      diff: myZoneData ? fmtUSD(Math.abs((maxTrfZone?.trf ?? 0) - myZoneData.trf)) : null,
      ahead: myZoneData ? myZoneData.trf >= (maxTrfZone?.trf ?? 0) : false,
    },
    {
      title: 'Top Membership Growth',
      icon: TrendingUp,
      color: 'green',
      zone: maxGrowthZone?.id,
      value: fmtPct(maxGrowthZone?.growth ?? 0),
      myValue: myZoneData ? fmtPct(myZoneData.growth) : null,
      diff: myZoneData ? fmtPct(Math.abs((maxGrowthZone?.growth ?? 0) - myZoneData.growth)) : null,
      ahead: myZoneData ? myZoneData.id === maxGrowthZone?.id : false,
    },
    {
      title: 'Top Service Projects',
      icon: Briefcase,
      color: 'blue',
      zone: maxProjectsZone?.id,
      value: fmtN(maxProjectsZone?.projects ?? 0),
      myValue: myZoneData ? fmtN(myZoneData.projects) : null,
      diff: myZoneData ? fmtN(Math.abs((maxProjectsZone?.projects ?? 0) - myZoneData.projects)) : null,
      ahead: myZoneData ? myZoneData.id === maxProjectsZone?.id : false,
    },
    {
      title: 'Top Award Club %',
      icon: CheckCircle,
      color: 'purple',
      zone: maxAwardsPctZone?.id,
      value: maxAwardsPctZone?.awardsPct + '%',
      myValue: myZoneData ? myZoneData.awardsPct + '%' : null,
      diff: myZoneData
        ? fmtPct(Math.abs(parseFloat(maxAwardsPctZone?.awardsPct ?? 0) - parseFloat(myZoneData.awardsPct)))
        : null,
      ahead: myZoneData ? myZoneData.id === maxAwardsPctZone?.id : false,
    },
  ]

  // ─ performance bars data ───────────────────────────────────────────────────
  const perfMetrics = useMemo(() => {
    const growthData = zoneIds.map((id) => ({
      zone: `Z${id}`,
      zoneId: id,
      value: Math.max(0, ZONE_TOTALS[id].growth ?? 0),
    }))
    const trfData = zoneIds.map((id) => ({
      zone: `Z${id}`,
      zoneId: id,
      value: ZONE_TOTALS[id].trfTotal,
    }))
    const projData = zoneIds.map((id) => ({
      zone: `Z${id}`,
      zoneId: id,
      value: ZONE_TOTALS[id].projects,
    }))
    const myRotaryData = zoneIds.map((id) => ({
      zone: `Z${id}`,
      zoneId: id,
      value: ZONE_TOTALS[id].myRotaryPercent ?? 0,
    }))
    return [
      { title: 'Membership Growth %', data: growthData, suffix: '%', color: '#22c55e' },
      { title: 'TRF Giving (USD)', data: trfData, suffix: '', isCurrency: true, color: ROTARY_GOLD },
      { title: 'Service Projects', data: projData, suffix: '', color: ROTARY_BLUE },
      { title: 'MyRotary Registration %', data: myRotaryData, suffix: '%', color: '#9333ea' },
    ]
  }, [zoneIds])

  // ─ radar: restructure for recharts (one row per axis) ────────────────────
  const AXES = [
    'Membership Growth',
    'TRF Giving Index',
    'Awards %',
    'MyRotary %',
    'Projects/Club',
    'New Youth Orgs',
  ]
  const radarChartData = useMemo(
    () =>
      AXES.map((axis) => {
        const row = { axis }
        radarData.forEach((z) => { row[z.id] = z[axis] })
        return row
      }),
    [radarData]
  )

  return (
    <div className="space-y-8">
      {/* ── Section Header ── */}
      <SectionHeader
        title="District Comparison"
        subtitle="How your zone ranks among all 7 zones"
        icon={BarChart3}
      />

      {/* ── Info banner ── */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 text-sm text-blue-800">
        <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <span>
          You are viewing <strong>zone-level aggregates only</strong>. Individual club data from
          other zones is not shown. All metrics are sourced from district records as of 19 March 2026.
        </span>
      </div>

      {/* ── Zone Ranking Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Zone Rankings</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rank Score = average of Growth rank, TRF rank, Awards rank (lower = better)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Zone</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Ambassador</th>
                <th className="px-4 py-3 text-center font-semibold">Clubs</th>
                <th className="px-4 py-3 text-center font-semibold">Members</th>
                <th className="px-4 py-3 text-center font-semibold">Growth%</th>
                <th className="px-4 py-3 text-center font-semibold">TRF Giving</th>
                <th className="px-4 py-3 text-center font-semibold">Projects</th>
                <th className="px-4 py-3 text-center font-semibold">Awards</th>
                <th className="px-4 py-3 text-center font-semibold">Rank Score</th>
              </tr>
            </thead>
            <tbody>
              {rankRows.map((row, idx) => {
                const isMyZone = row.id === myZone
                const isMaxGrowth = row.id === maxGrowthZone?.id
                const isMinGrowth = row.id === minGrowthZone?.id
                const isMaxTrf = row.id === maxTrfZone?.id
                const isMaxAwards = row.id === maxAwardsZone?.id
                return (
                  <tr
                    key={row.id}
                    className={`border-t border-slate-100 transition-colors ${
                      isMyZone
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'hover:bg-slate-50'
                    }`}
                    style={isMyZone ? { borderLeft: `4px solid ${ROTARY_BLUE}` } : {}}
                  >
                    <td className="px-4 py-3 text-slate-500 font-semibold">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: ZONE_PALETTE[ZONES.findIndex((z) => z.id === row.id) % ZONE_PALETTE.length] }}
                        >
                          {row.id}
                        </span>
                        <span className="font-medium text-slate-800">Zone {row.id}</span>
                        {isMyZone && (
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded text-white"
                            style={{ backgroundColor: ROTARY_BLUE }}
                          >
                            ← Your Zone
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs hidden md:table-cell">
                      {row.ambassador}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700">{row.clubs}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{fmtN(row.members)}</td>
                    <td
                      className={`px-4 py-3 text-center font-semibold ${
                        isMaxGrowth
                          ? 'text-green-600'
                          : isMinGrowth
                          ? 'text-red-500'
                          : 'text-slate-700'
                      }`}
                    >
                      {row.growth != null ? fmtPct(row.growth) : '—'}
                      {isMaxGrowth && <span className="ml-1 text-green-500">▲</span>}
                      {isMinGrowth && <span className="ml-1 text-red-400">▼</span>}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700">
                      {fmtUSD(row.trf)}
                      {isMaxTrf && <span className="ml-1">🏆</span>}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700">{fmtN(row.projects)}</td>
                    <td className="px-4 py-3 text-center text-slate-700">
                      {row.awards}
                      {isMaxAwards && <span className="ml-1">⭐</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          idx === 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : idx === rankRows.length - 1
                            ? 'bg-red-50 text-red-600'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {row.rankScore}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {/* District total row */}
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-700 text-sm">
                <td className="px-4 py-3 text-slate-400">—</td>
                <td className="px-4 py-3">District Total</td>
                <td className="px-4 py-3 hidden md:table-cell text-slate-400 font-normal text-xs">All zones</td>
                <td className="px-4 py-3 text-center">{DISTRICT_TOTALS.clubs}</td>
                <td className="px-4 py-3 text-center">{fmtN(DISTRICT_TOTALS.membersCurrent)}</td>
                <td className="px-4 py-3 text-center">{fmtPct(DISTRICT_TOTALS.growth)}</td>
                <td className="px-4 py-3 text-center">{fmtUSD(DISTRICT_TOTALS.trfTotal)}</td>
                <td className="px-4 py-3 text-center">{fmtN(DISTRICT_TOTALS.projects)}</td>
                <td className="px-4 py-3 text-center">{DISTRICT_TOTALS.awards}</td>
                <td className="px-4 py-3 text-center text-slate-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Radar Chart ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-1">Multi-Axis Zone Comparison</h3>
        <p className="text-xs text-slate-500 mb-4">
          Values normalized 0–100 (% of district maximum). {myZone ? `Zone ${myZone} highlighted in bold blue.` : 'All zones shown.'}
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarChartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              tickCount={4}
            />
            <RechartTooltip content={<RadarTip />} />
            {zoneIds.map((id, idx) => {
              const isMy = id === myZone
              return (
                <Radar
                  key={id}
                  name={id}
                  dataKey={id}
                  stroke={isMy ? ROTARY_BLUE : ZONE_PALETTE[idx]}
                  fill={isMy ? ROTARY_BLUE : ZONE_PALETTE[idx]}
                  fillOpacity={isMy ? 0.18 : 0.05}
                  strokeWidth={isMy ? 2.5 : 1}
                  dot={isMy}
                />
              )
            })}
            <Legend
              formatter={(val) => `Zone ${val}`}
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Category Leaderboards ── */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Category Leaderboards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {leaderboards.map((lb) => {
            const colorMap = {
              gold: { bg: 'bg-yellow-50 border-yellow-200', icon: 'bg-yellow-100 text-yellow-600', badge: 'bg-yellow-100 text-yellow-800' },
              green: { bg: 'bg-green-50 border-green-200', icon: 'bg-green-100 text-green-600', badge: 'bg-green-100 text-green-800' },
              blue: { bg: 'bg-blue-50 border-blue-200', icon: 'bg-blue-100 text-blue-600', badge: 'bg-blue-100 text-blue-800' },
              purple: { bg: 'bg-purple-50 border-purple-200', icon: 'bg-purple-100 text-purple-600', badge: 'bg-purple-100 text-purple-800' },
            }
            const c = colorMap[lb.color]
            return (
              <div key={lb.title} className={`rounded-xl border p-4 ${c.bg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${c.icon}`}>
                    <lb.icon size={16} />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{lb.title}</span>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-0.5">{lb.value}</div>
                <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${c.badge}`}>
                  Zone {lb.zone}
                </div>
                {myZone && lb.myValue && (
                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <div className="text-xs text-slate-500">
                      Your zone: <span className="font-semibold text-slate-700">{lb.myValue}</span>
                    </div>
                    {lb.zone !== myZone && (
                      <div className={`text-xs mt-0.5 ${lb.ahead ? 'text-green-600' : 'text-red-500'}`}>
                        {lb.ahead ? '▲ Ahead by' : '▼ Behind by'} {lb.diff}
                      </div>
                    )}
                    {lb.zone === myZone && (
                      <div className="text-xs mt-0.5 text-green-600 font-semibold">🏆 You lead this category!</div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Zone Performance Bars ── */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Zone Performance Bars</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {perfMetrics.map((metric) => (
            <div key={metric.title} className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">{metric.title}</h4>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={metric.data}
                  margin={{ top: 4, right: 20, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="zone"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickFormatter={(v) =>
                      metric.isCurrency
                        ? fmtUSD(v)
                        : metric.suffix
                        ? v + metric.suffix
                        : v
                    }
                    width={metric.isCurrency ? 50 : 40}
                  />
                  <Tooltip
                    formatter={(v) =>
                      metric.isCurrency
                        ? ['$' + Math.round(v).toLocaleString(), metric.title]
                        : [v + (metric.suffix || ''), metric.title]
                    }
                    labelFormatter={(l) => `Zone ${l.replace('Z', '')}`}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {metric.data.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={entry.zoneId === myZone ? ROTARY_BLUE : '#cbd5e1'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {myZone && (
                <p className="text-xs text-slate-400 mt-1">
                  <span className="inline-block w-3 h-3 rounded-sm mr-1 align-middle" style={{ backgroundColor: ROTARY_BLUE }} />
                  Rotary blue = Zone {myZone} (your zone)
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
