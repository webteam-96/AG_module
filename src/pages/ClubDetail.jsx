import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CLUBS } from '../data/district3192'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  ArrowLeft, Users, Heart, Award, Star, Briefcase,
  TrendingUp, AlertCircle, CheckCircle, Calendar, MapPin, User
} from 'lucide-react'

const ROTARY_BLUE = '#003DA5'
const ROTARY_GOLD = '#F7A81B'
const DONUT_COLORS = ['#003DA5', '#F7A81B', '#10B981', '#8B5CF6']

// ── helpers ────────────────────────────────────────────────────────────────

function fmt(n, decimals = 2) {
  return Number(n || 0).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function fmtUSD(n) {
  return `$${fmt(n)}`
}

function fmtINR(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function growthLabel(pct) {
  if (pct < 0) return { label: 'Declining', color: 'bg-red-100 text-red-700' }
  if (pct === 0) return { label: 'Stable', color: 'bg-yellow-100 text-yellow-700' }
  if (pct < 10) return { label: 'Growing', color: 'bg-blue-100 text-blue-700' }
  return { label: 'High Growth', color: 'bg-green-100 text-green-700' }
}

// ── small reusable components ───────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: accent + '18' }}>
        <Icon size={20} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-800 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function StatusBadge({ ok, trueLabel = 'Paid', falseLabel = 'Unpaid' }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      <CheckCircle size={12} /> {trueLabel}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      <AlertCircle size={12} /> {falseLabel}
    </span>
  )
}

function HBar({ label, value, benchmark, color }) {
  const pct = Math.min(value, 100)
  const bpct = Math.min(benchmark, 100)
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-bold" style={{ color }}>{fmt(value, 1)}%</span>
      </div>
      <div className="relative h-3 bg-gray-100 rounded-full overflow-visible">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
        {/* benchmark tick */}
        <div
          className="absolute top-0 h-full w-0.5 bg-gray-400"
          style={{ left: `${bpct}%` }}
          title={`District avg: ${benchmark}%`}
        />
      </div>
      <p className="text-xs text-gray-400 mt-0.5">District avg: {benchmark}%</p>
    </div>
  )
}

function CircularProgress({ pct }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = pct >= 80 ? '#10B981' : pct >= 50 ? ROTARY_GOLD : '#EF4444'

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#E5E7EB" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="65" textAnchor="middle" fontSize="22" fontWeight="bold" fill={color}>{Math.round(pct)}%</text>
        <text x="70" y="83" textAnchor="middle" fontSize="10" fill="#6B7280">Complete</text>
      </svg>
    </div>
  )
}

function OrgChips({ items }) {
  if (!items || items.length === 0) return <span className="text-gray-400 text-sm">—</span>
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {items.map((name, i) => (
        <span key={i} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          {name}
        </span>
      ))}
    </div>
  )
}

// ── tabs ────────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'Membership', 'Foundation (TRF)', 'Youth Services', 'Goals & Compliance']

// ── Tab 1: Overview ─────────────────────────────────────────────────────────

function TabOverview({ club }) {
  const { membership: m, trf, excellence: ex, serviceProjects: sp } = club
  const goalsCompletionPct = ex.goalsSet > 0 ? Math.round((ex.goalsCompleted / ex.goalsSet) * 100) : 0

  const growthData = [
    { period: 'July', members: m.atJuly },
    { period: 'Current', members: m.current },
  ]

  const trfDonut = [
    { name: 'Annual Fund', value: trf.annualFund },
    { name: 'PolioPlus', value: trf.polioPlus },
    { name: 'Other Funds', value: trf.otherFunds },
    { name: 'Endowment', value: trf.endowment },
  ].filter(d => d.value > 0)

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Current Members" value={m.current} sub={`+${m.current - m.atJuly} since July`} accent={ROTARY_BLUE} />
        <KpiCard icon={Heart} label="TRF Total" value={fmtUSD(trf.total)} sub={`${trf.donors} donors`} accent="#10B981" />
        <KpiCard icon={Briefcase} label="Service Projects" value={sp.projects} sub={`${sp.volunteers.toLocaleString()} volunteers`} accent={ROTARY_GOLD} />
        <KpiCard icon={Star} label="Goals Completion" value={`${goalsCompletionPct}%`} sub={`${ex.goalsCompleted} / ${ex.goalsSet} goals`} accent="#8B5CF6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member growth bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Member Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={growthData} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} />
              <Tooltip />
              <Bar dataKey="members" name="Members" radius={[6, 6, 0, 0]}>
                {growthData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#CBD5E1' : ROTARY_BLUE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TRF donut */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">TRF Breakdown</h3>
          {trfDonut.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={trfDonut} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {trfDonut.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmtUSD(v)} />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No TRF contributions recorded</div>
          )}
        </div>
      </div>

      {/* Status summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Status Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Award Status</span>
            <StatusBadge ok={ex.awardEarned} trueLabel="Earned" falseLabel="Not Earned" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">July Invoice</span>
            <StatusBadge ok={ex.julyInvoice} />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">January Invoice</span>
            <StatusBadge ok={ex.janInvoice} />
          </div>
        </div>
        {ex.duesOutstanding > 0 && (
          <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span className="text-sm text-red-700">Outstanding dues: <strong>{fmtINR(ex.duesOutstanding)}</strong></span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Tab 2: Membership ───────────────────────────────────────────────────────

function TabMembership({ club }) {
  const { membership: m } = club
  const DIST_FEMALE_AVG = 21.9
  const DIST_MYROTARY_AVG = 57.75
  const { label: growthTag, color: growthColor } = growthLabel(m.growth)

  const compositionData = [
    { name: 'Female', value: m.female },
    { name: 'Male', value: m.current - m.female },
  ]

  return (
    <div className="space-y-6">
      {/* top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Members at July</p>
          <p className="text-3xl font-bold text-gray-800">{m.atJuly}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Current Members</p>
          <p className="text-3xl font-bold" style={{ color: ROTARY_BLUE }}>{m.current}</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${growthColor}`}>{growthTag}</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Female Members</p>
          <p className="text-3xl font-bold text-gray-800">{m.female}</p>
          <p className="text-xs text-gray-500">{fmt(m.femalePercent, 1)}% of club</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">MyRotary Registered</p>
          <p className="text-3xl font-bold text-gray-800">{m.myRotary}</p>
          <p className="text-xs text-gray-500">{fmt(m.myRotaryPercent, 1)}% of club</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* horizontal bars */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-5">vs District Averages</h3>
          <HBar label="Female Members %" value={m.femalePercent} benchmark={DIST_FEMALE_AVG} color="#EC4899" />
          <HBar label="MyRotary Registration %" value={m.myRotaryPercent} benchmark={DIST_MYROTARY_AVG} color={ROTARY_BLUE} />
          <p className="text-xs text-gray-400 mt-2">Vertical line = district average</p>
        </div>

        {/* composition donut */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Member Composition</h3>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={compositionData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                <Cell fill="#EC4899" />
                <Cell fill={ROTARY_BLUE} />
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* growth info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Growth Details</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-gray-500 text-sm">Net change: </span>
            <span className={`font-bold text-sm ${m.current - m.atJuly >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {m.current - m.atJuly >= 0 ? '+' : ''}{m.current - m.atJuly} members
            </span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Growth rate: </span>
            <span className={`font-bold text-sm ${m.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {m.growth >= 0 ? '+' : ''}{fmt(m.growth, 2)}%
            </span>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${growthColor}`}>{growthTag}</span>
        </div>
      </div>
    </div>
  )
}

// ── Tab 3: Foundation ───────────────────────────────────────────────────────

function TabFoundation({ club, allClubs }) {
  const { trf } = club

  // compute zone total and district total
  const zoneTRF = allClubs.filter(c => c.zone === club.zone).reduce((s, c) => s + c.trf.total, 0)
  const distTRF = allClubs.reduce((s, c) => s + c.trf.total, 0)
  const zonePct = zoneTRF > 0 ? (trf.total / zoneTRF) * 100 : 0
  const distPct = distTRF > 0 ? (trf.total / distTRF) * 100 : 0

  const cards = [
    { label: 'Annual Fund', value: trf.annualFund, color: ROTARY_BLUE },
    { label: 'PolioPlus', value: trf.polioPlus, color: '#EF4444' },
    { label: 'Other Funds', value: trf.otherFunds, color: '#10B981' },
    { label: 'Endowment', value: trf.endowment, color: '#8B5CF6' },
    { label: 'Total', value: trf.total, color: ROTARY_GOLD, bold: true },
  ]

  const stackData = [
    {
      name: club.name,
      'Annual Fund': trf.annualFund,
      'PolioPlus': trf.polioPlus,
      'Other Funds': trf.otherFunds,
      'Endowment': trf.endowment,
    }
  ]

  return (
    <div className="space-y-6">
      {/* fund cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(c => (
          <div key={c.label} className={`bg-white rounded-xl border shadow-sm p-4 ${c.bold ? 'border-yellow-300 ring-1 ring-yellow-200' : 'border-gray-100'}`}>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{c.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: c.bold ? ROTARY_GOLD : c.color }}>{fmtUSD(c.value)}</p>
          </div>
        ))}
      </div>

      {/* donors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Donors</p>
          <p className="text-3xl font-bold text-gray-800">{trf.donors}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">New Donors</p>
          <p className="text-3xl font-bold" style={{ color: '#10B981' }}>{trf.newDonors}</p>
        </div>
      </div>

      {/* stacked bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Fund Breakdown</h3>
        {trf.total > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stackData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `$${v.toLocaleString()}`} />
              <YAxis type="category" dataKey="name" width={10} tick={false} />
              <Tooltip formatter={(v) => fmtUSD(v)} />
              <Legend iconType="circle" iconSize={10} />
              <Bar dataKey="Annual Fund" stackId="a" fill={ROTARY_BLUE} radius={[0,0,0,0]} />
              <Bar dataKey="PolioPlus" stackId="a" fill="#EF4444" />
              <Bar dataKey="Other Funds" stackId="a" fill="#10B981" />
              <Bar dataKey="Endowment" stackId="a" fill="#8B5CF6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-400 text-sm">No TRF contributions recorded</div>
        )}
      </div>

      {/* contribution % */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Contribution Share</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">% of Zone {club.zone} Total</p>
            <p className="text-2xl font-bold text-blue-700">{fmt(zonePct, 1)}%</p>
            <p className="text-xs text-blue-400">Zone total: {fmtUSD(zoneTRF)}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 font-medium">% of District Total</p>
            <p className="text-2xl font-bold text-purple-700">{fmt(distPct, 1)}%</p>
            <p className="text-xs text-purple-400">District total: {fmtUSD(distTRF)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Tab 4: Youth Services ───────────────────────────────────────────────────

function TabYouth({ club }) {
  const { sponsored: sp } = club
  const [open, setOpen] = useState({ rotary: false, rotaract: false, interact: false, rcc: false })
  const toggle = key => setOpen(o => ({ ...o, [key]: !o[key] }))

  const totalOrgs =
    sp.newRotaryClubs.length + sp.newRotaractClubs.length +
    sp.newInteractClubs.length + sp.sponsoredRCC.length

  if (totalOrgs === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-3">
        <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800">No youth organizations sponsored yet</p>
          <p className="text-sm text-amber-600 mt-1">
            This club has not sponsored any new Rotary clubs, Rotaract clubs, Interact clubs, or RCC communities this year.
          </p>
        </div>
      </div>
    )
  }

  const sections = [
    { key: 'rotary', label: 'New Rotary Clubs', items: sp.newRotaryClubs, color: ROTARY_BLUE },
    { key: 'rotaract', label: 'New Rotaract Clubs', items: sp.newRotaractClubs, color: '#8B5CF6' },
    { key: 'interact', label: 'New Interact Clubs', items: sp.newInteractClubs, color: '#10B981' },
    { key: 'rcc', label: 'Sponsored RCC', items: sp.sponsoredRCC, color: ROTARY_GOLD },
  ]

  return (
    <div className="space-y-4">
      {/* count cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map(s => (
          <div key={s.key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.items.length}</p>
          </div>
        ))}
      </div>

      {/* expandable lists */}
      {sections.map(s => s.items.length > 0 && (
        <div key={s.key} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => toggle(s.key)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-700">{s.label}</span>
            <span className="text-gray-400 text-sm">{open[s.key] ? '▲' : '▼'}</span>
          </button>
          {open[s.key] && (
            <div className="px-5 pb-4">
              <OrgChips items={s.items} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Tab 5: Goals & Compliance ───────────────────────────────────────────────

function TabGoals({ club }) {
  const { excellence: ex } = club
  const pct = ex.goalsSet > 0 ? (ex.goalsCompleted / ex.goalsSet) * 100 : 0
  const progressBarColor = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'

  return (
    <div className="space-y-6">
      {/* invoice + goals row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">July Invoice</p>
          <StatusBadge ok={ex.julyInvoice} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">January Invoice</p>
          <StatusBadge ok={ex.janInvoice} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Goals Set</p>
          <p className="text-3xl font-bold text-gray-800">{ex.goalsSet}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Goals Completed</p>
          <p className="text-3xl font-bold text-green-600">{ex.goalsCompleted}</p>
        </div>
      </div>

      {/* progress bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
          <span>Goals Progress</span>
          <span>{ex.goalsCompleted} / {ex.goalsSet}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${progressBarColor}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{Math.round(pct)}% of goals completed</p>
      </div>

      {/* award + circular progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* award badge */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center gap-3">
          <p className="text-sm font-semibold text-gray-600">Award Status</p>
          {ex.awardEarned ? (
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 rounded-full bg-green-100">
                <Award size={40} className="text-green-600" />
              </div>
              <span className="text-lg font-bold text-green-700">Club Excellence Award Earned</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 rounded-full bg-red-100">
                <Award size={40} className="text-red-400" />
              </div>
              <span className="text-lg font-bold text-red-500">Award Not Yet Earned</span>
            </div>
          )}
        </div>

        {/* circular progress */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-gray-600 mb-3">Goals Completion</p>
          <CircularProgress pct={pct} />
        </div>
      </div>

      {/* outstanding dues warning */}
      {ex.duesOutstanding > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Outstanding Dues</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{fmtINR(ex.duesOutstanding)}</p>
            <p className="text-sm text-red-500 mt-1">Please clear outstanding dues to maintain good standing.</p>
          </div>
        </div>
      )}

      {/* all clear */}
      {ex.duesOutstanding === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={18} className="text-green-600 shrink-0" />
          <p className="text-sm text-green-700 font-medium">No outstanding dues — club is in good financial standing.</p>
        </div>
      )}
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function ClubDetail() {
  const { clubId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  const club = CLUBS.find(c => c.id === clubId)

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <AlertCircle size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-600 mb-2">Club not found</h2>
        <p className="text-gray-400 text-sm mb-6">Club ID <code className="bg-gray-100 px-1.5 py-0.5 rounded">{clubId}</code> does not exist.</p>
        <button
          onClick={() => navigate('/clubs')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: ROTARY_BLUE }}
        >
          <ArrowLeft size={16} /> Back to Clubs
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div>
          {/* back button */}
          <button
            onClick={() => navigate('/clubs')}
            className="flex items-center gap-1.5 text-sm font-medium mb-4 hover:opacity-75 transition-opacity"
            style={{ color: ROTARY_BLUE }}
          >
            <ArrowLeft size={16} /> My Clubs
          </button>

          {/* club name row */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: ROTARY_BLUE }}>
                  RC {club.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar size={14} />
                    Chartered {club.charterDate}
                  </span>
                  <span
                    className="px-3 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: ROTARY_GOLD }}
                  >
                    Zone {club.zone}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">ID: {club.id}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase size={15} className="text-gray-400 shrink-0" />
                <span><span className="font-medium">AG:</span> {club.ag}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={15} className="text-gray-400 shrink-0" />
                <span><span className="font-medium">President:</span> {club.president}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab navigation ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-100">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === i
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                }`}
                style={activeTab === i ? { borderColor: ROTARY_BLUE, color: ROTARY_BLUE } : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === 0 && <TabOverview club={club} />}
            {activeTab === 1 && <TabMembership club={club} />}
            {activeTab === 2 && <TabFoundation club={club} allClubs={CLUBS} />}
            {activeTab === 3 && <TabYouth club={club} />}
            {activeTab === 4 && <TabGoals club={club} />}
          </div>
        </div>
      </div>
    </div>
  )
}
