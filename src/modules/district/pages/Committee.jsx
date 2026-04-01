import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { COMMITTEE_MEMBERS, DESIGNATIONS } from '../data/committeeData'

const COLORS = ['#003DA5','#16a34a','#ca8a04','#9333ea','#0891b2','#e11d48']

const EMPTY_FORM = { name: '', mobile: '', email: '', designation: '', club: '', remark: '' }

export default function DistrictCommittee() {
  const [members, setMembers]           = useState(COMMITTEE_MEMBERS)
  const [search, setSearch]             = useState('')
  const [designationFilter, setDFilter] = useState('')
  const [showForm, setShowForm]         = useState(false)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [editId, setEditId]             = useState(null)

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.club.toLowerCase().includes(search.toLowerCase())
    const matchDesig = !designationFilter || m.designation === designationFilter
    return matchSearch && matchDesig
  })

  const uniqueDesignations = [...new Set(members.map(m => m.designation))]

  const handleSubmit = () => {
    if (!form.name.trim()) return
    if (editId != null) {
      setMembers(ms => ms.map(m => m.id === editId ? { ...m, ...form } : m))
      setEditId(null)
    } else {
      setMembers(ms => [...ms, { ...form, id: Date.now() }])
    }
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const handleEdit = (m) => {
    setForm({ name: m.name, mobile: m.mobile, email: m.email, designation: m.designation, club: m.club, remark: m.remark })
    setEditId(m.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id) => setMembers(ms => ms.filter(m => m.id !== id))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Members"      value={members.length}      sub="2025-2026"            subColor="muted" accent="#003DA5" />
        <StatCard label="Designations"       value={uniqueDesignations.length} sub="Unique roles"    subColor="muted" accent="#16a34a" />
        <StatCard label="Clubs Represented"  value={new Set(members.map(m => m.club)).size} sub="Across district" subColor="muted" accent="#9333ea" />
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{editId != null ? 'Edit Member' : 'Add Committee Member'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {[
                { field: 'name',   label: 'Name',          type: 'text'  },
                { field: 'mobile', label: 'Mobile Number', type: 'text'  },
                { field: 'email',  label: 'Email',         type: 'email' },
                { field: 'club',   label: 'Club',          type: 'text'  },
              ].map(({ field, label, type }) => (
                <div key={field}>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
                  <input type={type} value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">District Designation</label>
                <input list="designations-list" value={form.designation}
                  onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"
                  placeholder="Type or select..." />
                <datalist id="designations-list">
                  {DESIGNATIONS.map(d => <option key={d} value={d} />)}
                </datalist>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Remark</label>
                <input type="text" value={form.remark}
                  onChange={e => setForm(f => ({ ...f, remark: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSubmit}
                className="text-xs font-semibold text-white px-4 py-2 rounded-lg"
                style={{ backgroundColor: '#003DA5' }}>
                {editId != null ? 'Update' : 'Add Member'}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }}
                className="text-xs font-medium text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">District Committee</CardTitle>
            <CardDescription className="text-xs">District 5656 — 2025-2026</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setShowForm(s => !s); setEditId(null); setForm(EMPTY_FORM) }}
              className="text-xs font-semibold text-white px-3 py-1.5 rounded-md"
              style={{ backgroundColor: '#003DA5' }}>
              {showForm ? '✕ Cancel' : '+ Add Member'}
            </button>
            <button className="text-xs font-medium text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              Export PDF
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-sm">
              <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name or club..."
                className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400" />
            </div>
            <select value={designationFilter} onChange={e => setDFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 bg-white outline-none">
              <option value="">All Designations</option>
              {uniqueDesignations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Photo','Name','Club','Designation','Mobile','Email','Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((m, i) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: COLORS[i % COLORS.length] }}>
                        {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap">{m.name}</td>
                    <td className="px-3 py-3 text-slate-600 text-xs whitespace-nowrap">{m.club}</td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 whitespace-nowrap">
                        {m.designation}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600 tabular-nums text-xs whitespace-nowrap">{m.mobile}</td>
                    <td className="px-3 py-3 text-slate-600 text-xs">{m.email}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(m)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="Edit">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(m.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" title="Delete">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-400">No members found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
