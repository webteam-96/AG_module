export default function DistrictOverview() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
        <svg width="28" height="28" fill="none" stroke="#9333ea" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800">District Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1">Coming soon — District 3142 analytics and reporting</p>
      </div>
      <div className="flex gap-3">
        <a href="/agdashboard/clubs" className="text-[11px] font-medium text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 transition-colors">
          Go to AG Dashboard
        </a>
        <a href="/clubdashboard/overview" className="text-[11px] font-medium text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 transition-colors">
          Go to Club Dashboard
        </a>
      </div>
    </div>
  )
}
