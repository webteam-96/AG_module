import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import StatCard from '../components/StatCard'
import {
  CLUB_STATS, ATTENDANCE_DATA, MONTHLY_REPORTS,
  CITATION_CHECKLIST, fmtINR, attendanceBg, attendanceColor,
} from '../data/clubData'

const STATUS_STYLE = {
  Accepted: { bg: 'bg-green-50', text: 'text-green-700' },
  Late:     { bg: 'bg-red-50',   text: 'text-red-600'   },
  Pending:  { bg: 'bg-amber-50', text: 'text-amber-700' },
}

const CITATION_ICON  = { done: '✓', partial: '~', incomplete: '✕' }
const CITATION_COLOR = { done: 'text-green-600', partial: 'text-amber-600', incomplete: 'text-red-600' }
const CITATION_BG    = { done: 'bg-green-50',    partial: 'bg-amber-50',    incomplete: 'bg-red-50'    }

export default function EGovernance() {
  const [activeTab, setActiveTab] = useState('attendance')
  const trfPct = Math.round((CLUB_STATS.trfRaised / CLUB_STATS.trfGoal) * 100)
  const citationPct = Math.round((CLUB_STATS.districtCitationScore / CLUB_STATS.districtCitationMax) * 100)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Reports Submitted" value={`${CLUB_STATS.reportsSubmitted}/${CLUB_STATS.reportsTotal}`} sub="89% on time"                                                         subColor="up"    accent="#003DA5" />
        <StatCard label="Avg Attendance"    value={`${CLUB_STATS.avgAttendance}%`}                             sub="▲ 4% YoY"                                                             subColor="up"    accent="#16a34a" />
        <StatCard label="TRF Raised"        value={fmtINR(CLUB_STATS.trfRaised)}                               sub={`${trfPct}% of goal`}                                                subColor="muted" accent="#ca8a04" />
        <StatCard label="District Citation" value={`${citationPct}%`}                                          sub={`${CLUB_STATS.districtCitationScore}/${CLUB_STATS.districtCitationMax} pts`} subColor="muted" accent="#9333ea" />
        <StatCard label="Zonal Awards"      value={CLUB_STATS.zonalAwards}                                     sub="This year"                                                            subColor="up"    accent="#0891b2" />
      </div>

      <Card>
        <CardContent className="pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 flex-wrap gap-1 h-auto">
              {['attendance', 'monthly', 'trf', 'citation', 'ocv', 'pph', 'awards'].map(t => (
                <TabsTrigger key={t} value={t} className="text-[10.5px]">
                  {t === 'attendance' ? 'Attendance' :
                   t === 'monthly'    ? 'Monthly Report' :
                   t === 'trf'        ? 'TRF Contribution' :
                   t === 'citation'   ? 'District Citation' :
                   t === 'ocv'        ? 'OCV / GOV' :
                   t === 'pph'        ? 'PPH Camp' : 'Zonal Awards'}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Attendance Tab */}
            <TabsContent value="attendance">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-semibold text-slate-700">Meeting Attendance Register</p>
                <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">Export</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['#', 'Meeting Date', 'Venue', 'Present', 'Total', 'Attendance %', 'Status'].map(h => (
                        <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {ATTENDANCE_DATA.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 cursor-pointer">
                        <td className="px-3 py-2.5 text-slate-400">{ATTENDANCE_DATA.length - i}</td>
                        <td className="px-3 py-2.5 font-semibold text-slate-700">{row.date}, 2026</td>
                        <td className="px-3 py-2.5 text-slate-500">Hotel Regency</td>
                        <td className="px-3 py-2.5 tabular-nums">{row.present}</td>
                        <td className="px-3 py-2.5 tabular-nums">{row.total}</td>
                        <td className="px-3 py-2.5">
                          <span className={`font-bold tabular-nums ${attendanceColor(row.pct)}`}>{row.pct}%</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                            row.pct >= 75 ? 'bg-green-50 text-green-700' :
                            row.pct >= 65 ? 'bg-amber-50 text-amber-700' :
                                            'bg-red-50 text-red-600'
                          }`}>
                            {row.pct >= 75 ? 'Good' : row.pct >= 65 ? 'Average' : 'Low'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Monthly Report Tab */}
            <TabsContent value="monthly">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-semibold text-slate-700">Monthly Report Submissions</p>
                <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">Submit Report</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['Month', 'Submitted On', 'On Time', 'Status'].map(h => (
                        <th key={h} className="text-left text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {MONTHLY_REPORTS.map((r, i) => {
                      const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.Pending
                      return (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 font-semibold text-slate-700">{r.month}</td>
                          <td className="px-3 py-2.5 text-slate-500">{r.submitted ?? '—'}</td>
                          <td className="px-3 py-2.5">
                            {r.onTime === null ? <span className="text-slate-300">—</span> :
                             r.onTime ? <span className="text-green-600 font-semibold">Yes</span> :
                                        <span className="text-red-600 font-semibold">Late</span>}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${s.bg} ${s.text}`}>{r.status}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* District Citation Tab */}
            <TabsContent value="citation">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-semibold text-slate-700">District Citation Checklist — {CLUB_STATS.districtCitationScore}/{CLUB_STATS.districtCitationMax} pts</p>
              </div>
              <div className="divide-y divide-slate-50">
                {CITATION_CHECKLIST.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${CITATION_BG[c.status]} ${CITATION_COLOR[c.status]}`}>
                      {CITATION_ICON[c.status]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11.5px] font-semibold text-slate-700">{c.criterion}</p>
                      <p className="text-[10px] text-slate-400">{c.detail}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${CITATION_BG[c.status]} ${CITATION_COLOR[c.status]}`}>
                      {c.earned}/{c.points} pts
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: `${citationPct}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  {CLUB_STATS.districtCitationScore} of {CLUB_STATS.districtCitationMax} points — {CLUB_STATS.districtCitationMax - CLUB_STATS.districtCitationScore} points needed for full citation
                </p>
              </div>
            </TabsContent>

            {/* TRF Tab */}
            <TabsContent value="trf">
              <p className="text-[12px] font-semibold text-slate-700 mb-3">TRF Contribution Summary</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-amber-700 tabular-nums">{fmtINR(CLUB_STATS.trfRaised)}</p>
                  <p className="text-[10px] text-amber-600 mt-1">Total Raised</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-slate-700 tabular-nums">{fmtINR(CLUB_STATS.trfGoal)}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Annual Goal</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-blue-700">{CLUB_STATS.phfContributors}</p>
                  <p className="text-[10px] text-blue-600 mt-1">PHF Contributors</p>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${trfPct}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">{trfPct}% of annual goal — {fmtINR(CLUB_STATS.trfGoal - CLUB_STATS.trfRaised)} remaining</p>
            </TabsContent>

            {/* Placeholder tabs */}
            {['ocv', 'pph', 'awards'].map(t => (
              <TabsContent key={t} value={t}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-slate-400 text-sm">No data available yet for this section.</p>
                  <button className="mt-3 text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">+ Add Entry</button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
