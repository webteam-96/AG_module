import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { PAST_PRESIDENTS } from '../data/clubData'

export default function PastPresidents() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newYear, setNewYear] = useState('')
  const [records, setRecords] = useState(PAST_PRESIDENTS)
  const [editId, setEditId] = useState(null)

  const filtered = records.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.year.includes(search)
  )

  const handleAdd = () => {
    if (!newName || !newYear) return
    setRecords(r => [...r, { name: newName, year: newYear, achievement: '' }])
    setNewName(''); setNewYear(''); setShowAdd(false)
  }

  const handleDelete = (idx) => setRecords(r => r.filter((_, i) => i !== idx))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Presidents on Record" value={records.length}     sub="Club leadership history" subColor="muted" accent="#003DA5" />
        <StatCard label="Years of Service"      value={records.length}    sub="Rotary years documented" subColor="muted" accent="#ca8a04" />
        <StatCard label="Oldest Record"         value="2015–16"           sub="On record"               subColor="muted" accent="#16a34a" />
        <StatCard label="Current President"     value={records[0]?.name.split(' ')[0]} sub={records[0]?.year} subColor="up" accent="#9333ea" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">Past Presidents List</CardTitle>
            <CardDescription className="text-xs">Thane City View — club leadership history</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search..." className="bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400 w-32" />
            </div>
            <button onClick={() => setShowAdd(v => !v)}
              className="text-xs font-semibold text-white px-3 py-1.5 rounded-md" style={{ backgroundColor: '#003DA5' }}>
              + Add
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Add form */}
          {showAdd && (
            <div className="flex gap-3 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex-wrap">
              <input value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="President name"
                className="flex-1 min-w-36 text-sm border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-white" />
              <input value={newYear} onChange={e => setNewYear(e.target.value)}
                placeholder="Year (e.g. 2027–28)"
                className="w-36 text-sm border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-white" />
              <button onClick={handleAdd}
                className="text-xs font-semibold text-white px-3 py-2 rounded-md" style={{ backgroundColor: '#003DA5' }}>Save</button>
              <button onClick={() => setShowAdd(false)}
                className="text-xs font-medium text-slate-600 px-3 py-2 rounded-md border border-slate-200 bg-white">Cancel</button>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2.5 w-12">Sr.No.</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2.5">Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2.5">Year</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2.5">Edit</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2.5">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p, i) => (
                  <tr key={i} className={`hover:bg-slate-50 ${i === 0 ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-4 py-3 text-xs text-slate-400 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      {editId === i ? (
                        <input defaultValue={p.name}
                          onBlur={e => { const r = [...records]; r[i] = { ...r[i], name: e.target.value }; setRecords(r); setEditId(null) }}
                          className="text-sm border border-blue-300 rounded px-2 py-1 outline-none w-full" autoFocus />
                      ) : (
                        <p className="font-semibold text-slate-800">{p.name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 tabular-nums font-medium">{p.year}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setEditId(i)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="Edit">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(i)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" title="Delete">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">{filtered.length} records</p>
        </CardContent>
      </Card>
    </div>
  )
}
