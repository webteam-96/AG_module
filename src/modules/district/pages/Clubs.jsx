import { Card, CardContent } from '@/components/ui/card'
import StatCard from '../../club/components/StatCard'
import { CLUBS_5656 } from '../data/clubsData'

const DAY_COLORS = {
  Monday: '#003DA5', Tuesday: '#16a34a', Wednesday: '#9333ea',
  Thursday: '#0891b2', Friday: '#ca8a04', Saturday: '#e11d48', Sunday: '#64748b',
}

export default function DistrictClubs() {
  const totalMembers = CLUBS_5656.reduce((sum, c) => sum + c.members, 0)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Clubs"   value={CLUBS_5656.length} sub="Under District 5656" subColor="muted" accent="#003DA5" />
        <StatCard label="Total Members" value={totalMembers}       sub="Across all clubs"    subColor="muted" accent="#16a34a" />
        <StatCard label="Rotary Year"   value="2025–26"            sub="Active year"         subColor="muted" accent="#9333ea" />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-600 mb-3">All Clubs — District 5656</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {CLUBS_5656.map(club => {
            const dayColor = DAY_COLORS[club.meetingDay] ?? '#64748b'
            return (
              <Card key={club.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                      style={{ backgroundColor: dayColor }}>
                      {club.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 leading-snug">{club.name}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span className="text-xs text-slate-500">{club.meetingDay}</span>
                        <span className="text-slate-300">·</span>
                        <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span className="text-xs text-slate-500">{club.meetingTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                        </svg>
                        <span className="text-xs text-slate-500">{club.members} members</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: dayColor }}>{club.meetingDay}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
