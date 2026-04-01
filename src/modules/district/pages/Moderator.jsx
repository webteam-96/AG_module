import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { MODERATORS } from '../data/moderatorData'

const COLORS = ['#003DA5','#16a34a','#ca8a04','#9333ea','#0891b2','#e11d48']

export default function DistrictModerator() {
  const [search, setSearch] = useState('')

  const filtered = MODERATORS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.club.toLowerCase().includes(search.toLowerCase()) ||
    m.mobile.includes(search)
  )

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Moderators"  value={MODERATORS.length}             sub="Assigned"           subColor="muted" accent="#003DA5" />
        <StatCard label="Clubs Covered"     value={MODERATORS.length}             sub="With moderator"     subColor="up"    accent="#16a34a" />
        <StatCard label="Unassigned Clubs"  value={6 - MODERATORS.length}         sub="Need assignment"    subColor={6 - MODERATORS.length > 0 ? 'down' : 'muted'} accent="#e11d48" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">Club Moderators</CardTitle>
            <CardDescription className="text-xs">District staff assigned to oversee specific clubs</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 mb-4 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 max-w-sm">
            <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name or club..."
              className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 w-10">Sr.</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Mobile</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((m, i) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 text-slate-500 text-xs">{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: COLORS[i % COLORS.length] }}>
                          {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{m.name}</p>
                          <p className="text-[11px] text-slate-400">({m.club})</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-600 tabular-nums text-xs">{m.mobile}</td>
                    <td className="px-3 py-3 text-slate-600 text-xs">{m.email}</td>
                    <td className="px-3 py-3">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="View Club">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-400">No moderators found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
