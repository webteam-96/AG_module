import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Smartphone, KeyRound, ChevronDown } from 'lucide-react'

const ZONES = [
  { id: 'A', label: 'Zone A', name: 'Shankar Sastry C V', role: 'ag' },
  { id: 'B', label: 'Zone B', name: 'Sharavana J', role: 'ag' },
  { id: 'C', label: 'Zone C', name: 'Aravind S Hooli', role: 'ag' },
  { id: 'D', label: 'Zone D', name: 'Manjunath Patil K', role: 'ag' },
  { id: 'E', label: 'Zone E', name: 'Madhusudan R Bidi', role: 'ag' },
  { id: 'F', label: 'Zone F', name: 'Prasanna Kumar C N', role: 'ag' },
  { id: 'G', label: 'Zone G', name: 'Rajesh T S', role: 'ag' },
  { id: 'ALL', label: 'District Governor', name: 'District Governor', role: 'dg' },
]

export default function Login() {
  const navigate = useNavigate()

  const [selectedZone, setSelectedZone] = useState('')
  const [mobile, setMobile] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedUser = ZONES.find(z => z.id === selectedZone)

  const handleSendOtp = () => {
    setError('')
    if (!selectedZone) {
      setError('Please select your zone or role.')
      return
    }
    if (!mobile || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setOtp(['1', '2', '3', '4'])
      setOtpSent(true)
      setLoading(false)
    }, 600)
  }

  const handleOtpChange = (value, index) => {
    const cleaned = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = cleaned
    setOtp(next)
    if (cleaned && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`)
      if (prev) prev.focus()
    }
  }

  const handleVerify = () => {
    setError('')
    const entered = otp.join('')
    if (entered !== '1234') {
      setError('Invalid OTP. Use demo OTP: 1234')
      return
    }
    if (!selectedUser) {
      setError('No zone selected.')
      return
    }
    const userData = {
      id: `${selectedUser.role}-${selectedUser.id.toLowerCase()}`,
      name: selectedUser.name,
      zone: selectedUser.id,
      role: selectedUser.role,
    }
    sessionStorage.setItem('ag_user', JSON.stringify(userData))
    navigate('/overview')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: 'linear-gradient(135deg, #001f6e 0%, #003DA5 45%, #0055c8 75%, #0068e1 100%)',
      }}
    >
      {/* Decorative background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#F7A81B' }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10"
          style={{ background: '#F7A81B' }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full opacity-5"
          style={{ background: '#ffffff' }}
        />
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #003DA5, #F7A81B, #003DA5)' }} />

        <div className="px-8 pt-8 pb-10">

          {/* Logo & heading */}
          <div className="flex flex-col items-center mb-7">
            {/* Gold Rotary gear circle */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-4"
              style={{ background: 'linear-gradient(145deg, #F7A81B, #e09210)' }}
            >
              <span className="text-white font-black text-2xl tracking-tight select-none">RI</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#003DA5' }}>
              District 3192
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500">
              Assistant Governor Dashboard &nbsp;·&nbsp; 2025-26
            </p>

            <div
              className="mt-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: '#003DA5' }}
            >
              Rotary International
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-6" />

          {/* Zone selector */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Select Your Zone
            </label>
            <div className="relative">
              <select
                value={selectedZone}
                onChange={e => { setSelectedZone(e.target.value); setError('') }}
                className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ '--tw-ring-color': '#003DA5' }}
              >
                <option value="">— Select zone or role —</option>
                {ZONES.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.label} {z.id !== 'ALL' ? `— ${z.name}` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {selectedUser && selectedUser.id !== 'ALL' && (
              <p className="mt-1.5 text-xs text-gray-500 pl-1">
                <span className="font-semibold" style={{ color: '#003DA5' }}>{selectedUser.name}</span>
                &nbsp;· AG Zone {selectedUser.id}
              </p>
            )}
            {selectedUser && selectedUser.id === 'ALL' && (
              <p className="mt-1.5 text-xs pl-1" style={{ color: '#F7A81B' }} >
                <span className="font-semibold">District Governor</span> &nbsp;· All Zones
              </p>
            )}
          </div>

          {/* Mobile input */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <Smartphone size={15} className="text-gray-400" />
                <span className="text-sm text-gray-400">+91</span>
              </div>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit mobile"
                value={mobile}
                onChange={e => { setMobile(e.target.value.replace(/\D/g, '')); setError('') }}
                className="w-full border border-gray-200 rounded-xl pl-14 pr-4 py-3 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ '--tw-ring-color': '#003DA5' }}
              />
            </div>
          </div>

          {/* OTP fields */}
          {otpSent && (
            <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <KeyRound size={14} className="text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Enter OTP</span>
              </div>
              <div className="flex gap-3 justify-center mb-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl bg-white focus:outline-none transition"
                    style={{
                      borderColor: digit ? '#003DA5' : '#d1d5db',
                      color: '#003DA5',
                    }}
                  />
                ))}
              </div>
              <p className="text-center text-xs text-blue-500 mt-1">
                Demo: use OTP <span className="font-bold tracking-widest">1234</span>
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Action buttons */}
          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide transition-all active:scale-95 shadow-md hover:shadow-lg disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #003DA5, #0055c8)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Sending OTP…
                </span>
              ) : 'Send OTP'}
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleVerify}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide transition-all active:scale-95 shadow-md hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #003DA5, #0055c8)' }}
              >
                Verify &amp; Login
              </button>
              <button
                onClick={() => { setOtpSent(false); setOtp(['', '', '', '']); setError('') }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
              >
                Change Zone / Mobile
              </button>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            <ShieldCheck size={13} className="text-gray-400" />
            <p className="text-xs text-gray-400">
              View-only dashboard &nbsp;·&nbsp; RI District 3192
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
