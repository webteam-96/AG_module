export default function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={20} className="text-blue-600" />}
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>
      {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
    </div>
  )
}
