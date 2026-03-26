import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  TrendingUp,
  Heart,
  Award,
  Star,
  Briefcase,
  BarChart3,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/clubs', icon: LayoutDashboard, label: 'My Clubs' },
  { to: '/membership', icon: TrendingUp, label: 'Membership' },
  { to: '/trf', icon: Heart, label: 'Foundation & TRF' },
  { to: '/excellence', icon: Award, label: 'Goals' },
  { to: '/youth', icon: Star, label: 'Youth Services' },
  { to: '/projects', icon: Briefcase, label: 'Service Projects' },
  { to: '/district', icon: BarChart3, label: 'District View' },
]

const AG_NAME = 'Anita C Murgai'


function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('')
}

function pageName(pathname) {
  const map = {
    '/clubs':      'My Clubs',
    '/overview':   'My Clubs',
    '/membership': 'Membership',
    '/trf':        'TRF & Foundation',
    '/excellence': 'Club Excellence',
    '/youth':      'Youth Services',
    '/projects':   'Service Projects',
    '/district':   'District View',
  }
  return map[pathname] ?? 'Dashboard'
}

export default function Layout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const initials = getInitials(AG_NAME)

  /* ── Sidebar inner content ─────────────────────────────────────────── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Brand */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md"
            style={{ background: 'linear-gradient(145deg, #F7A81B, #e09210)', color: '#1e3a5f' }}
          >
            RI
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight tracking-wide"></p>
            <p className="text-slate-400 text-xs leading-tight mt-0.5">AG Dashboard</p>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-700/60 mx-4" />

      {/* User card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarFallback
              className="text-white text-xs font-bold"
              style={{ backgroundColor: '#003DA5' }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-tight truncate">{AG_NAME}</p>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-700/60 mx-4" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: '#003DA5' } : {}
              }
            >
              <Icon size={17} className="flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      <Separator className="bg-slate-700/60 mx-4" />

      {/* Footer */}
      <div className="px-3 py-3">
        <p className="text-slate-500 text-[10px] text-center tracking-wide uppercase">
          Assistant Governor
        </p>
      </div>
    </div>
  )

  /* ── Root layout ────────────────────────────────────────────────────── */
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0"
        style={{ backgroundColor: '#0f172a' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="relative flex flex-col w-60 flex-shrink-0 z-10 shadow-2xl"
            style={{ backgroundColor: '#0f172a' }}
          >
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-5 py-0 flex items-center justify-between flex-shrink-0 h-14">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* Page title */}
            <span className="text-slate-700 font-semibold text-sm">{pageName(location.pathname)}</span>
          </div>

          <div className="flex items-center gap-3">
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
