import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { DUES, EVENT_LINKS, fmtINR } from '../data/clubData'

const STATUS_STYLE = {
  Paid:    { bg: 'bg-green-50', text: 'text-green-700' },
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Overdue: { bg: 'bg-red-50',   text: 'text-red-600'   },
}

const LINK_STYLE = {
  Active: { bg: 'bg-green-50', text: 'text-green-700' },
  Open:   { bg: 'bg-blue-50',  text: 'text-blue-700'  },
}

export default function Payments() {
  const [search, setSearch] = useState('')
  const totalDues = DUES.reduce((s, d) => s + d.amount, 0)
  const collected = DUES.filter(d => d.status === 'Paid').reduce((s, d) => s + d.amount, 0)
  const pending = totalDues - collected
  const pct = Math.round((collected / totalDues) * 100)
  const filtered = DUES.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Dues Collected" value={fmtINR(collected)} sub={`${pct}% collection`}                                         subColor="up"    accent="#16a34a" />
        <StatCard label="Dues Pending"   value={fmtINR(pending)}   sub={`${DUES.filter(d => d.status !== 'Paid').length} members`}     subColor="down"  accent="#e11d48" />
        <StatCard label="Event Revenue"  value="₹2.1L"             sub="This RY"                                                       subColor="muted" accent="#003DA5" />
        <StatCard label="TRF Collected"  value={fmtINR(320000)}    sub="68% of goal"                                                   subColor="muted" accent="#ca8a04" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {/* Dues table */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Membership Dues</CardTitle>
              <CardDescription className="text-[10px]">Current year payment status</CardDescription>
            </div>
            <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">Send Reminder</button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 mb-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search members..."
                className="flex-1 bg-transparent text-[11px] outline-none text-slate-600 placeholder-slate-400"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Member', 'Type', 'Amount', 'Due Date', 'Status'].map(h => (
                      <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(d => {
                    const s = STATUS_STYLE[d.status]
                    return (
                      <tr key={d.id} className="hover:bg-slate-50 cursor-pointer">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                              style={{ background: d.color }}>{d.initials}</div>
                            <span className="font-semibold text-slate-700">{d.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-slate-500">{d.type}</td>
                        <td className="px-3 py-2.5 tabular-nums font-medium text-slate-700">₹{d.amount.toLocaleString()}</td>
                        <td className={`px-3 py-2.5 ${d.status === 'Overdue' ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>{d.dueDate}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>{d.status}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-3">
          {/* Collection summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[12px]">Collection Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 rounded-lg p-2.5">
                  <p className="text-[14px] font-extrabold text-green-700 tabular-nums">{fmtINR(collected)}</p>
                  <p className="text-[8.5px] text-green-600 mt-0.5">Collected</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2.5">
                  <p className="text-[14px] font-extrabold text-red-600 tabular-nums">{fmtINR(pending)}</p>
                  <p className="text-[8.5px] text-red-500 mt-0.5">Pending</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <p className="text-[14px] font-extrabold text-slate-700">{pct}%</p>
                  <p className="text-[8.5px] text-slate-500 mt-0.5">Recovery</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-500">Full Members (97)</span>
                  <span className="text-slate-600 font-medium tabular-nums">₹4.8L / ₹5.8L</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: '83%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-500">Associate (26)</span>
                  <span className="text-slate-600 font-medium tabular-nums">₹76K / ₹1.04L</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-sky-400" style={{ width: '73%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Online Event Links */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[12px]">Online Event Links</CardTitle>
              <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-md border border-blue-200">+ Create</button>
            </CardHeader>
            <CardContent className="pt-0 divide-y divide-slate-50">
              {EVENT_LINKS.map(l => {
                const s = LINK_STYLE[l.status]
                return (
                  <div key={l.id} className="flex items-center gap-2.5 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11.5px] font-semibold text-slate-700 truncate">{l.name}</p>
                      <p className="text-[9.5px] text-slate-400">{l.price} · {l.date}</p>
                    </div>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>{l.status}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
