import { useState } from 'react'
import Directory        from './Directory'
import PastPresidents   from './PastPresidents'
import BoardOfDirectors from './BoardOfDirectors'
import { CLUB_STATS } from '../data/clubData'

const TABS = [
  { id: 'directory',       label: 'Member Directory'  },
  { id: 'past-presidents', label: 'Past Presidents'    },
  { id: 'bod',             label: 'Board of Directors' },
]

function MembershipGoalCard() {
  const [goal, setGoal] = useState(null)
  const [totalInput, setTotalInput]   = useState('')
  const [maleInput, setMaleInput]     = useState('')
  const [femaleInput, setFemaleInput] = useState('')

  // Dummy current-progress data — replace with real values when available
  const addedMale   = 5
  const addedFemale = 3
  const addedTotal  = 8   // includes male, female, and any honorary/other

  const submit = (e) => {
    e.preventDefault()
    const t = Number(totalInput)  || 0
    const m = Number(maleInput)   || 0
    const f = Number(femaleInput) || 0
    if (t + m + f > 0) {
      setGoal({ total: t, male: m, female: f })
      setTotalInput(''); setMaleInput(''); setFemaleInput('')
    }
  }

  if (goal === null) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-blue-300 px-5 py-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: '#003DA5' }} />
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-bold text-slate-800">Set Membership Goal</p>
            <p className="text-xs text-slate-500 mt-0.5">How many new members do you want to add this Rotary year?</p>
          </div>
          <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#003DA5' }}>Total</label>
              <input
                type="number"
                placeholder="0"
                value={totalInput}
                onChange={e => setTotalInput(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#0891b2' }}>Male</label>
              <input
                type="number"
                placeholder="0"
                value={maleInput}
                onChange={e => setMaleInput(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#e11d48' }}>Female</label>
              <input
                type="number"
                placeholder="0"
                value={femaleInput}
                onChange={e => setFemaleInput(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:border-pink-400"
              />
            </div>
            <button type="submit" className="text-xs font-bold text-white px-4 py-1.5 rounded-lg h-[34px]" style={{ background: '#003DA5' }}>
              Set Goal
            </button>
          </form>
        </div>
      </div>
    )
  }

  const totalPct   = goal.total  ? Math.min(Math.round((addedTotal  / goal.total)  * 100), 100) : 0
  const malePct    = goal.male   ? Math.min(Math.round((addedMale   / goal.male)   * 100), 100) : 0
  const femalePct  = goal.female ? Math.min(Math.round((addedFemale / goal.female) * 100), 100) : 0

  return (
    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: '#003DA5' }} />
      <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
        <div>
          <p className="text-sm font-bold text-slate-800">Membership Goal — RY 2026–27</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {goal.total
              ? `${addedTotal} of ${goal.total} new members added · ${totalPct}% achieved`
              : 'Progress against Male + Female targets shown below'}
          </p>
        </div>
        <button
          onClick={() => setGoal(null)}
          className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
        >
          Edit Goal
        </button>
      </div>

      <div className="space-y-2.5">
        {/* Total — top, prominent */}
        {goal.total > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-semibold text-slate-700">Total new members</span>
              <span className="text-xs font-bold tabular-nums" style={{ color: '#003DA5' }}>
                {addedTotal} / {goal.total} ({totalPct}%)
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${totalPct}%`, background: '#003DA5' }} />
            </div>
          </div>
        )}

        {/* Male */}
        {goal.male > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-slate-500">Male</span>
              <span className="text-xs font-semibold tabular-nums" style={{ color: '#0891b2' }}>
                {addedMale} / {goal.male} ({malePct}%)
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${malePct}%`, background: '#0891b2' }} />
            </div>
          </div>
        )}

        {/* Female */}
        {goal.female > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-slate-500">Female</span>
              <span className="text-xs font-semibold tabular-nums" style={{ color: '#e11d48' }}>
                {addedFemale} / {goal.female} ({femalePct}%)
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${femalePct}%`, background: '#e11d48' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Membership() {
  const [activeTab, setActiveTab] = useState('directory')

  return (
    <div className="space-y-4">
      {/* Goal setter */}
      <MembershipGoalCard />

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'text-white shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            style={activeTab === t.id ? { backgroundColor: '#003DA5' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'directory'       && <Directory />}
      {activeTab === 'past-presidents' && <PastPresidents />}
      {activeTab === 'bod'             && <BoardOfDirectors />}
    </div>
  )
}
