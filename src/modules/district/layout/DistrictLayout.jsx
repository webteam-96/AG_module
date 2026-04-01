import { Outlet } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

export default function DistrictLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0" style={{ background: '#080e1c' }}>
        <div className="px-4 py-4 border-b border-white/5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#F7A81B,#e09210)', color: '#1e3a5f' }}>RI</div>
          <div>
            <p className="text-white text-[11px] font-bold leading-tight">Rotary International</p>
            <p className="text-slate-500 text-[9px] mt-0.5">District Dashboard</p>
          </div>
        </div>
        <div className="px-3 py-4">
          <div className="flex items-center gap-2 bg-white/4 rounded-lg px-2.5 py-2">
            <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-[9px] font-bold text-white">D</div>
            <div>
              <p className="text-white text-[11px] font-semibold">District 3142</p>
              <p className="text-slate-500 text-[9px]">DG Office</p>
            </div>
          </div>
        </div>
        <Separator className="bg-white/5 mx-3" />
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-purple-900/30 text-purple-300 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Overview
          </div>
        </div>
        <div className="mt-auto px-3 py-2.5 border-t border-white/5 text-[8.5px] text-slate-600 text-center uppercase tracking-widest">
          RY 2025–26
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-5 h-[50px] flex items-center">
          <div>
            <p className="text-slate-800 font-semibold text-sm">District Dashboard</p>
            <p className="text-slate-400 text-[10px]">District 3142 / Overview</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5"><Outlet /></main>
      </div>
    </div>
  )
}
