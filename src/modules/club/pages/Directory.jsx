import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { MEMBERS, CLUB_STATS } from '../data/clubData'

const MEMBER_COLORS = ['#003DA5','#16a34a','#ca8a04','#9333ea','#0891b2','#e11d48','#f59e0b','#64748b','#b45309','#0f172a','#7c3aed','#0891b2','#16a34a','#e11d48','#003DA5']

const PAGE_SIZE = 8

export default function Directory() {
  const [search, setSearch]         = useState('')
  const [adminStates, setAdminStates]   = useState(() => Object.fromEntries(MEMBERS.map(m => [m.id, m.isAdmin])))
  const [riAdminStates, setRIAdminStates] = useState(() => Object.fromEntries(MEMBERS.map(m => [m.id, m.isRIAdmin])))
  const [page, setPage]             = useState(1)

  const filtered = MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.mobile.includes(search)
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleAdmin = (id) => setAdminStates(s => ({ ...s, [id]: !s[id] }))
  const toggleRIAdmin = (id) => setRIAdminStates(s => ({ ...s, [id]: !s[id] }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Total Members"   value={CLUB_STATS.totalMembers}     sub="▲ 8 this RY"    subColor="up"    accent="#003DA5" />
        <StatCard label="Full Members"    value={CLUB_STATS.fullMembers}      sub="68% of total"   subColor="muted" accent="#16a34a" />
        <StatCard label="Associates"      value={CLUB_STATS.associateMembers} sub="18% of total"   subColor="muted" accent="#60a5fa" />
        <StatCard label="Honorary"        value={CLUB_STATS.honoraryMembers}  sub="13% of total"   subColor="muted" accent="#9333ea" />
        <StatCard label="Club Admins"     value={Object.values(adminStates).filter(Boolean).length} sub="With portal access" subColor="muted" accent="#ca8a04" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">Member Directory</CardTitle>
            <CardDescription className="text-xs">All members — Thane City View Rotary Club</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-md" style={{ backgroundColor: '#003DA5' }}>+ Add New</button>
            <button className="text-xs font-medium text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">Add With Minimum Details</button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Search */}
          <div className="flex items-center gap-2 mb-4 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 max-w-sm">
            <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search name, email or mobile..."
              className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 w-32">Action</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 w-10">Photo</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">Mobile No.</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Email</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Change</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Delete</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">RI Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paged.map((m, i) => {
                  const idx      = (page - 1) * PAGE_SIZE + i
                  const isAdmin  = adminStates[m.id]
                  const isRIAdmin = riAdminStates[m.id]
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      {/* Admin toggle */}
                      <td className="px-3 py-3">
                        <button
                          onClick={() => toggleAdmin(m.id)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap ${
                            isAdmin
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                          }`}
                        >{isAdmin ? 'Remove Admin' : 'Make Admin'}</button>
                      </td>
                      {/* Avatar */}
                      <td className="px-3 py-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: MEMBER_COLORS[idx % MEMBER_COLORS.length] }}>
                          {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      </td>
                      {/* Name */}
                      <td className="px-3 py-3">
                        <div>
                          <p className="font-semibold text-blue-700 hover:underline cursor-pointer">{m.name}</p>
                          <p className="text-[11px] text-slate-400">{m.designation}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-600 tabular-nums text-xs">{m.mobile}</td>
                      <td className="px-3 py-3 text-slate-600 text-xs">{m.email}</td>
                      {/* Edit */}
                      <td className="px-3 py-3 text-center">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="Edit">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                      </td>
                      {/* Delete */}
                      <td className="px-3 py-3 text-center">
                        <button className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" title="Delete">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </td>
                      {/* RI Admin */}
                      <td className="px-3 py-3">
                        <button
                          onClick={() => toggleRIAdmin(m.id)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap ${
                            isRIAdmin
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >{isRIAdmin ? 'Remove RI Admin' : 'Make RI Admin'}</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-500">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} members
            </p>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage(1)}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">First</button>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    p === page ? 'text-white border-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  style={p === page ? { backgroundColor: '#003DA5' } : {}}>{p}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">›</button>
              <button disabled={page === totalPages} onClick={() => setPage(totalPages)}
                className="text-xs px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40">Last</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
