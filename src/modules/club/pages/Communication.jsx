import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { EVENTS, ANNOUNCEMENTS, DOCUMENTS } from '../data/clubData'

const EVENT_COLORS = {
  Meeting:   { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  Service:   { bg: 'bg-red-50',    text: 'text-red-700'    },
  TRF:       { bg: 'bg-amber-50',  text: 'text-amber-700'  },
  'New Gen': { bg: 'bg-purple-50', text: 'text-purple-700' },
  District:  { bg: 'bg-slate-100', text: 'text-slate-600'  },
}

const ANN_COLORS = { urgent: '#f59e0b', normal: '#003DA5', info: '#16a34a', action: '#e11d48' }
const DOC_COLORS = { PDF: 'bg-red-50 text-red-600', XLS: 'bg-green-50 text-green-700', DOC: 'bg-blue-50 text-blue-700' }

export default function Communication() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Upcoming Events"      value={EVENTS.length}        sub="Next 30 days" subColor="muted" accent="#003DA5" />
        <StatCard label="Active Announcements" value={ANNOUNCEMENTS.length} sub="Active"        subColor="muted" accent="#f59e0b" />
        <StatCard label="Newsletters"          value={9}                    sub="This RY"       subColor="muted" accent="#0891b2" />
        <StatCard label="Shared Documents"     value={DOCUMENTS.length}     sub="Files"         subColor="muted" accent="#16a34a" />
      </div>

      {/* Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[12px]">Upcoming Events</CardTitle>
            <CardDescription className="text-[10px]">Scheduled for next 30 days</CardDescription>
          </div>
          <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">+ Add Event</button>
        </CardHeader>
        <CardContent className="pt-0 divide-y divide-slate-50">
          {EVENTS.map(ev => {
            const d = ev.date.split('-')[2]
            const mon = new Date(ev.date).toLocaleString('default', { month: 'short' })
            const col = EVENT_COLORS[ev.type] ?? EVENT_COLORS.District
            return (
              <div key={ev.id} className="flex gap-3 py-2.5 items-center">
                <div className="w-10 text-center bg-slate-50 rounded-lg py-1.5 flex-shrink-0">
                  <p className="text-[7.5px] font-bold text-slate-400 uppercase">{mon}</p>
                  <p className="text-[16px] font-extrabold text-slate-800 leading-tight">{d}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-slate-800">{ev.name}</p>
                  <p className="text-[10px] text-slate-400">{ev.time} · {ev.venue}</p>
                </div>
                <span className={`text-[9px] font-semibold px-2 py-1 rounded-md ${col.bg} ${col.text}`}>{ev.type}</span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {/* Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Announcements</CardTitle>
              <CardDescription className="text-[10px]">Active notices for members</CardDescription>
            </div>
            <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">+ Post</button>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-50">
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} className="flex gap-3 py-2.5 items-start">
                <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: ANN_COLORS[a.priority] }} />
                <div>
                  <p className="text-[11px] text-slate-600 leading-snug">{a.text}</p>
                  <p className="text-[9.5px] text-slate-400 mt-1">{a.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[12px]">Documents & Newsletters</CardTitle>
              <CardDescription className="text-[10px]">Shared with club members</CardDescription>
            </div>
            <button className="text-[10.5px] font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200">Upload</button>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-50">
            {DOCUMENTS.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-slate-50 -mx-4 px-4 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${DOC_COLORS[doc.type]}`}>
                  {doc.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-semibold text-slate-700">{doc.name}</p>
                  <p className="text-[9.5px] text-slate-400">{doc.size} · {doc.date}</p>
                </div>
                <button className="text-[11px] text-blue-700 hover:text-blue-900 font-medium px-1.5">↓</button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
