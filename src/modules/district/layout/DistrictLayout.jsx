import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Menu, X } from 'lucide-react'

const NAV = [
  { to: '/districtdashboard/overview',       label: 'Overview'            },
  { to: '/districtdashboard/membership',     label: 'Membership'          },
  { to: '/districtdashboard/foundation',     label: 'Foundation'          },
  { to: '/districtdashboard/communication',  label: 'Communication'       },
  { to: '/districtdashboard/egovernance',    label: 'E-Governance'        },
  { to: '/districtdashboard/website-data',   label: 'Website Data'        },
]

const PAGE_TITLES = {
  '/districtdashboard/overview':       'District Dashboard',
  '/districtdashboard/membership':     'Membership',
  '/districtdashboard/foundation':     'Foundation',
  '/districtdashboard/communication':  'Communication',
  '/districtdashboard/egovernance':    'E-Governance & Reporting',
  '/districtdashboard/website-data':   'Website Data',
}

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <img src="/logo.png" alt="Rotary" className="h-10 w-auto" />
        <p className="text-xs text-slate-400 mt-2 font-medium">District Dashboard</p>
      </div>

      {/* Identity card */}
      <div className="px-3 py-3 border-b border-white/10">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
          <div className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: '#F7A81B', color: '#1e3a5f' }}>DG</div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold">District 5656</p>
            <p className="text-slate-400 text-xs">DG Office</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-2 py-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pb-2">Navigation</p>
        {NAV.map(({ to, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 mx-0.5 my-0.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-[#1e3a5f] font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#F7A81B' } : {}}
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: isActive ? '#1e3a5f' : '#475569' }} />
                  {label}
                </span>
                {badge != null && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#1e3a5f]/20 text-[#1e3a5f]' : 'bg-white/10 text-slate-300'
                  }`}>{badge}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </ScrollArea>

      <Separator className="bg-white/10 mx-3" />
      <p className="text-slate-500 text-xs text-center tracking-widest uppercase py-3">RY 2025–26</p>
    </div>
  )
}

export default function DistrictLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const title = PAGE_TITLES[location.pathname] ?? 'District Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0" style={{ background: '#0f172a' }}>
        <SidebarContent onClose={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative flex flex-col w-60 z-10 shadow-2xl" style={{ background: '#0f172a' }}>
            <button className="absolute top-3 right-3 text-slate-400 hover:text-white" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
            <SidebarContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b-2 px-6 h-14 flex items-center justify-between flex-shrink-0"
          style={{ borderBottomColor: '#F7A81B' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <p className="text-slate-800 font-semibold text-base leading-tight">{title}</p>
              <p className="text-slate-400 text-xs mt-0.5">District 5656 · RY 2025–26</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
    </div>
  )
}
