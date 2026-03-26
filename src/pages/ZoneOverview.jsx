import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, Heart, Award, Star, Briefcase, TrendingUp,
  AlertCircle, CheckCircle, ChevronDown, ChevronUp,
  MapPin, User, Calendar, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import {
  ZONES, ZONE_TOTALS, DISTRICT_TOTALS, CLUBS, getZoneClubs, getZoneInfo,
} from '../data/district3192'
import KPICard from '../components/KPICard'
import SectionHeader from '../components/SectionHeader'
import StatusBadge from '../components/StatusBadge'

// ─── Brand colours ───────────────────────────────────────────────────────────
const BLUE = '#003DA5'
const GOLD = '#F7A81B'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function usd(n) {
  if (!n && n !== 0) return '$0'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(0)}`
}

function fmt(n) {
  return typeof n === 'number' ? n.toLocaleString() : (n ?? '—')
}

function inr(n) {
  if (!n) return null
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function charterYear(dateStr) {
  if (!dateStr) return null
  const parts = dateStr.split('-')
  return parts[parts.length - 1]
}

function isNewClub(club) {
  return club.isNew === true
}

// Card left-border colour priority: new > dues > award > default
function cardBorderColor(club) {
  if (isNewClub(club)) return 'border-l-amber-400'
  if (club.excellence.duesOutstanding > 0) return 'border-l-red-500'
  if (club.excellence.awardEarned) return 'border-l-green-500'
  return 'border-l-blue-400'
}

// Compute zone-level aggregates from the CLUBS array (for DG summary per zone)
function computeZoneSummary(clubs) {
  return clubs.reduce(
    (acc, c) => {
      acc.members += c.membership.current
      acc.trf += c.trf.total
      acc.awards += c.excellence.awardEarned ? 1 : 0
      acc.duesClubs += c.excellence.duesOutstanding > 0 ? 1 : 0
      acc.projects += c.serviceProjects.projects
      acc.newRotaract += c.sponsored.newRotaractClubs.length
      acc.newInteract += c.sponsored.newInteractClubs.length
      return acc
    },
    { members: 0, trf: 0, awards: 0, duesClubs: 0, projects: 0, newRotaract: 0, newInteract: 0 },
  )
}

// ─── Mini metric tile inside a club card ─────────────────────────────────────
function MetricTile({ label, value, sub, accent }) {
  return (
    <div className="bg-slate-50 rounded-lg p-2.5 flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
      <span className={`text-base font-extrabold leading-none ${accent || 'text-slate-800'}`}>{value}</span>
      {sub && <span className="text-[10px] text-slate-500 mt-0.5">{sub}</span>}
    </div>
  )
}

// ─── Mini goal progress bar ───────────────────────────────────────────────────
function GoalBar({ completed, total }) {
  const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0
  const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ─── Individual club card ─────────────────────────────────────────────────────
function ClubCard({ club, onSelect }) {
  const growth = club.membership.growth
  const growthValid = growth !== null && growth !== undefined
  const growthPos = growthValid && growth >= 0
  const growthColor = !growthValid ? 'text-slate-400' : growthPos ? 'text-green-600' : 'text-red-500'

  const hasDues = club.excellence.duesOutstanding > 0
  const hasAward = club.excellence.awardEarned
  const newClub = isNewClub(club)

  const goalsSet = club.excellence.goalsSet
  const goalsDone = club.excellence.goalsCompleted

  const youthCount =
    club.sponsored.newRotaractClubs.length + club.sponsored.newInteractClubs.length

  const myRotaryPct = club.membership.myRotaryPercent

  const borderColor = cardBorderColor(club)

  // Membership status pill
  const memStatus = !growthValid
    ? { label: 'New', cls: 'bg-blue-100 text-blue-700' }
    : growth > 5
    ? { label: `+${growth.toFixed(1)}%`, cls: 'bg-green-100 text-green-700' }
    : growth < 0
    ? { label: `${growth.toFixed(1)}%`, cls: 'bg-red-100 text-red-700' }
    : { label: `+${growth.toFixed(1)}%`, cls: 'bg-amber-100 text-amber-700' }

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-slate-100
        border-l-4 ${borderColor}
        transition-all duration-200 ease-out
        hover:scale-[1.015] hover:shadow-lg cursor-pointer
        flex flex-col overflow-hidden
      `}
      onClick={() => onSelect && onSelect(club.id)}
    >
      {/* ── Card header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-50">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold text-slate-800 leading-snug truncate">
              {club.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {charterYear(club.charterDate) && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 bg-slate-50">
                  <Calendar size={10} />
                  Est. {charterYear(club.charterDate)}
                </span>
              )}
              {newClub && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-semibold">
                  <Star size={10} />
                  New Club
                </span>
              )}
              {hasAward && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 font-semibold">
                  <Award size={10} />
                  Award
                </span>
              )}
            </div>
          </div>
          {/* Large growth indicator */}
          <div className="shrink-0 text-right">
            {growthValid ? (
              <div className={`flex items-center gap-0.5 text-sm font-bold ${growthColor}`}>
                {growthPos
                  ? <ArrowUpRight size={15} />
                  : <ArrowDownRight size={15} />}
                {Math.abs(growth).toFixed(1)}%
              </div>
            ) : (
              <span className="text-xs text-slate-400">New</span>
            )}
            <div className="text-[10px] text-slate-400 text-right">growth</div>
          </div>
        </div>

        {/* AG & President row */}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <User size={10} className="shrink-0 text-slate-400" />
            <span className="font-medium text-slate-600">{club.ag}</span>
            <span className="text-slate-400">(AG)</span>
          </span>
          <span className="flex items-center gap-1">
            <User size={10} className="shrink-0 text-slate-400" />
            <span>{club.president}</span>
            <span className="text-slate-400">(Pres.)</span>
          </span>
        </div>
      </div>

      {/* ── 2×2 metric grid ── */}
      <div className="grid grid-cols-2 gap-2 p-3 flex-1">

        {/* Members */}
        <MetricTile
          label="Members"
          value={club.membership.current}
          sub={
            growthValid
              ? `${growthPos ? '+' : ''}${growth.toFixed(1)}% vs Jul`
              : 'New this year'
          }
          accent={!growthValid ? 'text-slate-800' : growthPos ? 'text-green-700' : 'text-red-600'}
        />

        {/* TRF Giving */}
        <MetricTile
          label="TRF Giving"
          value={usd(club.trf.total)}
          sub={club.trf.donors > 0 ? `${club.trf.donors} donor${club.trf.donors !== 1 ? 's' : ''}` : 'No donors yet'}
          accent={club.trf.total > 0 ? 'text-blue-700' : 'text-slate-400'}
        />

        {/* Goals */}
        <div className="bg-slate-50 rounded-lg p-2.5 flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Goals</span>
          {goalsSet > 0 ? (
            <>
              <span className="text-base font-extrabold text-slate-800 leading-none">
                {goalsDone}
                <span className="text-sm font-medium text-slate-400">/{goalsSet}</span>
              </span>
              <GoalBar completed={goalsDone} total={goalsSet} />
              <span className="text-[10px] text-slate-500 mt-0.5">
                {goalsSet > 0 ? `${Math.round((goalsDone / goalsSet) * 100)}% complete` : '—'}
              </span>
            </>
          ) : (
            <span className="text-base font-extrabold text-amber-500 leading-none mt-0.5">Not set</span>
          )}
        </div>

        {/* Youth services */}
        <div className="bg-slate-50 rounded-lg p-2.5 flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Youth Svc</span>
          <span className={`text-base font-extrabold leading-none ${youthCount > 0 ? 'text-purple-700' : 'text-slate-400'}`}>
            {youthCount}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            {club.sponsored.newRotaractClubs.length}R + {club.sponsored.newInteractClubs.length}I orgs
          </span>
        </div>
      </div>

      {/* ── Status pills bar ── */}
      <div className="px-3 pb-3 flex flex-wrap gap-1.5">
        {/* Membership pill */}
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${memStatus.cls}`}>
          Mem: {memStatus.label}
        </span>

        {/* MyRotary % */}
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
          myRotaryPct >= 75
            ? 'bg-green-100 text-green-700'
            : myRotaryPct >= 50
            ? 'bg-amber-100 text-amber-700'
            : 'bg-red-100 text-red-700'
        }`}>
          MyRy: {myRotaryPct.toFixed(0)}%
        </span>

        {/* Dues */}
        {hasDues ? (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700">
            Dues: {inr(club.excellence.duesOutstanding)}
          </span>
        ) : (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">
            Dues: Clear
          </span>
        )}

        {/* Youth count */}
        {youthCount > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-700">
            Youth: {youthCount} org{youthCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Collapsible zone section (DG view) ──────────────────────────────────────
function ZoneSection({ zoneId, zoneInfo, clubs }) {
  const [open, setOpen] = useState(true)
  const totals = ZONE_TOTALS[zoneId] || {}
  const computed = computeZoneSummary(clubs)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Zone header — clickable to collapse */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ background: BLUE }}
          >
            Zone {zoneId}
          </span>
          <span className="font-bold text-slate-800">{zoneInfo?.geography}</span>
          <span className="text-sm text-slate-500">
            AG: <span className="font-medium text-slate-700">{zoneInfo?.ambassador}</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="hidden sm:inline-flex items-center gap-1">
            <Users size={12} />
            {totals.clubs ?? clubs.length} clubs
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <TrendingUp size={12} />
            {totals.membersCurrent ?? computed.members} members
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <Award size={12} />
            {totals.awards ?? computed.awards} awards
          </span>
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4">
          {/* Zone mini KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 pb-4 border-b border-slate-100">
            <KPICard
              title="Members"
              value={fmt(totals.membersCurrent ?? computed.members)}
              icon={Users}
              color="blue"
              trend={totals.growth}
              subtitle={totals.growth != null ? `${totals.growth > 0 ? '+' : ''}${totals.growth}% growth` : undefined}
            />
            <KPICard
              title="TRF Giving"
              value={usd(totals.trfTotal ?? computed.trf)}
              icon={Heart}
              color="gold"
            />
            <KPICard
              title="Awards"
              value={`${totals.awards ?? computed.awards}/${totals.clubs ?? clubs.length}`}
              icon={Award}
              color="green"
            />
            <KPICard
              title="Dues Pending"
              value={totals.duesClubs ?? computed.duesClubs}
              icon={AlertCircle}
              color={(totals.duesClubs ?? computed.duesClubs) > 0 ? 'red' : 'green'}
              subtitle="clubs"
            />
          </div>

          {/* Club cards */}
          {clubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {clubs.map(club => (
                <ClubCard key={club.id} club={club} onSelect={(id) => navigate(`/clubs/${id}`)} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">
              Detailed club data not loaded for this zone in the current sample.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Quick stats footer bar ───────────────────────────────────────────────────
function FooterBar({ clubs }) {
  const totalMembers = clubs.reduce((s, c) => s + c.membership.current, 0)
  const totalTrf = clubs.reduce((s, c) => s + c.trf.total, 0)
  const totalProjects = clubs.reduce((s, c) => s + c.serviceProjects.projects, 0)
  const totalAwards = clubs.filter(c => c.excellence.awardEarned).length

  return (
    <div
      className="rounded-2xl px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-white text-sm font-medium"
      style={{ background: `linear-gradient(90deg, ${BLUE} 0%, #0055c8 100%)` }}
    >
      <span className="flex items-center gap-2">
        <Users size={14} className="opacity-70" />
        <span className="opacity-70">Clubs:</span>
        <span className="font-bold">{clubs.length}</span>
      </span>
      <span className="opacity-40 hidden sm:inline">|</span>
      <span className="flex items-center gap-2">
        <TrendingUp size={14} className="opacity-70" />
        <span className="opacity-70">Members:</span>
        <span className="font-bold">{fmt(totalMembers)}</span>
      </span>
      <span className="opacity-40 hidden sm:inline">|</span>
      <span className="flex items-center gap-2">
        <Heart size={14} className="opacity-70" />
        <span className="opacity-70">TRF:</span>
        <span className="font-bold">{usd(totalTrf)}</span>
      </span>
      <span className="opacity-40 hidden sm:inline">|</span>
      <span className="flex items-center gap-2">
        <Briefcase size={14} className="opacity-70" />
        <span className="opacity-70">Projects:</span>
        <span className="font-bold">{fmt(totalProjects)}</span>
      </span>
      <span className="opacity-40 hidden sm:inline">|</span>
      <span className="flex items-center gap-2">
        <Award size={14} className="opacity-70" />
        <span className="opacity-70">Awards:</span>
        <span className="font-bold">{totalAwards}</span>
        <span className="opacity-60 text-xs">of {clubs.length}</span>
      </span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ZoneOverview() {
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem('ag_user') || '{}')
  const isDG = user.role === 'dg' || user.zone === 'ALL'

  // Clubs for this user
  const clubs = user.zone === 'ALL' ? CLUBS : CLUBS.filter(c => c.zone === user.zone)

  // Zone info (AG only)
  const zoneInfo = isDG ? null : getZoneInfo(user.zone)
  const totals = isDG ? DISTRICT_TOTALS : (ZONE_TOTALS[user.zone] || {})

  // Computed aggregate KPIs
  const totalClubs = isDG ? DISTRICT_TOTALS.clubs : (totals.clubs ?? clubs.length)
  const totalMembers = isDG ? DISTRICT_TOTALS.membersCurrent : (totals.membersCurrent ?? clubs.reduce((s, c) => s + c.membership.current, 0))
  const memberGrowth = isDG ? DISTRICT_TOTALS.growth : (totals.growth ?? null)
  const totalTrf = isDG ? DISTRICT_TOTALS.trfTotal : (totals.trfTotal ?? clubs.reduce((s, c) => s + c.trf.total, 0))
  const totalAwards = isDG ? DISTRICT_TOTALS.awards : (totals.awards ?? clubs.filter(c => c.excellence.awardEarned).length)

  // DG: group clubs by zone
  const ZONE_IDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

  return (
    <div className="space-y-6 pb-12">

      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 text-white shadow-md relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #0055c8 60%, #1a6ed4 100%)` }}
      >
        {/* Decorative ring */}
        <div
          className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: GOLD }}
        />
        <div
          className="absolute -bottom-16 -left-6 w-40 h-40 rounded-full opacity-10"
          style={{ background: '#ffffff' }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            {/* Role badge */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                style={{ background: GOLD }}
              >
                {isDG ? 'District Governor' : `Zone ${user.zone} · AG`}
              </span>
              <span className="text-blue-200 text-xs">RI District 3192</span>
            </div>

            {/* Welcome heading */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Welcome, {user.name || (isDG ? 'District Governor' : 'Assistant Governor')}
            </h1>
            <p className="text-blue-200 text-sm mt-1 font-medium">
              {isDG
                ? 'District 3192 — All Zones Overview'
                : `Zone ${user.zone} · ${zoneInfo?.name || ''}`}
            </p>

            {/* AG Secretary row */}
            {!isDG && zoneInfo?.secretary && (
              <div className="flex items-center gap-2 mt-2 text-blue-100 text-sm">
                <User size={13} className="opacity-70" />
                <span>Zone Secretary:</span>
                <span className="font-semibold">{zoneInfo.secretary}</span>
              </div>
            )}
          </div>

          {/* Geography + data-as-of pill */}
          <div className="flex flex-col gap-2 shrink-0">
            {!isDG && zoneInfo?.geography && (
              <div
                className="flex items-start gap-2 px-3 py-2 rounded-xl text-xs max-w-xs"
                style={{ background: 'rgba(255,255,255,0.13)' }}
              >
                <MapPin size={13} className="text-yellow-300 mt-0.5 shrink-0" />
                <span className="text-blue-100">{zoneInfo.geography}</span>
              </div>
            )}
            {isDG && (
              <div
                className="flex items-start gap-2 px-3 py-2 rounded-xl text-xs"
                style={{ background: 'rgba(255,255,255,0.13)' }}
              >
                <MapPin size={13} className="text-yellow-300 mt-0.5 shrink-0" />
                <span className="text-blue-100">Bengaluru, Tumkur &amp; Mandya districts</span>
              </div>
            )}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
              style={{ background: 'rgba(255,255,255,0.10)' }}
            >
              <CheckCircle size={12} className="text-green-300 shrink-0" />
              <span className="text-blue-100">
                Data as of <span className="font-semibold text-white">19 March 2026</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard
          title="Total Clubs"
          value={fmt(totalClubs)}
          icon={Users}
          color="blue"
          subtitle={isDG ? 'across all 7 zones' : `in Zone ${user.zone}`}
        />
        <KPICard
          title="Total Members"
          value={fmt(totalMembers)}
          icon={TrendingUp}
          color="green"
          trend={memberGrowth}
          subtitle={memberGrowth != null ? `${memberGrowth > 0 ? '+' : ''}${typeof memberGrowth === 'number' ? memberGrowth.toFixed(2) : memberGrowth}% growth` : undefined}
        />
        <KPICard
          title="TRF Total Giving"
          value={usd(totalTrf)}
          icon={Heart}
          color="gold"
          subtitle={`${isDG ? DISTRICT_TOTALS.donors : (totals.donors ?? '—')} donors`}
        />
        <KPICard
          title="Awards Earned"
          value={fmt(totalAwards)}
          icon={Award}
          color="green"
          subtitle={`of ${fmt(totalClubs)} clubs`}
        />
      </div>

      {/* ── AG View: My Clubs ──────────────────────────────────────────────── */}
      {!isDG && (
        <>
          <SectionHeader
            title="My Clubs"
            subtitle={`${clubs.length} club${clubs.length !== 1 ? 's' : ''} in Zone ${user.zone}`}
            icon={Users}
          />

          {clubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubs.map(club => (
                <ClubCard key={club.id} club={club} onSelect={(id) => navigate(`/clubs/${id}`)} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400 text-sm">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              No clubs found for Zone {user.zone}.
            </div>
          )}

          {/* Quick stats footer */}
          <FooterBar clubs={clubs} />
        </>
      )}

      {/* ── DG View: All Zones ─────────────────────────────────────────────── */}
      {isDG && (
        <>
          <SectionHeader
            title="All Zones — Club Details"
            subtitle={`${DISTRICT_TOTALS.clubs} clubs across 7 zones · RY 2025-26`}
            icon={Users}
          />

          <div className="space-y-4">
            {ZONE_IDS.map(zid => {
              const zInfo = getZoneInfo(zid)
              const zClubs = CLUBS.filter(c => c.zone === zid)
              return (
                <ZoneSection
                  key={zid}
                  zoneId={zid}
                  zoneInfo={zInfo}
                  clubs={zClubs}
                />
              )
            })}
          </div>

          {/* District footer bar */}
          <FooterBar clubs={CLUBS} />
        </>
      )}
    </div>
  )
}
