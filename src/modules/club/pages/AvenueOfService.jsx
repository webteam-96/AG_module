import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { fmtINR } from '../data/clubData'

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
    moderator: { name: 'Jayesh', phone: '8928246907', email: 'connect@kaizeninfotech.com' },
    projects: [
      { id:1, date:'Mar 15, 2026', title:'Blood Donation Drive',       cost:0,      beneficiaries:320, manHours:48,  rotarians:28, rotaractors:15, projectType:'Repeat'   },
      { id:2, date:'Feb 22, 2026', title:'Tree Plantation Drive',      cost:45000,  beneficiaries:600, manHours:120, rotarians:35, rotaractors:20, projectType:'One-time' },
      { id:3, date:'Jan 18, 2026', title:'Medical Camp',               cost:95000,  beneficiaries:450, manHours:96,  rotarians:30, rotaractors:12, projectType:'One-time' },
      { id:4, date:'Dec 5, 2025',  title:'Winter Relief Distribution', cost:35000,  beneficiaries:280, manHours:60,  rotarians:22, rotaractors:8,  projectType:'Repeat'   },
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
  PPH: {
    label: 'PPH Camp', color: '#0891b2',
    camps: [
      { id:1, date:'Jan 25, 2026', location:'Kopri, Thane East',   children:280, rotarians:12, rotaractors:8,  coordinator:'Sunita Patil'  },
      { id:2, date:'Nov 2, 2025',  location:'Wagle Estate, Thane', children:320, rotarians:15, rotaractors:10, coordinator:'Ramesh Joshi'  },
      { id:3, date:'Feb 2, 2025',  location:'Mumbra, Thane',       children:210, rotarians:10, rotaractors:6,  coordinator:'Priya Desai'   },
    ],
  },
}

const MEETING_TYPE_STYLE = {
  Regular:    { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  Fellowship: { bg: 'bg-purple-50', text: 'text-purple-700' },
  BOD:        { bg: 'bg-amber-50',  text: 'text-amber-700'  },
}

export default function AvenueOfService() {
  const [active, setActive]   = useState('ALL')
  const [year, setYear]       = useState('2026–27')
  const [filter, setFilter]   = useState('All')
  const [popup, setPopup]     = useState(null)   // 'trial' | 'demo'
  const [success, setSuccess] = useState(null)

  const isAll    = active === 'ALL'
  const avenue   = isAll ? null : AVENUE_PROJECTS[active]
  const isClub   = active === 'CM'
  const isPPH    = active === 'PPH'
  const rawItems = isClub ? avenue.meetings : isPPH ? avenue.camps : (!isAll ? avenue.projects : [])
  const items    = (!isAll && !isPPH && avenue?.hasFilter && filter !== 'All')
    ? rawItems.filter(p =>
        filter === 'One-time Projects'
          ? p.projectType === 'One-time'
          : p.projectType === 'Repeat'
      )
    : rawItems

  // Aggregate stats (used by All tab)
  const allProjects = Object.values(AVENUE_PROJECTS).flatMap(a => a.projects ?? [])
  const totalBen    = allProjects.reduce((s, p) => s + p.beneficiaries, 0)
  const totalCost   = allProjects.reduce((s, p) => s + p.cost, 0)
  const totalHours  = allProjects.reduce((s, p) => s + p.manHours, 0)

  // Per-avenue stats
  const avgAtt  = isClub ? Math.round(avenue.meetings.reduce((s, m) => s + m.pct, 0) / avenue.meetings.length) : null
  const bestAtt = isClub ? Math.max(...avenue.meetings.map(m => m.pct)) : null
  const avBen   = (!isClub && !isAll && !isPPH) ? items.reduce((s, p) => s + p.beneficiaries, 0) : null
  const avCost  = (!isClub && !isAll && !isPPH) ? items.reduce((s, p) => s + p.cost, 0) : null
  const avHours = (!isClub && !isAll && !isPPH) ? items.reduce((s, p) => s + p.manHours, 0) : null

  // PPH stats
  const pphChildren   = isPPH ? items.reduce((s, c) => s + c.children,   0) : 0
  const pphRotarians  = isPPH ? items.reduce((s, c) => s + c.rotarians,  0) : 0
  const pphRotaractors= isPPH ? items.reduce((s, c) => s + c.rotaractors,0) : 0

  return (
    <div className="space-y-5">

      {/* Free Trial banner */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-3 rounded-xl" style={{ background:'linear-gradient(135deg,#16a34a,#15803d)' }}>
        <div className="text-white">
          <p className="text-sm font-bold">Avenue of Service Module</p>
          <p className="text-xs opacity-80 mt-0.5">Track projects, beneficiaries and man hours across all six avenues</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setPopup('demo')}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-white/40 text-white hover:bg-white/10 transition-colors"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Demo / Tutorial
          </button>
          <button
            onClick={() => setPopup('trial')}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-white hover:opacity-90 transition-opacity"
            style={{ color:'#16a34a' }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Free Trial — 1 Month
          </button>
        </div>
      </div>

      {/* Avenue tab bar — top of page */}
      <div className="flex gap-1 flex-wrap bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
        <button
          onClick={() => { setActive('ALL'); setFilter('All') }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            isAll ? 'text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          style={isAll ? { backgroundColor: '#1e3a5f' } : {}}
        >
          All
        </button>
        {Object.entries(AVENUE_PROJECTS).map(([key, av]) => (
          <button
            key={key}
            onClick={() => { setActive(key); setFilter('All') }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              active === key ? 'text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            style={active === key ? { backgroundColor: av.color } : {}}
          >
            {av.label}
          </button>
        ))}
      </div>

      {/* KPI strip — contextual to selected avenue */}
      {isAll ? (
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
          <StatCard label="Total Projects"      value={allProjects.length}                    sub="Across all avenues"  subColor="up"    accent="#1e3a5f" />
          <StatCard label="Total Beneficiaries" value={totalBen.toLocaleString()}             sub="Lives impacted"      subColor="up"    accent="#16a34a" />
          <StatCard label="Total Project Cost"  value={fmtINR(totalCost)}                    sub="Funds deployed"      subColor="muted" accent="#ca8a04" />
          <StatCard label="Man Hours"           value={totalHours}                            sub="Volunteer hours"     subColor="muted" accent="#9333ea" />
          <StatCard label="Meetings Held"       value={AVENUE_PROJECTS.CM.meetings.length}   sub="Club service"        subColor="muted" accent="#0891b2" />
        </div>
      ) : isClub ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard label="Meetings Held"    value={avenue.meetings.length}   sub={`RY ${year}`}              subColor="muted" accent={avenue.color} />
          <StatCard label="Avg Attendance"   value={`${avgAtt}%`}             sub="Per meeting"               subColor="muted" accent={avenue.color} />
          <StatCard label="Best Attendance"  value={`${bestAtt}%`}            sub="Single meeting high"       subColor="up"    accent={avenue.color} />
          <StatCard label="Members on Roll"  value={142}                      sub="Total club members"        subColor="muted" accent={avenue.color} />
        </div>
      ) : isPPH ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard label="Total Camps"          value={items.length}             sub={`RY ${year}`}              subColor="up"    accent={avenue.color} />
          <StatCard label="Children Vaccinated"  value={pphChildren.toLocaleString()} sub="Lives impacted"       subColor="up"    accent={avenue.color} />
          <StatCard label="Rotarians Involved"   value={pphRotarians}             sub="Volunteers"                subColor="muted" accent={avenue.color} />
          <StatCard label="Rotaractors"          value={pphRotaractors}           sub="Youth volunteers"          subColor="muted" accent={avenue.color} />
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard label="Projects"         value={items.length}             sub={`${avenue.label}`}         subColor="up"    accent={avenue.color} />
          <StatCard label="Beneficiaries"    value={avBen.toLocaleString()}   sub="Lives impacted"            subColor="up"    accent={avenue.color} />
          <StatCard label="Project Cost"     value={fmtINR(avCost)}           sub="Funds deployed"            subColor="muted" accent={avenue.color} />
          <StatCard label="Man Hours"        value={avHours}                  sub="Volunteer hours"           subColor="muted" accent={avenue.color} />
        </div>
      )}

      {/* Detail card */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm">{isAll ? 'All Avenues' : avenue.label}</CardTitle>
              <CardDescription className="text-xs">
                {isAll ? 'Summary by avenue' : isClub ? 'Meeting records' : isPPH ? 'Camp records' : 'Project records'} — {year}
              </CardDescription>
            </div>
            {!isAll && (
              <div className="flex gap-2 flex-wrap">
                <select value={year} onChange={e => setYear(e.target.value)}
                  className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-600 bg-white outline-none">
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
                <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-md" style={{ backgroundColor: avenue.color }}>
                  + {isClub ? 'Add Meeting' : isPPH ? 'Add Camp' : 'Add Project'}
                </button>
              </div>
            )}
          </div>

          {/* Onetime/Ongoing filter (Community Service only) */}
          {!isAll && avenue.hasFilter && (
            <div className="flex gap-1 mt-3">
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
          {/* Moderator strip — Community Service only */}
          {!isAll && avenue.moderator && (
            <div
              className="flex items-center gap-4 flex-wrap mb-4 px-4 py-3 rounded-xl"
              style={{ backgroundColor: avenue.color + '10', border: `0.5px solid ${avenue.color}40` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: avenue.color }}
                >
                  {avenue.moderator.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: avenue.color + 'cc' }}>Club Moderator</p>
                  <p className="text-sm font-bold text-slate-800">{avenue.moderator.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 ml-auto flex-wrap">
                <a
                  href={`tel:${avenue.moderator.phone}`}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                  style={{ border: `0.5px solid ${avenue.color}50`, color: avenue.color }}
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {avenue.moderator.phone}
                </a>
                <a
                  href={`mailto:${avenue.moderator.email}`}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                  style={{ border: `0.5px solid ${avenue.color}50`, color: avenue.color }}
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {avenue.moderator.email}
                </a>
              </div>
            </div>
          )}

          {isAll ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Avenue</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Projects</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Beneficiaries</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Cost</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Man Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(AVENUE_PROJECTS).map(([key, av]) => {
                    if (key === 'CM') return (
                      <tr key={key} className="hover:bg-slate-50">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: av.color }} />
                            <span className="font-semibold text-slate-800">{av.label}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center font-semibold text-slate-700 tabular-nums">{av.meetings.length} meetings</td>
                        <td className="px-3 py-3 text-center text-slate-400">—</td>
                        <td className="px-3 py-3 text-right text-slate-400">—</td>
                        <td className="px-3 py-3 text-center text-slate-400">—</td>
                      </tr>
                    )
                    if (key === 'PPH') return (
                      <tr key={key} className="hover:bg-slate-50">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: av.color }} />
                            <span className="font-semibold text-slate-800">{av.label}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center font-semibold text-slate-700 tabular-nums">{av.camps.length} camps</td>
                        <td className="px-3 py-3 text-center font-semibold text-slate-700 tabular-nums">{av.camps.reduce((s,c)=>s+c.children,0).toLocaleString()} children</td>
                        <td className="px-3 py-3 text-right text-slate-400">—</td>
                        <td className="px-3 py-3 text-center text-slate-400">—</td>
                      </tr>
                    )
                    const ps = av.projects
                    const ben   = ps.reduce((s, p) => s + p.beneficiaries, 0)
                    const cost  = ps.reduce((s, p) => s + p.cost, 0)
                    const hours = ps.reduce((s, p) => s + p.manHours, 0)
                    return (
                      <tr key={key} className="hover:bg-slate-50">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: av.color }} />
                            <span className="font-semibold text-slate-800">{av.label}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center font-semibold text-slate-700 tabular-nums">{ps.length}</td>
                        <td className="px-3 py-3 text-center font-semibold text-slate-700 tabular-nums">{ben.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right font-semibold text-slate-700 tabular-nums">{cost ? fmtINR(cost) : '—'}</td>
                        <td className="px-3 py-3 text-center text-slate-600 tabular-nums">{hours}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : isPPH ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 w-10">Sr.</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">Camp Date</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Location</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">Children Vaccinated</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Rotarians</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Rotaractors</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Coordinator</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Edit</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((camp, i) => (
                    <tr key={camp.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 text-xs text-slate-400">{i + 1}</td>
                      <td className="px-3 py-3 text-slate-500 text-xs whitespace-nowrap">{camp.date}</td>
                      <td className="px-3 py-3 font-semibold text-slate-800">{camp.location}</td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-lg font-extrabold text-cyan-600 tabular-nums">{camp.children}</span>
                      </td>
                      <td className="px-3 py-3 text-center tabular-nums text-slate-600">{camp.rotarians}</td>
                      <td className="px-3 py-3 text-center tabular-nums text-slate-600">{camp.rotaractors}</td>
                      <td className="px-3 py-3 text-slate-600 text-xs">{camp.coordinator}</td>
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
          ) : (
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
                        {avenue?.hasFilter && <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">Type</th>}
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
                          {avenue?.hasFilter && (
                            <td className="px-3 py-3 text-center">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                item.projectType === 'Repeat'
                                  ? 'bg-purple-50 text-purple-700'
                                  : 'bg-sky-50 text-sky-700'
                              }`}>
                                {item.projectType === 'Repeat' ? 'Repeat' : 'One-time'}
                              </span>
                            </td>
                          )}
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
          )}
          {!isAll && (
            <p className="text-xs text-slate-400 mt-2">
              {items.length} {isClub ? 'meetings' : isPPH ? `camps · ${pphChildren} children vaccinated` : 'projects'}
              {!isClub && !isPPH && avenue?.hasFilter && filter !== 'All' ? ` · ${filter}` : ''}
              {' · '}{year}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Popups */}
      {popup === 'trial' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:'rgba(15,23,42,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Start your 1-month free trial?</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">You'll get full access to the Avenue of Service module for 30 days at no cost.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setPopup(null); setSuccess(true) }} className="flex-1 text-xs font-bold text-white py-2.5 rounded-xl" style={{ backgroundColor:'#16a34a' }}>Yes, Proceed</button>
              <button onClick={() => setPopup(null)} className="flex-1 text-xs font-semibold text-slate-600 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {popup === 'demo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:'rgba(15,23,42,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Request a demo / tutorial?</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Our team will schedule a live walkthrough of the Avenue of Service module at a time convenient for you.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setPopup(null); setSuccess(true) }} className="flex-1 text-xs font-bold text-white py-2.5 rounded-xl" style={{ backgroundColor:'#16a34a' }}>Yes, Proceed</button>
              <button onClick={() => setPopup(null)} className="flex-1 text-xs font-semibold text-slate-600 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:'rgba(15,23,42,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto">
              <svg width="28" height="28" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Request Received!</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Our team will contact you shortly.</p>
            </div>
            <button onClick={() => setSuccess(null)} className="w-full text-xs font-bold text-white py-2.5 rounded-xl" style={{ backgroundColor:'#16a34a' }}>Got it</button>
          </div>
        </div>
      )}
    </div>
  )
}
