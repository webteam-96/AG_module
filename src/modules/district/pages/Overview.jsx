import { useNavigate } from 'react-router-dom'

const MODULES = [
  {
    label: 'Directory', badge: 29, route: '/districtdashboard/directory', color: '#003DA5',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: 'District Committee', badge: null, route: '/districtdashboard/committee', color: '#16a34a',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    label: 'Clubs', badge: 6, route: '/districtdashboard/clubs', color: '#9333ea',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: 'Club Monthly Report', badge: null, route: '/districtdashboard/monthly-report', color: '#0891b2',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    label: 'Club Moderator', badge: null, route: '/districtdashboard/moderator', color: '#ca8a04',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    label: 'AG / Zones', badge: null, route: '/districtdashboard/ag', color: '#e11d48',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    label: 'Website Data', badge: null, route: '/districtdashboard/website-data', color: '#64748b',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
      </svg>
    ),
  },
]

export default function DistrictOverview() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">District 5656</h1>
        <p className="text-slate-400 text-sm mt-1">Rotary Year 2025–26 · 6 Clubs · 152 Members</p>
      </div>

      {/* Module tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {MODULES.map(({ label, badge, route, color, icon }) => (
          <button
            key={route}
            onClick={() => navigate(route)}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center gap-3 hover:shadow-md hover:border-slate-300 transition-all text-center group"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: color + '18', color }}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-snug">{label}</p>
              {badge != null && (
                <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: color }}>{badge}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
