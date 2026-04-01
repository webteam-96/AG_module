import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users, Calendar, Briefcase, Trophy, Medal } from 'lucide-react'
import { CLUBS, AG_NAME } from '@/data/realData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// ─── Stat Cell ───────────────────────────────────────────────────────────────

const StatCell = ({ icon: Icon, label, value, accent = false }) => (
  <div className={`flex flex-col gap-0.5 rounded-lg px-3 py-2 ${accent ? 'bg-[#003DA5]/5' : 'bg-slate-50'}`}>
    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-400 font-medium">
      <Icon size={10} />
      {label}
    </div>
    <span className="text-sm font-bold text-slate-800 tabular-nums">{value}</span>
  </div>
)

// ─── Rank Badge ──────────────────────────────────────────────────────────────

const RankBadge = ({ rank }) => {
  let color = 'bg-slate-100 text-slate-600 border-slate-200'
  if (rank <= 600)  color = 'bg-green-50 text-green-700 border-green-200'
  else if (rank <= 1000) color = 'bg-blue-50 text-blue-700 border-blue-200'
  else color = 'bg-yellow-50 text-yellow-700 border-yellow-200'

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold border rounded-full px-2 py-0.5 ${color}`}>
      <Medal size={10} />
      #{rank.toLocaleString()} nationally
    </span>
  )
}

// ─── Club Card ───────────────────────────────────────────────────────────────

const ClubCard = ({ club }) => {
  const navigate = useNavigate()

  return (
    <Card
      onClick={() => navigate(`/clubs/${club.id}`)}
      className="cursor-pointer border border-slate-200 hover:border-[#003DA5]/40 hover:shadow-md transition-all duration-150 group"
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-bold text-slate-800 leading-tight group-hover:text-[#003DA5] transition-colors">
            {club.name}
          </CardTitle>
          <RankBadge rank={club.projectRank} />
        </div>

        {/* President */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <Users size={12} className="text-slate-400 shrink-0" />
          <span className="text-xs text-slate-600 truncate">
            <span className="text-slate-400 mr-1">President:</span>
            {club.president.name}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <StatCell icon={Users}     label="Members"  value={club.members}       accent />
          <StatCell icon={Calendar}  label="Meetings" value={club.meetings}      />
          <StatCell icon={Briefcase} label="Projects" value={club.totalProjects} />
          <StatCell
            icon={Trophy}
            label="TRF (INR)"
            value={`₹${(club.trf.totalINR / 1000).toFixed(0)}K`}
            accent
          />
        </div>

        {/* View link hint */}
        <div className="mt-3 text-right">
          <span className="text-[11px] text-[#003DA5] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View details →
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ClubDirectory() {
  const [search, setSearch] = useState('')

  const filteredClubs = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return CLUBS
    return CLUBS.filter(c => c.name.toLowerCase().includes(q))
  }, [search])

  const totals = useMemo(() => ({
    members:  CLUBS.reduce((s, c) => s + c.members, 0),
    meetings: CLUBS.reduce((s, c) => s + c.meetings, 0),
    projects: CLUBS.reduce((s, c) => s + c.totalProjects, 0),
    trfINR:   CLUBS.reduce((s, c) => s + c.trf.totalINR, 0),
  }), [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Club Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            AG: {AG_NAME} &middot; {CLUBS.length} clubs
          </p>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { label: 'Total Members',  value: totals.members },
            { label: 'Total Meetings', value: totals.meetings },
            { label: 'Total Projects', value: totals.projects },
            { label: 'Total TRF (INR)', value: `₹${(totals.trfINR / 1000).toFixed(0)}K` },
          ].map(chip => (
            <div
              key={chip.label}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm"
            >
              <span className="text-base font-bold text-[#003DA5] tabular-nums">{chip.value}</span>
              <span className="text-xs text-slate-500 font-medium">{chip.label}</span>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative max-w-sm mb-6">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clubs…"
            className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003DA5] focus:border-[#003DA5] placeholder-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base leading-none font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Club cards */}
        {filteredClubs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Search size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No clubs match your search.</p>
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-sm text-[#003DA5] hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredClubs.map(club => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}

        {/* Footer */}
        <p className="mt-8 text-xs text-slate-400 text-right">
          Data as of 26 March 2026
        </p>
      </div>
    </div>
  )
}
