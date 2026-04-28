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

const DOCUMENT_CATEGORIES = [
  {
    id: 'static',
    label: 'Static Documents',
    color: '#003DA5',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    docs: [
      { id:1, name:'Club Constitution & Bylaws',       uploadedBy:'Sec. Priya Mehta',    date:'Jul 5, 2025',  size:'1.2 MB', type:'PDF'  },
      { id:2, name:'Rotary Code of Policies',           uploadedBy:'Sec. Priya Mehta',    date:'Jul 5, 2025',  size:'3.4 MB', type:'PDF'  },
      { id:3, name:'Club BOD List 2025-26',             uploadedBy:'PP Arvind Kulkarni',  date:'Jul 10, 2025', size:'245 KB', type:'PDF'  },
      { id:4, name:'Club Membership Directory',         uploadedBy:'Sec. Priya Mehta',    date:'Aug 1, 2025',  size:'890 KB', type:'PDF'  },
    ],
  },
  {
    id: 'financial',
    label: 'Financial Documents',
    color: '#ca8a04',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    docs: [
      { id:1, name:'Audited Accounts 2024-25',          uploadedBy:'Treasurer R. Joshi',  date:'Sep 30, 2025', size:'2.1 MB', type:'PDF'  },
      { id:2, name:'Annual Budget 2025-26',             uploadedBy:'Treasurer R. Joshi',  date:'Jul 15, 2025', size:'560 KB', type:'XLSX' },
      { id:3, name:'Bank Statement — Mar 2026',         uploadedBy:'Treasurer R. Joshi',  date:'Apr 1, 2026',  size:'320 KB', type:'PDF'  },
      { id:4, name:'TRF Receipts Bundle 2025-26',       uploadedBy:'Treasurer R. Joshi',  date:'Mar 25, 2026', size:'4.5 MB', type:'PDF'  },
    ],
  },
  {
    id: 'trust',
    label: 'Trust Documents',
    color: '#9333ea',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    docs: [
      { id:1, name:'Trust Deed — Rotary Thane City',    uploadedBy:'PP Arvind Kulkarni',  date:'Jan 10, 2026', size:'1.8 MB', type:'PDF'  },
      { id:2, name:'Trust Registration Certificate',    uploadedBy:'PP Arvind Kulkarni',  date:'Jan 10, 2026', size:'620 KB', type:'PDF'  },
      { id:3, name:'80G / FCRA Certificates',           uploadedBy:'Treasurer R. Joshi',  date:'Feb 5, 2026',  size:'980 KB', type:'PDF'  },
      { id:4, name:'Trust PAN & Incorporation Docs',    uploadedBy:'PP Arvind Kulkarni',  date:'Jan 10, 2026', size:'750 KB', type:'PDF'  },
    ],
  },
  {
    id: 'grants',
    label: 'Grants',
    color: '#0891b2',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    docs: [
      { id:1, name:'Global Grant GG-2024-001 Application',uploadedBy:'Sec. Priya Mehta',  date:'Oct 15, 2025', size:'3.1 MB', type:'PDF'  },
      { id:2, name:'District Grant DG-3142-005',          uploadedBy:'Sec. Priya Mehta',  date:'Nov 5, 2025',  size:'1.4 MB', type:'PDF'  },
      { id:3, name:'Grant Completion Report 2023-24',     uploadedBy:'PP Arvind Kulkarni',date:'Jul 20, 2025', size:'2.8 MB', type:'PDF'  },
    ],
  },
  {
    id: 'additional',
    label: 'Additional Documents',
    color: '#16a34a',
    bg: 'bg-green-50',
    border: 'border-green-200',
    docs: [
      { id:1, name:'Annual Report 2024-25',              uploadedBy:'PP Arvind Kulkarni', date:'Jul 1, 2025',  size:'5.2 MB', type:'PDF'  },
      { id:2, name:'Project Reports Compendium',         uploadedBy:'Sec. Priya Mehta',   date:'Mar 15, 2026', size:'8.3 MB', type:'PDF'  },
      { id:3, name:'Club Brochure 2025-26',              uploadedBy:'Sec. Priya Mehta',   date:'Aug 5, 2025',  size:'1.6 MB', type:'PDF'  },
    ],
  },
  {
    id: 'dues',
    label: 'Dues',
    color: '#dc2626',
    bg: 'bg-red-50',
    border: 'border-red-200',
    docs: [
      { id:1, name:'RI Dues Payment Receipt Q1 2025-26', uploadedBy:'Treasurer R. Joshi', date:'Jul 31, 2025', size:'210 KB', type:'PDF'  },
      { id:2, name:'RI Dues Payment Receipt Q2 2025-26', uploadedBy:'Treasurer R. Joshi', date:'Oct 31, 2025', size:'215 KB', type:'PDF'  },
      { id:3, name:'District Dues Challan 2025-26',      uploadedBy:'Treasurer R. Joshi', date:'Aug 10, 2025', size:'180 KB', type:'PDF'  },
      { id:4, name:'Member Dues Register 2025-26',       uploadedBy:'Treasurer R. Joshi', date:'Apr 1, 2026',  size:'450 KB', type:'XLSX' },
    ],
  },
  {
    id: 'live',
    label: 'Live Documents',
    color: '#ea580c',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    docs: [
      { id:1, name:'Current Meeting Agenda',             uploadedBy:'Sec. Priya Mehta',   date:'Apr 26, 2026', size:'120 KB', type:'PDF'  },
      { id:2, name:'Active Project Status Tracker',      uploadedBy:'Sec. Priya Mehta',   date:'Apr 25, 2026', size:'340 KB', type:'XLSX' },
      { id:3, name:'Member Attendance Live Sheet',       uploadedBy:'Sec. Priya Mehta',   date:'Apr 28, 2026', size:'290 KB', type:'XLSX' },
    ],
  },
  {
    id: 'newsletters',
    label: 'Newsletters',
    color: '#db2777',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    docs: [
      { id:1, name:'Thane City View — Apr 2026',         uploadedBy:'Editor S. Kulkarni', date:'Apr 1, 2026',  size:'4.2 MB', type:'PDF'  },
      { id:2, name:'Thane City View — Mar 2026',         uploadedBy:'Editor S. Kulkarni', date:'Mar 1, 2026',  size:'3.9 MB', type:'PDF'  },
      { id:3, name:'Thane City View — Feb 2026',         uploadedBy:'Editor S. Kulkarni', date:'Feb 1, 2026',  size:'4.1 MB', type:'PDF'  },
      { id:4, name:'Thane City View — Jan 2026',         uploadedBy:'Editor S. Kulkarni', date:'Jan 1, 2026',  size:'3.7 MB', type:'PDF'  },
    ],
  },
]

const PPH_CAMPS = [
  { id:1, date:'Jan 25, 2026', location:'Kopri, Thane East',   children:280, rotarians:12, rotaractors:8,  coordinator:'Sunita Patil'   },
  { id:2, date:'Nov 2, 2025',  location:'Wagle Estate, Thane', children:320, rotarians:15, rotaractors:10, coordinator:'Ramesh Joshi'   },
  { id:3, date:'Feb 2, 2025',  location:'Mumbra, Thane',       children:210, rotarians:10, rotaractors:6,  coordinator:'Priya Desai'    },
]

const AUTO_POINTS_ROWS = [
  { id:1, award:'Membership Strength',    description:'Active & paid-up members above district threshold',      criteria:'142 members · 100% paid-up',       team:142, points:18000, maxPoints:20000 },
  { id:2, award:'Meeting Attendance',     description:'Average weekly meeting attendance across all sessions',  criteria:'82% avg · 6 sessions tracked',      team:116, points:9840,  maxPoints:12000 },
  { id:3, award:'TRF Contributions',      description:'Total Rotary Foundation funds raised this Rotary Year',  criteria:'₹1,58,000 raised · 8 donors',       team:8,   points:7900,  maxPoints:10000 },
  { id:4, award:'Monthly Reports',        description:'Secretary monthly reports submitted on time to district', criteria:'9 of 10 months on time',            team:2,   points:4500,  maxPoints:5000  },
  { id:5, award:'Service Projects',       description:'Community & vocational service projects completed',      criteria:'12 projects · 4 avenues covered',   team:38,  points:3600,  maxPoints:4000  },
  { id:6, award:'New Members Inducted',   description:'Net new members inducted during the Rotary Year',        criteria:'8 new members this RY',             team:8,   points:1270,  maxPoints:2000  },
]

const MANUAL_POINTS_ROWS = [
  { id:1, award:'Best Club Newsletter',       description:'Zonal award for best monthly club publication',           criteria:'Thane City View · Apr 2025 – Mar 2026', team:3,  points:5000, maxPoints:5000 },
  { id:2, award:'Community Service Excellence',description:'Recognition for flagship community service project',    criteria:'Blood Donation Drive · 280 units',       team:12, points:4880, maxPoints:5000 },
  { id:3, award:'Youth Service Program',      description:'Best youth empowerment initiative by the club',          criteria:'RYLA Local Chapter · 45 youth',          team:6,  points:4200, maxPoints:5000 },
  { id:4, award:'Vocational Service Award',   description:'Outstanding contribution to vocational training',        criteria:'Industry Visit Program · 3 sessions',    team:9,  points:3300, maxPoints:4000 },
  { id:5, award:'Environmental Initiative',   description:'Green projects and sustainability efforts',               criteria:'Tree Plantation · 200 saplings',         team:20, points:1000, maxPoints:4000 },
  { id:6, award:'International Service',      description:'Cross-border humanitarian or fellowship project',         criteria:'No submission this RY',                 team:0,  points:0,    maxPoints:3000 },
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
const OUTCOME_STYLE = {
  Excellent:    { bg: 'bg-green-50',  text: 'text-green-700'  },
  Satisfactory: { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  Pending:      { bg: 'bg-amber-50',  text: 'text-amber-700'  },
}
/* ── Zonal Awards — Points table ───────────────────────────────── */
function PointsTable({ rows, pointsColor, progressColor, total }) {
  const borderStyle = { borderWidth: '0.5px', borderColor: '#e2e8f0' }
  const rowBorderStyle = { borderWidth: '0.5px', borderColor: '#f1f5f9' }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {['Award', 'Criteria', 'Team', 'Progress', 'Points'].map((h, i) => (
              <th
                key={h}
                className={`px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 border-b ${
                  i === 2 ? 'text-center' : i === 4 ? 'text-right' : 'text-left'
                }`}
                style={borderStyle}
              >{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isLast = i === rows.length - 1
            const pct = row.maxPoints > 0 ? Math.round((row.points / row.maxPoints) * 100) : 0
            const isZero = row.points === 0
            return (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className={`px-4 py-3 ${isLast ? '' : 'border-b'}`} style={rowBorderStyle}>
                  <p className="text-[13px] font-medium text-slate-700 leading-snug">{row.award}</p>
                  <p className="text-[12px] text-slate-400 mt-0.5">{row.description}</p>
                </td>
                <td className={`px-4 py-3 text-xs text-slate-500 whitespace-nowrap ${isLast ? '' : 'border-b'}`} style={rowBorderStyle}>{row.criteria}</td>
                <td className={`px-4 py-3 text-center text-sm font-medium text-slate-600 ${isLast ? '' : 'border-b'}`} style={rowBorderStyle}>{row.team}</td>
                <td className={`px-4 py-3 ${isLast ? '' : 'border-b'}`} style={rowBorderStyle}>
                  <div className="w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: isZero ? '#ef4444' : progressColor }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{pct}%</p>
                </td>
                <td
                  className={`px-4 py-3 text-right font-bold tabular-nums text-sm ${isLast ? '' : 'border-b'}`}
                  style={{ ...rowBorderStyle, color: isZero ? '#ef4444' : pointsColor }}
                >
                  {isZero ? '—' : row.points.toLocaleString()}
                </td>
              </tr>
            )
          })}
          <tr className="bg-slate-50" style={{ borderTop: '0.5px solid #e2e8f0' }}>
            <td colSpan={4} className="px-4 py-2.5 text-xs font-semibold text-slate-500">Section Total</td>
            <td className="px-4 py-2.5 text-right text-sm font-extrabold tabular-nums" style={{ color: pointsColor }}>
              {total.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/* ── Zonal Awards — main panel ──────────────────────────────────── */
function ZonalAwardsPanel() {
  const [autoOpen,   setAutoOpen]   = useState(true)
  const [manualOpen, setManualOpen] = useState(true)

  const autoTotal  = AUTO_POINTS_ROWS.reduce((s, r) => s + r.points, 0)
  const manualTotal = MANUAL_POINTS_ROWS.reduce((s, r) => s + r.points, 0)
  const grandTotal  = autoTotal + manualTotal
  const autoPct    = Math.round((autoTotal  / grandTotal) * 100)
  const manualPct  = 100 - autoPct

  const Chevron = ({ open, color }) => (
    <svg
      width="16" height="16" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"
      style={{ transition: 'transform 0.2s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', flexShrink: 0 }}
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )

  return (
    <div className="space-y-5">
      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Total Points',    value:grandTotal,  sub:'Combined score',        color:'#185FA5', bg:'bg-blue-50'  },
          { label:'Auto-generated',  value:autoTotal,   sub:`${autoPct}% of total`,  color:'#0F6E56', bg:'bg-green-50' },
          { label:'Manual Points',   value:manualTotal, sub:`${manualPct}% of total`,color:'#854F0B', bg:'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl px-5 py-4`} style={{ border: '0.5px solid transparent' }}>
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="text-3xl font-extrabold tabular-nums" style={{ color: s.color }}>
              {s.value.toLocaleString()}
            </p>
            <p className="text-xs mt-1" style={{ color: s.color + '99' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Auto-generated section ── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <button
          onClick={() => setAutoOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          style={{ backgroundColor: '#E1F5EE' }}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1D9E75' }} />
            <span className="text-sm font-semibold" style={{ color: '#0F6E56' }}>Auto-generated Points</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#9FE1CB', color: '#0F6E56' }}>
              {autoTotal.toLocaleString()} pts
            </span>
          </div>
          <Chevron open={autoOpen} color="#0F6E56" />
        </button>
        {autoOpen && (
          <PointsTable rows={AUTO_POINTS_ROWS} pointsColor="#0F6E56" progressColor="#1D9E75" total={autoTotal} />
        )}
      </div>

      {/* ── Manual section ── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <button
          onClick={() => setManualOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          style={{ backgroundColor: '#FAEEDA' }}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EF9F27' }} />
            <span className="text-sm font-semibold" style={{ color: '#854F0B' }}>Manual Points</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#FAC775', color: '#854F0B' }}>
              {manualTotal.toLocaleString()} pts
            </span>
          </div>
          <Chevron open={manualOpen} color="#854F0B" />
        </button>
        {manualOpen && (
          <PointsTable rows={MANUAL_POINTS_ROWS} pointsColor="#854F0B" progressColor="#EF9F27" total={manualTotal} />
        )}
      </div>

      {/* ── Deadline banner ── */}
      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl" style={{ border: '0.5px solid #fde68a' }}>
        <svg width="15" height="15" fill="none" stroke="#ca8a04" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p className="text-xs text-amber-700">
          Zonal award submissions close on <span className="font-semibold">April 30, 2026</span>. Ensure all entries are submitted before the deadline.
        </p>
      </div>
    </div>
  )
}

/* ── Document type badge colors ────────────────────────────────── */
const DOC_TYPE_STYLE = {
  PDF:  { bg: 'bg-red-50',   text: 'text-red-600'   },
  XLSX: { bg: 'bg-green-50', text: 'text-green-700'  },
  DOCX: { bg: 'bg-blue-50',  text: 'text-blue-700'   },
}

/* ── Document category card ─────────────────────────────────────── */
function DocCategoryCard({ cat }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? cat.docs : cat.docs.slice(0, 3)

  return (
    <div className={`rounded-xl border ${cat.border} overflow-hidden flex flex-col`}>
      {/* Card header */}
      <div className={`${cat.bg} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            style={{ color: cat.color }}>
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.label}</span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70" style={{ color: cat.color }}>
          {cat.docs.length}
        </span>
      </div>

      {/* Document list */}
      <div className="flex-1 divide-y divide-slate-100 bg-white">
        {shown.map(doc => {
          const ts = DOC_TYPE_STYLE[doc.type] ?? DOC_TYPE_STYLE.PDF
          return (
            <div key={doc.id} className="px-4 py-2.5 flex items-start justify-between gap-2 hover:bg-slate-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate leading-snug">{doc.name}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{doc.date} · {doc.size}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ts.bg} ${ts.text}`}>{doc.type}</span>
                {/* Download */}
                <button className="p-1 rounded hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </button>
                {/* Delete */}
                <button className="p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Card footer */}
      <div className={`${cat.bg} px-4 py-2 flex items-center justify-between border-t ${cat.border}`}>
        {cat.docs.length > 3 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-xs font-semibold"
            style={{ color: cat.color }}
          >
            {expanded ? '▲ Show less' : `▼ +${cat.docs.length - 3} more`}
          </button>
        )}
        <button
          className="ml-auto text-xs font-semibold flex items-center gap-1"
          style={{ color: cat.color }}
        >
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Upload
        </button>
      </div>
    </div>
  )
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

/* ── Club Monthly Report data ───────────────────────────────────── */
const CMR_MONTHS = [
  { id:1,  month:'July 2025',      submittedOn:'Aug 2, 2025',  onTime:true,  status:'Submitted',   hasDetailed:true  },
  { id:2,  month:'August 2025',    submittedOn:'Sep 1, 2025',  onTime:true,  status:'Submitted',   hasDetailed:true  },
  { id:3,  month:'September 2025', submittedOn:'Oct 3, 2025',  onTime:true,  status:'Submitted',   hasDetailed:false },
  { id:4,  month:'October 2025',   submittedOn:'Nov 3, 2025',  onTime:true,  status:'Submitted',   hasDetailed:true  },
  { id:5,  month:'November 2025',  submittedOn:'Dec 2, 2025',  onTime:true,  status:'Submitted',   hasDetailed:true  },
  { id:6,  month:'December 2025',  submittedOn:'Jan 8, 2026',  onTime:false, status:'Submitted',   hasDetailed:false },
  { id:7,  month:'January 2026',   submittedOn:'Feb 5, 2026',  onTime:true,  status:'Submitted',   hasDetailed:true  },
  { id:8,  month:'February 2026',  submittedOn:'Mar 3, 2026',  onTime:true,  status:'Submitted',   hasDetailed:false },
  { id:9,  month:'March 2026',     submittedOn:null,           onTime:null,  status:'In Progress', hasDetailed:false },
  { id:10, month:'April 2026',     submittedOn:null,           onTime:null,  status:'Not Started', hasDetailed:false },
  { id:11, month:'May 2026',       submittedOn:null,           onTime:null,  status:'Not Started', hasDetailed:false },
  { id:12, month:'June 2026',      submittedOn:null,           onTime:null,  status:'Not Started', hasDetailed:false },
]

const CMR_STATUS_STYLE = {
  'Submitted':   { bg:'bg-green-50',  text:'text-green-700'  },
  'In Progress': { bg:'bg-amber-50',  text:'text-amber-700'  },
  'Not Started': { bg:'bg-slate-100', text:'text-slate-500'  },
}

function CMRActionBtn({ label, color, enabled, icon }) {
  return (
    <button
      disabled={!enabled}
      title={label}
      className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
      style={{
        color:           enabled ? color    : '#94a3b8',
        backgroundColor: enabled ? color + '18' : '#f8fafc',
        cursor:          enabled ? 'pointer' : 'not-allowed',
        opacity:         enabled ? 1 : 0.55,
        border:          `0.5px solid ${enabled ? color + '40' : '#e2e8f0'}`,
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function ClubMonthlyReportPanel() {
  const [year, setYear] = useState('2025-2026')

  const submitted  = CMR_MONTHS.filter(m => m.status === 'Submitted').length
  const inProgress = CMR_MONTHS.filter(m => m.status === 'In Progress').length
  const notStarted = CMR_MONTHS.filter(m => m.status === 'Not Started').length
  const detailed   = CMR_MONTHS.filter(m => m.hasDetailed).length
  const total      = CMR_MONTHS.length
  const pct        = Math.round((submitted / total) * 100)

  const hdStyle = { borderBottom: '0.5px solid #e2e8f0' }
  const tdBorder = (last) => ({ borderBottom: last ? 'none' : '0.5px solid #f1f5f9' })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">Club Monthly Report</p>
          <p className="text-xs text-slate-400 mt-0.5">Thane City View · {year}</p>
        </div>
        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          className="text-xs text-slate-600 rounded-lg bg-white"
          style={{ border: '0.5px solid #e2e8f0', padding: '6px 10px' }}
        >
          {['2025-2026','2024-2025','2023-2024','2022-2023'].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Months',     value:total,               color:'#003DA5', bg:'bg-blue-50'   },
          { label:'Submitted',        value:submitted,            color:'#16a34a', bg:'bg-green-50'  },
          { label:'Pending',          value:inProgress+notStarted,color:'#d97706', bg:'bg-amber-50'  },
          { label:'Detailed Reports', value:detailed,             color:'#9333ea', bg:'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3.5 text-center`} style={{ border:'0.5px solid transparent' }}>
            <p className="text-2xl font-extrabold tabular-nums" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1 text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-slate-50 rounded-xl p-4" style={{ border:'0.5px solid #e2e8f0' }}>
        <div className="flex justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">Submission Progress</span>
          <span className="text-xs font-bold text-green-700">{submitted} of {total} submitted ({pct}%)</span>
        </div>
        <div className="h-2.5 bg-white rounded-full overflow-hidden" style={{ border:'0.5px solid #e2e8f0' }}>
          <div className="h-full rounded-full bg-green-500 transition-all" style={{ width:`${pct}%` }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-amber-600">{inProgress} in progress</span>
          <span className="text-[11px] text-slate-400">{notStarted} not started</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl" style={{ border:'0.5px solid #e2e8f0' }}>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {[
                { h:'#',           cls:'text-center w-10'  },
                { h:'Month',       cls:'text-left'         },
                { h:'Submitted On',cls:'text-left'         },
                { h:'On Time',     cls:'text-center'       },
                { h:'Status',      cls:'text-center'       },
                { h:'Actions',     cls:'text-left'         },
              ].map(({ h, cls }) => (
                <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 ${cls}`} style={hdStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CMR_MONTHS.map((r, i) => {
              const ss         = CMR_STATUS_STYLE[r.status] ?? CMR_STATUS_STYLE['Not Started']
              const isSubmitted = r.status === 'Submitted'
              const hasData     = r.status !== 'Not Started'
              const isLast      = i === CMR_MONTHS.length - 1
              const bd          = tdBorder(isLast)
              return (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-center text-xs text-slate-400 tabular-nums" style={bd}>{i + 1}</td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-slate-700 whitespace-nowrap" style={bd}>{r.month}</td>
                  <td className="px-4 py-3 text-xs text-slate-500" style={bd}>{r.submittedOn ?? '—'}</td>
                  <td className="px-4 py-3 text-center" style={bd}>
                    {r.onTime === null
                      ? <span className="text-slate-300 text-xs">—</span>
                      : r.onTime
                        ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">✓ Yes</span>
                        : <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">✕ Late</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-center" style={bd}>
                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg ${ss.bg} ${ss.text}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={bd}>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <CMRActionBtn label="Create" color="#003DA5" enabled={r.status === 'Not Started'}
                        icon={<svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
                      />
                      <CMRActionBtn label="Edit" color="#16a34a" enabled={hasData}
                        icon={<svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                      />
                      <CMRActionBtn label="Club Report" color="#9333ea" enabled={isSubmitted}
                        icon={<svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
                      />
                      <CMRActionBtn label="Detailed" color="#d97706" enabled={r.hasDetailed}
                        icon={<svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Reports data ───────────────────────────────────────────────── */
const REPORT_SECTIONS = [
  {
    id: 'members', label: 'Members', color: '#185FA5', hoverBg: '#E6F1FB',
    reports: [
      { id:1, name:'Members',                  sub:'Active users in Rotary Zones 4, 5, 6 & 7 App' },
      { id:2, name:'Board of Directors (BOD)',  filter:{ options:['ALL','President','Secretary','Treasurer','Vice President','Director'] } },
      { id:3, name:'Members'                   },
      { id:4, name:'Family Details'            },
      { id:5, name:'Data Collection',          sub:'All Members'              },
      { id:6, name:'Data Collection',          sub:'President & Secretary'    },
      { id:7, name:'Data Collection',          sub:'District Committee'       },
    ],
  },
  {
    id: 'district', label: 'District', color: '#0F6E56', hoverBg: '#E1F5EE',
    reports: [
      { id:1, name:'District Citation' },
    ],
  },
  {
    id: 'clubs', label: 'Clubs', color: '#BA7517', hoverBg: '#FAEEDA',
    reports: [
      { id:1,  name:'Attendance',                    sub:'Meeting Wise'   },
      { id:2,  name:'Attendance',                    sub:'Member Wise'    },
      { id:3,  name:'Club Dues'                     },
      { id:4,  name:'Club Monthly Report'           },
      { id:5,  name:'Avenue of Service',             filter:{ options:['-All-','Club Service','Vocational Service','Community Service','International Service','Youth Service'] } },
      { id:6,  name:'Avenue of Service Raw Data',    sub:'Word Document'  },
      { id:7,  name:'Annual Club Service Raw Data',  sub:'Word Document'  },
      { id:8,  name:'PPH Camp'                      },
      { id:9,  name:'PPH Camp Attendees'            },
      { id:10, name:'TRF Contributions'             },
    ],
  },
]

/* ── Reports — section icons ────────────────────────────────────── */
const SECTION_ICON = {
  members: (c) => (
    <svg width="15" height="15" fill="none" stroke={c} strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  district: (c) => (
    <svg width="15" height="15" fill="none" stroke={c} strokeWidth="1.8" viewBox="0 0 24 24">
      <line x1="12" y1="2" x2="12" y2="6"/>
      <path d="M4 6h16v2H4zM2 8h20v2H2zM3 10v10h18V10"/>
      <rect x="9" y="14" width="6" height="6"/>
    </svg>
  ),
  clubs: (c) => (
    <svg width="15" height="15" fill="none" stroke={c} strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
}

/* ── Reports — Download pill button ─────────────────────────────── */
function DownloadPill({ color }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex items-center gap-1 transition-all whitespace-nowrap flex-shrink-0"
      style={{
        border: `0.5px solid ${color}`,
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        color: hov ? '#fff' : color,
        backgroundColor: hov ? color : 'transparent',
      }}
    >
      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Download
    </button>
  )
}

/* ── Reports — single row ───────────────────────────────────────── */
function ReportRow({ report, color, hoverBg, isLast }) {
  const [hov, setHov] = useState(false)
  const [filterVal, setFilterVal] = useState(report.filter?.options[0] ?? '')
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 transition-colors"
      style={{
        borderBottom: isLast ? 'none' : '0.5px solid #f1f5f9',
        backgroundColor: hov ? hoverBg : 'transparent',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="flex-1 min-w-0">
        <span className="text-[14px] text-slate-700">{report.name}</span>
        {report.sub && (
          <span className="ml-1.5 text-[12px] text-slate-400">{report.sub}</span>
        )}
      </div>
      {report.filter && (
        <select
          value={filterVal}
          onChange={e => setFilterVal(e.target.value)}
          className="text-xs text-slate-600 rounded-lg bg-white flex-shrink-0"
          style={{ border: '0.5px solid #e2e8f0', padding: '5px 8px', width: '160px' }}
        >
          {report.filter.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      <DownloadPill color={color} />
    </div>
  )
}

/* ── Reports — section card ─────────────────────────────────────── */
function ReportSectionCard({ section }) {
  return (
    <div
      className="bg-white rounded-xl flex flex-col overflow-hidden"
      style={{ border: '0.5px solid #e2e8f0', borderLeft: `3px solid ${section.color}` }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{ borderBottom: '0.5px solid #f1f5f9' }}
      >
        {SECTION_ICON[section.id](section.color)}
        <span className="text-[15px] font-medium" style={{ color: section.color }}>{section.label}</span>
        <span className="text-[12px] text-slate-400">
          {section.reports.length} report{section.reports.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex-1">
        {section.reports.map((r, i) => (
          <ReportRow
            key={r.id}
            report={r}
            color={section.color}
            hoverBg={section.hoverBg}
            isLast={i === section.reports.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Reports — main panel ───────────────────────────────────────── */
function ReportsPanel() {
  const [year, setYear] = useState('2025-2026')
  const members  = REPORT_SECTIONS.find(s => s.id === 'members')
  const district = REPORT_SECTIONS.find(s => s.id === 'district')
  const clubs    = REPORT_SECTIONS.find(s => s.id === 'clubs')

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">Reports</p>
          <p className="text-xs text-slate-400 mt-0.5">Thane City View</p>
        </div>
        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          className="text-xs text-slate-600 rounded-lg bg-white"
          style={{ border: '0.5px solid #e2e8f0', padding: '6px 10px' }}
        >
          {['2025-2026', '2024-2025', '2023-2024', '2022-2023'].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Two-column on xl, single on mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        {/* Left: Members + District */}
        <div className="flex flex-col gap-4">
          <ReportSectionCard section={members} />
          <ReportSectionCard section={district} />
        </div>
        {/* Right: Clubs */}
        <div>
          <ReportSectionCard section={clubs} />
        </div>
      </div>
    </div>
  )
}

/* ── Tabs config ─────────────────────────────────────────────────── */
const TABS = [
  { id: 'attendance', label: 'Attendance'        },
  { id: 'monthly',    label: 'Club Monthly Report' },
  { id: 'trf',        label: 'TRF Contribution'  },
  { id: 'citation',   label: 'District Citation' },
  { id: 'ocv',        label: 'OCV / GOV Documents' },
  { id: 'pph',        label: 'PPH Camp'          },
  { id: 'awards',     label: 'Zonal Awards'      },
  { id: 'reports',    label: 'Reports'           },
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
        <StatCard label="Documents"           value={DOCUMENT_CATEGORIES.reduce((s,c) => s + c.docs.length, 0)} sub="Across 8 categories"   subColor="muted" accent="#0891b2" />
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
          {activeTab === 'monthly' && <ClubMonthlyReportPanel />}

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

          {/* ── OCV / GOV — DOCUMENTS ────────────────────────────── */}
          {activeTab === 'ocv' && (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Club Documents</p>
                  <p className="text-xs text-slate-400 mt-0.5">All club documents organised by category</p>
                </div>
                <button
                  className="flex items-center gap-2 text-xs font-semibold text-white px-4 py-2 rounded-lg shadow-sm"
                  style={{ backgroundColor: '#003DA5' }}
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  Generate OCV Report
                </button>
              </div>

              {/* 8 Category Cards — 4 per row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {DOCUMENT_CATEGORIES.map(cat => (
                  <DocCategoryCard key={cat.id} cat={cat} />
                ))}
              </div>
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
          {activeTab === 'awards' && <ZonalAwardsPanel />}

          {/* ── REPORTS ──────────────────────────────────────────── */}
          {activeTab === 'reports' && <ReportsPanel />}

        </CardContent>
      </Card>
    </div>
  )
}
