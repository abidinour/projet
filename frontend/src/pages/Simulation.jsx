import { useState } from "react"
import axios from "axios"
import Layout from "../components/Layout"
import "./Simulation.css"

const PROFILES = [
  { value: "normal", label: "Attack Mix",  desc: "70% Benign • 20% SQLi • 10% XSS", colors: ["#22c55e", "#ef4444", "#f59e0b"] },
  { value: "sqli",   label: "Pure SQLi",   desc: "100% SQL Injection",               colors: ["#ef4444"] },
  { value: "xss",    label: "Pure XSS",    desc: "100% XSS Attacks",                 colors: ["#f59e0b"] },
  { value: "mixed",  label: "Full Mix",    desc: "50% Benign • 30% SQLi • 20% XSS",  colors: ["#22c55e", "#ef4444", "#f59e0b"] },
]

const PRESETS = [
  {
    id: "normal_baseline", label: "Normal Baseline",
    profile: "normal", volume: 2000, duration: 10, paths: "/login, /search, /api/*",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: "sqli_attack", label: "Focused SQLi Attack",
    profile: "sqli", volume: 6000, duration: 20, paths: "/login, /search",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
  },
  {
    id: "xss_scan", label: "Distributed XSS Scan",
    profile: "xss", volume: 8000, duration: 30, paths: "/login, /search, /api/*",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
]

function MiniPieChart({ colors }) {
  if (colors.length === 1) {
    return <div style={{ width: 22, height: 22, borderRadius: "50%", background: colors[0] }} />
  }
  const size = 22, r = size / 2
  const sliceSize = 360 / colors.length
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {colors.map((c, i) => {
        const start = (i * sliceSize * Math.PI) / 180
        const end   = ((i + 1) * sliceSize * Math.PI) / 180
        const x1 = r + r * Math.cos(start - Math.PI / 2)
        const y1 = r + r * Math.sin(start - Math.PI / 2)
        const x2 = r + r * Math.cos(end - Math.PI / 2)
        const y2 = r + r * Math.sin(end - Math.PI / 2)
        const large = sliceSize > 180 ? 1 : 0
        return <path key={i} d={`M${r},${r} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`} fill={c} />
      })}
    </svg>
  )
}

export default function Simulation() {
  const [preset, setPreset]     = useState(null)
  const [profile, setProfile]   = useState("normal")
  const [volume, setVolume]     = useState(5000)
  const [duration, setDuration] = useState(30)
  const [paths, setPaths]       = useState("/login, /search, /api/*")
  const [loading, setLoading]   = useState(false)

  const applyPreset = (p) => {
    setPreset(p.id)
    setProfile(p.profile)
    setVolume(p.volume)
    setDuration(p.duration)
    setPaths(p.paths)
  }

  const startSimulation = async () => {
    setLoading(true)
    try {
      await axios.post("http://localhost:5000/simulation/simulate", {
        profile, volume,
        paths: paths.split(",").map(s => s.trim())
      })
      alert("✅ Simulation finished!")
    } catch {
      alert("❌ Error starting simulation")
    } finally {
      setLoading(false)
    }
  }

  const currentProfile = PROFILES.find(p => p.value === profile) || PROFILES[0]
  const volPct = ((volume - 1000) / 9000) * 100

  return (
    <Layout>
      <div className="sim-main">

        {/* TOPBAR */}
        <div className="sim-topbar">
          <div>
            <div className="sim-page-title">WAF Traffic Simulator ⚡</div>
            <div className="sim-page-sub">Configure and launch simulated attack traffic against your WAF.</div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="sim-content">
          <div className="sim-wrapper">

            {/* PRESETS */}
            <div className="sim-section-label">Load Preset Scenario</div>
            <div className="sim-presets">
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  className={`sim-preset-btn${preset === p.id ? " active" : ""}`}
                  onClick={() => applyPreset(p)}
                >
                  <div className="sim-preset-icon">{p.icon}</div>
                  {p.label}
                </button>
              ))}
            </div>

            {/* CONFIG */}
            <div className="sim-config-card">

              {/* 1. Profile */}
              <div className="sim-field">
                <span className="sim-field-label">1. Simulation Profile</span>
                <div className="sim-select-wrap">
                  <select value={profile} onChange={e => setProfile(e.target.value)}>
                    {PROFILES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <div className="sim-select-display">
                    <MiniPieChart colors={currentProfile.colors} />
                    <span className="sim-select-text">{currentProfile.label}</span>
                    <span className="sim-select-sub">{currentProfile.desc}</span>
                  </div>
                  <svg className="sim-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {/* 2. Volume */}
              <div className="sim-field">
                <span className="sim-field-label">2. Traffic Volume</span>
                <div className="sim-range-wrap">
                  <input
                    type="range" min="1000" max="10000" step="500"
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    className="sim-range"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volPct}%, #e8ecf2 ${volPct}%, #e8ecf2 100%)`
                    }}
                  />
                  <div className="sim-range-labels">
                    <span>LOW</span>
                    <span>MEDIUM</span>
                    <span>HIGH (10,000+ Requests)</span>
                  </div>
                </div>
              </div>

              {/* 3. Duration */}
              <div className="sim-field">
                <span className="sim-field-label">3. Duration (minutes)</span>
                <div className="sim-input-with-addon">
                  <input
                    type="number" min="1"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                  />
                  <div className="sim-addon">Minutes</div>
                </div>
              </div>

              {/* 4. Target Paths */}
              <div className="sim-field">
                <span className="sim-field-label">4. Target Paths</span>
                <input
                  className="sim-input"
                  type="text"
                  placeholder="/login, /search, /api/*"
                  value={paths}
                  onChange={e => setPaths(e.target.value)}
                />
              </div>

              <button className="sim-start-btn" onClick={startSimulation} disabled={loading}>
                {loading ? "RUNNING SIMULATION..." : "START SIMULATION NOW"}
              </button>

            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
