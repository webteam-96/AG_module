import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { BOARD_OF_DIRECTORS } from '../data/clubData'

const YEARS = ['2026–27', '2025–26', '2024–25']

export default function BoardOfDirectors() {
  const [year, setYear]     = useState('2026–27')
  const [records, setRecords] = useState(BOARD_OF_DIRECTORS)
  const [search, setSearch] = useState('')

  const filtered = records.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.designation.toLowerCase().includes(search.toLowerCase())
  )

  const moveUp = (idx) => {
    if (idx === 0) return
    const r = [...records]
    ;[r[idx - 1], r[idx]] = [r[idx], r[idx - 1]]
    setRecords(r)
  }
  const moveDown = (idx) => {
    if (idx === records.length - 1) return
    const r = [...records]
    ;[r[idx], r[idx + 1]] = [r[idx + 1], r[idx]]
    setRecords(r)
  }
  const handleExport = () => {
    const rows = [['Sr.No.','Name','Designation','Mobile','Email'], ...records.map((b,i) => [i+1, b.name, b.designation, b.mobile, b.email])]
    const csv  = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `BOD_${year}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Board Members"    value={records.length}   sub={`RY ${year}`}        subColor="muted" accent="#003DA5" />
        <StatCard label="Executive Roles"  value={5}                sub="President to Sgt"    subColor="muted" accent="#ca8a04" />
        <StatCard label="Service Chairs"   value={6}                sub="Avenue chairs"       subColor="muted" accent="#16a34a" />
        <StatCard label="Growth & Outreach" value={3}               sub="Membership, PI, Youth" subColor="muted" accent="#9333ea" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">Board of Directors</CardTitle>
            <CardDescription className="text-xs">Thane City View — executive board roster</CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Year filter */}
            <select value={year} onChange={e => setYear(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-600 bg-white outline-none focus:border-blue-400">
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
            {/* Search */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search..." className="bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400 w-24" />
            </div>
            {/* Export to Excel */}
            <button onClick={handleExport}
              className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Export to Excel
            </button>
            <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-md" style={{ backgroundColor: '#003DA5' }}>+ Add</button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 w-10">Sr.</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Designation</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">Mobile Number</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Email</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Reorder</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b, i) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 text-xs text-slate-400 tabular-nums">{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: b.color }}>{b.initials}</div>
                        <span className="font-semibold text-slate-800 whitespace-nowrap">{b.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap"
                        style={{ background: b.color + '18', color: b.color }}>{b.designation}</span>
                    </td>
                    <td className="px-3 py-3 text-blue-700 text-xs font-medium tabular-nums">{b.mobile}</td>
                    <td className="px-3 py-3 text-slate-500 text-xs">{b.email}</td>
                    {/* Reorder */}
                    <td className="px-3 py-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <button onClick={() => moveUp(i)} disabled={i === 0}
                          className="text-slate-400 hover:text-slate-700 disabled:opacity-25">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
                        </button>
                        {/* Drag handle icon */}
                        <svg width="14" height="14" fill="#94a3b8" viewBox="0 0 24 24">
                          <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                          <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                          <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                        </svg>
                        <button onClick={() => moveDown(i)} disabled={i === filtered.length - 1}
                          className="text-slate-400 hover:text-slate-700 disabled:opacity-25">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">{records.length} board positions · {year}</p>
        </CardContent>
      </Card>
    </div>
  )
}
