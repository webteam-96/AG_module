export default function StatusBadge({ status }) {
  const map = {
    excellent: { label: 'Excellent', cls: 'bg-green-100 text-green-700 border-green-300' },
    award: { label: 'Award Earned', cls: 'bg-green-100 text-green-700 border-green-300' },
    'no-award': { label: 'No Award', cls: 'bg-slate-100 text-slate-600 border-slate-300' },
    dues: { label: 'Dues Pending', cls: 'bg-red-100 text-red-700 border-red-300' },
    'no-goals': { label: 'Goals Not Set', cls: 'bg-amber-100 text-amber-700 border-amber-300' },
    new: { label: 'New Club', cls: 'bg-blue-100 text-blue-700 border-blue-300' },
    growing: { label: 'Growing', cls: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    declining: { label: 'Declining', cls: 'bg-red-100 text-red-700 border-red-300' },
    stable: { label: 'Stable', cls: 'bg-slate-100 text-slate-600 border-slate-300' },
    yes: { label: 'Yes ✓', cls: 'bg-green-100 text-green-700 border-green-300' },
    no: { label: 'No ✗', cls: 'bg-red-100 text-red-700 border-red-300' },
    na: { label: 'N/A', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
  }
  const s = map[status] || map.stable
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded border font-medium ${s.cls}`}>
      {s.label}
    </span>
  )
}
