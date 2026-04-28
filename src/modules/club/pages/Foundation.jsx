import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

/* ── Real data from Excel — District 3142, March 2026 ───────────── */
const METRICS = [
  { id:'af',    name:'Annual Fund',                    short:'AF',   value:257711, avg:94553, max:486784, rank:3,  total:43, color:'#003DA5', unit:'$' },
  { id:'phf',   name:'PHF',                            short:'PHF',  value:148,    avg:110,   max:701,    rank:7,  total:43, color:'#9333ea', unit:''  },
  { id:'md',    name:'Major Donors',                   short:'MD',   value:20,     avg:10,    max:81,     rank:5,  total:41, color:'#ca8a04', unit:''  },
  { id:'epf',   name:'EPF',                            short:'EPF',  value:4,      avg:5,     max:42,     rank:8,  total:28, color:'#f59e0b', unit:''  },
  { id:'phsm',  name:'PHSM',                           short:'PHSM', value:3,      avg:5,     max:31,     rank:11, total:27, color:'#0891b2', unit:''  },
  { id:'ef',    name:'Endowment',                      short:'EF',   value:2,      avg:2,     max:8,      rank:11, total:28, color:'#e11d48', unit:''  },
  { id:'aks',   name:'Arch Klump Society',             short:'AKS',  value:0,      avg:1,     max:1,      rank:5,  total:4,  color:'#64748b', unit:''  },
  { id:'bs',    name:'Bequest Society',                short:'BS',   value:0,      avg:1,     max:1,      rank:2,  total:1,  color:'#64748b', unit:''  },
  { id:'dg',    name:'Directed Gift',                  short:'DG',   value:0,      avg:3,     max:8,      rank:16, total:15, color:'#64748b', unit:''  },
  { id:'pps',   name:'Polio Plus Society',             short:'PPS',  value:0,      avg:0,     max:0,      rank:0,  total:0,  color:'#64748b', unit:''  },
]

/* comparison chart — metrics with D3142 value > 0, normalised as % of national max */
const COMPARE_DATA = [
  { name:'Annual Fund',  d3142: Math.round((257711/486784)*100), avg: Math.round((94553/486784)*100), color:'#003DA5' },
  { name:'PHF',          d3142: Math.round((148/701)*100),       avg: Math.round((110/701)*100),      color:'#9333ea' },
  { name:'Major Donors', d3142: Math.round((20/81)*100),         avg: Math.round((10/81)*100),        color:'#ca8a04' },
  { name:'EPF',          d3142: Math.round((4/42)*100),          avg: Math.round((5/42)*100),         color:'#f59e0b' },
  { name:'PHSM',         d3142: Math.round((3/31)*100),          avg: Math.round((5/31)*100),         color:'#0891b2' },
  { name:'Endowment',    d3142: Math.round((2/8)*100),           avg: Math.round((2/8)*100),          color:'#e11d48' },
]

const USD_TO_INR = 84

const toINR   = (usd) => usd * USD_TO_INR
const fmtINRv = (v) => {
  const inr = toINR(v)
  if (inr >= 10000000) return `₹${(inr / 10000000).toFixed(2)} Cr`
  if (inr >= 100000)   return `₹${(inr / 100000).toFixed(2)}L`
  return `₹${inr.toLocaleString()}`
}

const rankBadge = (rank) => {
  if (rank === 1) return { bg:'#fef9c3', text:'#854d0e', label:`🥇 #${rank}` }
  if (rank === 2) return { bg:'#f1f5f9', text:'#334155', label:`🥈 #${rank}` }
  if (rank === 3) return { bg:'#fef3c7', text:'#78350f', label:`🥉 #${rank}` }
  if (rank <= 5)  return { bg:'#dcfce7', text:'#15803d', label:`#${rank}` }
  return { bg:'#f1f5f9', text:'#64748b', label:`#${rank}` }
}

const fmtVal = (m) => m.unit === '$' ? fmtINRv(m.value) : m.value.toLocaleString()
const fmtAvg = (m) => m.unit === '$' ? fmtINRv(m.avg)  : m.avg.toString()
const fmtMax = (m) => m.unit === '$' ? fmtINRv(m.max)  : m.max.toString()

/* ── Main component ──────────────────────────────────────────────── */
export default function Foundation() {
  const topMetrics = METRICS.filter(m => m.rank <= 5).sort((a, b) => a.rank - b.rank)

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">The Rotary Foundation</p>
          <p className="text-xs text-slate-400 mt-0.5">District 3142 · March 2026 Report</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          Live Excel Data
        </span>
      </div>

      {/* Achievement banner */}
      <div className="flex items-center gap-4 flex-wrap p-4 rounded-xl text-white"
        style={{ background:'linear-gradient(135deg,#003DA5 0%,#1e5fb5 100%)' }}>
        <div className="text-3xl">🏆</div>
        <div>
          <p className="text-sm font-extrabold">District 3142 ranks 3rd nationally for Annual Fund</p>
          <p className="text-xs opacity-80 mt-0.5">
            {fmtINRv(257711)} raised — 2.7× the national average of {fmtINRv(94553)} across 43 districts
          </p>
        </div>
        <div className="ml-auto flex gap-2 flex-wrap">
          {['#2 Per Capita','#3 Annual Fund','#3 CSR','#5 Major Donors'].map(t => (
            <span key={t} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/20">{t}</span>
          ))}
        </div>
      </div>

      {/* KPI Cards — top 4 metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {METRICS.slice(0, 4).map(m => {
          const rb = rankBadge(m.rank)
          return (
            <div key={m.id} className="bg-white rounded-xl px-4 py-4 border border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-slate-500">{m.name}</p>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: rb.bg, color: rb.text }}>{rb.label} / {m.total}</span>
              </div>
              <p className="text-2xl font-extrabold tabular-nums leading-none" style={{ color: m.color }}>
                {fmtVal(m)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Nat. avg: {fmtAvg(m)} · Top: {fmtMax(m)}
              </p>
            </div>
          )
        })}
      </div>

      {/* Row 2: Comparison chart + Scorecard */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Comparison bar chart — D3142 vs national avg (normalised % of top) */}
        <Card className="xl:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">District 3142 vs National Average</CardTitle>
            <CardDescription className="text-xs">Performance as % of top district (each metric)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={COMPARE_DATA} margin={{ left:0, right:8 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={32}
                  tickFormatter={v => `${v}%`} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize:11, borderRadius:6 }}
                  formatter={(v, name) => [`${v}%`, name === 'd3142' ? 'District 3142' : 'Nat. Average']} />
                <ReferenceLine y={100} stroke="#e2e8f0" strokeDasharray="3 3" label={{ value:'Top', position:'right', fontSize:10, fill:'#94a3b8' }} />
                <Bar dataKey="d3142" name="District 3142" radius={[3,3,0,0]}>
                  {COMPARE_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
                <Bar dataKey="avg" name="Nat. Average" fill="#e2e8f0" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center mt-1">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-700" /><span className="text-xs text-slate-500">District 3142</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-200" /><span className="text-xs text-slate-500">National Average</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Full scorecard */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">All Metrics — Scorecard</CardTitle>
            <CardDescription className="text-xs">District 3142 · March 2026</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {METRICS.map(m => {
              const rb    = rankBadge(m.rank)
              const pct   = m.max > 0 ? Math.round((m.value / m.max) * 100) : 0
              const noData = m.value === 0
              return (
                <div key={m.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">{m.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold tabular-nums" style={{ color: noData ? '#94a3b8' : m.color }}>
                        {noData ? '—' : fmtVal(m)}
                      </span>
                      {!noData && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: rb.bg, color: rb.text }}>{rb.label}</span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${pct}%`, backgroundColor: noData ? '#e2e8f0' : m.color }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Detailed table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Detailed Performance Table</CardTitle>
          <CardDescription className="text-xs">District 3142 vs national benchmarks — March 2026</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Metric','District 3142','Nat. Average','Top District','Rank','vs Average'].map(h => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${h === 'Metric' ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRICS.map((m, i) => {
                  const rb    = rankBadge(m.rank)
                  const noData   = m.value === 0
                  const ratio    = (!noData && m.avg > 0) ? (m.value / m.avg).toFixed(1) : null
                  const isLast   = i === METRICS.length - 1
                  const chipColor = ratio === null ? null
                                  : parseFloat(ratio) >= 2 ? { bg:'#dcfce7', text:'#15803d' }
                                  : parseFloat(ratio) >= 1 ? { bg:'#dbeafe', text:'#1d4ed8' }
                                  : { bg:'#fee2e2', text:'#dc2626' }
                  return (
                    <tr key={m.id} className="hover:bg-slate-50"
                      style={{ borderBottom: isLast ? 'none' : '1px solid #f1f5f9', opacity: noData ? 0.55 : 1 }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                          <span className="text-sm font-medium text-slate-700">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums" style={{ color: noData ? '#94a3b8' : m.color }}>
                        {noData ? '—' : fmtVal(m)}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-slate-500 tabular-nums">
                        {m.avg > 0 ? fmtAvg(m) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-slate-500 tabular-nums">
                        {m.max > 0 ? fmtMax(m) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {m.total > 0
                          ? <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: rb.bg, color: rb.text }}>{noData ? 'No data' : `${rb.label} / ${m.total}`}</span>
                          : <span className="text-xs text-slate-400">—</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-right">
                        {chipColor
                          ? <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: chipColor.bg, color: chipColor.text }}>{ratio}×</span>
                          : <span className="text-xs text-slate-400">—</span>
                        }
                      </td>
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
