import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, TrendingUp, Heart, Award, Star, Briefcase, BarChart3, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/overview', icon: LayoutDashboard, label: 'Zone Overview' },
  { to: '/clubs', icon: Users, label: 'Club Directory' },
  { to: '/membership', icon: TrendingUp, label: 'Membership' },
  { to: '/trf', icon: Heart, label: 'TRF Giving' },
  { to: '/excellence', icon: Award, label: 'Club Excellence' },
  { to: '/youth', icon: Star, label: 'Youth Services' },
  { to: '/projects', icon: Briefcase, label: 'Service Projects' },
  { to: '/district', icon: BarChart3, label: 'District Comparison' },
]

export default function Layout() {
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem('ag_user') || '{}')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    sessionStorage.removeItem('ag_user')
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-blue-900 text-sm">RI</div>
          <div>
            <div className="text-white font-bold text-sm">District 3192</div>
            <div className="text-blue-300 text-xs">AG Dashboard</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-blue-800 bg-blue-900">
        <div className="text-blue-200 text-xs uppercase tracking-wider mb-1">Logged in as</div>
        <div className="text-white font-semibold text-sm">{user.name}</div>
        <div className="inline-block mt-1 px-2 py-0.5 bg-yellow-400 text-blue-900 rounded text-xs font-bold">
          {user.role === 'dg' ? 'District Governor' : `Zone ${user.zone} — AG`}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all ${
                isActive
                  ? 'bg-yellow-400 text-blue-900 font-semibold'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-red-600 hover:text-white w-full transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
        <div className="text-blue-400 text-xs text-center mt-3">Data as of 19 Mar 2026</div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-blue-900 flex-shrink-0" style={{backgroundColor:'#003DA5'}}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 flex-shrink-0 z-10" style={{backgroundColor:'#003DA5'}}>
            <button className="absolute top-3 right-3 text-white" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-slate-800 font-semibold text-sm">RI District 3192 — Assistant Governor Dashboard</h1>
              <p className="text-slate-400 text-xs">Rotary Year 2025-26 · View Only</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 hidden sm:block">Last updated: 19 March 2026</div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
