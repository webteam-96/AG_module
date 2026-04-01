export default function DistrictWebsiteData() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
        <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18"/><path d="M9 21V9"/>
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800">Website Data</h2>
        <p className="text-slate-400 text-sm mt-1">District 5656 website data management — coming soon</p>
      </div>
    </div>
  )
}
