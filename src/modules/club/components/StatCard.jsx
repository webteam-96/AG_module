import { cn } from '@/lib/utils'

export default function StatCard({ label, value, sub, subColor = 'muted', accent }) {
  const subClass = {
    up:    'text-green-600',
    down:  'text-red-600',
    muted: 'text-slate-400',
  }[subColor]

  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-4 relative overflow-hidden">
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: accent }} />
      )}
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900 leading-none tabular-nums">{value}</p>
      {sub && <p className={cn('text-xs font-semibold mt-2', subClass)}>{sub}</p>}
    </div>
  )
}
