import { useNavigate } from 'react-router-dom'
import { CLUBS, AG_NAME, AG_TOTALS } from '@/data/realData'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CalendarCheck, FolderKanban, IndianRupee, Trophy, ChevronRight, Download } from 'lucide-react'
import { exportAllClubs } from '@/utils/exportExcel'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function trfINR(n) {
  if (!n || n === 0) return '₹0'
  // Indian number formatting: ₹X,XX,XXX
  const s = Math.round(n).toString()
  if (s.length <= 3) return '₹' + s
  const last3 = s.slice(-3)
  const rest   = s.slice(0, -3)
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return '₹' + formatted + ',' + last3
}

function summaryTRF(n) {
  if (!n || n === 0) return '₹0'
  const s = Math.round(n).toString()
  if (s.length <= 3) return '₹' + s
  const last3 = s.slice(-3)
  const rest   = s.slice(0, -3)
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return '₹' + formatted + ',' + last3
}

function clubInitials(name) {
  const stripped = name.replace(/^(RC|E-Club of|Rotary Club of)\s*/i, '').trim()
  const words = stripped.split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

// Per-club accent colors: left border + avatar background
const CLUB_COLORS = [
  { border: 'border-l-[#003DA5]', avatar: 'bg-[#003DA5]', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  { border: 'border-l-[#F7A81B]', avatar: 'bg-[#c98a00]', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  { border: 'border-l-emerald-500', avatar: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { border: 'border-l-purple-500', avatar: 'bg-purple-600', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
]

// ─── Club Card ────────────────────────────────────────────────────────────────

function ClubCard({ club, colorIdx }) {
  const navigate = useNavigate()
  const colors   = CLUB_COLORS[colorIdx % CLUB_COLORS.length]
  const initials = clubInitials(club.name)

  return (
    <Card
      className={`border-l-4 ${colors.border} shadow-sm hover:shadow-lg cursor-pointer
                  transition-all duration-200 hover:-translate-y-0.5 bg-white`}
      onClick={() => navigate(`/clubs/${club.id}`)}
    >
      <CardContent className="px-5 pt-5 pb-4">

        {/* ── Header: avatar + name + rank badge ── */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`h-11 w-11 rounded-xl shrink-0 flex items-center justify-center
                           text-white text-sm font-extrabold ${colors.avatar}`}>
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-bold text-slate-800 leading-snug">
                RC {club.name}
              </h3>
              {club.projectRank && (
                <Badge
                  className={`shrink-0 text-[10px] px-1.5 py-0 font-semibold rounded-full
                               border gap-0.5 ${colors.badge}`}
                >
                  <Trophy size={9} />
                  #{club.projectRank}
                </Badge>
              )}
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">
              President:&nbsp;
              <span className="font-medium text-slate-700">{club.president.name}</span>
            </p>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">

          {/* Members */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Users size={14} className="text-[#003DA5]" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide leading-none mb-0.5">
                Members
              </p>
              <p className="text-base font-extrabold text-slate-800 leading-none">
                {club.members}
              </p>
            </div>
          </div>

          {/* Meetings */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <CalendarCheck size={14} className="text-[#F7A81B]" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide leading-none mb-0.5">
                Meetings
              </p>
              <p className="text-base font-extrabold text-slate-800 leading-none">
                {club.meetings}
              </p>
            </div>
          </div>

          {/* Projects */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <FolderKanban size={14} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide leading-none mb-0.5">
                Projects
              </p>
              <p className="text-base font-extrabold text-slate-800 leading-none">
                {club.totalProjects}
              </p>
            </div>
          </div>

          {/* TRF INR */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <IndianRupee size={14} className="text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide leading-none mb-0.5">
                TRF (INR)
              </p>
              <p className={`text-sm font-extrabold leading-none ${club.trf.totalINR > 0 ? 'text-slate-800' : 'text-slate-400'}`}>
                {trfINR(club.trf.totalINR)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer: view link ── */}
        <div className="flex justify-end mt-3 pt-2 border-t border-slate-100">
          <button
            className="flex items-center gap-0.5 text-xs text-[#003DA5] font-semibold hover:underline"
            onClick={e => { e.stopPropagation(); navigate(`/clubs/${club.id}`) }}
          >
            View Dashboard <ChevronRight size={13} />
          </button>
        </div>

      </CardContent>
    </Card>
  )
}

// ─── Summary Stat Card ────────────────────────────────────────────────────────

function StatCard({ icon: Icon, iconColor, bgColor, label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-extrabold text-slate-800 leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ZoneOverview() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 pb-10">

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="bg-[#003DA5] text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-7">
          {/* Rotary branding strip */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-8 rounded-full bg-[#F7A81B]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-blue-200">
              District 3142
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">My Clubs</h1>
              <p className="text-blue-200 mt-1 text-sm font-medium">
                Assistant Governor:&nbsp;
                <span className="text-white font-semibold">{AG_NAME}</span>
              </p>
            </div>
            <button
              onClick={() => exportAllClubs(CLUBS, AG_NAME)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={15} />
              Download Excel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">

        {/* ── Summary Stats ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard
            icon={Users}
            iconColor="text-[#003DA5]"
            bgColor="bg-blue-50"
            label="Total Members"
            value={AG_TOTALS.totalMembers.toLocaleString()}
          />
          <StatCard
            icon={CalendarCheck}
            iconColor="text-[#F7A81B]"
            bgColor="bg-amber-50"
            label="Total Meetings"
            value={AG_TOTALS.totalMeetings.toLocaleString()}
          />
          <StatCard
            icon={FolderKanban}
            iconColor="text-emerald-600"
            bgColor="bg-emerald-50"
            label="Total Projects"
            value={AG_TOTALS.totalProjects.toLocaleString()}
          />
          <StatCard
            icon={IndianRupee}
            iconColor="text-purple-600"
            bgColor="bg-purple-50"
            label="Total TRF (INR)"
            value={summaryTRF(AG_TOTALS.totalTRF_INR)}
          />
        </div>

        {/* ── Section label ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mt-8 mb-4">
          <h2 className="text-lg font-bold text-slate-700">All Clubs</h2>
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">{CLUBS.length} clubs</span>
        </div>

        {/* ── Club Grid ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {CLUBS.map((club, idx) => (
            <ClubCard key={club.id} club={club} colorIdx={idx} />
          ))}
        </div>

      </div>
    </div>
  )
}
