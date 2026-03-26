import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getClubById } from '@/data/realData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  ArrowLeft, Users, Calendar, TrendingUp, Heart, Award,
  Briefcase, CheckCircle2, XCircle, BarChart2, Globe,
  DollarSign, Target, BookOpen, Megaphone, Eye, FileText,
  UserPlus, UserMinus, Star, ShieldCheck, AlertCircle, Trophy, Percent
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell, LineChart, Line
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

// ── Custom Tooltip ────────────────────────────────────────────────────────────

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.fill || p.color }}>
            {p.name}: <span className="font-bold">{p.value != null ? p.value.toLocaleString('en-IN') : '—'}</span>
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
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
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

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, iconBg, iconColor, label, value, sub }) {
  return (
    <Card className="border border-slate-100 shadow-sm">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${iconBg}`}>
            <Icon size={18} className={iconColor} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide leading-none mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900 truncate">{value}</p>
            {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Section Heading ───────────────────────────────────────────────────────────

function SectionHeading({ children }) {
  return (
    <h3 className="text-sm font-semibold text-slate-700 mb-3 px-1 uppercase tracking-wide">{children}</h3>
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
    <div className="space-y-6">
      {/* Stat Cards Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
          label="Current Members"
          value={club.members}
          sub="Active Rotarians"
        />
        <StatCard
          icon={BarChart2}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          label="Previous Year"
          value={prev}
          sub="Members last year"
        />
        <StatCard
          icon={UserPlus}
          iconBg="bg-green-50"
          iconColor="text-green-700"
          label="New Added"
          value={club.newMembers ?? '—'}
          sub="Inducted this year"
        />
        <StatCard
          icon={Heart}
          iconBg="bg-pink-50"
          iconColor="text-pink-600"
          label="Female Members"
          value={club.femaleMembers ?? '—'}
          sub={club.femaleMembers != null ? `${((club.femaleMembers / club.members) * 100).toFixed(0)}% of club` : ''}
        />
        <StatCard
          icon={Percent}
          iconBg="bg-purple-50"
          iconColor="text-purple-700"
          label="Avg Attendance"
          value={club.avgAttendance != null ? `${club.avgAttendance}%` : 'N/A'}
          sub="Meeting attendance %"
        />
        <StatCard
          icon={Globe}
          iconBg="bg-cyan-50"
          iconColor="text-cyan-700"
          label="MyRotary Reg."
          value={club.myRotaryCount ?? '—'}
          sub={club.myRotaryCount != null ? `${((club.myRotaryCount / club.members) * 100).toFixed(0)}% registered` : ''}
        />
      </div>

      {/* Growth & Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Growth Card */}
        <Card className={`border shadow-sm ${growthPositive ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className={growthPositive ? 'text-green-600' : 'text-red-500'} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Membership Growth</p>
                <p className={`text-3xl font-bold ${growthPositive ? 'text-green-700' : 'text-red-600'}`}>
                  {growthPositive ? '+' : ''}{growthPct}%
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{prev} → {club.members} members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active vs Terminated */}
        <Card className="border border-slate-100 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">Member Status This Year</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserPlus size={16} className="text-green-600" />
                <div>
                  <p className="text-xl font-bold text-green-700">+{club.newMembers ?? 0}</p>
                  <p className="text-xs text-slate-500">Inducted</p>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex items-center gap-2">
                <UserMinus size={16} className="text-red-500" />
                <div>
                  <p className="text-xl font-bold text-red-600">-{club.terminatedMembers ?? 0}</p>
                  <p className="text-xs text-slate-500">Terminated</p>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-xl font-bold text-slate-800">
                  {(club.newMembers ?? 0) - (club.terminatedMembers ?? 0) >= 0 ? '+' : ''}
                  {(club.newMembers ?? 0) - (club.terminatedMembers ?? 0)}
                </p>
                <p className="text-xs text-slate-500">Net change</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OCV / Announcements */}
        <Card className="border border-slate-100 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">Engagement Metrics</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-amber-600" />
                <div>
                  <p className="text-xl font-bold text-slate-800">{club.ocv ?? '—'}</p>
                  <p className="text-xs text-slate-500">OCV Count</p>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex items-center gap-2">
                <Megaphone size={16} className="text-blue-600" />
                <div>
                  <p className="text-xl font-bold text-slate-800">{club.announcements ?? '—'}</p>
                  <p className="text-xs text-slate-500">Announcements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Attendance Trend */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700">Monthly Attendance Trend — Rotarians Present (Jul 2025 – Mar 2026)</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyBarData} barCategoryGap="25%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="Attendance" name="Rotarians Present" fill="#003DA5" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Meetings" name="Meetings Held" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* BOD Table */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700">Board of Directors ({club.bod.length} members)</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs text-slate-500 font-semibold pl-5">#</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold">Designation</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold">Name</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold">Mobile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {club.bod.map((b, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/70">
                    <TableCell className="text-xs text-slate-400 pl-5 py-2">{i + 1}</TableCell>
                    <TableCell className="text-xs text-slate-600 py-2 max-w-[200px]">
                      <span className="block truncate" title={b.designation}>{b.designation}</span>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-800 py-2 whitespace-nowrap">{b.name}</TableCell>
                    <TableCell className="text-xs text-slate-500 py-2 whitespace-nowrap font-mono">{b.mobile}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Records */}
      {club.meetingRecords && club.meetingRecords.length > 0 && (
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700">Meeting Records ({club.meetingRecords.length})</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs text-slate-500 font-semibold pl-5">Date</TableHead>
                    <TableHead className="text-xs text-slate-500 font-semibold">Type</TableHead>
                    <TableHead className="text-xs text-slate-500 font-semibold">Title</TableHead>
                    <TableHead className="text-xs text-slate-500 font-semibold text-right pr-5">Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {club.meetingRecords.map((mr, i) => (
                    <TableRow key={i} className="hover:bg-slate-50/70">
                      <TableCell className="text-xs text-slate-500 pl-5 py-2 whitespace-nowrap font-mono">{fmtDate(mr.date)}</TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className="text-xs font-normal py-0">{mr.type}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-700 py-2 max-w-[260px]">
                        <span className="block truncate" title={mr.title}>{mr.title}</span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-700 py-2 text-right pr-5 font-medium">
                        {mr.attendance != null ? mr.attendance : '—'}
                        {mr.attendancePct != null ? <span className="text-slate-400 ml-1">({mr.attendancePct.toFixed(1)}%)</span> : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── TAB 2: FOUNDATION & TRF ───────────────────────────────────────────────────

function FoundationTab({ club }) {
  const { trf, monthly, members } = club

  const perMember = members > 0 ? (trf.totalUSD / members).toFixed(1) : 0
  const targetPerMember = 100
  const perMemberPct = Math.min((perMember / targetPerMember) * 100, 100)

  const breakdown = [
    { label: 'Annual Unrestricted', usd: trf.annual || 0, inr: trf.annualINR || (trf.annual || 0) * 84 },
    { label: 'Polio Plus', usd: trf.polio || 0, inr: trf.polioINR || (trf.polio || 0) * 84 },
    { label: 'Endowment', usd: trf.endowment || 0, inr: (trf.endowment || 0) * 84 },
    { label: 'Global Grant', usd: trf.globalGrant || 0, inr: trf.globalGrantINR || (trf.globalGrant || 0) * 84 },
    { label: 'Others', usd: trf.others || 0, inr: (trf.others || 0) * 84 },
  ]

  const barColors = ['#003DA5', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

  const monthlyTRFData = monthly.map(m => ({
    month: m.month.replace(' 20', "'"),
    'TRF (USD)': m.trf,
  }))

  return (
    <div className="space-y-6">
      {/* Hero TRF Card */}
      <Card className="border-0 bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium uppercase tracking-wide mb-1">Total TRF Contribution</p>
              <p className="text-4xl font-bold">{fmtINRFull(trf.totalINR)}</p>
              <p className="text-blue-300 text-sm mt-1">USD {(trf.totalUSD || 0).toLocaleString('en-IN')} × ₹84/USD</p>
            </div>
            <div className="flex gap-4">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-xl px-4 py-3">
                <Heart size={20} className="text-red-300" />
                <div>
                  <p className="text-xs text-blue-200">Annual Fund</p>
                  <p className="text-xl font-bold">{fmtINRFull(trf.annualINR || (trf.annual || 0) * 84)}</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-xl px-4 py-3">
                <Users size={20} className="text-blue-200" />
                <div>
                  <p className="text-xs text-blue-200">Per Member</p>
                  <p className="text-xl font-bold">${perMember}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Per-member progress vs $100 target */}
      <Card className="border border-slate-100 shadow-sm">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">Per-Member Giving vs Target</p>
              <p className="text-xs text-slate-500 mt-0.5">Current: ${perMember}/member — Target: ${targetPerMember}/member</p>
            </div>
            <span className={`text-lg font-bold ${parseFloat(perMember) >= targetPerMember ? 'text-green-600' : 'text-amber-600'}`}>
              {perMemberPct.toFixed(0)}%
            </span>
          </div>
          <Progress value={perMemberPct} className="h-3" />
          {parseFloat(perMember) < targetPerMember && (
            <p className="text-xs text-amber-600 mt-2">
              Gap: ${(targetPerMember - parseFloat(perMember)).toFixed(1)}/member to reach $100 target
              ({fmtINRFull((targetPerMember - parseFloat(perMember)) * members * 84)} total INR needed)
            </p>
          )}
          {parseFloat(perMember) >= targetPerMember && (
            <p className="text-xs text-green-600 mt-2">Target achieved — ${perMember}/member exceeds the $100 benchmark.</p>
          )}
        </CardContent>
      </Card>

      {/* 5 Fund Breakdown Cards */}
      <div>
        <SectionHeading>Fund Breakdown</SectionHeading>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {breakdown.map((b, i) => (
            <Card key={i} className="border border-slate-100 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: barColors[i] }} />
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate" title={b.label}>{b.label}</p>
                </div>
                <p className="text-xl font-bold text-slate-900">{fmtINR(b.inr)}</p>
                <p className="text-xs text-slate-400 mt-0.5">USD {b.usd.toLocaleString('en-IN')}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* TRF Breakdown Bar Chart — only if multiple funds have values */}
      {breakdown.filter(b => b.usd > 0 || b.inr > 0).length > 1 && (
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700">TRF Fund Breakdown (INR)</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={breakdown.filter(b => b.usd > 0 || b.inr > 0)} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => fmtINR(v)} />
                <Tooltip content={<INRTooltip />} />
                <Bar dataKey="inr" name="Amount (INR)" radius={[4, 4, 0, 0]}>
                  {breakdown.filter(b => b.usd > 0 || b.inr > 0).map((_, i) => (
                    <Cell key={i} fill={barColors[i % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Monthly TRF Trend */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700">Monthly TRF Trend (USD) — Jul 2025 to Mar 2026</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyTRFData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="TRF (USD)" fill="#003DA5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

// ── TAB 3: SERVICE PROJECTS ───────────────────────────────────────────────────

function ProjectsTab({ club }) {
  const { projects, monthly } = club

  const totalCost = projects.reduce((s, p) => s + (p.cost || 0), 0)
  const totalBeneficiaries = projects.reduce((s, p) => s + (p.beneficiaries || 0), 0)
  const totalManHours = projects.reduce((s, p) => s + (p.manHours || 0), 0)

  // Category breakdown
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

  // Top 3 by beneficiaries
  const top3 = [...projects]
    .filter(p => p.beneficiaries > 0)
    .sort((a, b) => b.beneficiaries - a.beneficiaries)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
          label="Total Projects"
          value={projects.length}
          sub="All service projects"
        />
        <StatCard
          icon={Users}
          iconBg="bg-green-50"
          iconColor="text-green-700"
          label="Total Beneficiaries"
          value={fmtNum(totalBeneficiaries)}
          sub="Lives impacted"
        />
        <StatCard
          icon={TrendingUp}
          iconBg="bg-purple-50"
          iconColor="text-purple-700"
          label="Total Man Hours"
          value={fmtNum(totalManHours)}
          sub="Volunteer effort"
        />
        <StatCard
          icon={DollarSign}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
          label="Total Project Cost"
          value={fmtINR(totalCost)}
          sub={fmtINRFull(totalCost)}
        />
      </div>

      {/* Top 3 Impact Projects */}
      {top3.length > 0 && (
        <div>
          <SectionHeading>Top 3 Impactful Projects (by Beneficiaries)</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((p, i) => {
              const medals = ['🥇', '🥈', '🥉']
              const bgColors = ['bg-amber-50 border-amber-200', 'bg-slate-50 border-slate-200', 'bg-orange-50 border-orange-200']
              return (
                <Card key={i} className={`border shadow-sm ${bgColors[i]}`}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-xl">{medals[i]}</span>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{p.title}</p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <span className="text-xs text-green-700 font-semibold">{fmtNum(p.beneficiaries)} beneficiaries</span>
                      <span className="text-xs text-slate-500">{fmtINR(p.cost)}</span>
                      <span className="text-xs text-slate-500">{p.manHours}h volunteer</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{fmtDate(p.date)} · {p.location}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Monthly Projects Chart */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700">Monthly Projects & Volunteer Hours Trend</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyProjectData} barCategoryGap="25%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="Projects" fill="#003DA5" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Man Hours" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700">Project Categories ({catData.length} categories)</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-2">
            {catData.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: catColors[i % catColors.length] }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs text-slate-600 truncate pr-2" title={c.name}>{c.name}</p>
                    <span className="text-xs font-semibold text-slate-800 shrink-0">{c.count}</span>
                  </div>
                  <Progress
                    value={(c.count / projects.length) * 100}
                    className="h-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full Projects Table */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700">All Projects ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs text-slate-500 font-semibold pl-5 whitespace-nowrap">Date</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold whitespace-nowrap">Category</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold">Title</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right whitespace-nowrap">Cost (INR)</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right whitespace-nowrap">Beneficiaries</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right whitespace-nowrap pr-5">Man Hrs</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold whitespace-nowrap">Funding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/70">
                    <TableCell className="text-xs text-slate-500 pl-5 py-2 font-mono whitespace-nowrap">{fmtDate(p.date)}</TableCell>
                    <TableCell className="py-2 max-w-[140px]">
                      <span className="text-xs text-slate-600 block truncate" title={p.category}>{p.category}</span>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-800 py-2 max-w-[220px]">
                      <span className="block truncate" title={p.title}>{p.title}</span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 py-2 text-right font-mono whitespace-nowrap">
                      {p.cost ? fmtINR(p.cost) : '—'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 py-2 text-right font-medium whitespace-nowrap">
                      {p.beneficiaries || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 py-2 text-right pr-5 whitespace-nowrap">
                      {p.manHours || '—'}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant={p.funding === 'Global Grant' ? 'default' : 'outline'}
                        className="text-xs font-normal py-0 whitespace-nowrap"
                      >
                        {p.funding}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── TAB 4: GOALS ──────────────────────────────────────────────────────────────

function GoalsTab({ club }) {
  const { monthly, goals, citationScore, members } = club

  // Determine award badges
  const awards = [
    {
      label: 'Presidential Citation',
      icon: Trophy,
      earned: citationScore >= 10000,
      detail: citationScore >= 10000 ? 'Achieved' : `Score ${citationScore?.toLocaleString('en-IN') ?? '—'} / 10,000 needed`,
      earnedClass: 'bg-amber-100 border-amber-300 text-amber-800',
      pendingClass: 'bg-slate-100 border-slate-200 text-slate-500',
    },
    {
      label: 'District Citation',
      icon: Award,
      earned: citationScore >= 7000,
      detail: citationScore >= 7000 ? 'Achieved' : `Score ${citationScore?.toLocaleString('en-IN') ?? '—'} / 7,000 needed`,
      earnedClass: 'bg-blue-100 border-blue-300 text-blue-800',
      pendingClass: 'bg-slate-100 border-slate-200 text-slate-500',
    },
    {
      label: 'Membership Excellence',
      icon: ShieldCheck,
      earned: goals != null && goals.membershipGrowth >= 5,
      detail: goals != null ? `${goals.membershipGrowth}% growth (target: 5%)` : 'No data',
      earnedClass: 'bg-green-100 border-green-300 text-green-800',
      pendingClass: 'bg-slate-100 border-slate-200 text-slate-500',
    },
    {
      label: 'Club of the Year',
      icon: Star,
      earned: citationScore >= 12000 && goals != null && goals.membershipGrowth >= 7,
      detail: 'Citation ≥ 12,000 & Growth ≥ 7%',
      earnedClass: 'bg-purple-100 border-purple-300 text-purple-800',
      pendingClass: 'bg-slate-100 border-slate-200 text-slate-500',
    },
  ]

  // Goals progress bars
  const goalItems = goals ? [
    {
      label: 'Membership Growth',
      actual: goals.membershipGrowth,
      target: 5,
      unit: '%',
      color: '#003DA5',
    },
    {
      label: 'TRF / Capita',
      actual: goals.trfPerCapita,
      target: 100,
      unit: ' USD',
      color: '#10b981',
    },
    {
      label: 'Service Projects',
      actual: goals.projects,
      target: 12,
      unit: '',
      color: '#f59e0b',
    },
    {
      label: 'Avg Attendance',
      actual: goals.attendance,
      target: 60,
      unit: '%',
      color: '#8b5cf6',
    },
    {
      label: 'MyRotary Reg.',
      actual: goals.myRotary,
      target: 80,
      unit: '%',
      color: '#0ea5e9',
    },
    {
      label: 'New Members',
      actual: goals.newMembers,
      target: 3,
      unit: '',
      color: '#ef4444',
    },
  ] : []

  // Monthly meetings chart
  const monthlyMeetingsData = monthly.map(m => ({
    month: m.month.replace(' 20', "'"),
    Meetings: m.meetings,
    Projects: m.projects,
  }))

  return (
    <div className="space-y-6">
      {/* Citation Score Hero */}
      <Card className="border-0 bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-yellow-100 text-sm font-medium uppercase tracking-wide mb-1">Club Citation Score</p>
              <p className="text-5xl font-bold">{citationScore != null ? citationScore.toLocaleString('en-IN') : '—'}</p>
              <p className="text-yellow-200 text-sm mt-1">Presidential Citation threshold: 10,000 points</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-white/20 rounded-xl px-4 py-2">
                <p className="text-xs text-yellow-100 mb-1">Score vs Presidential Threshold</p>
                <Progress
                  value={citationScore != null ? Math.min((citationScore / 10000) * 100, 100) : 0}
                  className="h-2.5"
                />
                <p className="text-xs text-yellow-100 mt-1">
                  {citationScore != null ? Math.min(((citationScore / 10000) * 100), 100).toFixed(0) : 0}% of 10,000
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Progress Bars */}
      {goalItems.length > 0 && (
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700">Goal Progress vs Targets</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {goalItems.map((g, i) => {
                const pct = g.target > 0 ? Math.min((g.actual / g.target) * 100, 100) : 0
                const met = g.actual >= g.target
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-700">{g.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Target: {g.target}{g.unit}</span>
                        <span className={`text-xs font-bold ${met ? 'text-green-600' : 'text-slate-700'}`}>
                          {g.actual}{g.unit}
                          {met && <CheckCircle2 size={11} className="inline ml-1 text-green-500" />}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: g.color }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{pct.toFixed(0)}% of target{met ? ' — Met!' : ''}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Award Status Badges */}
      <div>
        <SectionHeading>Award Status</SectionHeading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {awards.map((a, i) => {
            const cls = a.earned ? a.earnedClass : a.pendingClass
            return (
              <Card key={i} className={`border shadow-sm ${cls}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <a.icon size={18} className={a.earned ? 'opacity-100' : 'opacity-40'} />
                    {a.earned
                      ? <Badge className="bg-green-500 text-white text-xs py-0 hover:bg-green-500">Achieved</Badge>
                      : <Badge variant="outline" className="text-xs py-0 text-slate-400">Pending</Badge>
                    }
                  </div>
                  <p className="text-sm font-bold">{a.label}</p>
                  <p className="text-xs mt-1 opacity-75">{a.detail}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Monthly Meetings Trend */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700">Monthly Meetings & Projects Trend</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyMeetingsData} barCategoryGap="25%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="Meetings" fill="#003DA5" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Projects" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly CMR Summary Table */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700">Monthly CMR Summary (Jul 2025 – Mar 2026)</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs text-slate-500 font-semibold pl-5 whitespace-nowrap">Month</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right whitespace-nowrap">Meetings</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right whitespace-nowrap">TRF (USD)</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right whitespace-nowrap">Projects</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right whitespace-nowrap">Beneficiaries</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right whitespace-nowrap pr-5">Man Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthly.map((m, i) => {
                  const hasData = m.meetings > 0 || m.projects > 0 || m.trf > 0
                  return (
                    <TableRow key={i} className={`hover:bg-slate-50/70 ${!hasData ? 'opacity-40' : ''}`}>
                      <TableCell className="text-xs font-medium text-slate-700 pl-5 py-2 whitespace-nowrap">{m.month}</TableCell>
                      <TableCell className="text-xs text-slate-700 py-2 text-right">{m.meetings}</TableCell>
                      <TableCell className="text-xs text-slate-700 py-2 text-right font-mono">{m.trf > 0 ? `$${m.trf.toLocaleString('en-IN')}` : '—'}</TableCell>
                      <TableCell className="text-xs text-slate-700 py-2 text-right">{m.projects || '—'}</TableCell>
                      <TableCell className="text-xs text-slate-700 py-2 text-right">{m.beneficiaries || '—'}</TableCell>
                      <TableCell className="text-xs text-slate-700 py-2 text-right pr-5">{m.manHours || '—'}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Project Rank */}
      {club.projectRank && (
        <Card className="border border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Award size={24} className="text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900">District Project Ranking</p>
                <p className="text-2xl font-bold text-amber-800">
                  #{club.projectRank.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-amber-600 ml-2">out of 4,928 clubs in District {club.district}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── TAB 5: DUES & COMPLIANCE ──────────────────────────────────────────────────

function DuesTab({ club }) {
  const { dues, duesStatus, monthly, meetingRecords, ocv, announcements } = club
  const paid = dues?.paid || []
  const notUploaded = dues?.notUploaded || []
  const totalPaid = paid.reduce((s, d) => s + (d.amount || 0), 0)
  const totalDues = paid.length + notUploaded.length
  const compliancePct = totalDues > 0 ? Math.round((paid.length / totalDues) * 100) : 0

  // Build CMR month compliance (whether a CMR was reported for that month)
  const cmrMonths = monthly.map(m => {
    const reported = m.meetings > 0 || m.projects > 0 || m.trf > 0
    return { month: m.month, reported, meetings: m.meetings, projects: m.projects }
  })
  const reportedMonths = cmrMonths.filter(m => m.reported).length

  const allDuesPaid = duesStatus?.paid === true
  const outstanding = duesStatus?.outstanding ?? 0

  return (
    <div className="space-y-6">
      {/* Dues Hero Status */}
      <Card className={`border-0 shadow-lg ${allDuesPaid ? 'bg-gradient-to-r from-green-700 to-emerald-600' : 'bg-gradient-to-r from-red-700 to-red-500'} text-white`}>
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {allDuesPaid
                ? <CheckCircle2 size={40} className="text-green-200 shrink-0" />
                : <AlertCircle size={40} className="text-red-200 shrink-0" />
              }
              <div>
                <p className="text-lg font-bold">{allDuesPaid ? 'All Dues Paid — Full Compliance' : 'Dues Outstanding'}</p>
                <p className="text-sm opacity-80 mt-0.5">
                  {allDuesPaid
                    ? 'This club has no outstanding dues with RI or District.'
                    : `Outstanding amount: ${fmtINRFull(outstanding)}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{compliancePct}%</p>
              <p className="text-sm opacity-75">{paid.length} of {totalDues} dues uploaded</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-green-200 bg-green-50 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-green-600 shrink-0" />
              <div>
                <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Paid & Uploaded</p>
                <p className="text-3xl font-bold text-green-800">{paid.length}</p>
                <p className="text-xs text-green-600 mt-0.5">Total: {fmtINRFull(totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border shadow-sm ${notUploaded.length > 0 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              {notUploaded.length > 0
                ? <XCircle size={24} className="text-red-500 shrink-0" />
                : <CheckCircle2 size={24} className="text-green-600 shrink-0" />
              }
              <div>
                <p className={`text-xs font-medium uppercase tracking-wide ${notUploaded.length > 0 ? 'text-red-700' : 'text-green-700'}`}>
                  Not Uploaded
                </p>
                <p className={`text-3xl font-bold ${notUploaded.length > 0 ? 'text-red-700' : 'text-green-800'}`}>{notUploaded.length}</p>
                <p className={`text-xs mt-0.5 ${notUploaded.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {notUploaded.length > 0 ? 'Action required' : 'All clear'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <BarChart2 size={24} className="text-slate-500 shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Compliance Rate</p>
                <p className="text-3xl font-bold text-slate-800">{compliancePct}%</p>
                <p className="text-xs text-slate-500 mt-0.5">{paid.length} of {totalDues} dues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Progress Bar */}
      {totalDues > 0 && (
        <Card className="border border-slate-100 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Overall Dues Compliance</p>
              <span className="text-xs font-bold text-slate-700">{compliancePct}%</span>
            </div>
            <Progress value={compliancePct} className="h-3" />
          </CardContent>
        </Card>
      )}

      {/* Paid Dues Table */}
      {paid.length > 0 && (
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-green-600" />
              Paid & Uploaded ({paid.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-green-50">
                    <TableHead className="text-xs text-slate-500 font-semibold pl-5">#</TableHead>
                    <TableHead className="text-xs text-slate-500 font-semibold">Type</TableHead>
                    <TableHead className="text-xs text-slate-500 font-semibold">Document</TableHead>
                    <TableHead className="text-xs text-slate-500 font-semibold whitespace-nowrap">Paid On</TableHead>
                    <TableHead className="text-xs text-slate-500 font-semibold whitespace-nowrap">Uploaded On</TableHead>
                    <TableHead className="text-xs text-slate-500 font-semibold text-right pr-5 whitespace-nowrap">Amount (INR)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paid.map((d, i) => (
                    <TableRow key={i} className="hover:bg-green-50/60">
                      <TableCell className="text-xs text-slate-400 pl-5 py-2">{i + 1}</TableCell>
                      <TableCell className="py-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium py-0 hover:bg-green-100">
                          {d.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 py-2 max-w-[220px]">
                        <span className="block truncate font-mono text-[10px]" title={d.document}>{d.document}</span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 py-2 whitespace-nowrap font-mono">{d.paidOn || '—'}</TableCell>
                      <TableCell className="text-xs text-slate-500 py-2 whitespace-nowrap font-mono">{d.uploadedOn || '—'}</TableCell>
                      <TableCell className="text-xs font-semibold text-green-700 py-2 text-right pr-5 whitespace-nowrap font-mono">
                        {fmtINRFull(d.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-green-100 font-bold">
                    <TableCell colSpan={5} className="text-xs pl-5 py-2 text-green-800 font-bold">TOTAL PAID</TableCell>
                    <TableCell className="text-xs text-right pr-5 py-2 text-green-800 font-bold font-mono">{fmtINRFull(totalPaid)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Not Uploaded Table */}
      {notUploaded.length > 0 && (
        <Card className="border border-red-200 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
              <XCircle size={15} className="text-red-500" />
              Not Uploaded ({notUploaded.length}) — Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-red-50">
                    <TableHead className="text-xs text-slate-500 font-semibold pl-5">#</TableHead>
                    <TableHead className="text-xs text-slate-500 font-semibold">Due Type</TableHead>
                    <TableHead className="text-xs text-slate-500 font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notUploaded.map((d, i) => (
                    <TableRow key={i} className="hover:bg-red-50/60">
                      <TableCell className="text-xs text-slate-400 pl-5 py-2">{i + 1}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-700 py-2">{d.type}</TableCell>
                      <TableCell className="py-2">
                        <Badge className="bg-red-100 text-red-700 border-red-200 text-xs font-medium py-0 hover:bg-red-100">
                          Not Uploaded
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CMR Monthly Compliance Table */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700">
            CMR Reporting Compliance — {reportedMonths} of 9 months reported
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs text-slate-500 font-semibold pl-5">Month</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-center">CMR Reported</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right">Meetings</TableHead>
                  <TableHead className="text-xs text-slate-500 font-semibold text-right pr-5">Projects</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cmrMonths.map((m, i) => (
                  <TableRow key={i} className={`hover:bg-slate-50/70 ${!m.reported ? 'opacity-50' : ''}`}>
                    <TableCell className="text-xs font-medium text-slate-700 pl-5 py-2 whitespace-nowrap">{m.month}</TableCell>
                    <TableCell className="py-2 text-center">
                      {m.reported
                        ? <Badge className="bg-green-100 text-green-800 border-green-200 text-xs py-0 hover:bg-green-100">Yes</Badge>
                        : <Badge className="bg-red-100 text-red-700 border-red-200 text-xs py-0 hover:bg-red-100">No</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 py-2 text-right">{m.meetings || '—'}</TableCell>
                    <TableCell className="text-xs text-slate-700 py-2 text-right pr-5">{m.projects || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* OCV & Announcements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border border-amber-100 bg-amber-50 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <Eye size={22} className="text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">OCV (Official Club Visits)</p>
                <p className="text-3xl font-bold text-amber-800">{ocv ?? '—'}</p>
                <p className="text-xs text-amber-600 mt-0.5">Visits submitted to RI by members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-blue-100 bg-blue-50 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <Megaphone size={22} className="text-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Announcements</p>
                <p className="text-3xl font-bold text-blue-800">{announcements ?? '—'}</p>
                <p className="text-xs text-blue-600 mt-0.5">Public image announcements posted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All clear message */}
      {paid.length > 0 && notUploaded.length === 0 && (
        <Card className="border border-green-200 bg-green-50 shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={28} className="text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-800">All dues uploaded — Full Compliance!</p>
                <p className="text-xs text-green-700 mt-0.5">All {paid.length} dues have been paid and documents uploaded.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── MAIN ClubDetail PAGE ──────────────────────────────────────────────────────

export default function ClubDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('membership')

  const club = getClubById(id)

  if (!club) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="border border-slate-200 shadow-md p-8 text-center max-w-sm w-full">
          <XCircle size={40} className="text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800 mb-1">Club Not Found</h2>
          <p className="text-sm text-slate-500 mb-4">No club found with ID: <code className="bg-slate-100 px-1 rounded">{id}</code></p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
        </Card>
      </div>
    )
  }

  const duesPaid = (club.dues?.paid || []).length
  const duesPending = (club.dues?.notUploaded || []).length
  const allDuesPaid = club.duesStatus?.paid === true

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 h-14">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors shrink-0 pr-3 border-r border-slate-200"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Club Name */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                RC {club.name}
              </h1>
            </div>

            {/* Meta Chips */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users size={13} className="text-blue-600" />
                <span className="font-semibold text-slate-700">{club.members}</span>
                <span>members</span>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Award size={13} className="text-amber-500" />
                <span className="font-medium text-slate-700 truncate max-w-[160px]" title={club.president?.name}>
                  {club.president?.name || '—'}
                </span>
              </div>
              {club.citationScore != null && (
                <>
                  <div className="w-px h-4 bg-slate-200" />
                  <div className="flex items-center gap-1.5 text-xs">
                    <Star size={12} className="text-amber-500" />
                    <span className="font-semibold text-slate-700">{club.citationScore.toLocaleString('en-IN')}</span>
                    <span className="text-slate-400">pts</span>
                  </div>
                </>
              )}
              <div className="w-px h-4 bg-slate-200" />
              {allDuesPaid
                ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs hover:bg-green-100">
                    Dues Compliant
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700 border-red-200 text-xs hover:bg-red-100">
                    {club.duesStatus?.outstanding != null
                      ? `₹${club.duesStatus.outstanding.toLocaleString('en-IN')} outstanding`
                      : `${duesPending} dues pending`}
                  </Badge>
                )
              }
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Mobile chips */}
        <div className="md:hidden flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 rounded-full px-3 py-1.5">
            <Users size={12} className="text-blue-600" />
            <span className="font-semibold text-slate-700">{club.members} members</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 rounded-full px-3 py-1.5">
            <Award size={12} className="text-amber-500" />
            <span className="text-slate-600">{club.president?.name}</span>
          </div>
          {club.citationScore != null && (
            <div className="flex items-center gap-1.5 text-xs bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
              <Star size={12} className="text-amber-500" />
              <span className="font-semibold text-amber-700">{club.citationScore.toLocaleString('en-IN')} pts</span>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full mb-6 bg-white border border-slate-200 shadow-sm h-auto p-1">
            <TabsTrigger value="membership" className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-900 data-[state=active]:text-white">
              <span className="hidden sm:inline">Membership</span>
              <span className="sm:hidden">Members</span>
            </TabsTrigger>
            <TabsTrigger value="foundation" className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-900 data-[state=active]:text-white">
              <span className="hidden sm:inline">Foundation</span>
              <span className="sm:hidden">TRF</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-900 data-[state=active]:text-white">
              Projects
            </TabsTrigger>
            <TabsTrigger value="goals" className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-900 data-[state=active]:text-white">
              <span className="hidden sm:inline">Goals</span>
              <span className="sm:hidden">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="dues" className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-900 data-[state=active]:text-white relative">
              Dues
              {!allDuesPaid && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">!</span>
              )}
            </TabsTrigger>
          </TabsList>

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
        </Tabs>
      </div>
    </div>
  )
}
