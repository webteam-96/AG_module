import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShieldCheck, Smartphone, KeyRound, User, Check } from 'lucide-react'

const FEATURES = [
  'Club membership analytics',
  'Foundation & TRF tracking',
  'Goals & compliance',
  'Youth services overview',
]

export default function Login() {
  const navigate = useNavigate()

  const [name,    setName]    = useState('')
  const [mobile,  setMobile]  = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp,     setOtp]     = useState(['', '', '', ''])
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  /* ── Handlers ─────────────────────────────────────────────────────── */
  const handleSendOtp = () => {
    setError('')
    if (!name.trim()) {
      setError('Please enter your full name.')
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
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerify = () => {
    setError('')
    if (otp.join('') !== '1234') {
      setError('Invalid OTP. Demo OTP is 1234.')
      return
    }
    const userData = {
      name:   name.trim(),
      mobile: mobile,
      role:   'ag',
    }
    sessionStorage.setItem('ag_user', JSON.stringify(userData))
    navigate('/overview')
  }

  /* ── Render ────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left panel ── */}
      <div
        className="relative hidden lg:flex flex-col justify-between w-1/2 p-12 overflow-hidden"
        style={{ backgroundColor: '#003DA5' }}
      >
        {/* Gold accent line at top */}
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{ background: 'linear-gradient(90deg, #F7A81B, transparent)' }}
        />

        {/* Decorative Rotary wheel rings — bottom-right */}
        <div className="absolute -bottom-40 -right-40 opacity-10 pointer-events-none">
          <div className="w-[28rem] h-[28rem] rounded-full border-[40px] border-white" />
        </div>
        <div className="absolute -bottom-24 -right-24 opacity-10 pointer-events-none">
          <div className="w-72 h-72 rounded-full border-[28px] border-white" />
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
          <div className="w-44 h-44 rounded-full border-[18px] border-white" />
        </div>

        {/* Top: logo + heading */}
        <div>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl shadow-xl mb-8"
            style={{
              background: 'linear-gradient(145deg, #F7A81B, #e09210)',
              color: '#1e3a5f',
            }}
          >
            RI
          </div>

          <h1 className="text-white text-4xl font-extrabold tracking-tight leading-none mb-2">
            Assistant Governor
          </h1>
          <p className="text-blue-200 text-xl font-medium mb-5">
            Dashboard
          </p>

          <Badge
            className="text-xs font-semibold px-3 py-1 rounded-full border-0"
            style={{ backgroundColor: 'rgba(247,168,27,0.2)', color: '#F7A81B' }}
          >
            Rotary Year 2025-26
          </Badge>
        </div>

        {/* Middle: feature bullets */}
        <div>
          <p className="text-blue-300 text-xs uppercase tracking-widest font-semibold mb-4">
            What&apos;s inside
          </p>
          <ul className="flex flex-col gap-3">
            {FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(247,168,27,0.2)' }}
                >
                  <Check size={11} style={{ color: '#F7A81B' }} strokeWidth={3} />
                </span>
                <span className="text-blue-100 text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: tagline */}
        <div>
          <p className="text-blue-400 text-xs">
            Rotary International · Karnataka, India
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile-only brand header */}
          <div className="flex lg:hidden flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shadow-lg mb-3"
              style={{
                background: 'linear-gradient(145deg, #F7A81B, #e09210)',
                color: '#1e3a5f',
              }}
            >
              RI
            </div>
            <p className="text-slate-800 font-bold text-lg">Assistant Governor</p>
            <p className="text-slate-500 text-sm">Dashboard</p>
          </div>

          <Card className="border border-slate-200 shadow-lg rounded-2xl overflow-hidden">
            {/* Accent bar */}
            <div
              className="h-1 w-full"
              style={{ background: 'linear-gradient(90deg, #003DA5, #F7A81B, #003DA5)' }}
            />

            <CardHeader className="px-7 pt-7 pb-0">
              <CardTitle className="text-xl font-extrabold text-slate-800">
                Sign In
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-1">
                Enter your details to access your clubs
              </CardDescription>
            </CardHeader>

            <CardContent className="px-7 pt-5 pb-7">

              {/* Name input */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <User size={14} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => { setName(e.target.value); setError('') }}
                    disabled={otpSent}
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* Mobile number */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                    <Smartphone size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-400 font-medium">+91</span>
                    <span className="text-slate-200 mx-0.5">|</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={mobile}
                    onChange={e => { setMobile(e.target.value.replace(/\D/g, '')); setError('') }}
                    disabled={otpSent}
                    className="w-full border border-slate-200 rounded-xl pl-[4.5rem] pr-4 py-3 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* OTP boxes */}
              {otpSent && (
                <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <KeyRound size={13} className="text-blue-600" />
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
                        className="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl bg-white focus:outline-none transition-colors"
                        style={{
                          borderColor: digit ? '#003DA5' : '#e2e8f0',
                          color: '#003DA5',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-blue-500 mt-1.5">
                    Demo mode — OTP is{' '}
                    <span className="font-bold tracking-[0.2em]">1234</span>
                  </p>
                </div>
              )}

              {/* Error */}
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
                  className="w-full py-3.5 rounded-xl text-white text-sm font-bold tracking-wide shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #003DA5 0%, #0055c8 100%)' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending OTP…
                    </span>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleVerify}
                    className="w-full py-3.5 rounded-xl text-white text-sm font-bold tracking-wide shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                    style={{ background: 'linear-gradient(135deg, #003DA5 0%, #0055c8 100%)' }}
                  >
                    Verify &amp; Login
                  </button>
                  <button
                    onClick={() => { setOtpSent(false); setOtp(['', '', '', '']); setError('') }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Change Details
                  </button>
                </div>
              )}

              <Separator className="my-5" />

              {/* Footer */}
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck size={12} className="text-slate-400" />
                <p className="text-xs text-slate-400">
                  View-only dashboard · Rotary International
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
