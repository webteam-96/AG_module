import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getClubById } from '@/data/realData'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  ArrowLeft, Users, Calendar, TrendingUp, Heart, Award,
  Briefcase, CheckCircle2, XCircle, BarChart2, Globe,
  DollarSign, Target, Megaphone, Eye, FileText,
  UserPlus, UserMinus, Star, ShieldCheck, AlertCircle, Trophy, Shield, Download
} from 'lucide-react'
import { exportClubDetail } from '@/utils/exportExcel'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell
} from 'recharts'

// ── Formatters ────────────────────────────────────────────────────────────────

const fmtINR = (n) => {
  if (!n && n !== 0) return '—'
  const v = Number(n)
  if (v === 0) return '₹0'
  if (v >= 10000000) return '₹' + (v / 10000000).toFixed(2) + ' Cr'
  if (v >= 100000) return '₹' + (v / 100000).toFixed(2) + ' L'
  if (v >= 1000) return '₹' + (v / 1000).toFixed(1) + 'K'
  return '₹' + v.toLocaleString('en-IN')
}

const fmtINRFull = (n) =>
  n != null ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '—'

const fmtNum = (n) =>
  n != null ? Number(n).toLocaleString('en-IN') : '—'

const fmtDate = (d) => {
  if (!d) return '—'
  const parts = d.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0].slice(2)}`
  }
  return d
}

// ── Custom Tooltips ───────────────────────────────────────────────────────────

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
        <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.fill || p.color }} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.fill || p.color }} />
            {p.name}: <span className="font-bold ml-1">{p.value != null ? p.value.toLocaleString('en-IN') : '—'}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const INRTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
        <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.fill || p.color }}>
            {p.name}: <span className="font-bold">{fmtINR(p.value)}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

// ── Stat Card (top-border accent design) ──────────────────────────────────────

function StatCard({ icon: Icon, iconBg, iconColor, accentColor, label, value, sub, trend }) {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 hover:shadow-md transition-shadow duration-200"
      style={{ borderTop: `3px solid ${accentColor || '#003DA5'}` }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
        >
          <Icon size={16} className={iconColor} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500 mb-1 leading-none">{label}</p>
          <p className="text-2xl font-bold text-slate-900 leading-tight truncate">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
          {trend != null && (
            <p className={`text-xs font-semibold mt-1 ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Chart Card wrapper ─────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="px-5 pt-4 pb-2">
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-3 pb-4">{children}</div>
    </div>
  )
}

// ── Section Label ──────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{children}</p>
  )
}

// ── TAB 1: MEMBERSHIP ─────────────────────────────────────────────────────────

function MembershipTab({ club }) {
  const prev = club.membersPrev ?? club.members
  const growthPct = prev > 0 ? (((club.members - prev) / prev) * 100).toFixed(1) : '0.0'
  const growthPositive = parseFloat(growthPct) >= 0

  const monthlyBarData = club.monthly.map(m => ({
    month: m.month.replace(' 20', "'"),
    Attendance: m.rotarians,
    Meetings: m.meetings,
  }))

  return (
    <div className="space-y-5">
      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
          accentColor="#003DA5"
          label="Current Members"
          value={club.members}
          sub="Active Rotarians"
        />
        <StatCard
          icon={TrendingUp}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
          accentColor="#10b981"
          label="Membership Growth"
          value={`${growthPositive ? '+' : ''}${growthPct}%`}
          sub={`${prev} → ${club.members} members`}
        />
        <StatCard
          icon={Heart}
          iconBg="bg-pink-50"
          iconColor="text-pink-600"
          accentColor="#ec4899"
          label="Female Members"
          value={club.femaleMembers ?? '—'}
          sub={club.femaleMembers != null ? `${((club.femaleMembers / club.members) * 100).toFixed(0)}% of club` : ''}
        />
        <StatCard
          icon={Globe}
          iconBg="bg-cyan-50"
          iconColor="text-cyan-700"
          accentColor="#0891b2"
          label="MyRotary Registered"
          value={club.myRotaryCount ?? '—'}
          sub={club.myRotaryCount != null ? `${((club.myRotaryCount / club.members) * 100).toFixed(0)}% registered` : ''}
        />
      </div>

      {/* Growth & Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Membership Growth Card */}
        <div
          className={`rounded-xl border shadow-sm p-5 ${
            growthPositive
              ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50'
              : 'border-red-200 bg-gradient-to-br from-red-50 to-rose-50'
          }`}
        >
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Membership Growth</p>
          <div className="flex items-end gap-4">
            <div>
              <p className={`text-5xl font-bold leading-none ${growthPositive ? 'text-emerald-700' : 'text-red-600'}`}>
                {growthPositive ? '+' : ''}{growthPct}%
              </p>
              <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                <span className="font-semibold text-slate-700">{prev}</span>
                <span className="text-slate-400">→</span>
                <span className="font-semibold text-slate-700">{club.members}</span>
                <span className="text-slate-400">members</span>
              </p>
            </div>
            <TrendingUp size={36} className={`mb-1 ${growthPositive ? 'text-emerald-300' : 'text-red-300'}`} />
          </div>
        </div>

        {/* Member Status Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Member Activity This Year</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                <UserPlus size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">+{club.newMembers ?? 0}</p>
                <p className="text-xs text-slate-500">Inducted</p>
              </div>
            </div>
            <div className="w-px h-12 bg-slate-100" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                <UserMinus size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">-{club.terminatedMembers ?? 0}</p>
                <p className="text-xs text-slate-500">Terminated</p>
              </div>
            </div>
            <div className="w-px h-12 bg-slate-100" />
            <div>
              <p className={`text-2xl font-bold ${(club.newMembers ?? 0) - (club.terminatedMembers ?? 0) >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {(club.newMembers ?? 0) - (club.terminatedMembers ?? 0) >= 0 ? '+' : ''}
                {(club.newMembers ?? 0) - (club.terminatedMembers ?? 0)}
              </p>
              <p className="text-xs text-slate-500">Net change</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Activity Chart */}
      <ChartCard
        title="Monthly Activity — Rotarians Present & Meetings Held"
        subtitle="Jul 2025 – Mar 2026"
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyBarData} barCategoryGap="28%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,61,165,0.04)' }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="Attendance" name="Rotarians Present" fill="#003DA5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Meetings" name="Meetings Held" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* BOD Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800">Board of Directors</h4>
          <p className="text-xs text-slate-400 mt-0.5">{club.bod.length} office-bearers</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs text-slate-500 font-semibold pl-5 py-3">#</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold py-3">Designation</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold py-3">Name</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold py-3">Mobile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {club.bod.map((b, i) => (
                <TableRow key={i} className={`border-b border-slate-50 hover:bg-slate-50 ${i % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                  <TableCell className="text-xs text-slate-400 pl-5 py-3">{i + 1}</TableCell>
                  <TableCell className="py-3 max-w-[220px]">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium truncate max-w-[200px]" title={b.designation}>
                      {b.designation}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-slate-800 py-3 whitespace-nowrap">{b.name}</TableCell>
                  <TableCell className="text-xs text-slate-500 py-3 whitespace-nowrap font-mono">{b.mobile}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Meeting Records */}
      {club.meetingRecords && club.meetingRecords.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-slate-100">
            <h4 className="text-sm font-semibold text-slate-800">Meeting Records</h4>
            <p className="text-xs text-slate-400 mt-0.5">{club.meetingRecords.length} meetings on record</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-xs text-slate-500 font-semibold pl-5 py-3">Date</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold py-3">Type</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold py-3">Title</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right pr-5 py-3">Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {club.meetingRecords.map((mr, i) => (
                  <TableRow key={i} className={`border-b border-slate-50 hover:bg-slate-50 ${i % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                    <TableCell className="text-xs text-slate-500 pl-5 py-3 whitespace-nowrap font-mono">{fmtDate(mr.date)}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className={`text-xs font-medium py-0.5 ${mr.type === 'Regular' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-purple-200 text-purple-700 bg-purple-50'}`}>
                        {mr.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 py-3 max-w-[280px]">
                      <span className="block truncate" title={mr.title}>{mr.title}</span>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-slate-800 py-3 text-right pr-5 whitespace-nowrap">
                      {mr.attendance != null ? mr.attendance : '—'}
                      {mr.attendancePct != null ? <span className="text-xs text-slate-400 ml-1.5 font-normal">({mr.attendancePct.toFixed(1)}%)</span> : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

// ── TAB 2: FOUNDATION & TRF ───────────────────────────────────────────────────

function FoundationTab({ club }) {
  const { trf, monthly, members } = club

  const perMember = members > 0 ? (trf.totalUSD / members).toFixed(1) : 0
  const perMemberINR = members > 0 ? (trf.totalINR / members) : 0
  const targetPerMemberINR = 8400
  const perMemberINRPct = Math.min((perMemberINR / targetPerMemberINR) * 100, 100)

  const breakdown = [
    { label: 'Annual Fund', usd: trf.annual || 0, inr: trf.annualINR || (trf.annual || 0) * 84, color: '#003DA5', iconBg: 'bg-blue-50', iconColor: 'text-blue-700' },
    { label: 'Polio Plus', usd: trf.polio || 0, inr: trf.polioINR || (trf.polio || 0) * 84, color: '#10b981', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' },
    { label: 'Endowment', usd: trf.endowment || 0, inr: (trf.endowment || 0) * 84, color: '#f59e0b', iconBg: 'bg-amber-50', iconColor: 'text-amber-700' },
    { label: 'Global Grant', usd: trf.globalGrant || 0, inr: trf.globalGrantINR || (trf.globalGrant || 0) * 84, color: '#8b5cf6', iconBg: 'bg-purple-50', iconColor: 'text-purple-700' },
  ]

  const monthlyTRFData = monthly.map(m => ({
    month: m.month.replace(' 20', "'"),
    'TRF (USD)': m.trf,
  }))

  return (
    <div className="space-y-5">
      {/* TRF Hero — amber info panel (no full-bleed gradient) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-1">Total TRF Contribution</p>
            <p className="text-4xl font-bold text-amber-900 leading-none">{fmtINRFull(trf.totalINR)}</p>
            <p className="text-sm text-amber-700 mt-2">USD {(trf.totalUSD || 0).toLocaleString('en-IN')} at ₹84/USD</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white border border-amber-200 rounded-lg px-4 py-3 min-w-[120px]">
              <p className="text-xs text-amber-600 mb-0.5">Per Member (USD)</p>
              <p className="text-xl font-bold text-amber-900">${perMember}</p>
            </div>
            <div className="bg-white border border-amber-200 rounded-lg px-4 py-3 min-w-[120px]">
              <p className="text-xs text-amber-600 mb-0.5">Per Member (INR)</p>
              <p className="text-xl font-bold text-amber-900">{fmtINR(perMemberINR)}</p>
            </div>
            <div className="bg-white border border-amber-200 rounded-lg px-4 py-3 min-w-[120px]">
              <p className="text-xs text-amber-600 mb-0.5">vs ₹8,400 Target</p>
              <p className={`text-xl font-bold ${perMemberINRPct >= 100 ? 'text-emerald-700' : 'text-amber-900'}`}>
                {perMemberINRPct.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
        {/* Progress toward ₹8,400 */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-amber-700 mb-1.5">
            <span>Progress toward ₹8,400/member target</span>
            <span className="font-bold">{perMemberINRPct.toFixed(0)}%</span>
          </div>
          <div className="h-2.5 bg-amber-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${perMemberINRPct}%`,
                backgroundColor: perMemberINRPct >= 100 ? '#10b981' : '#d97706'
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-amber-600 mt-1">
            <span>Current: {fmtINR(perMemberINR)}/member</span>
            <span>Target: ₹8,400/member</span>
          </div>
        </div>
      </div>

      {/* 4 Fund Breakdown Stat Cards */}
      <div>
        <SectionLabel>Fund Breakdown</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {breakdown.map((b, i) => (
            <StatCard
              key={i}
              icon={Heart}
              iconBg={b.iconBg}
              iconColor={b.iconColor}
              accentColor={b.color}
              label={b.label}
              value={fmtINR(b.inr)}
              sub={`USD ${b.usd.toLocaleString('en-IN')}`}
            />
          ))}
        </div>
      </div>

      {/* Fund Breakdown Chart */}
      {breakdown.filter(b => b.usd > 0 || b.inr > 0).length > 0 && (
        <ChartCard title="TRF Fund Breakdown (INR)" subtitle="Distribution across fund categories">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={breakdown.filter(b => b.usd > 0 || b.inr > 0)} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => fmtINR(v)} />
              <Tooltip content={<INRTooltip />} cursor={{ fill: 'rgba(0,61,165,0.04)' }} />
              <Bar dataKey="inr" name="Amount (INR)" radius={[6, 6, 0, 0]}>
                {breakdown.filter(b => b.usd > 0 || b.inr > 0).map((item, i) => (
                  <Cell key={i} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Monthly TRF Trend */}
      <ChartCard title="Monthly TRF Contributions (USD)" subtitle="Jul 2025 – Mar 2026">
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={monthlyTRFData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,61,165,0.04)' }} />
            <Bar dataKey="TRF (USD)" fill="#003DA5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

// ── TAB 3: SERVICE PROJECTS ───────────────────────────────────────────────────

function ProjectsTab({ club }) {
  const { projects, monthly } = club
  const [search, setSearch] = useState('')

  const totalCost = projects.reduce((s, p) => s + (p.cost || 0), 0)
  const totalBeneficiaries = projects.reduce((s, p) => s + (p.beneficiaries || 0), 0)
  const totalManHours = projects.reduce((s, p) => s + (p.manHours || 0), 0)

  const catMap = {}
  projects.forEach(p => {
    const cat = p.category || 'Uncategorised'
    catMap[cat] = (catMap[cat] || 0) + 1
  })
  const catData = Object.entries(catMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const catColors = ['#003DA5', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#0ea5e9', '#f97316', '#6366f1', '#14b8a6', '#ec4899']

  const monthlyProjectData = monthly.map(m => ({
    month: m.month.replace(' 20', "'"),
    Projects: m.projects,
    'Man Hours': m.manHours,
  }))

  const filteredProjects = projects.filter(p =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
          accentColor="#003DA5"
          label="Total Projects"
          value={projects.length}
          sub="All service projects"
        />
        <StatCard
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
          accentColor="#10b981"
          label="Total Beneficiaries"
          value={fmtNum(totalBeneficiaries)}
          sub="Lives impacted"
        />
        <StatCard
          icon={TrendingUp}
          iconBg="bg-purple-50"
          iconColor="text-purple-700"
          accentColor="#8b5cf6"
          label="Volunteer Hours"
          value={fmtNum(totalManHours)}
          sub="Total man hours"
        />
        <StatCard
          icon={DollarSign}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
          accentColor="#f59e0b"
          label="Total Project Cost"
          value={fmtINR(totalCost)}
          sub={fmtINRFull(totalCost)}
        />
      </div>

      {/* Monthly Projects Chart */}
      <ChartCard title="Monthly Projects & Volunteer Hours" subtitle="Jul 2025 – Mar 2026">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyProjectData} barCategoryGap="25%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,61,165,0.04)' }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="Projects" fill="#003DA5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Man Hours" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Category Breakdown — horizontal bars */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800">Project Categories</h4>
          <p className="text-xs text-slate-400 mt-0.5">{catData.length} categories across {projects.length} projects</p>
        </div>
        <div className="p-5 space-y-3">
          {catData.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: catColors[i % catColors.length] }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-slate-600 truncate pr-2" title={c.name}>{c.name}</p>
                  <span className="text-xs font-bold text-slate-700 shrink-0">{c.count}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(c.count / projects.length) * 100}%`, backgroundColor: catColors[i % catColors.length] }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Table with Search */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">All Projects</h4>
            <p className="text-xs text-slate-400 mt-0.5">{filteredProjects.length} of {projects.length} shown</p>
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-slate-50"
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs text-slate-500 font-semibold pl-5 py-3 whitespace-nowrap">Date</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold py-3 whitespace-nowrap">Category</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold py-3">Title</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold text-right py-3 whitespace-nowrap">Cost (INR)</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold text-right py-3 whitespace-nowrap">Beneficiaries</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold text-right pr-5 py-3 whitespace-nowrap">Man Hrs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((p, i) => (
                <TableRow key={i} className={`border-b border-slate-50 hover:bg-slate-50 ${i % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                  <TableCell className="text-xs text-slate-500 pl-5 py-3 font-mono whitespace-nowrap">{fmtDate(p.date)}</TableCell>
                  <TableCell className="py-3 max-w-[140px]">
                    <span className="text-xs text-slate-600 block truncate" title={p.category}>{p.category}</span>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-800 py-3 max-w-[240px]">
                    <span className="block truncate" title={p.title}>{p.title}</span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 py-3 text-right font-mono whitespace-nowrap">
                    {p.cost ? fmtINR(p.cost) : '—'}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700 py-3 text-right whitespace-nowrap">
                    {p.beneficiaries || '—'}
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 py-3 text-right pr-5 whitespace-nowrap">
                    {p.manHours || '—'}
                  </TableCell>
                </TableRow>
              ))}
              {filteredProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-slate-400 py-8">
                    No projects match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

// ── TAB 4: GOALS ──────────────────────────────────────────────────────────────

function GoalsTab({ club }) {
  const { monthly, goals, citationScore } = club

  const citationMax = 20000
  const citationPct = citationScore != null ? Math.min((citationScore / citationMax) * 100, 100) : 0

  const awards = [
    {
      label: 'Presidential Citation',
      icon: Trophy,
      earned: citationScore >= 10000,
      detail: citationScore >= 10000 ? 'Achieved' : `Score ${citationScore?.toLocaleString('en-IN') ?? '—'} / 10,000`,
      earnedBg: 'bg-amber-50 border-amber-300',
      earnedText: 'text-amber-800',
      pendingBg: 'bg-slate-50 border-slate-200',
      pendingText: 'text-slate-400',
    },
    {
      label: 'District Citation',
      icon: Award,
      earned: citationScore >= 7000,
      detail: citationScore >= 7000 ? 'Achieved' : `Score ${citationScore?.toLocaleString('en-IN') ?? '—'} / 7,000`,
      earnedBg: 'bg-blue-50 border-blue-300',
      earnedText: 'text-blue-800',
      pendingBg: 'bg-slate-50 border-slate-200',
      pendingText: 'text-slate-400',
    },
    {
      label: 'Membership Excellence',
      icon: ShieldCheck,
      earned: goals != null && goals.membershipGrowth >= 5,
      detail: goals != null ? `${goals.membershipGrowth}% growth (target 5%)` : 'No data',
      earnedBg: 'bg-emerald-50 border-emerald-300',
      earnedText: 'text-emerald-800',
      pendingBg: 'bg-slate-50 border-slate-200',
      pendingText: 'text-slate-400',
    },
    {
      label: 'Club of the Year',
      icon: Star,
      earned: citationScore >= 12000 && goals != null && goals.membershipGrowth >= 7,
      detail: 'Citation ≥ 12,000 & Growth ≥ 7%',
      earnedBg: 'bg-purple-50 border-purple-300',
      earnedText: 'text-purple-800',
      pendingBg: 'bg-slate-50 border-slate-200',
      pendingText: 'text-slate-400',
    },
  ]

  const goalItems = goals ? [
    { label: 'Membership Growth', actual: goals.membershipGrowth, target: 5, unit: '%', color: '#003DA5' },
    { label: 'TRF Per Capita', actual: goals.trfPerCapita, target: 100, unit: ' USD', color: '#10b981' },
    { label: 'Service Projects', actual: goals.projects, target: 12, unit: '', color: '#f59e0b' },
    { label: 'Avg Attendance', actual: goals.attendance, target: 60, unit: '%', color: '#8b5cf6' },
    { label: 'MyRotary Registration', actual: goals.myRotary, target: 80, unit: '%', color: '#0ea5e9' },
    { label: 'New Members', actual: goals.newMembers, target: 3, unit: '', color: '#ef4444' },
  ] : []

  const monthlyMeetingsData = monthly.map(m => ({
    month: m.month.replace(' 20', "'"),
    Meetings: m.meetings,
    Projects: m.projects,
  }))

  return (
    <div className="space-y-5">
      {/* Citation Score Panel — Rotary blue card (contained, not full-bleed) */}
      <div className="bg-[#003DA5] text-white rounded-xl p-6">
        <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">Club Citation Score</p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <p className="text-6xl font-bold text-white leading-none">
              {citationScore != null ? citationScore.toLocaleString('en-IN') : '—'}
            </p>
            <p className="text-blue-300 text-sm mt-2">out of {citationMax.toLocaleString('en-IN')} maximum points</p>
          </div>
          <div className="sm:w-72">
            <div className="flex justify-between text-xs text-blue-200 mb-1.5">
              <span>Score Progress</span>
              <span>{citationPct.toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${citationPct}%`, background: 'linear-gradient(90deg, #F7A81B, #fbbf24)' }}
              />
            </div>
            <div className="flex justify-between text-xs text-blue-300 mt-2">
              <span>Presidential: 10,000</span>
              <span>Max: 20,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Goal Progress Cards in 2-col grid */}
      {goalItems.length > 0 && (
        <div>
          <SectionLabel>Goal Progress vs Targets</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goalItems.map((g, i) => {
              const pct = g.target > 0 ? Math.min((g.actual / g.target) * 100, 100) : 0
              const met = g.actual >= g.target
              return (
                <div
                  key={i}
                  className="rounded-xl border bg-white shadow-sm p-5 hover:shadow-md transition-shadow"
                  style={{ borderTop: `3px solid ${g.color}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-800">{g.label}</p>
                    {met ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={11} /> Met
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-3xl font-bold text-slate-900">{g.actual}{g.unit}</span>
                    <span className="text-sm text-slate-400 mb-0.5">/ {g.target}{g.unit} target</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: g.color }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">{pct.toFixed(0)}% of target</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Award Status Badges */}
      <div>
        <SectionLabel>Award Status</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {awards.map((a, i) => {
            const bg = a.earned ? a.earnedBg : a.pendingBg
            const textCls = a.earned ? a.earnedText : a.pendingText
            return (
              <div key={i} className={`flex-1 min-w-[160px] rounded-xl border ${bg} p-4 shadow-sm`}>
                <div className="flex items-center gap-2 mb-2">
                  <a.icon size={18} className={a.earned ? textCls : 'text-slate-300'} />
                  {a.earned
                    ? <Badge className="bg-emerald-500 text-white text-xs py-0 hover:bg-emerald-500">Achieved</Badge>
                    : <Badge variant="outline" className="text-xs py-0 text-slate-400 border-slate-200">Pending</Badge>
                  }
                </div>
                <p className={`text-sm font-bold ${textCls}`}>{a.label}</p>
                <p className={`text-xs mt-0.5 ${a.earned ? textCls + ' opacity-70' : 'text-slate-400'}`}>{a.detail}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly Meetings Chart */}
      <ChartCard title="Monthly Meetings & Projects Trend" subtitle="Jul 2025 – Mar 2026">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyMeetingsData} barCategoryGap="28%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,61,165,0.04)' }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="Meetings" fill="#003DA5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Projects" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* CMR Summary Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800">Monthly CMR Summary</h4>
          <p className="text-xs text-slate-400 mt-0.5">Jul 2025 – Mar 2026</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs text-slate-500 font-semibold pl-5 py-3 whitespace-nowrap">Month</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold text-right py-3 whitespace-nowrap">Meetings</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold text-right py-3 whitespace-nowrap">TRF (USD)</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold text-right py-3 whitespace-nowrap">Projects</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold text-right py-3 whitespace-nowrap">Beneficiaries</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold text-right pr-5 py-3 whitespace-nowrap">Man Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {club.monthly.map((m, i) => {
                const hasData = m.meetings > 0 || m.projects > 0 || m.trf > 0
                return (
                  <TableRow key={i} className={`border-b border-slate-50 hover:bg-slate-50 ${i % 2 === 1 ? 'bg-slate-50/50' : ''} ${!hasData ? 'opacity-40' : ''}`}>
                    <TableCell className="text-xs font-semibold text-slate-700 pl-5 py-3 whitespace-nowrap">{m.month}</TableCell>
                    <TableCell className="text-xs text-slate-700 py-3 text-right">{m.meetings || '—'}</TableCell>
                    <TableCell className="text-xs text-slate-700 py-3 text-right font-mono">{m.trf > 0 ? `$${m.trf.toLocaleString('en-IN')}` : '—'}</TableCell>
                    <TableCell className="text-xs text-slate-700 py-3 text-right">{m.projects || '—'}</TableCell>
                    <TableCell className="text-xs text-slate-700 py-3 text-right">{m.beneficiaries || '—'}</TableCell>
                    <TableCell className="text-xs text-slate-700 py-3 text-right pr-5">{m.manHours || '—'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Project Rank */}
      {club.projectRank && (
        <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Award size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-0.5">District Project Ranking</p>
            <p className="text-2xl font-bold text-amber-900">
              #{club.projectRank.toLocaleString('en-IN')}
              <span className="text-sm font-normal text-amber-600 ml-2">out of 4,928 clubs</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── TAB 5: DUES & COMPLIANCE ──────────────────────────────────────────────────

function DuesTab({ club }) {
  const { dues, duesStatus, monthly, ocv, announcements } = club
  const paid = dues?.paid || []
  const notUploaded = dues?.notUploaded || []
  const totalPaid = paid.reduce((s, d) => s + (d.amount || 0), 0)
  const totalDues = paid.length + notUploaded.length
  const compliancePct = totalDues > 0 ? Math.round((paid.length / totalDues) * 100) : 0

  const cmrMonths = monthly.map(m => {
    const reported = m.meetings > 0 || m.projects > 0 || m.trf > 0
    return { month: m.month, reported, meetings: m.meetings, projects: m.projects }
  })
  const reportedMonths = cmrMonths.filter(m => m.reported).length

  const allDuesPaid = duesStatus?.paid === true
  const outstanding = duesStatus?.outstanding ?? 0

  return (
    <div className="space-y-5">
      {/* Status Banner */}
      <div className={`rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
        allDuesPaid
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${allDuesPaid ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {allDuesPaid
              ? <CheckCircle2 size={22} className="text-emerald-600" />
              : <AlertCircle size={22} className="text-red-500" />
            }
          </div>
          <div>
            <p className={`text-base font-bold ${allDuesPaid ? 'text-emerald-800' : 'text-red-800'}`}>
              {allDuesPaid ? 'All Dues Paid — Full Compliance' : 'Dues Outstanding'}
            </p>
            <p className={`text-sm mt-0.5 ${allDuesPaid ? 'text-emerald-700' : 'text-red-700'}`}>
              {allDuesPaid
                ? 'This club has no outstanding dues with RI or District.'
                : `Outstanding amount: ${fmtINRFull(outstanding)}`}
            </p>
          </div>
        </div>
        <div className={`text-right shrink-0 ${allDuesPaid ? 'text-emerald-800' : 'text-red-800'}`}>
          <p className="text-4xl font-bold">{compliancePct}%</p>
          <p className={`text-xs mt-0.5 ${allDuesPaid ? 'text-emerald-600' : 'text-red-600'}`}>
            {paid.length} of {totalDues} dues uploaded
          </p>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Paid & Uploaded</p>
              <p className="text-3xl font-bold text-emerald-800">{paid.length}</p>
              <p className="text-xs text-emerald-600 mt-0.5">{fmtINRFull(totalPaid)}</p>
            </div>
          </div>
        </div>
        <div className={`rounded-xl border shadow-sm p-5 ${notUploaded.length > 0 ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${notUploaded.length > 0 ? 'bg-red-100' : 'bg-emerald-100'}`}>
              {notUploaded.length > 0
                ? <XCircle size={16} className="text-red-500" />
                : <CheckCircle2 size={16} className="text-emerald-600" />
              }
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${notUploaded.length > 0 ? 'text-red-700' : 'text-emerald-700'}`}>Not Uploaded</p>
              <p className={`text-3xl font-bold ${notUploaded.length > 0 ? 'text-red-700' : 'text-emerald-800'}`}>{notUploaded.length}</p>
              <p className={`text-xs mt-0.5 ${notUploaded.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {notUploaded.length > 0 ? 'Action required' : 'All clear'}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
              <BarChart2 size={16} className="text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Compliance Rate</p>
              <p className="text-3xl font-bold text-slate-800">{compliancePct}%</p>
              <p className="text-xs text-slate-400 mt-0.5">{paid.length} of {totalDues} dues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance progress bar */}
      {totalDues > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Overall Dues Compliance</p>
            <span className="text-sm font-bold text-slate-700">{compliancePct}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${compliancePct}%`,
                background: compliancePct === 100 ? '#10b981' : compliancePct >= 50 ? '#f59e0b' : '#ef4444'
              }}
            />
          </div>
        </div>
      )}

      {/* Paid Dues Table */}
      {paid.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <h4 className="text-sm font-semibold text-slate-800">Paid & Uploaded ({paid.length})</h4>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50/60 hover:bg-emerald-50/60">
                  <TableHead className="text-xs text-slate-500 font-semibold pl-5 py-3">#</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold py-3">Type</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold py-3">Document</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold py-3 whitespace-nowrap">Paid On</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold py-3 whitespace-nowrap">Uploaded On</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right pr-5 py-3 whitespace-nowrap">Amount (INR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paid.map((d, i) => (
                  <TableRow key={i} className={`border-b border-slate-50 hover:bg-emerald-50/40 ${i % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                    <TableCell className="text-xs text-slate-400 pl-5 py-3">{i + 1}</TableCell>
                    <TableCell className="py-3">
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-medium py-0.5 hover:bg-emerald-100">
                        {d.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 py-3 max-w-[220px]">
                      <span className="block truncate font-mono text-[10px]" title={d.document}>{d.document}</span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 py-3 whitespace-nowrap font-mono">{d.paidOn || '—'}</TableCell>
                    <TableCell className="text-xs text-slate-500 py-3 whitespace-nowrap font-mono">{d.uploadedOn || '—'}</TableCell>
                    <TableCell className="text-sm font-bold text-emerald-700 py-3 text-right pr-5 whitespace-nowrap font-mono">
                      {fmtINRFull(d.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-emerald-100/60">
                  <TableCell colSpan={5} className="text-xs pl-5 py-3 text-emerald-800 font-bold">TOTAL PAID</TableCell>
                  <TableCell className="text-sm text-right pr-5 py-3 text-emerald-800 font-bold font-mono">{fmtINRFull(totalPaid)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Not Uploaded Table */}
      {notUploaded.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-red-100 flex items-center gap-2">
            <XCircle size={14} className="text-red-500" />
            <h4 className="text-sm font-semibold text-red-700">Not Uploaded ({notUploaded.length}) — Action Required</h4>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-red-50/60 hover:bg-red-50/60">
                  <TableHead className="text-xs text-slate-500 font-semibold pl-5 py-3">#</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold py-3">Due Type</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold py-3">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notUploaded.map((d, i) => (
                  <TableRow key={i} className={`border-b border-slate-50 hover:bg-red-50/40 ${i % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                    <TableCell className="text-xs text-slate-400 pl-5 py-3">{i + 1}</TableCell>
                    <TableCell className="text-sm font-semibold text-slate-700 py-3">{d.type}</TableCell>
                    <TableCell className="py-3">
                      <Badge className="bg-red-100 text-red-700 border-red-200 text-xs font-medium py-0.5 hover:bg-red-100">
                        Not Uploaded
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* CMR Monthly Compliance */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800">CMR Monthly Reporting Compliance</h4>
          <p className="text-xs text-slate-400 mt-0.5">{reportedMonths} of 9 months reported</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs text-slate-500 font-semibold pl-5 py-3">Month</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold text-center py-3">CMR Reported</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold text-right py-3">Meetings</TableHead>
                <TableHead className="text-xs text-slate-500 font-semibold text-right pr-5 py-3">Projects</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cmrMonths.map((m, i) => (
                <TableRow key={i} className={`border-b border-slate-50 hover:bg-slate-50 ${i % 2 === 1 ? 'bg-slate-50/50' : ''} ${!m.reported ? 'opacity-50' : ''}`}>
                  <TableCell className="text-xs font-semibold text-slate-700 pl-5 py-3 whitespace-nowrap">{m.month}</TableCell>
                  <TableCell className="py-3 text-center">
                    {m.reported
                      ? <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs py-0.5 hover:bg-emerald-100">Reported</Badge>
                      : <Badge className="bg-red-100 text-red-700 border-red-200 text-xs py-0.5 hover:bg-red-100">Not Reported</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 py-3 text-right">{m.meetings || '—'}</TableCell>
                  <TableCell className="text-xs text-slate-700 py-3 text-right pr-5">{m.projects || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* OCV & Announcements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 shadow-sm p-5 flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Eye size={16} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">OCV Count</p>
            <p className="text-3xl font-bold text-amber-800">{ocv ?? '—'}</p>
            <p className="text-xs text-amber-600 mt-0.5">Official Club Visits submitted</p>
          </div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 shadow-sm p-5 flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Megaphone size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Announcements</p>
            <p className="text-3xl font-bold text-blue-800">{announcements ?? '—'}</p>
            <p className="text-xs text-blue-600 mt-0.5">Public image announcements posted</p>
          </div>
        </div>
      </div>

      {paid.length > 0 && notUploaded.length === 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 shadow-sm p-5 flex items-center gap-4">
          <CheckCircle2 size={26} className="text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-800">All dues uploaded — Full Compliance!</p>
            <p className="text-xs text-emerald-700 mt-0.5">All {paid.length} dues have been paid and documents uploaded.</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── MAIN ClubDetail PAGE ──────────────────────────────────────────────────────

export default function ClubDetail() {
  const { clubId: id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('membership')

  const club = getClubById(id)

  if (!club) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="rounded-2xl border border-slate-200 shadow-md p-10 text-center max-w-sm w-full bg-white">
          <XCircle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800 mb-2">Club Not Found</h2>
          <p className="text-sm text-slate-500 mb-5">
            No club found with ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{id}</code>
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-semibold"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
        </div>
      </div>
    )
  }

  const allDuesPaid = club.duesStatus?.paid === true
  const duesPending = (club.dues?.notUploaded || []).length
  const totalBeneficiaries = (club.projects || []).reduce((s, p) => s + (p.beneficiaries || 0), 0)

  return (
    <div className="space-y-5">

      {/* ── 1. Club Header Card ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">

        {/* Top row: Back | Download */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>
          <button
            onClick={() => exportClubDetail(club)}
            className="inline-flex items-center gap-1.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download size={13} /> Download Excel
          </button>
        </div>

        {/* Club name */}
        <h1 className="text-2xl font-bold text-[#003DA5] leading-tight mb-3">
          RC {club.name}
        </h1>

        {/* Badge row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
            <FileText size={11} /> District {club.district}
          </span>
          {club.president?.name && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
              <Users size={11} /> Pres: {club.president.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
            <Users size={11} /> {club.members} members
          </span>
          {allDuesPaid ? (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 size={11} /> Dues Compliant
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
              <AlertCircle size={11} />
              {club.duesStatus?.outstanding
                ? `₹${club.duesStatus.outstanding.toLocaleString('en-IN')} outstanding`
                : `${duesPending} dues pending`}
            </span>
          )}
        </div>

        {/* Quick stat chips */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Users size={12} className="text-blue-600" />
            {club.members} Members
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Briefcase size={12} className="text-purple-600" />
            {club.totalProjects} Projects
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Heart size={12} className="text-rose-600" />
            {fmtINR(club.trf?.totalINR)} TRF
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Calendar size={12} className="text-emerald-600" />
            {club.meetings} Meetings
          </span>
          {club.citationScore != null && (
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Star size={12} className="text-amber-500" />
              {club.citationScore.toLocaleString('en-IN')} pts
            </span>
          )}
        </div>
      </div>

      {/* ── 2. Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none h-auto p-0 gap-1">
          {[
            { value: 'membership', icon: Users, label: 'Membership' },
            { value: 'foundation', icon: Heart, label: 'Foundation & TRF' },
            { value: 'projects', icon: Briefcase, label: 'Projects' },
            { value: 'goals', icon: Target, label: 'Goals' },
            { value: 'dues', icon: Shield, label: 'Dues', alert: !allDuesPaid },
          ].map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-[#003DA5] data-[state=active]:text-[#003DA5] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 gap-2"
            >
              <tab.icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              {tab.alert && (
                <span className="absolute top-2 right-1 w-2 h-2 rounded-full bg-red-400" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── 3. Tab Content ── */}
        <div className="pt-5">
          <TabsContent value="membership">
            <MembershipTab club={club} />
          </TabsContent>
          <TabsContent value="foundation">
            <FoundationTab club={club} />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsTab club={club} />
          </TabsContent>
          <TabsContent value="goals">
            <GoalsTab club={club} />
          </TabsContent>
          <TabsContent value="dues">
            <DuesTab club={club} />
          </TabsContent>
        </div>
      </Tabs>

    </div>
  )
}
