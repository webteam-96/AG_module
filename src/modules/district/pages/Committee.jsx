import { useState } from 'react'
import StatCard from '../../club/components/StatCard'
import { COMMITTEES } from '../data/committeeData'

const AVATAR_COLORS = ['#003DA5','#16a34a','#ca8a04','#9333ea','#0891b2','#e11d48','#f59e0b','#64748b']

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function MemberRow({ member, index }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 text-xs text-slate-400 tabular-nums">{index + 1}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
          >
            {initials(member.name)}
          </div>
          <span className="font-semibold text-slate-800 whitespace-nowrap">{member.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 whitespace-nowrap">
          {member.designation}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{member.club}</td>
      <td className="px-4 py-3 text-xs text-slate-600 tabular-nums whitespace-nowrap">{member.mobile}</td>
      <td className="px-4 py-3 text-xs text-slate-600">{member.email}</td>
    </tr>
  )
}

function CommitteeCard({ committee }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Committee header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-8 rounded-full flex-shrink-0"
            style={{ backgroundColor: committee.color }}
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">{committee.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{committee.members.length} member{committee.members.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Member avatar stack */}
          <div className="flex -space-x-2">
            {committee.members.slice(0, 4).map((m, i) => (
              <div
                key={m.id}
                title={m.name}
                className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length], zIndex: 4 - i }}
              >
                {initials(m.name)}
              </div>
            ))}
            {committee.members.length > 4 && (
              <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600" style={{ zIndex: 0 }}>
                +{committee.members.length - 4}
              </div>
            )}
          </div>
          {/* Chevron */}
          <svg
            width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"
            className="transition-transform flex-shrink-0"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Member listing — collapsible */}
      {open && (
        <div className="border-t border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['#', 'Name', 'Designation', 'Club', 'Mobile', 'Email'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {committee.members.map((m, i) => (
                  <MemberRow key={m.id} member={m} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DistrictCommittee() {
  const [search, setSearch] = useState('')

  const totalMembers = COMMITTEES.reduce((s, c) => s + c.members.length, 0)

  const filtered = search
    ? COMMITTEES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.members.some(m =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.designation.toLowerCase().includes(search.toLowerCase()) ||
          m.club.toLowerCase().includes(search.toLowerCase())
        )
      )
    : COMMITTEES

  return (
    <div className="space-y-5">
      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Committees" value={COMMITTEES.length}  sub="District 5656"     subColor="muted" accent="#003DA5" />
        <StatCard label="Total Members"    value={totalMembers}       sub="Across all committees" subColor="muted" accent="#16a34a" />
        <StatCard label="Rotary Year"      value="2025–26"            sub="Active year"       subColor="muted" accent="#9333ea" />
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-sm shadow-sm">
        <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search committee or member..."
          className="flex-1 bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400"
        />
      </div>

      {/* Committee list */}
      <div className="space-y-3">
        {filtered.map(c => (
          <CommitteeCard key={c.id} committee={c} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-10">No committees match "{search}"</p>
        )}
      </div>
    </div>
  )
}
