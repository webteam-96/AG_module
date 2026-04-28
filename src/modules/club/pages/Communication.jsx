import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'
import { EVENTS, ANNOUNCEMENTS, DOCUMENTS } from '../data/clubData'

/* ── Greetings data ─────────────────────────────────────────────── */
const GREETINGS = [
  { id:1,  name:'Deepa Sharma',      role:'Member',              initials:'DS', color:'#9333ea', type:'Birthday',           date:'Apr 28', section:'today' },
  { id:2,  name:'Suresh Iyer',       role:'Sgt-at-Arms',         initials:'SI', color:'#0891b2', type:'Anniversary',        date:'Apr 28', section:'today' },
  { id:3,  name:'Anita Kulkarni',    role:'Treasurer',           initials:'AK', color:'#16a34a', type:'Birthday',           date:'Apr 30', section:'week'  },
  { id:4,  name:'Ramesh Joshi',      role:'Comm. Service Chair', initials:'RJ', color:'#f59e0b', type:'Rotary Anniversary', date:'May 1',  section:'week'  },
  { id:5,  name:'Khushboo Tadkar',   role:'President',           initials:'KT', color:'#003DA5', type:'Anniversary',        date:'May 2',  section:'week'  },
  { id:6,  name:'Praveen Mestry',    role:'Foundation Chair',    initials:'PM', color:'#ca8a04', type:'Birthday',           date:'May 6',  section:'month' },
  { id:7,  name:'Meera Shenoy',      role:'Membership Chair',    initials:'MS', color:'#e11d48', type:'Birthday',           date:'May 10', section:'month' },
  { id:8,  name:'Rohit Verma',       role:'Youth Service Chair', initials:'RV', color:'#0891b2', type:'Rotary Anniversary', date:'May 14', section:'month' },
  { id:9,  name:'Seema Kapoor',      role:'Member',              initials:'SK', color:'#9333ea', type:'Anniversary',        date:'May 19', section:'month' },
  { id:10, name:'Anil Mehta',        role:'Member',              initials:'AM', color:'#16a34a', type:'Birthday',           date:'May 24', section:'month' },
]

const TYPE_STYLE = {
  'Birthday':           { bg:'bg-rose-50',   text:'text-rose-600',  icon:'🎂' },
  'Anniversary':        { bg:'bg-pink-50',   text:'text-pink-700',  icon:'💍' },
  'Rotary Anniversary': { bg:'bg-blue-50',   text:'text-blue-700',  icon:'⭐' },
}

const ANN_COLORS = { urgent:'#f59e0b', normal:'#003DA5', info:'#16a34a', action:'#e11d48' }
const ANN_LABEL  = { urgent:'Urgent', normal:'Notice', info:'Info', action:'Action' }
const ANN_BADGE  = {
  urgent: 'bg-amber-50 text-amber-700',
  normal: 'bg-blue-50  text-blue-700',
  info:   'bg-green-50 text-green-700',
  action: 'bg-red-50   text-red-600',
}

const EVENT_COLORS = {
  Meeting:   { bg:'bg-blue-50',   text:'text-blue-700'   },
  Service:   { bg:'bg-red-50',    text:'text-red-700'    },
  TRF:       { bg:'bg-amber-50',  text:'text-amber-700'  },
  'New Gen': { bg:'bg-purple-50', text:'text-purple-700' },
  District:  { bg:'bg-slate-100', text:'text-slate-600'  },
}

const DOC_STYLE = {
  PDF: { bg:'bg-red-50',   text:'text-red-600',   accent:'#ef4444' },
  XLS: { bg:'bg-green-50', text:'text-green-700', accent:'#16a34a' },
  DOC: { bg:'bg-blue-50',  text:'text-blue-700',  accent:'#003DA5' },
}

/* ── Shared card header action button ───────────────────────────── */
function ActionBtn({ label }) {
  return (
    <button className="text-xs font-medium text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200 flex-shrink-0">
      {label}
    </button>
  )
}

export default function Communication() {
  const [greetSection, setGreetSection] = useState('today')
  const todayCount = GREETINGS.filter(g => g.section === 'today').length
  const greetRows  = GREETINGS.filter(g => g.section === greetSection)

  return (
    <div className="space-y-4">

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Upcoming Events"      value={EVENTS.length}        sub="Next 30 days"             subColor="muted" accent="#003DA5" />
        <StatCard label="Active Announcements" value={ANNOUNCEMENTS.length} sub="Active"                   subColor="muted" accent="#f59e0b" />
        <StatCard label="Newsletters"          value={9}                    sub="This RY"                  subColor="muted" accent="#0891b2" />
        <StatCard label="Shared Documents"     value={DOCUMENTS.length}     sub="Files"                    subColor="muted" accent="#16a34a" />
        <StatCard label="Greetings Today"      value={todayCount}           sub="Birthdays & anniversaries" subColor="up"    accent="#e11d48" />
      </div>

      {/* ── Row 1: Events · Announcements · Greetings ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Events */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm">Upcoming Events</CardTitle>
              <CardDescription className="text-xs">Next 30 days</CardDescription>
            </div>
            <ActionBtn label="+ Add" />
          </CardHeader>
          <CardContent className="pt-0 flex-1 divide-y divide-slate-100">
            {EVENTS.map(ev => {
              const d   = ev.date.split('-')[2]
              const mon = new Date(ev.date).toLocaleString('default', { month: 'short' })
              const col = EVENT_COLORS[ev.type] ?? EVENT_COLORS.District
              return (
                <div key={ev.id} className="flex gap-3 py-2.5 items-center">
                  <div className="w-10 text-center bg-slate-50 rounded-lg py-1.5 flex-shrink-0 border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{mon}</p>
                    <p className="text-base font-extrabold text-slate-800 leading-tight">{d}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 leading-snug truncate">{ev.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{ev.time} · {ev.venue}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${col.bg} ${col.text}`}>{ev.type}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm">Announcements</CardTitle>
              <CardDescription className="text-xs">Active notices for members</CardDescription>
            </div>
            <ActionBtn label="+ Post" />
          </CardHeader>
          <CardContent className="pt-0 flex-1 divide-y divide-slate-100">
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} className="py-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] text-slate-700 leading-snug flex-1">{a.text}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${ANN_BADGE[a.priority]}`}>
                    {ANN_LABEL[a.priority]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ANN_COLORS[a.priority] }} />
                  <p className="text-[11px] text-slate-400">{a.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Greetings */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm flex items-center gap-2">
                  Greetings
                  {todayCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                      {todayCount} today
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">Birthdays & anniversaries</CardDescription>
              </div>
              <ActionBtn label="Send All" />
            </div>
            {/* Section mini-tabs */}
            <div className="flex gap-1 mt-3">
              {[
                { id:'today', label:'Today' },
                { id:'week',  label:'Week'  },
                { id:'month', label:'Month' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setGreetSection(s.id)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    greetSection === s.id
                      ? 'text-white'
                      : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                  }`}
                  style={greetSection === s.id ? { backgroundColor:'#003DA5' } : {}}
                >
                  {s.label}
                  <span className={`ml-1 text-[10px] ${greetSection === s.id ? 'opacity-75' : 'text-slate-400'}`}>
                    {GREETINGS.filter(g => g.section === s.id).length}
                  </span>
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex-1">
            {greetRows.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No greetings for this period</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {greetRows.map(g => {
                  const ts = TYPE_STYLE[g.type] ?? TYPE_STYLE['Birthday']
                  return (
                    <div key={g.id} className="flex items-center gap-2.5 py-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                        style={{ backgroundColor: g.color }}
                      >
                        {g.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800 leading-snug truncate">{g.name}</p>
                        <p className="text-[11px] text-slate-400">{g.role}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${ts.bg} ${ts.text}`}>
                          {ts.icon} {g.type}
                        </span>
                        <span className="text-[10px] text-slate-400">{g.date}</span>
                      </div>
                      {/* Send buttons */}
                      <div className="flex gap-1 flex-shrink-0">
                        <button title="WhatsApp" className="w-6 h-6 rounded-md flex items-center justify-center bg-green-50 hover:bg-green-100 transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#16a34a">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.533 5.846L0 24l6.335-1.512A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.213-3.728.89.936-3.617-.234-.371A9.818 9.818 0 1 1 12 21.818z"/>
                          </svg>
                        </button>
                        <button title="Email" className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors">
                          <svg width="11" height="11" fill="none" stroke="#003DA5" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Documents as card tiles ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm">Documents & Newsletters</CardTitle>
            <CardDescription className="text-xs">Shared with club members</CardDescription>
          </div>
          <ActionBtn label="Upload" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DOCUMENTS.map(doc => {
              const ds = DOC_STYLE[doc.type] ?? DOC_STYLE.PDF
              return (
                <div
                  key={doc.id}
                  className="rounded-xl p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow cursor-pointer"
                  style={{ border:'0.5px solid #e2e8f0' }}
                >
                  {/* Type badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${ds.bg} ${ds.text}`}>
                      {doc.type}
                    </span>
                    <button
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                      title="Download"
                    >
                      <svg width="13" height="13" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  </div>
                  {/* File icon bar */}
                  <div
                    className="w-full h-1 rounded-full opacity-30"
                    style={{ backgroundColor: ds.accent }}
                  />
                  {/* Name */}
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700 leading-snug">{doc.name}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{doc.size} · {doc.date}</p>
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
