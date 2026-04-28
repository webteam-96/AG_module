import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { fmtINR } from '../data/clubData'

/* ── Extended mock data for this page ─────────────────────────────── */
const DUES_DATA = {
  '2026–27': [
    { id: 1,  name: 'Khushboo Tadkar', initials: 'KT', color: '#003DA5', type: 'Full',      ri: 4200, local: 1800, total: 6000, dueDate: 'Mar 31', paidOn: 'Mar 15, 2026', status: 'Paid'    },
    { id: 2,  name: 'Rashid Shaikh',   initials: 'RS', color: '#9333ea', type: 'Full',      ri: 4200, local: 1800, total: 6000, dueDate: 'Mar 31', paidOn: 'Mar 20, 2026', status: 'Paid'    },
    { id: 3,  name: 'Praveen Mestry',  initials: 'PM', color: '#0891b2', type: 'Full',      ri: 4200, local: 1800, total: 6000, dueDate: 'Mar 31', paidOn: 'Feb 28, 2026', status: 'Paid'    },
    { id: 4,  name: 'Asha Kumar',      initials: 'AK', color: '#e11d48', type: 'Associate', ri: 2800, local: 1200, total: 4000, dueDate: 'Mar 31', paidOn: null,           status: 'Overdue' },
    { id: 5,  name: 'Vijay Nair',      initials: 'VN', color: '#ca8a04', type: 'Full',      ri: 4200, local: 1800, total: 6000, dueDate: 'Apr 15', paidOn: null,           status: 'Pending' },
    { id: 6,  name: 'Sunita Patil',    initials: 'SP', color: '#16a34a', type: 'Full',      ri: 4200, local: 1800, total: 6000, dueDate: 'Mar 31', paidOn: 'Mar 25, 2026', status: 'Paid'    },
    { id: 7,  name: 'Ramesh Joshi',    initials: 'RJ', color: '#64748b', type: 'Associate', ri: 2800, local: 1200, total: 4000, dueDate: 'Apr 15', paidOn: null,           status: 'Pending' },
    { id: 8,  name: 'Deepa Sharma',    initials: 'DS', color: '#0f172a', type: 'Honorary',  ri: 0,    local: 0,    total: 0,    dueDate: '—',      paidOn: '—',            status: 'Exempt'  },
    { id: 9,  name: 'Anita Kulkarni',  initials: 'AK', color: '#7c3aed', type: 'Associate', ri: 2800, local: 1200, total: 4000, dueDate: 'Apr 15', paidOn: null,           status: 'Pending' },
    { id: 10, name: 'Suresh Iyer',     initials: 'SI', color: '#b45309', type: 'Full',      ri: 4200, local: 1800, total: 6000, dueDate: 'Mar 31', paidOn: 'Mar 10, 2026', status: 'Paid'    },
  ],
  '2025–26': [
    { id: 1,  name: 'Khushboo Tadkar', initials: 'KT', color: '#003DA5', type: 'Full',      ri: 3800, local: 1600, total: 5400, dueDate: 'Mar 31', paidOn: 'Feb 12, 2025', status: 'Paid'    },
    { id: 2,  name: 'Rashid Shaikh',   initials: 'RS', color: '#9333ea', type: 'Full',      ri: 3800, local: 1600, total: 5400, dueDate: 'Mar 31', paidOn: 'Mar 5, 2025',  status: 'Paid'    },
    { id: 3,  name: 'Praveen Mestry',  initials: 'PM', color: '#0891b2', type: 'Full',      ri: 3800, local: 1600, total: 5400, dueDate: 'Mar 31', paidOn: 'Mar 18, 2025', status: 'Paid'    },
    { id: 4,  name: 'Asha Kumar',      initials: 'AK', color: '#e11d48', type: 'Associate', ri: 2400, local: 1000, total: 3400, dueDate: 'Mar 31', paidOn: 'Apr 10, 2025', status: 'Paid'    },
    { id: 5,  name: 'Vijay Nair',      initials: 'VN', color: '#ca8a04', type: 'Full',      ri: 3800, local: 1600, total: 5400, dueDate: 'Mar 31', paidOn: null,           status: 'Overdue' },
  ],
}

const EVENT_LINKS = [
  { id: 1, name: 'TRF Fundraiser Dinner',     price: '₹2,500 / seat',   date: 'Apr 20, 2026', registrations: 38,  capacity: 80,  status: 'Active', url: 'rotary3142.org/trf-dinner-apr26'     },
  { id: 2, name: 'Rotaract Charter Ceremony', price: 'Free entry',       date: 'Apr 25, 2026', registrations: 112, capacity: 200, status: 'Active', url: 'rotary3142.org/rotaract-charter-apr26' },
  { id: 3, name: 'Annual Membership Renewal', price: '₹6,000 / member', date: 'Apr 30, 2026', registrations: 89,  capacity: 142, status: 'Open',   url: 'rotary3142.org/membership-2026-27'    },
  { id: 4, name: 'PPH Medical Camp',          price: '₹500 / slot',     date: 'May 5, 2026',  registrations: 22,  capacity: 50,  status: 'Draft',  url: 'rotary3142.org/pph-may-2026'          },
]

/* ── Style maps ───────────────────────────────────────────────────── */
const STATUS_STYLE = {
  Paid:    { bg: 'bg-green-50',  text: 'text-green-700',  dot: '#16a34a' },
  Pending: { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: '#f59e0b' },
  Overdue: { bg: 'bg-red-50',    text: 'text-red-600',    dot: '#ef4444' },
  Exempt:  { bg: 'bg-slate-100', text: 'text-slate-500',  dot: '#94a3b8' },
}
const LINK_STYLE = {
  Active: { bg: 'bg-green-50',  text: 'text-green-700'  },
  Open:   { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  Draft:  { bg: 'bg-slate-100', text: 'text-slate-500'  },
}

/* ── Search icon ───────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

/* ── Copy icon ────────────────────────────────────────────────────── */
const CopyIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

/* ── Excel icon ───────────────────────────────────────────────────── */
const ExcelIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
)

/* ── Main component ───────────────────────────────────────────────── */
export default function Payments() {
  const [search, setSearch]         = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [duesYear, setDuesYear]     = useState('2026–27')
  const [copied, setCopied]         = useState(null)
  const [popup, setPopup]           = useState(null)
  const [success, setSuccess]       = useState(null)

  const dues = DUES_DATA[duesYear] ?? []
  const filtered = dues.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchType   = typeFilter === 'All' || d.type === typeFilter
    return matchSearch && matchType
  })

  const payable   = dues.filter(d => d.status !== 'Exempt')
  const collected = payable.filter(d => d.status === 'Paid').reduce((s, d) => s + d.total, 0)
  const pending   = payable.filter(d => d.status !== 'Paid').reduce((s, d) => s + d.total, 0)
  const paidCount = payable.filter(d => d.status === 'Paid').length
  const pct       = payable.length ? Math.round((paidCount / payable.length) * 100) : 0

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 1800)
  }

  /* ── KPI strip ──────────────────────────────────────────────────── */
  return (
    <div className="space-y-5">

      {/* Free Trial banner */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-3 rounded-xl" style={{ background:'linear-gradient(135deg,#003DA5,#1e5fb5)' }}>
        <div className="text-white">
          <p className="text-sm font-bold">Membership Dues Module</p>
          <p className="text-xs opacity-80 mt-0.5">Digital dues collection, reminders, payment links and receipts</p>
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
            style={{ color:'#003DA5' }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Free Trial — 1 Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Dues Collected"  value={fmtINR(collected)} sub={`${pct}% of members paid`}                               subColor="up"    accent="#16a34a" />
        <StatCard label="Dues Pending"    value={fmtINR(pending)}   sub={`${payable.length - paidCount} members outstanding`}      subColor="down"  accent="#e11d48" />
        <StatCard label="Event Revenue"   value="₹2.1L"             sub="4 active event links"                                     subColor="muted" accent="#003DA5" />
        <StatCard label="Total Registered" value="261"              sub="Across all events this RY"                                subColor="muted" accent="#9333ea" />
      </div>

      {/* ── Membership Dues Table ─────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-sm">Membership Dues</CardTitle>
            <CardDescription className="text-xs">Thane City View — annual dues collection register</CardDescription>
          </div>

          {/* Year tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              {Object.keys(DUES_DATA).map(yr => (
                <button
                  key={yr}
                  onClick={() => setDuesYear(yr)}
                  className={`text-xs font-semibold px-3 py-1.5 transition-colors ${
                    duesYear === yr ? 'text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                  style={duesYear === yr ? { backgroundColor: '#003DA5' } : {}}
                >{yr}</button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              Send Reminder
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
              <ExcelIcon /> Export
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Filters */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
              <SearchIcon />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search member name..."
                className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400"
              />
            </div>
            {['All', 'Full', 'Associate', 'Honorary'].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  typeFilter === t ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >{t}</button>
            ))}
          </div>

          {/* Collection summary strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">Collected</p>
              <p className="text-xl font-extrabold text-green-700 tabular-nums mt-0.5">{fmtINR(collected)}</p>
              <p className="text-xs text-green-600 mt-0.5">{paidCount} members</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <p className="text-xs text-red-500 font-semibold uppercase tracking-wider">Outstanding</p>
              <p className="text-xl font-extrabold text-red-600 tabular-nums mt-0.5">{fmtINR(pending)}</p>
              <p className="text-xs text-red-500 mt-0.5">{payable.length - paidCount} members</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Collection Rate</p>
              <p className="text-xl font-extrabold text-slate-800 tabular-nums mt-0.5">{pct}%</p>
              <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">RI Dues Share</p>
              <p className="text-xl font-extrabold text-amber-700 tabular-nums mt-0.5">
                {fmtINR(dues.filter(d => d.status === 'Paid').reduce((s, d) => s + d.ri, 0))}
              </p>
              <p className="text-xs text-amber-600 mt-0.5">Remitted to RI</p>
            </div>
          </div>

          {/* Dues table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['#', 'Member', 'Type', 'RI Dues', 'Local Dues', 'Total', 'Due Date', 'Paid On', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((d, i) => {
                  const s = STATUS_STYLE[d.status]
                  return (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-xs text-slate-400 tabular-nums">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: d.color }}>{d.initials}</div>
                          <span className="font-semibold text-slate-800 whitespace-nowrap">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-slate-600 px-2 py-0.5 bg-slate-100 rounded">{d.type}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 tabular-nums text-xs">{d.ri ? `₹${d.ri.toLocaleString()}` : '—'}</td>
                      <td className="px-4 py-3 text-slate-600 tabular-nums text-xs">{d.local ? `₹${d.local.toLocaleString()}` : '—'}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 tabular-nums">{d.total ? `₹${d.total.toLocaleString()}` : '—'}</td>
                      <td className={`px-4 py-3 text-xs tabular-nums ${d.status === 'Overdue' ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>{d.dueDate}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 tabular-nums">{d.paidOn ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${s.bg} ${s.text}`}>{d.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {d.status !== 'Paid' && d.status !== 'Exempt' && (
                            <button className="text-xs text-green-700 hover:text-green-900 font-medium whitespace-nowrap">Mark Paid</button>
                          )}
                          {d.status !== 'Exempt' && (
                            <button className="text-xs text-blue-600 hover:text-blue-900 font-medium">
                              {d.status === 'Paid' ? 'Receipt' : 'Remind'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">No members match your search.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Online Event Links ─────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm">Online Event & Payment Links</CardTitle>
            <CardDescription className="text-xs">Shareable registration and payment links for club events</CardDescription>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Link
          </button>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['#', 'Event Name', 'Date', 'Price / Seat', 'Registrations', 'Payment Link', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {EVENT_LINKS.map((ev, i) => {
                  const s  = LINK_STYLE[ev.status]
                  const pctReg = ev.capacity ? Math.round((ev.registrations / ev.capacity) * 100) : 0
                  return (
                    <tr key={ev.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-xs text-slate-400 tabular-nums">{i + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">{ev.name}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{ev.date}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 tabular-nums whitespace-nowrap">{ev.price}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pctReg}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 tabular-nums whitespace-nowrap">{ev.registrations}/{ev.capacity}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-mono truncate max-w-[160px]">{ev.url}</span>
                          <button
                            onClick={() => handleCopy(ev.id, ev.url)}
                            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded border transition-colors ${
                              copied === ev.id
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                            }`}
                          >
                            <CopyIcon />
                            {copied === ev.id ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${s.bg} ${s.text}`}>{ev.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button className="text-xs text-blue-700 hover:text-blue-900 font-medium">Edit</button>
                          <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium">
                            <ExcelIcon /> Export
                          </button>
                          {ev.status === 'Draft' && (
                            <button className="text-xs text-green-700 hover:text-green-900 font-medium">Publish</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {EVENT_LINKS.filter(e => e.status !== 'Draft').length}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Active Links</p>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {EVENT_LINKS.reduce((s, e) => s + e.registrations, 0)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Total Registered</p>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {EVENT_LINKS.reduce((s, e) => s + e.capacity, 0)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Total Capacity</p>
            </div>
            <div className="bg-amber-50 rounded-xl border border-amber-100 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-amber-700 tabular-nums">₹2.1L</p>
              <p className="text-xs text-amber-600 mt-0.5">Event Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popups */}
      {popup === 'trial' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:'rgba(15,23,42,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" fill="none" stroke="#003DA5" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Start your 1-month free trial?</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">You'll get full access to the Membership Dues module for 30 days at no cost.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setPopup(null); setSuccess(true) }} className="flex-1 text-xs font-bold text-white py-2.5 rounded-xl" style={{ backgroundColor:'#003DA5' }}>Yes, Proceed</button>
              <button onClick={() => setPopup(null)} className="flex-1 text-xs font-semibold text-slate-600 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {popup === 'demo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:'rgba(15,23,42,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" fill="none" stroke="#003DA5" strokeWidth="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Request a demo / tutorial?</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Our team will schedule a live walkthrough of the Membership Dues module at a time convenient for you.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setPopup(null); setSuccess(true) }} className="flex-1 text-xs font-bold text-white py-2.5 rounded-xl" style={{ backgroundColor:'#003DA5' }}>Yes, Proceed</button>
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
            <button onClick={() => setSuccess(null)} className="w-full text-xs font-bold text-white py-2.5 rounded-xl" style={{ backgroundColor:'#003DA5' }}>Got it</button>
          </div>
        </div>
      )}
    </div>
  )
}
