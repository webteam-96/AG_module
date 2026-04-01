import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { MONTHS, MONTHLY_STATUS } from '../data/monthlyReportData'

function statusBadge(submitted, total) {
  if (submitted === 0)     return { bg: '#fef2f2', text: '#e11d48',  label: `0/${total} submitted`           }
  if (submitted === total) return { bg: '#f0fdf4', text: '#16a34a',  label: `${total}/${total} submitted`    }
  return                          { bg: '#fffbeb', text: '#b45309',  label: `${submitted}/${total} submitted` }
}

export default function DistrictMonthlyReport() {
  const [whatsapp, setWhatsapp] = useState(false)

  const statuses = MONTHS.map(m => ({ ...m, ...MONTHLY_STATUS[m.id] }))
  const fullSubmission = statuses.filter(m => m.submitted === m.total).length
  const avgRate = Math.round(
    statuses.reduce((sum, m) => sum + (m.submitted / m.total) * 100, 0) / statuses.length
  )

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Months Tracked"    value={MONTHS.length}     sub="Jul 2025 – Apr 2026"  subColor="muted" accent="#003DA5" />
        <StatCard label="Full Submissions"  value={fullSubmission}    sub="All clubs submitted"  subColor="up"    accent="#16a34a" />
        <StatCard label="Avg Compliance"    value={`${avgRate}%`}     sub="Across all months"    subColor="muted" accent="#0891b2" />
        <StatCard label="Clubs in District" value={6}                 sub="Active clubs"         subColor="muted" accent="#9333ea" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3 pb-3">
          <div>
            <CardTitle className="text-sm">Club Monthly Report</CardTitle>
            <CardDescription className="text-xs">Submission status per month — RY 2025–26</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <button className="text-xs font-medium text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              Export to Excel
            </button>
            <div className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5">
              <span className="text-xs text-slate-600">WhatsApp Notify</span>
              <button
                onClick={() => setWhatsapp(w => !w)}
                className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${whatsapp ? 'bg-green-500' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${whatsapp ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {statuses.map(m => {
              const { label, bg, text } = statusBadge(m.submitted, m.total)
              return (
                <div key={m.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span className="text-sm font-medium text-slate-700">{m.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: bg, color: text }}>
                      {label}
                    </span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${(m.submitted / m.total) * 100}%`, backgroundColor: text }} />
                    </div>
                    <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
