import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import {
  CLUB_STATS, ATTENDANCE_DATA, MONTHLY_REPORTS,
  CITATION_CHECKLIST, fmtINR,
} from '../data/clubData'

/* ── Extended mock data ─────────────────────────────────────────── */
const ATTENDANCE_SESSIONS = [
  { id:1, name:'Weekly Meeting',   date:'Apr 5, 2026',  present:116, total:142, pct:82  },
  { id:2, name:'Weekly Meeting',   date:'Mar 29, 2026', present:85,  total:142, pct:60  },
  { id:3, name:'Fellowship Night', date:'Mar 22, 2026', present:114, total:142, pct:80  },
  { id:4, name:'Weekly Meeting',   date:'Mar 15, 2026', present:97,  total:142, pct:68  },
  { id:5, name:'Board Meeting',    date:'Mar 8, 2026',  present:12,  total:12,  pct:100 },
  { id:6, name:'Weekly Meeting',   date:'Mar 1, 2026',  present:116, total:142, pct:82  },
]

const TRF_DONORS = [
  { id:1, name:'Praveen Mestry',  type:'Annual Fund',      amount:25000, phf: true,  date:'Mar 20, 2026', receipt:'TRF-2026-001' },
  { id:2, name:'Khushboo Tadkar', type:'Polio Plus',       amount:18000, phf: false, date:'Mar 15, 2026', receipt:'TRF-2026-002' },
  { id:3, name:'Rashid Shaikh',   type:'Annual Fund',      amount:15000, phf: false, date:'Mar 10, 2026', receipt:'TRF-2026-003' },
  { id:4, name:'Anita Kulkarni',  type:'Endowment Fund',   amount:50000, phf: true,  date:'Feb 28, 2026', receipt:'TRF-2026-004' },
  { id:5, name:'Arvind Kulkarni', type:'Annual Fund',      amount:12000, phf: false, date:'Feb 20, 2026', receipt:'TRF-2026-005' },
  { id:6, name:'Suresh Iyer',     type:'Polio Plus',       amount:10000, phf: false, date:'Feb 10, 2026', receipt:'TRF-2026-006' },
  { id:7, name:'Meera Shenoy',    type:'Annual Fund',      amount:8000,  phf: false, date:'Jan 25, 2026', receipt:'TRF-2026-007' },
  { id:8, name:'Deepa Sharma',    type:'Annual Fund',      amount:20000, phf: true,  date:'Jan 15, 2026', receipt:'TRF-2026-008' },
]

const OCV_GOV = [
  { id:1, type:'OCV',  visitDate:'Nov 15, 2025', governor:'AG Anita C Murgai',   venue:'Hotel Regency, Thane',   outcome:'Satisfactory', notes:'Club activities reviewed, BOD introduced'  },
  { id:2, type:'GOV',  visitDate:'Feb 10, 2026', governor:'DG Ramesh Sharma',    venue:'Vivanta Hotel, Thane',   outcome:'Excellent',    notes:'Governor commended TRF progress & projects' },
]

const PPH_CAMPS = [
  { id:1, date:'Jan 25, 2026', location:'Kopri, Thane East',   children:280, rotarians:12, rotaractors:8,  coordinator:'Sunita Patil'   },
  { id:2, date:'Nov 2, 2025',  location:'Wagle Estate, Thane', children:320, rotarians:15, rotaractors:10, coordinator:'Ramesh Joshi'   },
  { id:3, date:'Feb 2, 2025',  location:'Mumbra, Thane',       children:210, rotarians:10, rotaractors:6,  coordinator:'Priya Desai'    },
]

const ZONAL_AWARDS = [
  { id:1, category:'Best Community Service Project', submission:'Feb 28, 2026', project:'Blood Donation Drive',    status:'Submitted', result:'Awaited' },
  { id:2, category:'Best Club Newsletter',           submission:'Jan 15, 2026', project:'Thane City View Bulletin',status:'Submitted', result:'Won'     },
  { id:3, category:'Best Youth Service Program',     submission:'Mar 10, 2026', project:'RYLA — Local Chapter',    status:'Submitted', result:'Awaited' },
]

/* ── Style helpers ──────────────────────────────────────────────── */
const CITATION_ICON  = { done: '✓', partial: '~', incomplete: '✕' }
const CITATION_COLOR = { done: '#16a34a', partial: '#f59e0b', incomplete: '#ef4444' }

const pctColor  = (p) => p >= 75 ? '#16a34a' : p >= 65 ? '#f59e0b' : '#ef4444'
const pctBadge  = (p) => p >= 75
  ? 'bg-green-50 text-green-700'
  : p >= 65 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
const pctLabel  = (p) => p >= 75 ? 'Good' : p >= 65 ? 'Average' : 'Low'

const FUND_STYLE = {
  'Annual Fund':    { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  'Polio Plus':     { bg: 'bg-rose-50',   text: 'text-rose-700'   },
  'Endowment Fund': { bg: 'bg-purple-50', text: 'text-purple-700' },
}
const RESULT_STYLE = {
  Won:     { bg: 'bg-green-50',  text: 'text-green-700'  },
  Awaited: { bg: 'bg-amber-50',  text: 'text-amber-700'  },
  Lost:    { bg: 'bg-slate-100', text: 'text-slate-500'  },
}
const OUTCOME_STYLE = {
  Excellent:    { bg: 'bg-green-50',  text: 'text-green-700'  },
  Satisfactory: { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  Pending:      { bg: 'bg-amber-50',  text: 'text-amber-700'  },
}
const MONTHLY_STATUS = {
  Submitted: { bg: 'bg-green-50', text: 'text-green-700' },
  Late:     { bg: 'bg-red-50',   text: 'text-red-600'   },
  Pending:  { bg: 'bg-amber-50', text: 'text-amber-700' },
}

/* ── Reusable table shell ───────────────────────────────────────── */
function TableWrap({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  )
}
function TH({ children, center }) {
  return (
    <th className={`text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 bg-slate-50 border-b border-slate-200 whitespace-nowrap ${center ? 'text-center' : 'text-left'}`}>
      {children}
    </th>
  )
}
function TD({ children, center, mono, muted, bold }) {
  return (
    <td className={`px-4 py-3.5 text-sm border-b border-slate-100 ${center ? 'text-center' : ''} ${mono ? 'tabular-nums' : ''} ${muted ? 'text-slate-400' : 'text-slate-700'} ${bold ? 'font-semibold' : ''}`}>
      {children}
    </td>
  )
}
function ActionBtn({ color = 'blue', onClick, icon }) {
  const cls = color === 'red'
    ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
    : 'text-blue-500 hover:text-blue-700 hover:bg-blue-50'
  return (
    <button onClick={onClick} className={`p-1.5 rounded-lg transition-colors ${cls}`}>{icon}</button>
  )
}

const EditIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const DelIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

/* ── Tabs config ─────────────────────────────────────────────────── */
const TABS = [
  { id: 'attendance', label: 'Attendance'        },
  { id: 'monthly',    label: 'Monthly Report'    },
  { id: 'trf',        label: 'TRF Contribution'  },
  { id: 'citation',   label: 'District Citation' },
  { id: 'ocv',        label: 'OCV / GOV'         },
  { id: 'pph',        label: 'PPH Camp'          },
  { id: 'awards',     label: 'Zonal Awards'      },
]

/* ── Main component ──────────────────────────────────────────────── */
export default function EGovernance() {
  const [activeTab, setActiveTab] = useState('attendance')
  const trfPct      = Math.round((CLUB_STATS.trfRaised / CLUB_STATS.trfGoal) * 100)
  const citationPct = Math.round((CLUB_STATS.districtCitationScore / CLUB_STATS.districtCitationMax) * 100)
  const trfTotal    = TRF_DONORS.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="space-y-5">

      {/* KPI strip */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Club Monthly Report" value={`${CLUB_STATS.reportsSubmitted}/${CLUB_STATS.reportsTotal}`} sub="89% on time"           subColor="up"    accent="#003DA5" />
        <StatCard label="Avg Attendance"    value={`${CLUB_STATS.avgAttendance}%`}                             sub="▲ 4% YoY"              subColor="up"    accent="#16a34a" />
        <StatCard label="TRF Raised"        value={fmtINR(CLUB_STATS.trfRaised)}                               sub={`${trfPct}% of goal`}  subColor="muted" accent="#ca8a04" />
        <StatCard label="District Citation" value={`${CLUB_STATS.districtCitationScore} pts`}                  sub={`of ${CLUB_STATS.districtCitationMax} max`}                              subColor="muted" accent="#9333ea" />
        <StatCard label="OCV / GOV"          value={OCV_GOV.length}                                             sub="Projects added"        subColor="muted" accent="#0891b2" />
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">E-Governance & Reporting</CardTitle>
          <CardDescription className="text-xs">Attendance, reports, citations, TRF and district submissions</CardDescription>

          {/* Custom tab bar */}
          <div className="flex gap-1 mt-4 flex-wrap">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === t.id
                    ? 'text-[#1e3a5f] shadow-sm'
                    : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                }`}
                style={activeTab === t.id ? { backgroundColor: '#F7A81B' } : {}}
              >{t.label}</button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-5">

          {/* ── ATTENDANCE ──────────────────────────────────────── */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Meeting Attendance Register</p>
                <div className="flex gap-2">
                  <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#003DA5' }}>+ Add Session</button>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Export
                  </button>
                </div>
              </div>
              <TableWrap>
                <thead>
                  <tr>
                    <TH>Sr.No.</TH>
                    <TH>Attendance Name</TH>
                    <TH>Attendance Date</TH>
                    <TH center>Present</TH>
                    <TH center>Total</TH>
                    <TH center>Attendance %</TH>
                    <TH center>Status</TH>
                    <TH center>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {ATTENDANCE_SESSIONS.map((row, i) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <TD muted>{i + 1}</TD>
                      <TD bold>{row.name}</TD>
                      <TD>{row.date}</TD>
                      <TD center mono bold>{row.present}</TD>
                      <TD center mono muted>{row.total}</TD>
                      <TD center>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${row.pct}%`, backgroundColor: pctColor(row.pct) }} />
                          </div>
                          <span className="text-sm font-bold tabular-nums w-10" style={{ color: pctColor(row.pct) }}>{row.pct}%</span>
                        </div>
                      </TD>
                      <TD center>
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg ${pctBadge(row.pct)}`}>
                          {pctLabel(row.pct)}
                        </span>
                      </TD>
                      <TD center>
                        <div className="flex items-center justify-center gap-1">
                          <ActionBtn icon={<EditIcon />} />
                          <ActionBtn color="red" icon={<DelIcon />} />
                        </div>
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
              <p className="text-xs text-slate-400">{ATTENDANCE_SESSIONS.length} sessions recorded</p>
            </div>
          )}

          {/* ── MONTHLY REPORT ──────────────────────────────────── */}
          {activeTab === 'monthly' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Monthly Report Submissions</p>
                <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#003DA5' }}>Submit Report</button>
              </div>
              <TableWrap>
                <thead>
                  <tr>
                    <TH>Sr.No.</TH>
                    <TH>Month</TH>
                    <TH>Submitted On</TH>
                    <TH center>On Time</TH>
                    <TH center>Status</TH>
                    <TH center>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {MONTHLY_REPORTS.map((r, i) => {
                    const s = MONTHLY_STATUS[r.status] ?? MONTHLY_STATUS.Pending
                    return (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <TD muted>{i + 1}</TD>
                        <TD bold>{r.month}</TD>
                        <TD muted={!r.submitted}>{r.submitted ?? '—'}</TD>
                        <TD center>
                          {r.onTime === null
                            ? <span className="text-slate-300 text-xs">—</span>
                            : r.onTime
                              ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">✓ Yes</span>
                              : <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">✕ Late</span>
                          }
                        </TD>
                        <TD center>
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg ${s.bg} ${s.text}`}>{r.status}</span>
                        </TD>
                        <TD center>
                          <div className="flex items-center justify-center gap-1">
                            <ActionBtn icon={<EditIcon />} />
                            <ActionBtn color="red" icon={<DelIcon />} />
                          </div>
                        </TD>
                      </tr>
                    )
                  })}
                </tbody>
              </TableWrap>
              <p className="text-xs text-slate-400">{MONTHLY_REPORTS.length} months tracked this RY</p>
            </div>
          )}

          {/* ── TRF CONTRIBUTION ─────────────────────────────────── */}
          {activeTab === 'trf' && (
            <div className="space-y-4">
              {/* Summary tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                {[
                  { label: 'Total Raised',      value: fmtINR(CLUB_STATS.trfRaised), color: '#ca8a04', bg: 'bg-amber-50' },
                  { label: 'Annual Goal',        value: fmtINR(CLUB_STATS.trfGoal),  color: '#64748b', bg: 'bg-slate-50' },
                  { label: 'PHF Contributors',   value: CLUB_STATS.phfContributors,  color: '#9333ea', bg: 'bg-purple-50' },
                  { label: 'Donors This RY',     value: TRF_DONORS.length,           color: '#003DA5', bg: 'bg-blue-50'  },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3.5 text-center border border-white/50`}>
                    <p className="text-2xl font-extrabold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs mt-1" style={{ color: s.color + 'aa' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Goal progress */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">Progress to Annual Goal</span>
                  <span className="text-xs font-bold text-amber-700">{trfPct}% — {fmtINR(CLUB_STATS.trfGoal - CLUB_STATS.trfRaised)} remaining</span>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${trfPct}%` }} />
                </div>
              </div>

              {/* Donor table */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Donor-wise Contributions</p>
                <div className="flex gap-2">
                  <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#003DA5' }}>+ Add Contribution</button>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Export
                  </button>
                </div>
              </div>
              <TableWrap>
                <thead>
                  <tr>
                    <TH>Sr.No.</TH>
                    <TH>Donor Name</TH>
                    <TH>Fund Type</TH>
                    <TH center>Amount</TH>
                    <TH center>PHF</TH>
                    <TH>Date</TH>
                    <TH>Receipt No.</TH>
                    <TH center>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {TRF_DONORS.map((d, i) => {
                    const fs = FUND_STYLE[d.type] ?? FUND_STYLE['Annual Fund']
                    return (
                      <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                        <TD muted>{i + 1}</TD>
                        <TD bold>{d.name}</TD>
                        <TD>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${fs.bg} ${fs.text}`}>{d.type}</span>
                        </TD>
                        <TD center>
                          <span className="font-bold text-amber-700 tabular-nums">{fmtINR(d.amount)}</span>
                        </TD>
                        <TD center>
                          {d.phf
                            ? <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">✓ PHF</span>
                            : <span className="text-slate-300 text-xs">—</span>
                          }
                        </TD>
                        <TD muted>{d.date}</TD>
                        <TD><span className="font-mono text-xs text-slate-500">{d.receipt}</span></TD>
                        <TD center>
                          <div className="flex items-center justify-center gap-1">
                            <ActionBtn icon={<EditIcon />} />
                            <ActionBtn color="red" icon={<DelIcon />} />
                          </div>
                        </TD>
                      </tr>
                    )
                  })}
                </tbody>
              </TableWrap>
              <p className="text-xs text-slate-400">{TRF_DONORS.length} contributions · Total {fmtINR(trfTotal)}</p>
            </div>
          )}

          {/* ── DISTRICT CITATION ────────────────────────────────── */}
          {activeTab === 'citation' && (
            <div className="space-y-4">
              {/* Overall progress */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-center flex-shrink-0">
                  <p className="text-4xl font-extrabold text-rose-600 tabular-nums">{CLUB_STATS.districtCitationScore}</p>
                  <p className="text-xs text-slate-500 mt-0.5">of {CLUB_STATS.districtCitationMax} pts</p>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{CLUB_STATS.districtCitationScore} pts earned</span>
                    <span>{CLUB_STATS.districtCitationMax - CLUB_STATS.districtCitationScore} pts remaining</span>
                  </div>
                  <div className="h-3 bg-white rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full rounded-full bg-rose-500" style={{ width: `${citationPct}%` }} />
                  </div>
                </div>
              </div>

              {/* Checklist table */}
              <TableWrap>
                <thead>
                  <tr>
                    <TH>Sr.No.</TH>
                    <TH>Criterion</TH>
                    <TH>Detail / Evidence</TH>
                    <TH center>Max Pts</TH>
                    <TH center>Earned</TH>
                    <TH center>Status</TH>
                  </tr>
                </thead>
                <tbody>
                  {CITATION_CHECKLIST.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <TD muted>{i + 1}</TD>
                      <TD bold>{c.criterion}</TD>
                      <TD muted>{c.detail}</TD>
                      <TD center mono muted>{c.points}</TD>
                      <TD center>
                        <span className="text-sm font-extrabold tabular-nums" style={{ color: CITATION_COLOR[c.status] }}>
                          {c.earned}
                        </span>
                      </TD>
                      <TD center>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                          style={{
                            backgroundColor: CITATION_COLOR[c.status] + '18',
                            color: CITATION_COLOR[c.status],
                          }}>
                          {CITATION_ICON[c.status]}{' '}
                          {c.status === 'done' ? 'Complete' : c.status === 'partial' ? 'Partial' : 'Incomplete'}
                        </span>
                      </TD>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                    <td colSpan={3} className="px-4 py-3 text-sm font-bold text-slate-700">Total</td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-slate-700 tabular-nums">{CLUB_STATS.districtCitationMax}</td>
                    <td className="px-4 py-3 text-center text-sm font-extrabold tabular-nums text-rose-600">{CLUB_STATS.districtCitationScore}</td>
                    <td />
                  </tr>
                </tbody>
              </TableWrap>
            </div>
          )}

          {/* ── OCV / GOV ────────────────────────────────────────── */}
          {activeTab === 'ocv' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Official Visit Records</p>
                <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#003DA5' }}>+ Schedule Visit</button>
              </div>
              <TableWrap>
                <thead>
                  <tr>
                    <TH>Sr.No.</TH>
                    <TH>Visit Type</TH>
                    <TH>Visit Date</TH>
                    <TH>Governor / AG</TH>
                    <TH>Venue</TH>
                    <TH center>Outcome</TH>
                    <TH>Notes</TH>
                    <TH center>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {OCV_GOV.map((v, i) => {
                    const os = OUTCOME_STYLE[v.outcome] ?? OUTCOME_STYLE.Pending
                    return (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <TD muted>{i + 1}</TD>
                        <TD>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            v.type === 'GOV' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                          }`}>{v.type}</span>
                        </TD>
                        <TD>{v.visitDate}</TD>
                        <TD bold>{v.governor}</TD>
                        <TD muted>{v.venue}</TD>
                        <TD center>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${os.bg} ${os.text}`}>{v.outcome}</span>
                        </TD>
                        <TD><span className="text-xs text-slate-500 line-clamp-1">{v.notes}</span></TD>
                        <TD center>
                          <div className="flex items-center justify-center gap-1">
                            <ActionBtn icon={<EditIcon />} />
                            <ActionBtn color="red" icon={<DelIcon />} />
                          </div>
                        </TD>
                      </tr>
                    )
                  })}
                </tbody>
              </TableWrap>
              <p className="text-xs text-slate-400">{OCV_GOV.length} official visits recorded</p>
            </div>
          )}

          {/* ── PPH CAMP ─────────────────────────────────────────── */}
          {activeTab === 'pph' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">PPH Vaccination Camp Records</p>
                <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#003DA5' }}>+ Add Camp</button>
              </div>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Camps',      value: PPH_CAMPS.length,                                    color: '#003DA5', bg: 'bg-blue-50'  },
                  { label: 'Children Vaccinated',value: PPH_CAMPS.reduce((s,c) => s + c.children, 0),      color: '#16a34a', bg: 'bg-green-50' },
                  { label: 'Rotarians Involved', value: PPH_CAMPS.reduce((s,c) => s + c.rotarians, 0),     color: '#9333ea', bg: 'bg-purple-50'},
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3.5 text-center border border-white`}>
                    <p className="text-2xl font-extrabold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs mt-1 text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
              <TableWrap>
                <thead>
                  <tr>
                    <TH>Sr.No.</TH>
                    <TH>Camp Date</TH>
                    <TH>Location</TH>
                    <TH center>Children Vaccinated</TH>
                    <TH center>Rotarians</TH>
                    <TH center>Rotaractors</TH>
                    <TH>Coordinator</TH>
                    <TH center>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {PPH_CAMPS.map((c, i) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <TD muted>{i + 1}</TD>
                      <TD>{c.date}</TD>
                      <TD bold>{c.location}</TD>
                      <TD center>
                        <span className="text-lg font-extrabold text-green-600 tabular-nums">{c.children}</span>
                      </TD>
                      <TD center mono>{c.rotarians}</TD>
                      <TD center mono>{c.rotaractors}</TD>
                      <TD>{c.coordinator}</TD>
                      <TD center>
                        <div className="flex items-center justify-center gap-1">
                          <ActionBtn icon={<EditIcon />} />
                          <ActionBtn color="red" icon={<DelIcon />} />
                        </div>
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
              <p className="text-xs text-slate-400">{PPH_CAMPS.length} camps · {PPH_CAMPS.reduce((s,c) => s + c.children, 0)} children vaccinated total</p>
            </div>
          )}

          {/* ── ZONAL AWARDS ─────────────────────────────────────── */}
          {activeTab === 'awards' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Zonal Award Submissions</p>
                <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#003DA5' }}>+ Submit Entry</button>
              </div>
              <TableWrap>
                <thead>
                  <tr>
                    <TH>Sr.No.</TH>
                    <TH>Award Category</TH>
                    <TH>Project / Entry</TH>
                    <TH>Submission Date</TH>
                    <TH center>Status</TH>
                    <TH center>Result</TH>
                    <TH center>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {ZONAL_AWARDS.map((a, i) => {
                    const rs = RESULT_STYLE[a.result] ?? RESULT_STYLE.Awaited
                    return (
                      <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <TD muted>{i + 1}</TD>
                        <TD bold>{a.category}</TD>
                        <TD>{a.project}</TD>
                        <TD muted>{a.submission}</TD>
                        <TD center>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">{a.status}</span>
                        </TD>
                        <TD center>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${rs.bg} ${rs.text}`}>{a.result}</span>
                        </TD>
                        <TD center>
                          <div className="flex items-center justify-center gap-1">
                            <ActionBtn icon={<EditIcon />} />
                            <ActionBtn color="red" icon={<DelIcon />} />
                          </div>
                        </TD>
                      </tr>
                    )
                  })}
                </tbody>
              </TableWrap>
              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <svg width="16" height="16" fill="none" stroke="#ca8a04" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-xs text-amber-700">Zonal award submissions close on <span className="font-semibold">April 30, 2026</span>. Ensure all entries are submitted before the deadline.</p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
