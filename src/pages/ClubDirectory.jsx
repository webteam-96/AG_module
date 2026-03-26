import { useState, useMemo } from 'react'
import {
  Search, MapPin, Users, Award, AlertCircle, Star,
  TrendingUp, TrendingDown, Target, BookOpen
} from 'lucide-react'
import { ZONES, CLUBS, getZoneClubs, getZoneInfo } from '../data/district3192'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'

// ─── helpers ────────────────────────────────────────────────────────────────

const isNewClub = (club) => {
  if (club.isNew) return true
  const year = parseInt(club.charterDate?.split('-').at(-1) ?? '0', 10)
  return year >= 2023
}

const isDeclining = (club) => club.membership.growth < 0

const getCardBorderClass = (club) => {
  if (isNewClub(club)) return 'border-l-4 border-l-blue-500'
  if (club.excellence.awardEarned) return 'border-l-4 border-l-green-500'
  if (club.excellence.duesOutstanding > 0) return 'border-l-4 border-l-red-500'
  return 'border-l-4 border-l-slate-200'
}

const GrowthBadge = ({ growth }) => {
  if (growth === null || growth === undefined) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">
        New Club
      </span>
    )
  }
  if (growth < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5">
        <TrendingDown size={10} />
        {Math.abs(growth).toFixed(1)}%
      </span>
    )
  }
  if (growth >= 50) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-green-700 bg-green-50 border border-green-300 rounded px-1.5 py-0.5">
        <TrendingUp size={10} />
        {growth.toFixed(1)}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded px-1.5 py-0.5">
      <TrendingUp size={10} />
      {growth.toFixed(1)}%
    </span>
  )
}

// ─── Zone Info Card ──────────────────────────────────────────────────────────

const ZoneInfoCard = ({ zoneId }) => {
  if (zoneId === 'ALL') {
    return (
      <div className="bg-gradient-to-r from-[#003DA5] to-blue-700 text-white rounded-xl p-4 mb-6 flex flex-wrap gap-6 items-center shadow">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="opacity-80" />
          <span className="font-semibold text-sm">RI </span>
        </div>
        <div className="text-sm opacity-90">
          <span className="font-medium">7 Zones</span> · Bengaluru &amp; surrounds
        </div>
        <div className="text-sm opacity-90">
          DG Dashboard — All Zones visible
        </div>
      </div>
    )
  }

  const info = getZoneInfo(zoneId)
  if (!info) return null

  return (
    <div className="bg-gradient-to-r from-[#003DA5] to-blue-700 text-white rounded-xl p-4 mb-6 flex flex-wrap gap-x-8 gap-y-2 items-center shadow">
      <div className="flex items-center gap-2 min-w-0">
        <Star size={16} className="opacity-80 shrink-0" />
        <div>
          <p className="text-xs opacity-70 uppercase tracking-wide">Zone {info.id} Ambassador</p>
          <p className="font-semibold text-sm leading-tight">{info.ambassador}</p>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs opacity-70 uppercase tracking-wide">Secretary</p>
        <p className="font-semibold text-sm leading-tight">{info.secretary}</p>
      </div>
      <div className="min-w-0">
        <p className="text-xs opacity-70 uppercase tracking-wide">Geography</p>
        <p className="text-sm leading-tight">{info.geography}</p>
      </div>
    </div>
  )
}

// ─── Stats Summary Row ───────────────────────────────────────────────────────

const StatChip = ({ label, value, color = 'slate' }) => {
  const colors = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  }
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${colors[color]}`}>
      <span className="text-lg font-bold tabular-nums">{value}</span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}

// ─── Filter Chip Button ──────────────────────────────────────────────────────

const FilterChip = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all
      ${active
        ? 'bg-[#003DA5] text-white border-[#003DA5] shadow-sm'
        : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-700'
      }`}
  >
    {label}
    {count !== undefined && (
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? 'bg-blue-400 text-white' : 'bg-slate-100 text-slate-500'}`}>
        {count}
      </span>
    )}
  </button>
)

// ─── Club Card ───────────────────────────────────────────────────────────────

const ClubCard = ({ club }) => {
  const isNew = isNewClub(club)
  const declining = isDeclining(club)
  const { membership, trf, excellence } = club
  const charterYear = club.charterDate?.split('-').at(-1) ?? '—'
  const duesAmt = excellence.duesOutstanding

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${getCardBorderClass(club)} p-4 flex flex-col gap-3 hover:shadow-md transition-shadow`}>

      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">{club.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Est. {charterYear}</p>
        </div>
        <div className="flex flex-wrap gap-1 justify-end shrink-0">
          {excellence.awardEarned && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-green-100 text-green-700 border border-green-300 rounded-full px-2 py-0.5">
              <Award size={9} /> Award
            </span>
          )}
          {isNew && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-300 rounded-full px-2 py-0.5">
              New Club
            </span>
          )}
          {declining && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-red-100 text-red-700 border border-red-300 rounded-full px-2 py-0.5">
              <TrendingDown size={9} /> Declining
            </span>
          )}
          {duesAmt > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-red-100 text-red-700 border border-red-300 rounded-full px-2 py-0.5">
              <AlertCircle size={9} /> Dues ₹{(duesAmt / 1000).toFixed(0)}K
            </span>
          )}
        </div>
      </div>

      {/* AG chip */}
      <div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#003DA5] text-white rounded-full px-2.5 py-0.5">
          <BookOpen size={9} /> AG: {club.ag}
        </span>
      </div>

      {/* President */}
      <div className="flex items-center gap-1 text-xs text-slate-600">
        <Users size={11} className="text-slate-400 shrink-0" />
        <span className="truncate">{club.president}</span>
      </div>

      {/* Membership & TRF row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Members</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-bold text-slate-800 text-sm">{membership.current}</span>
            <GrowthBadge growth={membership.growth} />
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">TRF Giving</p>
          <p className="font-bold text-slate-800 text-sm mt-0.5">
            ${trf.total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Goals bar */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Target size={10} />
            <span>Goals completed</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-700">
            {excellence.goalsCompleted}/{excellence.goalsSet}
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${excellence.awardEarned ? 'bg-green-500' : 'bg-[#003DA5]'}`}
            style={{ width: excellence.goalsSet > 0 ? `${Math.round((excellence.goalsCompleted / excellence.goalsSet) * 100)}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const FILTERS = [
  { key: 'all', label: 'All Clubs' },
  { key: 'award', label: 'Award Earned' },
  { key: 'dues', label: 'Dues Pending' },
  { key: 'declining', label: 'Declining' },
  { key: 'new', label: 'New Clubs' },
]

export default function ClubDirectory() {
  const user = JSON.parse(sessionStorage.getItem('ag_user') || '{}')
  const zoneId = user.zone || 'ALL'

  const allClubs = useMemo(
    () => (zoneId === 'ALL' ? CLUBS : getZoneClubs(zoneId)),
    [zoneId]
  )

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  // count for each filter chip
  const filterCounts = useMemo(() => ({
    all: allClubs.length,
    award: allClubs.filter(c => c.excellence.awardEarned).length,
    dues: allClubs.filter(c => c.excellence.duesOutstanding > 0).length,
    declining: allClubs.filter(c => isDeclining(c)).length,
    new: allClubs.filter(c => isNewClub(c)).length,
  }), [allClubs])

  const filteredClubs = useMemo(() => {
    let list = allClubs

    // text search
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(c => c.name.toLowerCase().includes(q))
    }

    // filter chip
    switch (activeFilter) {
      case 'award':    list = list.filter(c => c.excellence.awardEarned); break
      case 'dues':     list = list.filter(c => c.excellence.duesOutstanding > 0); break
      case 'declining': list = list.filter(c => isDeclining(c)); break
      case 'new':      list = list.filter(c => isNewClub(c)); break
      default: break
    }

    return list
  }, [allClubs, search, activeFilter])

  // summary stats derived from filtered list
  const stats = useMemo(() => ({
    total: filteredClubs.length,
    awards: filteredClubs.filter(c => c.excellence.awardEarned).length,
    newClubs: filteredClubs.filter(c => isNewClub(c)).length,
    duesPending: filteredClubs.filter(c => c.excellence.duesOutstanding > 0).length,
  }), [filteredClubs])

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <SectionHeader
          title="Club Directory"
          subtitle={`Zone ${zoneId === 'ALL' ? 'All — District Overview' : zoneId} · ${allClubs.length} clubs`}
          icon={BookOpen}
        />

        {/* Zone info card */}
        <ZoneInfoCard zoneId={zoneId} />

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clubs…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 items-center">
            {FILTERS.map(f => (
              <FilterChip
                key={f.key}
                label={f.label}
                active={activeFilter === f.key}
                onClick={() => setActiveFilter(f.key)}
                count={f.key !== 'all' ? filterCounts[f.key] : undefined}
              />
            ))}
          </div>
        </div>

        {/* Stats summary row */}
        <div className="flex flex-wrap gap-2 mb-5">
          <StatChip label="Clubs shown" value={stats.total} color="slate" />
          <StatChip label="Awards Earned" value={stats.awards} color="green" />
          <StatChip label="New Clubs" value={stats.newClubs} color="blue" />
          <StatChip label="Dues Pending" value={stats.duesPending} color="red" />
        </div>

        {/* Club cards grid */}
        {filteredClubs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Search size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No clubs match your search.</p>
            <button
              onClick={() => { setSearch(''); setActiveFilter('all') }}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClubs.map(club => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" /> Green border = Award Earned</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block" /> Red border = Dues Pending</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" /> Blue border = New Club</span>
          <span className="text-slate-300">|</span>
          <span>Data as of 19 March 2026</span>
        </div>
      </div>
    </div>
  )
}
