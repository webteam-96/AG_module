import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard'
import { AVENUE_DATA, fmtINR } from '../data/clubData'

const YEARS = ['2026–27', '2025–26', '2024–25']

const AVENUE_PROJECTS = {
  CM: {
    label: 'Club Service', color: '#003DA5',
    meetings: [
      { id:1, date:'Apr 5, 2026',  type:'Regular',    title:'Weekly Meeting',             attendance:116, total:142, pct:82  },
      { id:2, date:'Mar 29, 2026', type:'Regular',    title:'Weekly Meeting',             attendance:85,  total:142, pct:60  },
      { id:3, date:'Mar 22, 2026', type:'Fellowship', title:'Fellowship Evening',         attendance:114, total:142, pct:80  },
      { id:4, date:'Mar 15, 2026', type:'Regular',    title:'Weekly Meeting',             attendance:97,  total:142, pct:68  },
      { id:5, date:'Mar 8, 2026',  type:'BOD',        title:'Board Meeting',              attendance:12,  total:12,  pct:100 },
      { id:6, date:'Mar 1, 2026',  type:'Regular',    title:'Weekly Meeting',             attendance:116, total:142, pct:82  },
    ],
  },
  SP: {
    label: 'Community Service', color: '#16a34a', hasFilter: true,
    projects: [
      { id:1, date:'Mar 15, 2026', title:'Blood Donation Drive',       cost:0,      beneficiaries:320, manHours:48,  rotarians:28, rotaractors:15 },
      { id:2, date:'Feb 22, 2026', title:'Tree Plantation Drive',      cost:45000,  beneficiaries:600, manHours:120, rotarians:35, rotaractors:20 },
      { id:3, date:'Jan 18, 2026', title:'Medical Camp',               cost:95000,  beneficiaries:450, manHours:96,  rotarians:30, rotaractors:12 },
      { id:4, date:'Dec 5, 2025',  title:'Winter Relief Distribution', cost:35000,  beneficiaries:280, manHours:60,  rotarians:22, rotaractors:8  },
    ],
  },
  VS: {
    label: 'Vocational Service', color: '#0891b2',
    projects: [
      { id:1, date:'Apr 18, 2026', title:'Vocational Training Camp',   cost:72000,  beneficiaries:80,  manHours:72,  rotarians:15, rotaractors:0  },
      { id:2, date:'Dec 5, 2025',  title:'Literacy Drive',             cost:30000,  beneficiaries:120, manHours:48,  rotarians:12, rotaractors:5  },
      { id:3, date:'Nov 10, 2025', title:'Skill Dev. Workshop',        cost:25000,  beneficiaries:60,  manHours:36,  rotarians:10, rotaractors:8  },
    ],
  },
  IS: {
    label: 'International Service', color: '#9333ea',
    projects: [
      { id:1, date:'Mar 10, 2026', title:'Rotary Friends Exchange',    cost:18000,  beneficiaries:8,   manHours:24,  rotarians:4,  rotaractors:0  },
      { id:2, date:'Jan 5, 2026',  title:'Rotary National Program',    cost:12000,  beneficiaries:20,  manHours:16,  rotarians:6,  rotaractors:0  },
      { id:3, date:'Sep 15, 2025', title:'Within Zone Project',        cost:30000,  beneficiaries:200, manHours:40,  rotarians:8,  rotaractors:3  },
    ],
  },
  NGS: {
    label: 'New Generation', color: '#f59e0b',
    projects: [
      { id:1, date:'Apr 25, 2026', title:'Rotaract Charter Ceremony',  cost:35000,  beneficiaries:200, manHours:60,  rotarians:20, rotaractors:45 },
      { id:2, date:'Mar 8, 2026',  title:'RYLA (Local)',               cost:22000,  beneficiaries:25,  manHours:36,  rotarians:5,  rotaractors:0  },
      { id:3, date:'Feb 15, 2026', title:'Interact Club Meet',         cost:8000,   beneficiaries:80,  manHours:24,  rotarians:6,  rotaractors:15 },
      { id:4, date:'Nov 20, 2025', title:'Youth Exchange Program',     cost:15000,  beneficiaries:4,   manHours:48,  rotarians:3,  rotaractors:0  },
    ],
  },
  PII: {
    label: 'Public Image', color: '#e11d48',
    projects: [
      { id:1, date:'Feb 10, 2026', title:'Public Image Workshop',      cost:20000,  beneficiaries:60,  manHours:32,  rotarians:12, rotaractors:0  },
      { id:2, date:'Jan 26, 2026', title:'Republic Day Coverage',      cost:5000,   beneficiaries:500, manHours:16,  rotarians:8,  rotaractors:5  },
      { id:3, date:'Dec 1, 2025',  title:'Social Media Campaign',      cost:12000,  beneficiaries:2000,manHours:40,  rotarians:6,  rotaractors:8  },
      { id:4, date:'Nov 1, 2025',  title:'Press Conference — Awards',  cost:8000,   beneficiaries:150, manHours:12,  rotarians:10, rotaractors:0  },
    ],
  },
}

const MEETING_TYPE_STYLE = {
  Regular:    { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  Fellowship: { bg: 'bg-purple-50', text: 'text-purple-700' },
  BOD:        { bg: 'bg-amber-50',  text: 'text-amber-700'  },
}

const barData = AVENUE_DATA.map(a => ({
  name: a.name.split(' ')[0],
  Done: a.completed,
  Left: a.target - a.completed,
}))

export default function AvenueOfService() {
  const [active, setActive] = useState('CM')
  const [year, setYear]     = useState('2026–27')
  const [filter, setFilter] = useState('All')

  const avenue   = AVENUE_PROJECTS[active]
  const isClub   = active === 'CM'
  const items    = isClub ? avenue.meetings : avenue.projects

  const allProjects = Object.values(AVENUE_PROJECTS).flatMap(a => a.projects ?? [])
  const totalBen    = allProjects.reduce((s, p) => s + p.beneficiaries, 0)
  const totalCost   = allProjects.reduce((s, p) => s + p.cost, 0)
  const totalHours  = allProjects.reduce((s, p) => s + p.manHours, 0)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Total Projects"      value={allProjects.length}                   sub="Across all avenues"  subColor="up"    accent="#003DA5" />
        <StatCard label="Total Beneficiaries" value={totalBen.toLocaleString()}            sub="Lives impacted"      subColor="up"    accent="#16a34a" />
        <StatCard label="Total Project Cost"  value={fmtINR(totalCost)}                   sub="Funds deployed"      subColor="muted" accent="#ca8a04" />
        <StatCard label="Man Hours"           value={totalHours}                           sub="Volunteer hours"     subColor="muted" accent="#9333ea" />
        <StatCard label="Meetings Held"       value={AVENUE_PROJECTS.CM.meetings.length}  sub="Club service"        subColor="muted" accent="#0891b2" />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Project Completion — All Avenues</CardTitle>
          <CardDescription className="text-xs">Completed vs target this RY</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={barData} barSize={18}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 12]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Bar dataKey="Done" fill="#003DA5" radius={[3,3,0,0]} name="Completed" />
              <Bar dataKey="Left" fill="#e2e8f0" radius={[3,3,0,0]} name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Avenue detail */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm">{avenue.label}</CardTitle>
              <CardDescription className="text-xs">{isClub ? 'Meeting records' : 'Project records'} — {year}</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select value={year} onChange={e => setYear(e.target.value)}
                className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-600 bg-white outline-none">
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
              <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-md" style={{ backgroundColor: avenue.color }}>
                + {isClub ? 'Add Meeting' : 'Add Project'}
              </button>
            </div>
          </div>

          {/* Avenue tabs */}
          <div className="flex gap-1 mt-3 flex-wrap">
            {Object.entries(AVENUE_PROJECTS).map(([key, av]) => (
              <button key={key} onClick={() => { setActive(key); setFilter('All') }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  active === key ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={active === key ? { backgroundColor: av.color } : {}}>{av.label}</button>
            ))}
          </div>

          {/* Onetime/Ongoing filter (Community Service only) */}
          {avenue.hasFilter && (
            <div className="flex gap-1 mt-2">
              {['All', 'One-time Projects', 'Ongoing/Repeat Projects'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    filter === f ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>{f}</button>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-4">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 w-10">Sr.</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">Date</th>
                  {isClub && <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">Meeting Type</th>}
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Title</th>
                  {isClub ? (
                    <>
                      <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Attendance</th>
                      <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Att. %</th>
                    </>
                  ) : (
                    <>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Cost</th>
                      <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">Direct Ben.</th>
                      <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">Man Hours</th>
                      <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Rotarians</th>
                      <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Rotaractors</th>
                    </>
                  )}
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Edit</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, i) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 text-xs text-slate-400">{i + 1}</td>
                    <td className="px-3 py-3 text-slate-500 text-xs whitespace-nowrap">{item.date}</td>
                    {isClub && (
                      <td className="px-3 py-3">
                        {(() => { const s = MEETING_TYPE_STYLE[item.type] ?? MEETING_TYPE_STYLE.Regular; return (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${s.bg} ${s.text}`}>{item.type}</span>
                        )})()}
                      </td>
                    )}
                    <td className="px-3 py-3 font-semibold text-slate-800">{item.title}</td>
                    {isClub ? (
                      <>
                        <td className="px-3 py-3 text-center font-semibold text-slate-700 tabular-nums">{item.attendance}/{item.total}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={`text-sm font-extrabold tabular-nums ${item.pct >= 75 ? 'text-green-600' : item.pct >= 65 ? 'text-amber-600' : 'text-red-600'}`}>
                            {item.pct}%
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-3 text-right font-semibold text-slate-800 tabular-nums">{item.cost ? fmtINR(item.cost) : '—'}</td>
                        <td className="px-3 py-3 text-center font-bold text-slate-800 tabular-nums">{item.beneficiaries.toLocaleString()}</td>
                        <td className="px-3 py-3 text-center text-slate-600 tabular-nums">{item.manHours}</td>
                        <td className="px-3 py-3 text-center text-slate-600 tabular-nums">{item.rotarians}</td>
                        <td className="px-3 py-3 text-center text-slate-600 tabular-nums">{item.rotaractors}</td>
                      </>
                    )}
                    <td className="px-3 py-3 text-center">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">{items.length} {isClub ? 'meetings' : 'projects'} · {year}</p>
        </CardContent>
      </Card>
    </div>
  )
}
