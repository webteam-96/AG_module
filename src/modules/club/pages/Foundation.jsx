import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

/* ── Data ───────────────────────────────────────────────────────── */
const FUNDS = [
  { id:'af',  name:'Annual Fund',  short:'AF',  target:180000, highest:485000, color:'#003DA5' },
  { id:'pp',  name:'Polio Plus',   short:'PP',  target: 85000, highest:210000, color:'#e11d48' },
  { id:'csr', name:'CSR',          short:'CSR', target: 50000, highest:870000, color:'#16a34a' },
  { id:'ef',  name:'Endowment',    short:'EF',  target:120000, highest:295000, color:'#9333ea' },
  { id:'phf', name:'PHF',          short:'PHF', target: 60000, highest:142000, color:'#ca8a04' },
]

const HISTORY = [
  { year:'2021-22', af:320000, pp:145000, csr:580000, ef:210000, phf: 95000 },
  { year:'2022-23', af:380000, pp:175000, csr:650000, ef:240000, phf:108000 },
  { year:'2023-24', af:420000, pp:192000, csr:720000, ef:265000, phf:125000 },
  { year:'2024-25', af:460000, pp:205000, csr:810000, ef:285000, phf:138000 },
  { year:'2025-26', af:485000, pp:210000, csr:870000, ef:295000, phf:142000 },
]

/* ── Helpers ────────────────────────────────────────────────────── */
const fmtL  = (v) => `₹${(v / 100000).toFixed(2)}L`
const fmtK  = (v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}K`
const ratio = (f)  => (f.highest / f.target).toFixed(1)

const totalHighest = FUNDS.reduce((s, f) => s + f.highest, 0)
const totalTarget  = FUNDS.reduce((s, f) => s + f.target,  0)
const bestFund     = FUNDS.reduce((a, b) => parseFloat(ratio(a)) > parseFloat(ratio(b)) ? a : b)
const avgByYear    = HISTORY.map(h => h.af + h.pp + h.csr + h.ef + h.phf)
                            .reduce((s, v) => s + v, 0) / HISTORY.length

const donutData = FUNDS.map(f => ({ name: f.name, value: f.highest, color: f.color }))
const ratioData = FUNDS.map(f => ({ name: f.short, ratio: parseFloat(ratio(f)), color: f.color, fullName: f.name }))
const histData  = HISTORY.map(h => ({ year: h.year.slice(-5), af: h.af, pp: h.pp, csr: h.csr, ef: h.ef, phf: h.phf }))

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.07) return null
  const R = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * R)
  const y = cy + r * Math.sin(-midAngle * R)
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="700">{`${(percent*100).toFixed(0)}%`}</text>
}

/* ── Main component ──────────────────────────────────────────────── */
export default function Foundation() {
  const [year, setYear] = useState('2025-26')

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">The Rotary Foundation</p>
          <p className="text-xs text-slate-400 mt-0.5">Thane City View · TRF Giving Analysis</p>
        </div>
        <select value={year} onChange={e => setYear(e.target.value)}
          className="text-xs text-slate-600 rounded-lg bg-white"
          style={{ border:'0.5px solid #e2e8f0', padding:'6px 10px' }}>
          {['2025-26','2024-25','2023-24','2022-23','2021-22'].map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label:'Total Peak Giving',  value: fmtL(totalHighest),              sub:'Highest ever combined',          color:'#003DA5', bg:'bg-blue-50'   },
          { label:'5-Year Annual Avg',  value: fmtL(avgByYear),                 sub:'Avg across all funds per year',  color:'#16a34a', bg:'bg-green-50'  },
          { label:'Best Achievement',   value: `${ratio(bestFund)}×`,           sub:`${bestFund.name} vs target`,     color:'#16a34a', bg:'bg-green-50'  },
          { label:'Overall Ratio',      value: `${(totalHighest/totalTarget).toFixed(1)}×`, sub:'Highest vs combined target', color:'#9333ea', bg:'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl px-4 py-4`}>
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold tabular-nums leading-none" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[11px] mt-1.5" style={{ color: s.color + '99' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Row 2: Fund mix donut + Achievement ratio ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Fund mix donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Fund Mix at Peak Giving</CardTitle>
            <CardDescription className="text-xs">Proportional breakdown of highest combined giving</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  dataKey="value" labelLine={false} label={renderLabel}>
                  {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize:11, borderRadius:6 }} formatter={(v) => fmtL(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-1">
              {FUNDS.map(f => (
                <div key={f.id} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                  <span className="text-xs text-slate-500">{f.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Target achievement ratio bars */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Target Achievement Ratio</CardTitle>
            <CardDescription className="text-xs">Highest giving ÷ target — × multiplier per fund</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3.5">
            {ratioData.map(r => (
              <div key={r.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700">{r.fullName}</span>
                  <span className="text-sm font-extrabold tabular-nums" style={{ color: r.color }}>{r.ratio}×</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                    style={{ width:`${Math.min((r.ratio / 20) * 100, 100)}%`, backgroundColor: r.color }}>
                    {r.ratio >= 4 && (
                      <span className="text-[9px] font-bold text-white">{r.ratio}×</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: 5-year stacked trend ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">5-Year Giving Trend</CardTitle>
          <CardDescription className="text-xs">Year-on-year total giving across all funds</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={histData} margin={{ left:0, right:8 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} width={52} tickFormatter={fmtK} />
              <Tooltip contentStyle={{ fontSize:11, borderRadius:6 }} formatter={(v) => fmtL(v)} />
              <Bar dataKey="csr" name="CSR"         stackId="a" fill="#16a34a" />
              <Bar dataKey="af"  name="Annual Fund" stackId="a" fill="#003DA5" />
              <Bar dataKey="ef"  name="Endowment"   stackId="a" fill="#9333ea" />
              <Bar dataKey="pp"  name="Polio Plus"  stackId="a" fill="#e11d48" />
              <Bar dataKey="phf" name="PHF"         stackId="a" fill="#ca8a04" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {FUNDS.map(f => (
              <div key={f.id} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                <span className="text-xs text-slate-500">{f.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Enhanced table ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Fund-wise Summary Table</CardTitle>
          <CardDescription className="text-xs">Target vs highest giving with achievement ratios</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Metric</th>
                  {FUNDS.map(f => (
                    <th key={f.id} className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                        {f.name}
                      </div>
                    </th>
                  ))}
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Target row */}
                <tr className="border-b border-slate-100" style={{ backgroundColor:'#fefce8' }}>
                  <td className="px-4 py-3 text-xs font-semibold text-amber-700">Target</td>
                  {FUNDS.map(f => (
                    <td key={f.id} className="px-4 py-3 text-right text-xs font-semibold text-amber-700 tabular-nums">{fmtL(f.target)}</td>
                  ))}
                  <td className="px-4 py-3 text-right text-xs font-bold text-amber-700 tabular-nums">{fmtL(totalTarget)}</td>
                </tr>
                {/* Highest row */}
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700">Highest</td>
                  {FUNDS.map(f => {
                    const r = parseFloat(ratio(f))
                    const chip = r >= 10 ? { bg:'#dbeafe', text:'#1d4ed8' } : { bg:'#dcfce7', text:'#15803d' }
                    return (
                      <td key={f.id} className="px-4 py-3 text-right tabular-nums">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-bold" style={{ color: f.color }}>{fmtL(f.highest)}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: chip.bg, color: chip.text }}>{r}×</span>
                        </div>
                      </td>
                    )
                  })}
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-extrabold text-slate-800 tabular-nums">{fmtL(totalHighest)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
