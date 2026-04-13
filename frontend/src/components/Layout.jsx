import { useNavigate, useLocation } from "react-router-dom"
import "./Layout.css"

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="layout-shell">

      {/* SIDEBAR */}
      <div className="layout-sidebar">

        <div className="layout-logo">
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="#f0faf9"/>
            <path d="M8 26 L14 10 L18 20 L22 14 L28 26" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="14" cy="10" r="2" fill="#ef4444"/>
            <circle cx="22" cy="14" r="2" fill="#f59e0b"/>
            <circle cx="28" cy="26" r="2" fill="#3b82f6"/>
          </svg>
          <span className="layout-logo-text">NEXALYTICS</span>
        </div>

        <nav className="layout-nav">
          <button
            className={`layout-nav-item ${isActive("/dashboard") ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </button>

          <button
            className={`layout-nav-item ${isActive("/simulation") ? "active" : ""}`}
            onClick={() => navigate("/simulation")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Simulation
          </button>
        </nav>

        {/* USER BLOCK */}
        <div className="layout-user-block">
          <div className="layout-user-row">
            <div className="layout-avatar">A</div>
            <div>
              <div className="layout-user-name">Admin</div>
              <div className="layout-user-email">nour@gmail.com</div>
            </div>
          </div>
          <div className="layout-auth-badge">
            <span className="layout-auth-dot" />
            Authenticated
          </div>
        </div>

        <button className="layout-logout" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>

      </div>

      {/* PAGE CONTENT */}
      <div className="layout-content">
        {children}
      </div>

    </div>
  )
}
