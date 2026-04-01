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

export default function WebsiteData() {
  const [activeModule, setActiveModule] = useState(null)
  const [socialLinks, setSocialLinks]   = useState(SOCIAL_LINKS)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Website Status"   value="Live"       sub="thanecityview.rotaryindia.org" subColor="up"    accent="#16a34a" />
        <StatCard label="Subscription"     value="Overdue"    sub="Expired Jan 31, 2026"          subColor="down"  accent="#e11d48" />
        <StatCard label="Last Updated"     value="Mar 30"     sub="Banner photos"                 subColor="muted" accent="#003DA5" />
        <StatCard label="Menu Items"       value="7"          sub="Navigation links"              subColor="muted" accent="#9333ea" />
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
