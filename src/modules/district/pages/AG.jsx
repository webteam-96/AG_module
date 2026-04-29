import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { ZONES } from '../data/agData'

const COLORS = ['#003DA5','#16a34a','#9333ea']
const EMPTY_FORM = { zoneName: '', agName: '', agMobile: '', agEmail: '', clubs: '' }

export default function DistrictAG() {
  const [zones, setZones]       = useState(ZONES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [editId, setEditId]     = useState(null)

  const handleSubmit = () => {
    if (!form.zoneName.trim() || !form.agName.trim()) return
    const clubs = form.clubs.split(',').map(c => c.trim()).filter(Boolean)
    if (editId != null) {
      setZones(zs => zs.map(z => z.id === editId ? { ...z, ...form, clubs } : z))
      setEditId(null)
    } else {
      setZones(zs => [...zs, { ...form, clubs, id: Date.now() }])
    }
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const handleEdit = (z) => {
    setForm({ zoneName: z.zoneName, agName: z.agName, agMobile: z.agMobile, agEmail: z.agEmail, clubs: z.clubs.join(', ') })
    setEditId(z.id)
    setShowForm(true)
  }

  const handleDelete = (id) => setZones(zs => zs.filter(z => z.id !== id))

  const totalClubs = zones.reduce((sum, z) => sum + z.clubs.length, 0)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Zones"   value={zones.length}  sub="Under District 5656"  subColor="muted" accent="#003DA5" />
        <StatCard label="Total AGs"     value={zones.length}  sub="Active AGs"           subColor="up"    accent="#16a34a" />
        <StatCard label="Clubs Covered" value={totalClubs}    sub="Across all zones"     subColor="muted" accent="#9333ea" />
      </div>

      {showForm && (
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{editId != null ? 'Edit Zone' : 'Add Zone'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {[
                { field: 'zoneName', label: 'Zone Name'  },
                { field: 'agName',   label: 'AG Name'    },
                { field: 'agMobile', label: 'AG Mobile'  },
                { field: 'agEmail',  label: 'AG Email'   },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
                  <input value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Assigned Clubs (comma-separated)</label>
                <input value={form.clubs}
                  onChange={e => setForm(f => ({ ...f, clubs: e.target.value }))}
                  placeholder="Club A, Club B, Club C"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSubmit}
                className="text-xs font-semibold text-white px-4 py-2 rounded-lg"
                style={{ backgroundColor: '#003DA5' }}>
                {editId != null ? 'Update Zone' : 'Add Zone'}
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
            <CardTitle className="text-sm">Assistant Governors</CardTitle>
            <CardDescription className="text-xs">District 5656 — zone assignments</CardDescription>
          </div>
          <button onClick={() => { setShowForm(s => !s); setEditId(null); setForm(EMPTY_FORM) }}
            className="text-xs font-semibold text-white px-3 py-1.5 rounded-md"
            style={{ backgroundColor: '#003DA5' }}>
            {showForm ? '✕ Cancel' : '+ Add Zone'}
          </button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Zone','AG Name','Mobile','Email','Clubs','Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {zones.map((z, i) => (
                  <tr key={z.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3">
                      <span className="font-semibold text-sm px-2.5 py-1 rounded-md text-white"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}>{z.zoneName}</span>
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap">{z.agName}</td>
                    <td className="px-3 py-3 text-slate-600 tabular-nums text-xs whitespace-nowrap">{z.agMobile}</td>
                    <td className="px-3 py-3 text-slate-600 text-xs">{z.agEmail}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {z.clubs.map(c => (
                          <span key={c} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 whitespace-nowrap">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(z)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" title="Edit">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(z.id)}
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
