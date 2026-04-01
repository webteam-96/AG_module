import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { DIRECTORY_MEMBERS } from '../data/directoryData'

const COLORS = ['#003DA5','#16a34a','#ca8a04','#9333ea','#0891b2','#e11d48','#f59e0b','#64748b']
const PAGE_SIZE = 8

export default function DistrictDirectory() {
  const [search, setSearch]           = useState('')
  const [adminStates, setAdminStates] = useState(() =>
    Object.fromEntries(DIRECTORY_MEMBERS.map(m => [m.id, m.isAdmin]))
  )
  const [page, setPage] = useState(1)

  const filtered = DIRECTORY_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.mobile.includes(search)
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const adminCount = Object.values(adminStates).filter(Boolean).length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Members"    value={DIRECTORY_MEMBERS.length} sub="District-level access" subColor="muted" accent="#003DA5" />
        <StatCard label="Admins"           value={adminCount}               sub="With portal access"    subColor="muted" accent="#16a34a" />
        <StatCard label="Read-Only Access" value={DIRECTORY_MEMBERS.length - adminCount} sub="View only" subColor="muted" accent="#64748b" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">Member Directory</CardTitle>
            <CardDescription className="text-xs">District 5656 — governance access list (read-only)</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Search */}
          <div className="flex items-center gap-2 mb-4 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 max-w-sm">
            <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search name, email or mobile..."
              className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 w-10">Photo</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Mobile No.</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paged.map((m, i) => {
                  const colorIdx = ((page - 1) * PAGE_SIZE + i) % COLORS.length
                  const isAdmin = adminStates[m.id]
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: COLORS[colorIdx] }}>
                          {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-800">{m.name}</td>
                      <td className="px-3 py-3 text-slate-600 tabular-nums text-xs">{m.mobile}</td>
                      <td className="px-3 py-3 text-slate-600 text-xs">{m.email}</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                          isAdmin
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>{isAdmin ? 'Admin' : 'Member'}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-500">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
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
          </div>}
          {filtered.length === 0 && search && (
            <p className="text-xs text-slate-400 mt-3 text-center">No members match "{search}"</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
