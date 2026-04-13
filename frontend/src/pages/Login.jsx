import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Login.css"

export default function Login() {
  const [email, setEmail] = useState("j.parker@nexalytics.com")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password })
      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="logo-row">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="#f0faf9"/>
            <path d="M8 26 L14 10 L18 20 L22 14 L28 26" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="14" cy="10" r="2" fill="#ef4444"/>
            <circle cx="22" cy="14" r="2" fill="#f59e0b"/>
            <circle cx="28" cy="26" r="2" fill="#3b82f6"/>
          </svg>
          <span className="logo-text">NEXALYTICS</span>
        </div>

        <h2 className="card-title">AI Web Attack Detection</h2>
        <p className="card-subtitle">Log in with your administrator credentials to<br/>monitor live threats.</p>

        <label className="field-label">Email Address</label>
        <div className="input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <label className="field-label">Password</label>
        <div className="input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input
            type={showPass ? "text" : "password"}
            placeholder="••••••••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="eye-btn" onClick={() => setShowPass(!showPass)}>
            {showPass
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>

        <div className="options-row">
          <label className="remember-label">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            Remember me
          </label>
          <button className="forgot-link">Forgot Password?</button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button className="sign-in-btn" onClick={handleLogin}>
          Sign In
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>

      </div>
    </div>
  )
}
