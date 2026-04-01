import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  LayoutDashboard, Shield, Phone, FileText,
  CreditCard, Users, ChevronRight, Menu, X,
} from 'lucide-react'
import { CLUB } from '../data/clubData'

const SUB_NAV = [
  { to: '/clubdashboard/overview',      icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clubdashboard/avenue',        icon: Shield,          label: 'Avenue of Service' },
  { to: '/clubdashboard/communication', icon: Phone,           label: 'Communication' },
  { to: '/clubdashboard/egovernance',   icon: FileText,        label: 'E-Governance & Reporting' },
  { to: '/clubdashboard/payments',      icon: CreditCard,      label: 'Payments' },
  { to: '/clubdashboard/directory',     icon: Users,           label: 'Directory & Leadership' },
]

const PAGE_TITLES = {
  '/clubdashboard/overview':      'Club Overview',
  '/clubdashboard/avenue':        'Avenue of Service',
  '/clubdashboard/communication': 'Communication',
  '/clubdashboard/egovernance':   'E-Governance & Reporting',
  '/clubdashboard/payments':      'Payments',
  '/clubdashboard/directory':     'Directory & Leadership',
}

export default function ClubLayout() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [ddOpen, setDdOpen] = useState(true)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#F7A81B,#e09210)', color: '#1e3a5f' }}
          >RI</div>
          <div>
            <p className="text-white text-[11px] font-bold leading-tight">Rotary International</p>
            <p className="text-slate-500 text-[9px] mt-0.5">Club Dashboard</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="px-3 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 bg-white/4 rounded-lg px-2.5 py-2">
          <Avatar className="h-6 w-6 rounded-md flex-shrink-0">
            <AvatarFallback className="text-white text-[9px] font-bold rounded-md" style={{ background: '#16a34a' }}>
              TC
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-white text-[11px] font-semibold truncate">{CLUB.name}</p>
            <p className="text-slate-500 text-[9px]">Club President</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-2 py-2">
        <p className="text-[8.5px] font-semibold text-slate-600 uppercase tracking-widest px-2 pt-2 pb-1">Navigation</p>

        {/* Collapsible Overview parent */}
        <button
          onClick={() => setDdOpen(v => !v)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
        >
          <LayoutDashboard size={13} className="flex-shrink-0" />
          <span className="flex-1 text-left">Overview</span>
          <ChevronRight
            size={12}
            className="flex-shrink-0 transition-transform duration-200"
            style={{ transform: ddOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
          />
        </button>

        {/* Dropdown items */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: ddOpen ? '400px' : '0px' }}
        >
          {SUB_NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 pl-8 pr-2 py-[5px] mx-1 my-[1px] rounded-md text-[10.5px] font-medium transition-all ${
                  isActive
                    ? 'text-sky-400 bg-blue-900/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/4'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: isActive ? '#60a5fa' : 'currentColor', opacity: isActive ? 1 : 0.5 }}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </ScrollArea>

      <Separator className="bg-white/5 mx-3" />
      <p className="text-slate-600 text-[8.5px] text-center tracking-widest uppercase py-2.5">
        Rotary Year {CLUB.rotaryYear}
      </p>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0" style={{ background: '#080e1c' }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative flex flex-col w-56 z-10 shadow-2xl" style={{ background: '#080e1c' }}>
            <button className="absolute top-3 right-3 text-slate-400 hover:text-white" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-5 h-[50px] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100" onClick={() => setOpen(true)}>
              <Menu size={18} />
            </button>
            <div>
              <p className="text-slate-800 font-semibold text-sm leading-tight">
                {PAGE_TITLES[location.pathname] ?? 'Club Dashboard'}
              </p>
              <p className="text-slate-400 text-[10px]">
                Club Dashboard / {CLUB.name}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
