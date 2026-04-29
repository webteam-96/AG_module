// src/modules/district/pages/Overview.jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { CLUB_ANALYTICS } from '../data/analyticsData'

// ─── RAG helpers ────────────────────────────────────────────────────────────
function rag(pct) {
  if (pct > 75) return 'green'
  if (pct >= 50) return 'amber'
  return 'red'
}

const RAG = {
  green: { dot: 'bg-green-500', text: 'text-green-700' },
  amber: { dot: 'bg-amber-400', text: 'text-amber-700' },
  red:   { dot: 'bg-red-500',   text: 'text-red-600'   },
}

function RagCell({ pct, label }) {
  const s = RAG[rag(pct)]
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
      <span className={`text-xs font-semibold tabular-nums ${s.text}`}>{label}</span>
    </div>
  )
}

// ─── Derived data (computed once at module level) ────────────────────────────
const enriched = CLUB_ANALYTICS.map(c => ({
  ...c,
  citationPct:   Math.round((c.citationScore   / c.citationMax)    * 100),
  compliancePct: Math.round((c.reportsSubmitted / c.reportsTotal)   * 100),
  memberPct:     Math.round((c.members          / c.memberTarget)   * 100),
  trfPct:        Math.round((c.trfRaised        / c.trfGoal)        * 100),
}))

const withComposite = enriched.map(c => ({
  ...c,
  composite: Math.round((c.citationPct + c.compliancePct + c.avgAttendance) / 3),
}))

const ranked = [...withComposite].sort((a, b) => b.composite - a.composite)

const avgOf = key => Math.round(withComposite.reduce((s, c) => s + c[key], 0) / withComposite.length)
const avgCitation   = avgOf('citationPct')
const avgCompliance = avgOf('compliancePct')
const avgAttendance = avgOf('avgAttendance')
const totalMembers  = CLUB_ANALYTICS.reduce((s, c) => s + c.members, 0)
const avgProjects   = avgOf('serviceProjects')

const chartData = withComposite.map(c => ({
  name:           c.name.split(' ')[0],
  'Citation %':   c.citationPct,
  'Compliance %': c.compliancePct,
  'Attendance %': c.avgAttendance,
}))

// ─── Component ───────────────────────────────────────────────────────────────
export default function DistrictOverview() {

  return (
    <div className="space-y-4">

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatCard label="Total Clubs"       value={CLUB_ANALYTICS.length} sub="District 5656"      subColor="muted" accent="#003DA5" />
        <StatCard label="Total Members"     value={totalMembers}           sub="Across all clubs"   subColor="muted" accent="#16a34a" />
        <StatCard label="Avg Citation"      value={`${avgCitation}%`}      sub="District average"   subColor={avgCitation   > 75 ? 'up' : 'down'} accent="#9333ea" />
        <StatCard label="Report Compliance" value={`${avgCompliance}%`}    sub="Monthly reports"    subColor={avgCompliance > 75 ? 'up' : 'down'} accent="#0891b2" />
        <StatCard label="Avg Attendance"    value={`${avgAttendance}%`}    sub="Meeting attendance" subColor={avgAttendance > 75 ? 'up' : 'down'} accent="#f59e0b" />
      </div>

      {/* Chart + Leaderboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Grouped bar chart */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Club Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={14} barGap={2}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" width={36} />
                <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Citation %"    fill="#003DA5" radius={[3,3,0,0]} />
                <Bar dataKey="Compliance %"  fill="#16a34a" radius={[3,3,0,0]} />
                <Bar dataKey="Attendance %"  fill="#f59e0b" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Club Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            {ranked.map((c, i) => {
              const isTop    = i < 2
              const isBottom = i >= ranked.length - 2
              return (
                <div key={c.id}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${
                    isTop ? 'bg-green-50' : isBottom ? 'bg-red-50' : 'bg-slate-50'
                  }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs font-bold w-5 text-center flex-shrink-0 ${
                      isTop ? 'text-green-600' : isBottom ? 'text-red-500' : 'text-slate-400'
                    }`}>{i + 1}</span>
                    <span className={`text-xs font-semibold truncate ${
                      isTop ? 'text-green-800' : isBottom ? 'text-red-800' : 'text-slate-700'
                    }`}>{c.name}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isTop    && <span className="text-green-500 text-[10px]">▲</span>}
                    {isBottom && <span className="text-red-400 text-[10px]">▼</span>}
                    <span className={`text-xs font-bold tabular-nums ${
                      isTop ? 'text-green-700' : isBottom ? 'text-red-600' : 'text-slate-600'
                    }`}>{c.composite}%</span>
                  </div>
                </div>
              )
            })}
            {ranked.filter(c => c.composite < 50).length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-red-600">
                  ⚠ {ranked.filter(c => c.composite < 50).length} club(s) below 50%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison Matrix */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Club Comparison Matrix</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Club','Members','Citation','Reports','Attendance','TRF','Projects'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withComposite.map(c => {
                  const projPct = c.serviceProjects >= avgProjects ? 100
                    : c.serviceProjects >= avgProjects * 0.8 ? 65
                    : 40
                  const trfColor = c.trfPct > 75 ? '#16a34a' : c.trfPct >= 50 ? '#f59e0b' : '#e11d48'
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 font-semibold text-slate-800 text-xs whitespace-nowrap">{c.name}</td>
                      <td className="px-3 py-3"><RagCell pct={c.memberPct}     label={`${c.members}/${c.memberTarget}`} /></td>
                      <td className="px-3 py-3"><RagCell pct={c.citationPct}   label={`${c.citationPct}%`} /></td>
                      <td className="px-3 py-3"><RagCell pct={c.compliancePct} label={`${c.reportsSubmitted}/${c.reportsTotal}`} /></td>
                      <td className="px-3 py-3"><RagCell pct={c.avgAttendance} label={`${c.avgAttendance}%`} /></td>
                      <td className="px-3 py-3">
                        <RagCell pct={c.trfPct} label={`${c.trfPct}%`} />
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden w-16 mt-1">
                          <div className="h-full rounded-full" style={{ width: `${c.trfPct}%`, backgroundColor: trfColor }} />
                        </div>
                      </td>
                      <td className="px-3 py-3"><RagCell pct={projPct} label={String(c.serviceProjects)} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
