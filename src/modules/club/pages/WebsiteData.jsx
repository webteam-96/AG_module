import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'

/* ── Website modules (Active view) ─────────────────────────────── */
const WEBSITE_MODULES = [
  { id:'banners', title:'Banner Photos',       description:'Upload and manage homepage banner/slider images.',              icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,      color:'#003DA5', count:'3 banners',    fields:['Upload Image','Caption','Link URL','Display Order'] },
  { id:'ads',     title:'Advertisement Area',  description:'Manage advertisement slots and promotional banners.',          icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,  color:'#9333ea', count:'2 ad slots',   fields:['Ad Image','Link URL','Position','Active Status'] },
  { id:'social',  title:'Social Media Links',  description:'Edit links to Facebook, Instagram, Twitter, YouTube.',         icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,     color:'#0891b2', count:'4 platforms', fields:['Facebook URL','Instagram URL','Twitter/X URL','YouTube URL','LinkedIn URL'] },
  { id:'logo',    title:'Club Logo',           description:'Upload or replace the official club logo.',                    icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,     color:'#F7A81B', count:'Logo set',    fields:['Logo Image (PNG/SVG)','Alt Text'] },
  { id:'menu',    title:'Menu List',           description:'Edit the navigation menu structure and links.',                icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,   color:'#16a34a', count:'7 menu items',fields:['Menu Label','Link URL','Parent Menu','Display Order','Visible'] },
  { id:'theme',   title:'Change Theme',        description:'Select and apply a colour theme from design templates.',       icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10c0 2.21-.72 4.25-1.93 5.9L12 12l-8.07 5.9A10 10 0 0 1 12 2z"/></svg>, color:'#e11d48', count:'Theme 3',     fields:['Theme Selection','Primary Colour','Font Style'] },
  { id:'contact', title:'Contact Details',     description:'Edit club contact info, address, phone and email.',            icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19 19.5 19.5 0 0 1 5 12.63 19.79 19.79 0 0 1 2.12 3.18 2 2 0 0 1 4.11 1h3a2 2 0 0 1 2 1.72A12.84 12.84 0 0 0 9.81 5.5a2 2 0 0 1-.45 2.11L8.09 8.91A16 16 0 0 0 14 14.91l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, color:'#ca8a04', count:'Updated',     fields:['Club Name','Address','Phone','Email','Meeting Venue','Meeting Day & Time'] },
  { id:'about',   title:'About',               description:'Edit About Us page content, club history and mission.',        icon:<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,   color:'#64748b', count:'Published',   fields:['About Content (Rich Text)','History','Mission','Vision'] },
]

const SOCIAL_LINKS = [
  { platform:'Facebook',  url:'facebook.com/rotarythanecityview', color:'#1877f2' },
  { platform:'Instagram', url:'instagram.com/rc.thanecityview',   color:'#e1306c' },
  { platform:'YouTube',   url:'youtube.com/@thanecityviewrotary', color:'#ff0000' },
  { platform:'LinkedIn',  url:'linkedin.com/company/rc-thane',    color:'#0a66c2' },
]

const CLUB_WEBSITE_URL = 'https://thanecityview.rotaryindia.org'

/* ── Expired analytics mock data ────────────────────────────────── */
const ANALYTICS = {
  totalVisits:    12450,
  uniqueVisitors: 8230,
  projectViews:   3420,
  memberViews:    1890,
  avgDuration:    '2m 34s',
  bounceRate:     '38%',
  monthly: [
    { month:'Aug', visits:980  },
    { month:'Sep', visits:1120 },
    { month:'Oct', visits:1340 },
    { month:'Nov', visits:1050 },
    { month:'Dec', visits:890  },
    { month:'Jan', visits:1230 },
  ],
  topPages: [
    { page:'Home',           views:4820, pct:39 },
    { page:'Projects',       views:2310, pct:19 },
    { page:'Members',        views:1890, pct:15 },
    { page:'Events',         views:1540, pct:12 },
    { page:'Contact',        views:980,  pct:8  },
    { page:'About Us',       views:910,  pct:7  },
  ],
}

/* ── Popup modal ────────────────────────────────────────────────── */
function ConfirmPopup({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:'rgba(15,23,42,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" fill="none" stroke="#003DA5" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{title}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onConfirm}
            className="flex-1 text-xs font-bold text-white py-2.5 rounded-xl transition-colors"
            style={{ backgroundColor:'#003DA5' }}
          >
            Yes, Proceed
          </button>
          <button
            onClick={onCancel}
            className="flex-1 text-xs font-semibold text-slate-600 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function SuccessPopup({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:'rgba(15,23,42,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto">
          <svg width="28" height="28" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">Request Received!</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full text-xs font-bold text-white py-2.5 rounded-xl"
          style={{ backgroundColor:'#16a34a' }}
        >
          Got it
        </button>
      </div>
    </div>
  )
}

/* ── NEW variant ────────────────────────────────────────────────── */
function NewView() {
  const [popup, setPopup]       = useState(null) // 'trial' | 'demo'
  const [success, setSuccess]   = useState(null) // 'trial' | 'demo'

  const FEATURES = [
    { icon:'🌐', title:'Public Club Website',    desc:'A professional website for your club under the official Rotary India domain.' },
    { icon:'📋', title:'Project Showcase',       desc:'Highlight your community service projects, events, and impact stories.' },
    { icon:'👥', title:'Member Directory',       desc:'Display BOD, past presidents, and member profiles to the public.' },
    { icon:'📢', title:'Announcements & Events', desc:'Keep members and the public updated with upcoming meetings and events.' },
    { icon:'📸', title:'Photo Gallery',          desc:'Showcase your club activities with a beautiful image gallery.' },
    { icon:'📊', title:'Analytics Dashboard',   desc:'Track website visitors, page views, and engagement in real time.' },
  ]

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,#003DA5 0%,#1e5fb5 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-70 mb-1">Rotary India · Integrated Club Website</p>
          <h2 className="text-xl font-extrabold leading-snug">Give your club a professional<br/>online presence</h2>
          <p className="text-sm opacity-80 mt-2 max-w-lg">Your own website under <span className="font-mono font-semibold">rotaryindia.org</span> — zero setup, fully managed, ready in minutes.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => setPopup('trial')}
              className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-white transition-opacity hover:opacity-90"
              style={{ color:'#003DA5' }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Start Free Trial — 1 Month
            </button>
            <button
              onClick={() => setPopup('demo')}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border border-white/40 hover:bg-white/10 transition-colors"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Demo / Tutorial
            </button>
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full opacity-10" style={{ backgroundColor:'#F7A81B' }} />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor:'white' }} />
      </div>

      {/* Features grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">What's included</CardTitle>
          <CardDescription className="text-xs">Everything you need to manage your club's online presence</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {FEATURES.map(f => (
              <div key={f.title} className="flex gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{f.title}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


      {/* Popups */}
      {popup === 'trial' && (
        <ConfirmPopup
          title="Start your 1-month free trial?"
          message="You'll get full access to the Integrated Club Website for 30 days at no cost. Our team will set everything up for you."
          onConfirm={() => { setPopup(null); setSuccess('trial') }}
          onCancel={() => setPopup(null)}
        />
      )}
      {popup === 'demo' && (
        <ConfirmPopup
          title="Request a demo / tutorial?"
          message="Our team will schedule a live walkthrough of the Integrated Club Website platform at a time convenient for you."
          onConfirm={() => { setPopup(null); setSuccess('demo') }}
          onCancel={() => setPopup(null)}
        />
      )}
      {success && (
        <SuccessPopup
          message={
            success === 'trial'
              ? 'Our team will contact you shortly to activate your free 1-month trial and get your website live.'
              : 'Our team will contact you shortly to schedule your personalised demo and tutorial session.'
          }
          onClose={() => setSuccess(null)}
        />
      )}
    </div>
  )
}

/* ── EXPIRED variant ────────────────────────────────────────────── */
function ExpiredView() {
  const maxVisits = Math.max(...ANALYTICS.monthly.map(m => m.visits))

  return (
    <div className="space-y-5">
      {/* Alert banner */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">Website Subscription Expired</p>
            <p className="text-xs text-red-500 mt-0.5">Expired on 31 Jan 2026. Your website is no longer publicly accessible. Renew to restore it.</p>
          </div>
        </div>
        <button className="text-xs font-bold text-white px-4 py-2 rounded-xl flex-shrink-0" style={{ backgroundColor:'#e11d48' }}>
          Renew Subscription
        </button>
      </div>

      {/* Analytics KPI strip */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Website Analytics — Last Active Period (Jul 2025 – Jan 2026)</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            { label:'Total Visits',      value:ANALYTICS.totalVisits.toLocaleString(),    color:'#003DA5', bg:'bg-blue-50'   },
            { label:'Unique Visitors',   value:ANALYTICS.uniqueVisitors.toLocaleString(), color:'#16a34a', bg:'bg-green-50'  },
            { label:'Project Views',     value:ANALYTICS.projectViews.toLocaleString(),   color:'#9333ea', bg:'bg-purple-50' },
            { label:'Member Views',      value:ANALYTICS.memberViews.toLocaleString(),    color:'#0891b2', bg:'bg-cyan-50'   },
            { label:'Avg. Duration',     value:ANALYTICS.avgDuration,                     color:'#ca8a04', bg:'bg-amber-50'  },
            { label:'Bounce Rate',       value:ANALYTICS.bounceRate,                      color:'#64748b', bg:'bg-slate-100' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3.5 text-center`} style={{ border:'0.5px solid transparent' }}>
              <p className="text-xl font-extrabold tabular-nums" style={{ color:s.color }}>{s.value}</p>
              <p className="text-[11px] mt-1 text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Monthly visits bar chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Visits</CardTitle>
            <CardDescription className="text-xs">Jul 2025 – Jan 2026</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end gap-2 h-36">
              {ANALYTICS.monthly.map(m => {
                const h = Math.round((m.visits / maxVisits) * 100)
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-500 tabular-nums">{m.visits.toLocaleString()}</span>
                    <div className="w-full rounded-t-md transition-all" style={{ height:`${h}%`, backgroundColor:'#003DA5', opacity:0.85 }} />
                    <span className="text-[10px] text-slate-400">{m.month}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top pages */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Pages</CardTitle>
            <CardDescription className="text-xs">By page views during active period</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2.5">
            {ANALYTICS.topPages.map(p => (
              <div key={p.page} className="flex items-center gap-3">
                <span className="text-[13px] text-slate-700 w-20 truncate">{p.page}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width:`${p.pct}%` }} />
                </div>
                <span className="text-[12px] text-slate-500 tabular-nums w-12 text-right">{p.views.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 w-8 text-right">{p.pct}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

/* ── ACTIVE variant ─────────────────────────────────────────────── */
function ActiveView() {
  const [activeModule, setActiveModule] = useState(null)
  const [socialLinks, setSocialLinks]   = useState(SOCIAL_LINKS)
  const [copied, setCopied]             = useState(false)
  const [banners, setBanners]           = useState({ filled:3, total:5 })
  const [ads, setAds]                   = useState({ filled:2, total:4 })

  function copyUrl() {
    navigator.clipboard.writeText(CLUB_WEBSITE_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Website Status" value="Live"     sub="thanecityview.rotaryindia.org" subColor="up"    accent="#16a34a" />
        <StatCard label="Subscription"   value="Active"   sub="Expires Jun 30, 2026"          subColor="up"    accent="#003DA5" />
        <StatCard label="Last Updated"   value="Mar 30"   sub="Banner photos"                 subColor="muted" accent="#003DA5" />
        <StatCard label="Menu Items"     value="7"        sub="Navigation links"               subColor="muted" accent="#9333ea" />
      </div>

      {/* Share bar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span className="text-xs font-mono text-slate-600 truncate">{CLUB_WEBSITE_URL}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={copyUrl} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors" style={{ color: copied ? '#16a34a' : '#475569' }}>
            {copied
              ? <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
              : <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Link</>
            }
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent('Visit our club website: '+CLUB_WEBSITE_URL)}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor:'#25d366' }}>
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.528 5.855L0 24l6.335-1.505A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 0 1-5.002-1.368l-.359-.214-3.722.885.936-3.617-.235-.372A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            WhatsApp
          </a>
          <a href={`mailto:?subject=Visit our club website&body=Visit the Rotary Club of Thane City View website: ${CLUB_WEBSITE_URL}`} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email
          </a>
          <a href={CLUB_WEBSITE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor:'#003DA5' }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Visit Site
          </a>
        </div>
      </div>

      {/* Banner & Ad cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#003DA508', color:'#003DA5' }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Banner Photos</p>
              <p className="text-xs text-slate-500">{banners.filled} of {banners.total} slots used</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-[11px] text-slate-400 mb-1">{banners.filled}/{banners.total}</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width:`${(banners.filled/banners.total)*100}%`, backgroundColor: banners.filled>=banners.total?'#ef4444':'#003DA5' }} />
            </div>
          </div>
          <button onClick={() => setBanners(b => b.filled<b.total?{...b,filled:b.filled+1}:b)} disabled={banners.filled>=banners.total}
            className="w-full text-xs font-semibold py-2 rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor:'#003DA5' }}>
            + Add Banner
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#9333ea08', color:'#9333ea' }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Advertisement Area</p>
              <p className="text-xs text-slate-500">{ads.filled} of {ads.total} slots used</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-[11px] text-slate-400 mb-1">{ads.filled}/{ads.total}</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width:`${(ads.filled/ads.total)*100}%`, backgroundColor: ads.filled>=ads.total?'#ef4444':'#9333ea' }} />
            </div>
          </div>
          <button onClick={() => setAds(a => a.filled<a.total?{...a,filled:a.filled+1}:a)} disabled={ads.filled>=ads.total}
            className="w-full text-xs font-semibold py-2 rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor:'#9333ea' }}>
            + Add Advertisement
          </button>
        </div>
      </div>

      {/* 8 management tiles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Website Management</CardTitle>
          <CardDescription className="text-xs">Click a module to manage that section of your club website</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {WEBSITE_MODULES.map(mod => (
              <button key={mod.id} onClick={() => setActiveModule(activeModule===mod.id?null:mod.id)}
                className={`flex flex-col items-start gap-3 p-4 border rounded-xl text-left transition-all hover:shadow-md ${activeModule===mod.id?'shadow-md border-2':'border-slate-200 hover:border-slate-300'}`}
                style={activeModule===mod.id?{borderColor:mod.color,background:mod.color+'08'}:{}}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background:mod.color+'18', color:mod.color }}>{mod.icon}</div>
                <div className="w-full">
                  <p className="font-bold text-slate-900 text-sm">{mod.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{mod.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-slate-400">{mod.count}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-50 text-green-700">Active</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {activeModule === 'social' && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-800 mb-3">Social Media Links</p>
              <div className="space-y-2">
                {socialLinks.map((s, i) => (
                  <div key={s.platform} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background:s.color }}>{s.platform[0]}</div>
                    <span className="text-xs font-medium text-slate-600 w-20">{s.platform}</span>
                    <input value={s.url} onChange={e => { const u=[...socialLinks]; u[i]={...u[i],url:e.target.value}; setSocialLinks(u) }}
                      className="flex-1 text-xs border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-white font-mono" />
                  </div>
                ))}
                <button className="mt-2 text-xs font-semibold text-white px-4 py-2 rounded-md" style={{ backgroundColor:'#003DA5' }}>Save Links</button>
              </div>
            </div>
          )}

          {activeModule && activeModule !== 'social' && (() => {
            const mod = WEBSITE_MODULES.find(m => m.id === activeModule)
            return (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm font-semibold text-slate-800 mb-3">{mod.title} — Edit Fields</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mod.fields.map(field => (
                    <div key={field}>
                      <label className="text-xs font-medium text-slate-600 block mb-1">{field}</label>
                      {field.toLowerCase().includes('content') || field.toLowerCase().includes('rich') ? (
                        <textarea rows={3} className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-white resize-none" placeholder={`Enter ${field.toLowerCase()}...`} />
                      ) : field.toLowerCase().includes('image') || field.toLowerCase().includes('logo') ? (
                        <div className="flex items-center gap-2">
                          <input type="file" accept="image/*" className="hidden" id={`file-${field}`} />
                          <label htmlFor={`file-${field}`} className="text-xs font-medium text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md border border-blue-200 cursor-pointer">Choose File</label>
                          <span className="text-xs text-slate-400">No file chosen</span>
                        </div>
                      ) : field.toLowerCase().includes('theme') ? (
                        <select className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-white">
                          {['Theme 1 — Navy Blue','Theme 2 — Royal Blue','Theme 3 — Rotary Gold','Theme 4 — Forest Green'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      ) : (
                        <input type="text" className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-white" placeholder={`Enter ${field.toLowerCase()}...`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="text-xs font-semibold text-white px-4 py-2 rounded-md" style={{ backgroundColor:'#003DA5' }}>Save</button>
                  <button onClick={() => setActiveModule(null)} className="text-xs font-medium text-slate-600 px-4 py-2 rounded-md border border-slate-200 bg-white">Cancel</button>
                </div>
              </div>
            )
          })()}
        </CardContent>
      </Card>
    </div>
  )
}

/* ── Root component with variant switcher ───────────────────────── */
export default function WebsiteData() {
  const [variant, setVariant] = useState('active')

  const VARIANTS = [
    { id:'active',  label:'Active',  dot:'#16a34a', badge:'bg-green-50 text-green-700' },
    { id:'new',     label:'New',     dot:'#003DA5', badge:'bg-blue-50  text-blue-700'  },
    { id:'expired', label:'Expired', dot:'#e11d48', badge:'bg-red-50   text-red-600'   },
  ]

  return (
    <div className="space-y-4">
      {/* Variant switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">Club Website</p>
          <p className="text-xs text-slate-400 mt-0.5">Integrated Rotary India club website platform</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {VARIANTS.map(v => (
            <button
              key={v.id}
              onClick={() => setVariant(v.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                variant === v.id ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: v.dot }} />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {variant === 'active'  && <ActiveView  />}
      {variant === 'new'     && <NewView     />}
      {variant === 'expired' && <ExpiredView />}
    </div>
  )
}
