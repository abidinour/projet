import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import "./Dashboard.css"

const TYPE_STYLES = {
  attack:                { bg: "#fef2f2", color: "#ef4444", dot: "#ef4444" },
  normal:                { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  sql_injection:         { bg: "#fef2f2", color: "#ef4444", dot: "#ef4444" },
  xss:                   { bg: "#fff7ed", color: "#ea580c", dot: "#f97316" },
  remote_file_inclusion: { bg: "#faf5ff", color: "#7c3aed", dot: "#a855f7" },
  unknown_attack:        { bg: "#fff7ed", color: "#d97706", dot: "#f59e0b" },
}

function TypeBadge({ type }) {
  const s = TYPE_STYLES[type] || { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" }
  return (
    <span className="type-badge" style={{ background: s.bg, color: s.color }}>
      <span className="type-badge-dot" style={{ background: s.dot }} />
      {type.replace(/_/g, " ")}
    </span>
  )
}

export default function Dashboard() {
  const [logs, setLogs]     = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("AI Types")
  const navigate            = useNavigate()

  useEffect(() => {
    fetchLogs()
    const iv = setInterval(fetchLogs, 3000)
    return () => clearInterval(iv)
  }, [])

const fetchLogs = async () => {
  try {
    const token = localStorage.getItem("token")

    console.log("🔑 Token from localStorage:", token)

    if (!token) {
      console.warn("⚠️  No token found — user is not logged in or token was cleared")
      return
    }

    console.log("📤 Sending request to /logs with token:", `Bearer ${token}`)

    const res = await axios.get("http://localhost:5000/logs", {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log("✅ Logs fetched successfully:", res.data)
    setLogs(res.data)

  } catch (err) {
    console.error("❌ fetchLogs error:")
    console.error("   Status  :", err.response?.status)
    console.error("   Message :", err.response?.data)
    console.error("   Full err:", err.message)
  }
}

  const total    = logs.length
  const attacks  = logs.filter(l => l.prediction !== "normal").length
  const normal   = logs.filter(l => l.prediction === "normal").length
  const accuracy = logs.length
    ? ((logs.filter(l => l.confidence >= 0.9).length / logs.length) * 100).toFixed(1)
    : "94.4"

  const filtered = logs.filter(l => {
    const matchSearch = l.url?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "AI Types" || l.prediction === filter
    return matchSearch && matchFilter
  })

  const formatDate = (ts) => {
    if (!ts) return "Today at 14:30:00"
    const d = new Date(ts)
    return `Today at ${d.toTimeString().slice(0, 8)}`
  }

  return (
    <Layout>
      <div className="db-main">

        {/* TOPBAR */}
        <div className="db-topbar">
          <div>
            <div className="db-page-title">AI Logs Dashboard 🚀</div>
            <div className="db-page-sub">Monitor and analyze AI-detected web threats in real-time.</div>
          </div>
          <div className="db-topbar-right">
            <div className="db-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aab4c4" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="db-icon-btn" onClick={fetchLogs}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
            </button>
            <div className="db-user-avatar">N</div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="db-content">

          {/* STAT CARDS */}
          <div className="db-cards">
            <div className="db-card teal">
              <div className="db-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div>
                <div className="db-card-label">Total Logs</div>
                <div className="db-card-value">{total}</div>
              </div>
            </div>

            <div className="db-card red">
              <div className="db-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <div className="db-card-label">Attacks Detected</div>
                <div className="db-card-value">{attacks}</div>
              </div>
            </div>

            <div className="db-card green">
              <div className="db-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <div className="db-card-label">Normal URLs</div>
                <div className="db-card-value">{normal}</div>
              </div>
            </div>

            <div className="db-card blue">
              <div className="db-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <div className="db-card-label">AI Accuracy</div>
                <div className="db-card-value db-card-value--blue">{accuracy}%</div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="db-table-card">
            <div className="db-table-header">
              <div className="db-table-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                Detection Logs
              </div>
              <div className="db-table-actions">
                <select className="db-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
                  <option>AI Types</option>
                  <option value="normal">Normal</option>
                  <option value="attack">Attack</option>
                  <option value="sql_injection">SQL Injection</option>
                  <option value="xss">XSS</option>
                  <option value="remote_file_inclusion">RFI</option>
                </select>
                <button className="db-refresh-btn" onClick={fetchLogs}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th># ID</th>
                  <th>🔗 URL</th>
                  <th>⚡ Type</th>
                  <th>📊 Confidence</th>
                  <th>📅 Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={5} className="db-empty">No logs yet...</td></tr>
                  : filtered.map((log, i) => (
                    <tr key={log.id}>
                      <td><span className="id-badge">{log.id ?? i + 1}</span></td>
                      <td className="url-cell">{log.url}</td>
                      <td><TypeBadge type={log.prediction} /></td>
                      <td>
                        <div className="conf-bar-wrap">
                          <div className="conf-bar-bg">
                            <div className="conf-bar-fill" style={{ width: `${(log.confidence ?? 0.9) * 100}%` }} />
                          </div>
                          <span className="conf-label">{(log.confidence ?? 0.9).toFixed(2)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {formatDate(log.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </Layout>
  )
}
