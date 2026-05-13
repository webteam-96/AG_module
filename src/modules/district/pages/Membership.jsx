// src/modules/district/pages/Membership.jsx
import { useState } from 'react'
import StatCard from '../../club/components/StatCard'
import { CLUB_ANALYTICS } from '../data/analyticsData'
import DistrictDirectory  from './Directory'
import DistrictCommittee  from './Committee'
import DistrictAG         from './AG'
import DistrictModerator  from './Moderator'
import DistrictClubs      from './Clubs'

const TABS = [
  { id: 'directory',  label: 'Directory'           },
  { id: 'committee',  label: 'District Committee'  },
  { id: 'ag',         label: 'Assistant Governors' },
  { id: 'moderator',  label: 'Club Moderator'      },
  { id: 'clubs',      label: 'Clubs'               },
]

const totalMembers  = CLUB_ANALYTICS.reduce((s, c) => s + c.members, 0)
const activeMembers = CLUB_ANALYTICS.reduce((s, c) => s + c.activeMembers, 0)
const newThisYear   = CLUB_ANALYTICS.reduce((s, c) => s + c.newThisYear, 0)
const terminated    = CLUB_ANALYTICS.reduce((s, c) => s + c.terminated, 0)

function MembershipGoalCard() {
  const [goal, setGoal] = useState(null)
  const [maleInput, setMaleInput]     = useState('')
  const [femaleInput, setFemaleInput] = useState('')

  // Dummy district-level current progress
  const addedMale   = Math.round(newThisYear * 0.62)
  const addedFemale = newThisYear - addedMale

  const submit = (e) => {
    e.preventDefault()
    const m = Number(maleInput) || 0
    const f = Number(femaleInput) || 0
    if (m + f > 0) {
      setGoal({ male: m, female: f })
      setMaleInput(''); setFemaleInput('')
    }
  }

  if (goal === null) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-blue-300 px-5 py-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: '#003DA5' }} />
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-bold text-slate-800">Set District Membership Goal</p>
            <p className="text-xs text-slate-500 mt-0.5">How many new members do you want to add district-wide this Rotary year?</p>
          </div>
          <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Male</label>
              <input
                type="number"
                placeholder="0"
                value={maleInput}
                onChange={e => setMaleInput(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Female</label>
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

  const totalGoal  = goal.male + goal.female
  const totalAdded = addedMale + addedFemale
  const malePct    = goal.male   ? Math.min(Math.round((addedMale   / goal.male)   * 100), 100) : 0
  const femalePct  = goal.female ? Math.min(Math.round((addedFemale / goal.female) * 100), 100) : 0
  const totalPct   = totalGoal   ? Math.min(Math.round((totalAdded  / totalGoal)   * 100), 100) : 0

  return (
    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: '#003DA5' }} />
      <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
        <div>
          <p className="text-sm font-bold text-slate-800">District Membership Goal — RY 2025–26</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {totalAdded} of {totalGoal} new members added · {totalPct}% achieved
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

        <div className="pt-2 border-t border-slate-100">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-semibold text-slate-700">Total new members</span>
            <span className="text-xs font-bold tabular-nums" style={{ color: '#003DA5' }}>
              {totalAdded} / {totalGoal}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${totalPct}%`, background: '#003DA5' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DistrictMembership() {
  const [activeTab, setActiveTab] = useState('directory')

  return (
    <div className="space-y-4">

      {/* Goal setter */}
      <MembershipGoalCard />

      {/* District-wide KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Members"  value={totalMembers}  sub="All clubs"        subColor="muted" accent="#003DA5" />
        <StatCard label="Active Members" value={activeMembers} sub="Currently active" subColor="up"    accent="#16a34a" />
        <StatCard label="New This Year"  value={newThisYear}   sub="New this RY"      subColor="up"    accent="#9333ea" />
        <StatCard label="Terminated"     value={terminated}    sub="Exits this RY"    subColor="down"  accent="#e11d48" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'text-[#1e3a5f] shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            style={activeTab === t.id ? { backgroundColor: '#F7A81B' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'directory'  && <DistrictDirectory />}
      {activeTab === 'committee'  && <DistrictCommittee />}
      {activeTab === 'ag'         && <DistrictAG />}
      {activeTab === 'moderator'  && <DistrictModerator />}
      {activeTab === 'clubs'      && <DistrictClubs />}
    </div>
  )
}
