import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard, TrendingUp, Heart, Award,
  Star, Briefcase, BarChart3, Menu, X,
} from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/agdashboard/clubs',      icon: LayoutDashboard, label: 'My Clubs'         },
  { to: '/agdashboard/membership', icon: TrendingUp,      label: 'Membership'       },
  { to: '/agdashboard/trf',        icon: Heart,           label: 'Foundation & TRF' },
  { to: '/agdashboard/excellence', icon: Award,           label: 'Goals'            },
  { to: '/agdashboard/youth',      icon: Star,            label: 'Youth Services'   },
  { to: '/agdashboard/projects',   icon: Briefcase,       label: 'Service Projects' },
  { to: '/agdashboard/district',   icon: BarChart3,       label: 'District View'    },
]

const AG_NAME = 'Anita C Murgai'

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('')
}

function pageName(pathname) {
  const map = {
    '/agdashboard/clubs':      'My Clubs',
    '/agdashboard/membership': 'Membership',
    '/agdashboard/trf':        'TRF & Foundation',
    '/agdashboard/excellence': 'Club Excellence',
    '/agdashboard/youth':      'Youth Services',
    '/agdashboard/projects':   'Service Projects',
    '/agdashboard/district':   'District View',
  }
  return map[pathname] ?? 'Dashboard'
}

export default function AGLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const initials = getInitials(AG_NAME)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <img src="/logo.png" alt="Rotary" className="h-10 w-auto" />
        <p className="text-xs text-slate-400 mt-2 font-medium">AG Dashboard</p>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: '#F7A81B', color: '#1e3a5f' }}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-tight truncate">{AG_NAME}</p>
            <p className="text-slate-400 text-xs mt-0.5">Assistant Governor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 pb-2">Navigation</p>
        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive ? 'text-[#1e3a5f] shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: '#F7A81B' } : {}}
            >
              <Icon size={17} className="flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      <Separator className="bg-white/10 mx-4" />
      <div className="px-4 py-3">
        <p className="text-slate-500 text-xs text-center tracking-wide uppercase">District 3142 · RY 2026–27</p>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0" style={{ backgroundColor: '#0f172a' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-60 flex-shrink-0 z-10 shadow-2xl" style={{ backgroundColor: '#0f172a' }}>
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b-2 px-6 py-0 flex items-center justify-between flex-shrink-0 h-14" style={{ borderBottomColor: '#F7A81B' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <span className="text-slate-800 font-semibold text-base">{pageName(location.pathname)}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
