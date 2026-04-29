// src/modules/district/pages/Clubs.jsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { CLUB_ANALYTICS } from '../data/analyticsData'

const PER_PAGE = 15

const STATUS_COLORS = {
  Active:   'bg-green-50 text-green-700',
  Inactive: 'bg-slate-100 text-slate-500',
}

export default function DistrictClubs() {
  const [search,     setSearch]     = useState('')
  const [page,       setPage]       = useState(0)
  const [expandedId, setExpandedId] = useState(null)

  const totalMembers = CLUB_ANALYTICS.reduce((s, c) => s + c.members, 0)
  const totalActive  = CLUB_ANALYTICS.reduce((s, c) => s + c.activeMembers, 0)
  const totalNew     = CLUB_ANALYTICS.reduce((s, c) => s + c.newThisYear, 0)

  const filtered   = CLUB_ANALYTICS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const safePage   = Math.min(page, Math.max(0, totalPages - 1))
  const rows       = filtered.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE)

  return (
    <div className="space-y-5">

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Clubs"    value={CLUB_ANALYTICS.length} sub="District 5656"    subColor="muted" accent="#003DA5" />
        <StatCard label="Total Members"  value={totalMembers}           sub="Across all clubs" subColor="muted" accent="#16a34a" />
        <StatCard label="Active Members" value={totalActive}            sub="Currently active" subColor="up"    accent="#0891b2" />
        <StatCard label="New This Year"  value={totalNew}               sub="New members RY"   subColor="up"    accent="#9333ea" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-sm">All Clubs — District 5656</CardTitle>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search club..."
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-slate-400 placeholder-slate-400 w-52" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">

          {rows.map(club => {
            const isOpen      = expandedId === club.id
            const attendColor = club.avgAttendance >= 75 ? '#16a34a' : club.avgAttendance >= 50 ? '#f59e0b' : '#ef4444'
            return (
              <div key={club.id} className="rounded-xl border border-slate-200 overflow-hidden">

                {/* Club summary row */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : club.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#003DA5' }}>
                    {club.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{club.name}</p>
                    <p className="text-xs text-slate-400">{club.meetingDay} · {club.meetingTime}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 flex-shrink-0 text-xs">
                    <div className="text-center">
                      <p className="font-bold text-slate-800 tabular-nums">{club.members}</p>
                      <p className="text-slate-400">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold tabular-nums" style={{ color: attendColor }}>{club.avgAttendance}%</p>
                      <p className="text-slate-400">Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-800 tabular-nums">{club.newThisYear}</p>
                      <p className="text-slate-400">New</p>
                    </div>
                  </div>
                  <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"
                    className="flex-shrink-0 transition-transform" style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>

                {/* Member drill-down */}
                {isOpen && (
                  <div className="border-t border-slate-100 overflow-x-auto bg-slate-50">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200">
                          {['Name','Designation','Mobile','Email','Since','Status'].map(h => (
                            <th key={h} className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {club.memberRoster.map((m, i) => (
                          <tr key={i} className="hover:bg-white">
                            <td className="px-3 py-2.5 font-semibold text-slate-800 whitespace-nowrap">{m.name}</td>
                            <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{m.designation}</td>
                            <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{m.mobile}</td>
                            <td className="px-3 py-2.5 text-slate-500">{m.email}</td>
                            <td className="px-3 py-2.5 text-slate-500 tabular-nums">{m.since}</td>
                            <td className="px-3 py-2.5">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[m.status] ?? STATUS_COLORS.Active}`}>
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-10">No clubs match your search.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                {safePage * PER_PAGE + 1}–{Math.min((safePage + 1) * PER_PAGE, filtered.length)} of {filtered.length} clubs
              </span>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">←</button>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">→</button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
