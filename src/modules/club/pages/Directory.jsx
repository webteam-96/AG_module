import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { MEMBERS, PAST_PRESIDENTS, BOARD, CLUB_STATS } from '../data/clubData'

const TYPE_STYLE = {
  Full:      { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  Associate: { bg: 'bg-purple-50', text: 'text-purple-700' },
  Honorary:  { bg: 'bg-slate-100', text: 'text-slate-600'  },
}
const STATUS_STYLE = {
  Active:   { bg: 'bg-green-50', text: 'text-green-700' },
  Inactive: { bg: 'bg-amber-50', text: 'text-amber-700' },
}
const ROLE_COLORS = { President: '#003DA5', Secretary: '#16a34a', 'Foundation Chair': '#ca8a04', Treasurer: '#9333ea' }
const MEMBER_COLORS = ['#003DA5', '#16a34a', '#ca8a04', '#9333ea', '#0891b2', '#e11d48', '#f59e0b', '#64748b']

export default function Directory() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  const filtered = MEMBERS.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.mobile.includes(search)
    const matchType = typeFilter === 'All' || m.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Total Members"   value={CLUB_STATS.totalMembers}     sub="▲ 8 this RY"  subColor="up"    accent="#003DA5" />
        <StatCard label="Full Members"    value={CLUB_STATS.fullMembers}      sub="68% of total" subColor="muted" accent="#16a34a" />
        <StatCard label="Associates"      value={CLUB_STATS.associateMembers} sub="18% of total" subColor="muted" accent="#60a5fa" />
        <StatCard label="Honorary"        value={CLUB_STATS.honoraryMembers}  sub="13% of total" subColor="muted" accent="#9333ea" />
        <StatCard label="Past Presidents" value={PAST_PRESIDENTS.length}      sub="On record"    subColor="muted" accent="#ca8a04" />
      </div>

      {/* Member Directory */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[12px]">Member Directory</CardTitle>
            <CardDescription className="text-[10px]">All members with contact details</CardDescription>
          </div>
          <div className="flex gap-2">
            <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">+ Add Member</button>
            <button className="text-[10.5px] font-medium text-slate-600 hover:bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">Export</button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 min-w-48">
              <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email or mobile..."
                className="flex-1 bg-transparent text-[11px] outline-none text-slate-600 placeholder-slate-400" />
            </div>
            {['All', 'Full', 'Associate', 'Honorary'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-medium transition-all ${
                  typeFilter === t ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >{t}</button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Member', 'Mobile No.', 'Email', 'Type', 'Member Since', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((m, i) => {
                  const ts = TYPE_STYLE[m.type]
                  const ss = STATUS_STYLE[m.status]
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                            style={{ background: MEMBER_COLORS[i % MEMBER_COLORS.length] }}>
                            {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700">{m.name}</p>
                            <p className="text-[9px] text-slate-400">{m.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 tabular-nums">{m.mobile}</td>
                      <td className="px-3 py-2.5 text-slate-500 text-[10px]">{m.email}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${ts.bg} ${ts.text}`}>{m.type}</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 tabular-nums">{m.since}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${ss.bg} ${ss.text}`}>{m.status}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-2">
                          <button className="text-[10px] text-blue-700 hover:text-blue-900 font-medium">Edit</button>
                          <button className="text-[10px] text-red-500 hover:text-red-700 font-medium">Remove</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {/* Past Presidents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Past Presidents</CardTitle>
              <CardDescription className="text-[10px]">Club leadership history</CardDescription>
            </div>
            <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-md border border-blue-200">+ Add</button>
          </CardHeader>
          <CardContent className="pt-0">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Name', 'Year', 'Notable Achievement'].map(h => (
                    <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {PAST_PRESIDENTS.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-semibold text-slate-700">{p.name}</td>
                    <td className="px-3 py-2.5 text-slate-500 tabular-nums">{p.year}</td>
                    <td className="px-3 py-2.5 text-slate-500">{p.achievement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Board of Directors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Board of Directors 2025–26</CardTitle>
            </div>
            <button className="text-[10.5px] font-medium text-slate-600 hover:bg-slate-50 px-2 py-1 rounded-md border border-slate-200">Export</button>
          </CardHeader>
          <CardContent className="pt-0">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Member', 'Role', 'Contact'].map(h => (
                    <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {BOARD.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                          style={{ background: b.color }}>{b.initials}</div>
                        <span className="font-semibold text-slate-700">{b.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: b.color + '18', color: b.color }}>{b.role}</span>
                    </td>
                    <td className="px-3 py-2.5 text-blue-700 text-[10.5px] font-medium tabular-nums">{b.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
