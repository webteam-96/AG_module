import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import StatCard from '../components/StatCard'
import { AVENUE_DATA, PROJECTS, fmtINR } from '../data/clubData'

const STATUS_STYLE = {
  'Completed':   { bg: 'bg-green-50',  text: 'text-green-700'  },
  'In Progress': { bg: 'bg-amber-50',  text: 'text-amber-700'  },
  'Upcoming':    { bg: 'bg-blue-50',   text: 'text-blue-700'   },
}

const AVENUE_TABS = ['All', 'Community Service', 'Club Service', 'New Generation', 'Vocational Service', 'Public Image', 'International Service']

export default function AvenueOfService() {
  const [tab, setTab] = useState('All')
  const filtered = tab === 'All' ? PROJECTS : PROJECTS.filter(p => p.avenue === tab)
  const totalBeneficiaries = AVENUE_DATA.reduce((s, a) => s + a.beneficiaries, 0)
  const totalFunds = PROJECTS.reduce((s, p) => s + p.funds, 0)
  const completed = PROJECTS.filter(p => p.status === 'Completed').length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Total Projects"  value={PROJECTS.length}                                                           sub="This RY"             subColor="muted" accent="#003DA5" />
        <StatCard label="Completed"       value={completed}                                                                 sub={`${Math.round(completed/PROJECTS.length*100)}% done`} subColor="up" accent="#16a34a" />
        <StatCard label="In Progress"     value={PROJECTS.filter(p => p.status === 'In Progress').length}                  sub="Ongoing"             subColor="muted" accent="#f59e0b" />
        <StatCard label="Beneficiaries"   value={totalBeneficiaries.toLocaleString()}                                      sub="People impacted"     subColor="up"    accent="#0891b2" />
        <StatCard label="Funds Deployed"  value={fmtINR(totalFunds)}                                                       sub="This year"           subColor="muted" accent="#9333ea" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-[12px]">Projects by Avenue</CardTitle>
            <CardDescription className="text-[10px]">Count completed this RY</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={AVENUE_DATA} barSize={28}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={n => n.split(' ')[0]} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={20} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                  {AVENUE_DATA.map((a, i) => <Cell key={i} fill={a.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[12px]">Beneficiary Reach</CardTitle>
            <CardDescription className="text-[10px]">People impacted by avenue</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {[...AVENUE_DATA].sort((a, b) => b.beneficiaries - a.beneficiaries).map(a => (
              <div key={a.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10.5px] font-medium text-slate-600">{a.name}</span>
                  <span className="text-[10px] text-slate-400 tabular-nums">{a.beneficiaries.toLocaleString()}</span>
                </div>
                <div className="h-[5px] bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(a.beneficiaries / 2400) * 100}%`, background: a.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[12px]">All Projects</CardTitle>
            <CardDescription className="text-[10px]">Filter by avenue or status</CardDescription>
          </div>
          <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">
            + Add Project
          </button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-1.5 flex-wrap mb-3">
            {AVENUE_TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-medium transition-all ${
                  tab === t ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >{t}</button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Project Name</th>
                  <th className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Avenue</th>
                  <th className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Date</th>
                  <th className="text-right text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Beneficiaries</th>
                  <th className="text-right text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Funds</th>
                  <th className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => {
                  const s = STATUS_STYLE[p.status] ?? STATUS_STYLE['Upcoming']
                  const av = AVENUE_DATA.find(a => a.name === p.avenue)
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                      <td className="px-3 py-2.5 font-semibold text-slate-700">{p.name}</td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: av?.color ?? '#94a3b8' }} />
                          {p.avenue}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500">{p.date}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{p.beneficiaries}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{p.funds ? fmtINR(p.funds) : '—'}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>{p.status}</span>
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
