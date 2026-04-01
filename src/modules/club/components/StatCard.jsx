import { cn } from '@/lib/utils'

export default function StatCard({ label, value, sub, subColor = 'muted', accent }) {
  const subClass = {
    up:    'text-green-600',
    down:  'text-red-600',
    muted: 'text-slate-400',
  }[subColor]

  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 relative overflow-hidden">
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-xl" style={{ background: accent }} />
      )}
      <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>
      <p className="text-[21px] font-extrabold text-slate-900 leading-none tabular-nums">{value}</p>
      {sub && <p className={cn('text-[9.5px] font-semibold mt-1.5', subClass)}>{sub}</p>}
    </div>
  )
}
