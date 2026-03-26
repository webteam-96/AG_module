import { useMemo } from 'react'
import {
  Trophy, Users, Briefcase, Calendar, Star,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CLUBS, AG_TOTALS, AG_NAME } from '@/data/realData'

// ─── constants ────────────────────────────────────────────────────────────────
const ROTARY_BLUE  = '#003DA5'
const ROTARY_GOLD  = '#F7A81B'

// One distinct colour per club (index-stable)
const CLUB_COLORS = [
  '#003DA5', // Navi Mumbai        – deep Rotary blue
  '#F7A81B', // Flamingo City      – Rotary gold
  '#10b981', // Palm Beach         – emerald
  '#ef4444', // New Bombay Seaside – coral-red
]

// Short display names for chart axes
const SHORT_NAMES = {
  'Navi Mumbai':            'Navi Mumbai',
  'Navi Mumbai Flamingo City': 'Flamingo City',
  'Navi Mumbai-Palm Beach': 'Palm Beach',
  'New Bombay Seaside':     'New Bombay Seaside',
}

// ─── formatters ───────────────────────────────────────────────────────────────
const fmtINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n ?? 0)

const fmtN = (n) => (n ?? 0).toLocaleString('en-IN')

// ─── helpers ──────────────────────────────────────────────────────────────────
function maxIndex(clubs, accessor) {
  let best = 0
  clubs.forEach((c, i) => { if (accessor(c) > accessor(clubs[best])) best = i })
  return best
}

function normalize(clubs, accessor) {
  const max = Math.max(...clubs.map(accessor))
  return clubs.map((c) => (max === 0 ? 0 : Math.round((accessor(c) / max) * 100)))
}

// ─── sub-components ───────────────────────────────────────────────────────────

/** One leaderboard summary card */
function LeaderCard({ icon: Icon, title, accessor, formatter, clubs }) {
  const sorted = [...clubs].sort((a, b) => accessor(b) - accessor(a))
  const leader = sorted[0]
  const colorIdx = clubs.indexOf(leader)

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center gap-2">
          <Icon size={18} style={{ color: ROTARY_BLUE }} />
          <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {/* Winner */}
        <div
          className="rounded-lg px-4 py-3 mb-3"
          style={{ backgroundColor: ROTARY_BLUE }}
        >
          <p className="text-white font-bold text-base leading-tight">
            {SHORT_NAMES[leader.name] ?? leader.name}
          </p>
          <p className="text-yellow-300 font-semibold text-lg mt-0.5">
            {formatter(accessor(leader))}
          </p>
        </div>

        {/* Ranked list (2–4) */}
        <ol className="space-y-1.5">
          {sorted.slice(1).map((club, i) => (
            <li key={club.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: CLUB_COLORS[clubs.indexOf(club)] }}
                >
                  {i + 2}
                </span>
                {SHORT_NAMES[club.name] ?? club.name}
              </span>
              <span className="font-medium text-gray-800">{formatter(accessor(club))}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

/** Simple bar chart wrapper */
function ClubBarChart({ title, accessor, formatter, clubs, yLabel }) {
  const data = clubs.map((c) => ({
    name: SHORT_NAMES[c.name] ?? c.name,
    value: accessor(c),
    color: CLUB_COLORS[clubs.indexOf(c)],
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-gray-200 rounded shadow px-3 py-2 text-sm">
        <p className="font-semibold text-gray-700">{payload[0].payload.name}</p>
        <p style={{ color: payload[0].payload.color }} className="font-bold">
          {formatter(payload[0].value)}
        </p>
      </div>
    )
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-0 pt-4 px-5">
        <CardTitle className="text-sm font-semibold text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 px-2 pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 32 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#555', fontFamily: 'inherit' }}
              angle={-20}
              textAnchor="end"
              interval={0}
              height={52}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#888' }}
              tickLine={false}
              axisLine={false}
              label={
                yLabel
                  ? { value: yLabel, angle: -90, position: 'insideLeft', offset: 8, style: { fontSize: 10, fill: '#aaa' } }
                  : undefined
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function DistrictComparison() {
  // Pre-compute per-column best values for green highlighting
  const best = useMemo(() => ({
    members:   Math.max(...CLUBS.map((c) => c.members)),
    meetings:  Math.max(...CLUBS.map((c) => c.meetings)),
    projects:  Math.max(...CLUBS.map((c) => c.totalProjects)),
    trf:       Math.max(...CLUBS.map((c) => c.trf.totalINR)),
    ocv:       Math.max(...CLUBS.map((c) => c.ocv)),
    rank:      Math.min(...CLUBS.map((c) => c.projectRank)), // lower is better
    voc:       Math.max(...CLUBS.map((c) => c.vocationalService)),
    intl:      Math.max(...CLUBS.map((c) => c.internationalService)),
    newgen:    Math.max(...CLUBS.map((c) => c.newGenerationService)),
  }), [])

  // Radar data — 5 normalized metrics, one entry per metric
  const radarData = useMemo(() => {
    const metrics = [
      { key: 'Members',  fn: (c) => c.members },
      { key: 'Projects', fn: (c) => c.totalProjects },
      { key: 'TRF',      fn: (c) => c.trf.totalINR },
      { key: 'Meetings', fn: (c) => c.meetings },
      { key: 'OCV',      fn: (c) => c.ocv },
    ]

    return metrics.map(({ key, fn }) => {
      const normed = normalize(CLUBS, fn)
      const point = { metric: key }
      CLUBS.forEach((c, i) => {
        point[SHORT_NAMES[c.name] ?? c.name] = normed[i]
      })
      return point
    })
  }, [])

  const cellCls = (isGreen) =>
    `px-3 py-3 text-sm whitespace-nowrap ${isGreen ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-700'}`

  return (
    <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-8">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: ROTARY_BLUE }}>
          Club Performance Comparison
        </h1>
        <p className="text-gray-500 mt-1">How your 4 clubs compare across key metrics</p>
        <p className="text-xs text-gray-400 mt-0.5">AG: {AG_NAME} · District 3142 · RY 2025–26</p>
      </div>

      {/* ── Summary Leaderboard Cards ─────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Leaderboards
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <LeaderCard
            icon={Star}
            title="Top TRF Giving"
            clubs={CLUBS}
            accessor={(c) => c.trf.totalINR}
            formatter={fmtINR}
          />
          <LeaderCard
            icon={Briefcase}
            title="Most Projects"
            clubs={CLUBS}
            accessor={(c) => c.totalProjects}
            formatter={(v) => `${v} projects`}
          />
          <LeaderCard
            icon={Users}
            title="Largest Club"
            clubs={CLUBS}
            accessor={(c) => c.members}
            formatter={(v) => `${v} members`}
          />
          <LeaderCard
            icon={Calendar}
            title="Most Active"
            clubs={CLUBS}
            accessor={(c) => c.meetings}
            formatter={(v) => `${v} meetings`}
          />
        </div>
      </section>

      {/* ── Club Comparison Table ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Head-to-Head Comparison
        </h2>
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr style={{ backgroundColor: ROTARY_BLUE }}>
                  {[
                    'Club', 'Members', 'Meetings', 'Projects',
                    'TRF (INR)', 'OCV', 'National Rank',
                    'Vocational', 'International', 'New Gen',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-3 text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLUBS.map((club, idx) => (
                  <tr
                    key={club.id}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {/* Club name */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: CLUB_COLORS[idx] }}
                        />
                        <span className="text-sm font-semibold text-gray-800">
                          {SHORT_NAMES[club.name] ?? club.name}
                        </span>
                      </div>
                    </td>

                    <td className={cellCls(club.members === best.members)}>
                      {fmtN(club.members)}
                    </td>
                    <td className={cellCls(club.meetings === best.meetings)}>
                      {fmtN(club.meetings)}
                    </td>
                    <td className={cellCls(club.totalProjects === best.projects)}>
                      {fmtN(club.totalProjects)}
                    </td>
                    <td className={cellCls(club.trf.totalINR === best.trf)}>
                      {fmtINR(club.trf.totalINR)}
                    </td>
                    <td className={cellCls(club.ocv === best.ocv)}>
                      {fmtN(club.ocv)}
                    </td>
                    <td className={cellCls(club.projectRank === best.rank)}>
                      #{fmtN(club.projectRank)}
                    </td>
                    <td className={cellCls(club.vocationalService === best.voc)}>
                      {fmtN(club.vocationalService)}
                    </td>
                    <td className={cellCls(club.internationalService === best.intl)}>
                      {fmtN(club.internationalService)}
                    </td>
                    <td className={cellCls(club.newGenerationService === best.newgen)}>
                      {fmtN(club.newGenerationService)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
            Green cells indicate the leading club in each column. National Rank = lower is better.
          </div>
        </Card>
      </section>

      {/* ── Bar Charts 2×2 ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Club Metrics at a Glance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ClubBarChart
            title="Members per Club"
            clubs={CLUBS}
            accessor={(c) => c.members}
            formatter={(v) => `${v} members`}
          />
          <ClubBarChart
            title="Projects per Club"
            clubs={CLUBS}
            accessor={(c) => c.totalProjects}
            formatter={(v) => `${v} projects`}
          />
          <ClubBarChart
            title="TRF Giving per Club (INR)"
            clubs={CLUBS}
            accessor={(c) => c.trf.totalINR}
            formatter={fmtINR}
            yLabel="INR"
          />
          <ClubBarChart
            title="Meetings per Club"
            clubs={CLUBS}
            accessor={(c) => c.meetings}
            formatter={(v) => `${v} meetings`}
          />
        </div>
      </section>

      {/* ── Radar Chart ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          Multi-Metric Radar
        </h2>
        <p className="text-xs text-gray-400 mb-3">
          All metrics normalized to 0–100 so clubs can be compared across dimensions.
          The club with the highest raw value in each category scores 100.
        </p>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="pt-6 pb-4">
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={radarData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 12, fill: '#374151', fontFamily: 'inherit', fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickCount={5}
                />
                {CLUBS.map((club, idx) => (
                  <Radar
                    key={club.id}
                    name={SHORT_NAMES[club.name] ?? club.name}
                    dataKey={SHORT_NAMES[club.name] ?? club.name}
                    stroke={CLUB_COLORS[idx]}
                    fill={CLUB_COLORS[idx]}
                    fillOpacity={0.12}
                    strokeWidth={2}
                    dot={{ r: 3, fill: CLUB_COLORS[idx] }}
                  />
                ))}
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color, fontWeight: 600 }}>{value}</span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* ── AG Totals Footer Strip ────────────────────────────────────────────── */}
      <section>
        <Card
          className="border-0 shadow-sm"
          style={{ background: `linear-gradient(135deg, ${ROTARY_BLUE} 0%, #0052cc 100%)` }}
        >
          <CardContent className="py-5 px-6">
            <p className="text-white text-xs uppercase tracking-widest font-semibold mb-3 opacity-70">
              AG Group Combined Totals
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Members',  value: fmtN(AG_TOTALS.totalMembers) },
                { label: 'Total Meetings', value: fmtN(AG_TOTALS.totalMeetings) },
                { label: 'Total Projects', value: fmtN(AG_TOTALS.totalProjects) },
                { label: 'Total TRF',      value: fmtINR(AG_TOTALS.totalTRF_INR) },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-white text-xl font-bold">{value}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  )
}
