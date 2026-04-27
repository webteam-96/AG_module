import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Menu, X } from 'lucide-react'
import { CLUB } from '../data/clubData'

const NAV = [
  { to: '/clubdashboard/overview',      label: 'Dashboard'                },
  { to: '/clubdashboard/avenue',        label: 'Avenue of Service'        },
  { to: '/clubdashboard/communication', label: 'Communication'            },
  { to: '/clubdashboard/egovernance',   label: 'E-Governance'             },
  { to: '/clubdashboard/payments',      label: 'Membership Dues'          },
  { to: '/clubdashboard/website',       label: 'My Club Website'          },
]

const PAGE_TITLES = {
  '/clubdashboard/overview':      'Club Dashboard',
  '/clubdashboard/avenue':        'Avenue of Service',
  '/clubdashboard/communication': 'Communication',
  '/clubdashboard/egovernance':   'E-Governance & Reporting',
  '/clubdashboard/payments':      'Membership Dues',
  '/clubdashboard/website':       'My Club Website',
}

export default function ClubLayout() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <img src="/logo.png" alt="Rotary" className="h-10 w-auto" />
        <p className="text-xs text-slate-400 mt-2 font-medium">Club Dashboard</p>
      </div>

      {/* User card */}
      <div className="px-3 py-3 border-b border-white/10">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
          <Avatar className="h-8 w-8 rounded-md flex-shrink-0">
            <AvatarFallback className="text-[#1e3a5f] text-xs font-bold rounded-md" style={{ background: '#F7A81B' }}>
              TC
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{CLUB.name}</p>
            <p className="text-slate-400 text-xs">Club President</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-2 py-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pb-2">Navigation</p>
        {NAV.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 mx-0.5 my-0.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-[#1e3a5f] font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#F7A81B' } : {}}
          >
            {({ isActive }) => (
              <>
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: isActive ? '#1e3a5f' : '#475569' }}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </ScrollArea>

      <Separator className="bg-white/10 mx-3" />
      <p className="text-slate-500 text-xs text-center tracking-widest uppercase py-3">
        Rotary Year {CLUB.rotaryYear}
      </p>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0" style={{ background: '#0f172a' }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative flex flex-col w-60 z-10 shadow-2xl" style={{ background: '#0f172a' }}>
            <button className="absolute top-3 right-3 text-slate-400 hover:text-white" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b-2 px-6 h-14 flex items-center justify-between flex-shrink-0" style={{ borderBottomColor: '#F7A81B' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <p className="text-slate-800 font-semibold text-base leading-tight">
                {PAGE_TITLES[location.pathname] ?? 'Club Dashboard'}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                {CLUB.name} · District {CLUB.district}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
