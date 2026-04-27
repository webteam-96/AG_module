import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'

const WEBSITE_MODULES = [
  {
    id: 'banners',
    title: 'Banner Photos',
    description: 'Upload and manage homepage banner/slider images for the club website.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    color: '#003DA5', count: '3 banners', status: 'Active',
    fields: ['Upload Image', 'Caption', 'Link URL', 'Display Order'],
  },
  {
    id: 'ads',
    title: 'Advertisement Area',
    description: 'Manage advertisement slots and promotional banners on the club website.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    color: '#9333ea', count: '2 ad slots', status: 'Active',
    fields: ['Ad Image', 'Link URL', 'Position', 'Active Status'],
  },
  {
    id: 'social',
    title: 'Social Media Links',
    description: 'Add or edit links to the club\'s Facebook, Instagram, Twitter, YouTube, and LinkedIn profiles.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
    color: '#0891b2', count: '4 platforms', status: 'Active',
    fields: ['Facebook URL', 'Instagram URL', 'Twitter/X URL', 'YouTube URL', 'LinkedIn URL'],
  },
  {
    id: 'logo',
    title: 'Club Logo',
    description: 'Upload or replace the official club logo displayed across the website.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    color: '#F7A81B', count: 'Logo set', status: 'Active',
    fields: ['Logo Image (PNG/SVG)', 'Alt Text'],
  },
  {
    id: 'menu',
    title: 'Menu List',
    description: 'Edit the navigation menu structure and links of the club website.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    ),
    color: '#16a34a', count: '7 menu items', status: 'Active',
    fields: ['Menu Label', 'Link URL', 'Parent Menu', 'Display Order', 'Visible'],
  },
  {
    id: 'theme',
    title: 'Change Theme',
    description: 'Select and apply a website colour theme from the available design templates.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10c0 2.21-.72 4.25-1.93 5.9L12 12l-8.07 5.9A10 10 0 0 1 12 2z"/>
      </svg>
    ),
    color: '#e11d48', count: 'Theme 3', status: 'Active',
    fields: ['Theme Selection', 'Primary Colour', 'Font Style'],
  },
  {
    id: 'contact',
    title: 'Contact Details',
    description: 'Edit club contact information, address, phone, and email displayed on the website.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19 19.5 19.5 0 0 1 5 12.63 19.79 19.79 0 0 1 2.12 3.18 2 2 0 0 1 4.11 1h3a2 2 0 0 1 2 1.72A12.84 12.84 0 0 0 9.81 5.5a2 2 0 0 1-.45 2.11L8.09 8.91A16 16 0 0 0 14 14.91l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    color: '#ca8a04', count: 'Updated', status: 'Active',
    fields: ['Club Name', 'Address', 'Phone', 'Email', 'Meeting Venue', 'Meeting Day & Time'],
  },
  {
    id: 'about',
    title: 'About',
    description: 'Edit the About Us page content, club history, and mission statement.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    color: '#64748b', count: 'Published', status: 'Active',
    fields: ['About Content (Rich Text)', 'History', 'Mission', 'Vision'],
  },
]

const SOCIAL_LINKS = [
  { platform: 'Facebook',  url: 'facebook.com/rotarythanecityview',  icon: '𝑓', color: '#1877f2' },
  { platform: 'Instagram', url: 'instagram.com/rc.thanecityview',     icon: '⊕', color: '#e1306c' },
  { platform: 'YouTube',   url: 'youtube.com/@thanecityviewrotary',   icon: '▶', color: '#ff0000' },
  { platform: 'LinkedIn',  url: 'linkedin.com/company/rc-thane',      icon: 'in', color: '#0a66c2' },
]

const CLUB_WEBSITE_URL = 'https://thanecityview.rotaryindia.org'

export default function WebsiteData() {
  const [activeModule, setActiveModule] = useState(null)
  const [socialLinks, setSocialLinks]   = useState(SOCIAL_LINKS)
  const [copied, setCopied]             = useState(false)
  const [banners, setBanners]           = useState({ filled: 3, total: 5 })
  const [ads, setAds]                   = useState({ filled: 2, total: 4 })

  function copyUrl() {
    navigator.clipboard.writeText(CLUB_WEBSITE_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Website Status"   value="Live"       sub="thanecityview.rotaryindia.org" subColor="up"    accent="#16a34a" />
        <StatCard label="Subscription"     value="Overdue"    sub="Expired Jan 31, 2026"          subColor="down"  accent="#e11d48" />
        <StatCard label="Last Updated"     value="Mar 30"     sub="Banner photos"                 subColor="muted" accent="#003DA5" />
        <StatCard label="Menu Items"       value="7"          sub="Navigation links"              subColor="muted" accent="#9333ea" />
      </div>

      {/* Share bar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span className="text-xs font-mono text-slate-600 truncate">{CLUB_WEBSITE_URL}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={copyUrl}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            style={{ color: copied ? '#16a34a' : '#475569' }}
          >
            {copied ? (
              <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
            ) : (
              <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Link</>
            )}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent('Visit our club website: ' + CLUB_WEBSITE_URL)}`}
            target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
            style={{ backgroundColor: '#25d366' }}
          >
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.528 5.855L0 24l6.335-1.505A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 0 1-5.002-1.368l-.359-.214-3.722.885.936-3.617-.235-.372A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            WhatsApp
          </a>
          <a
            href={`mailto:?subject=Visit our club website&body=Visit the Rotary Club of Thane City View website: ${CLUB_WEBSITE_URL}`}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email
          </a>
          <a
            href={CLUB_WEBSITE_URL} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
            style={{ backgroundColor: '#003DA5' }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Visit Site
          </a>
        </div>
      </div>

      {/* Banner & Ad slot cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Banner Photos */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#003DA508', color: '#003DA5' }}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Banner Photos</p>
                <p className="text-xs text-slate-500">{banners.filled} of {banners.total} slots used</p>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-[11px] text-slate-400 mb-1">{banners.filled}/{banners.total}</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${(banners.filled / banners.total) * 100}%`, backgroundColor: banners.filled >= banners.total ? '#ef4444' : '#003DA5' }} />
            </div>
          </div>
          <button
            onClick={() => setBanners(b => b.filled < b.total ? { ...b, filled: b.filled + 1 } : b)}
            disabled={banners.filled >= banners.total}
            className="w-full text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-white"
            style={{ backgroundColor: '#003DA5' }}
          >
            + Add Banner
          </button>
        </div>

        {/* Advertisement Area */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#9333ea08', color: '#9333ea' }}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Advertisement Area</p>
                <p className="text-xs text-slate-500">{ads.filled} of {ads.total} slots used</p>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-[11px] text-slate-400 mb-1">{ads.filled}/{ads.total}</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${(ads.filled / ads.total) * 100}%`, backgroundColor: ads.filled >= ads.total ? '#ef4444' : '#9333ea' }} />
            </div>
          </div>
          <button
            onClick={() => setAds(a => a.filled < a.total ? { ...a, filled: a.filled + 1 } : a)}
            disabled={ads.filled >= ads.total}
            className="w-full text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-white"
            style={{ backgroundColor: '#9333ea' }}
          >
            + Add Advertisement
          </button>
        </div>

      </div>

      {/* Subscription alert */}
      <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">Integrated Club Website — Subscription Overdue</p>
            <p className="text-xs text-red-500">Expired on 31/01/2026. Renew to keep your club website active.</p>
          </div>
        </div>
        <button className="text-xs font-bold text-white px-4 py-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#e11d48' }}>
          Renew Now
        </button>
      </div>

      {/* 8 Management tiles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Website Management</CardTitle>
          <CardDescription className="text-xs">Click a module to manage that section of your club website</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {WEBSITE_MODULES.map(mod => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
                className={`flex flex-col items-start gap-3 p-4 border rounded-xl text-left transition-all hover:shadow-md ${
                  activeModule === mod.id ? 'shadow-md border-2' : 'border-slate-200 hover:border-slate-300'
                }`}
                style={activeModule === mod.id ? { borderColor: mod.color, background: mod.color + '08' } : {}}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: mod.color + '18', color: mod.color }}>
                  {mod.icon}
                </div>
                <div className="w-full">
                  <p className="font-bold text-slate-900 text-sm">{mod.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{mod.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-slate-400">{mod.count}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-50 text-green-700">{mod.status}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Expanded panel for Social Media Links */}
          {activeModule === 'social' && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-800 mb-3">Social Media Links</p>
              <div className="space-y-2">
                {socialLinks.map((s, i) => (
                  <div key={s.platform} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: s.color }}>{s.platform[0]}</div>
                    <span className="text-xs font-medium text-slate-600 w-20">{s.platform}</span>
                    <input
                      value={s.url}
                      onChange={e => {
                        const u = [...socialLinks]; u[i] = { ...u[i], url: e.target.value }; setSocialLinks(u)
                      }}
                      className="flex-1 text-xs border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-white font-mono"
                    />
                  </div>
                ))}
                <button className="mt-2 text-xs font-semibold text-white px-4 py-2 rounded-md" style={{ backgroundColor: '#003DA5' }}>
                  Save Links
                </button>
              </div>
            </div>
          )}

          {/* Generic expanded panel for other modules */}
          {activeModule && activeModule !== 'social' && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              {(() => {
                const mod = WEBSITE_MODULES.find(m => m.id === activeModule)
                return (
                  <>
                    <p className="text-sm font-semibold text-slate-800 mb-3">
                      {mod.title} — Edit Fields
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {mod.fields.map(field => (
                        <div key={field}>
                          <label className="text-xs font-medium text-slate-600 block mb-1">{field}</label>
                          {field.toLowerCase().includes('content') || field.toLowerCase().includes('rich') ? (
                            <textarea rows={3}
                              className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-white resize-none"
                              placeholder={`Enter ${field.toLowerCase()}...`} />
                          ) : field.toLowerCase().includes('image') || field.toLowerCase().includes('logo') ? (
                            <div className="flex items-center gap-2">
                              <input type="file" accept="image/*" className="hidden" id={`file-${field}`} />
                              <label htmlFor={`file-${field}`}
                                className="text-xs font-medium text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md border border-blue-200 cursor-pointer">
                                Choose File
                              </label>
                              <span className="text-xs text-slate-400">No file chosen</span>
                            </div>
                          ) : field.toLowerCase().includes('theme') ? (
                            <select className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-white">
                              {['Theme 1 — Navy Blue','Theme 2 — Royal Blue','Theme 3 — Rotary Gold','Theme 4 — Forest Green'].map(t => (
                                <option key={t}>{t}</option>
                              ))}
                            </select>
                          ) : (
                            <input type="text"
                              className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-white"
                              placeholder={`Enter ${field.toLowerCase()}...`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="text-xs font-semibold text-white px-4 py-2 rounded-md" style={{ backgroundColor: '#003DA5' }}>Save</button>
                      <button onClick={() => setActiveModule(null)}
                        className="text-xs font-medium text-slate-600 px-4 py-2 rounded-md border border-slate-200 bg-white">Cancel</button>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
