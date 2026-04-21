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
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
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

          <button
            className={`layout-nav-item ${isActive("/statistiques") ? "active" : ""}`}
            onClick={() => navigate("/statistiques")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="20" x2="4" y2="10"/>
              <line x1="10" y1="20" x2="10" y2="4"/>
              <line x1="16" y1="20" x2="16" y2="14"/>
              <line x1="22" y1="20" x2="22" y2="8"/>
            </svg>
            Statistics
          </button>

        </nav>

        <button
          className={`layout-nav-item ${isActive("/admins") ? "active" : ""}`}
          onClick={() => navigate("/admins")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.26 1.3.73 1.77.47.47 1.11.73 1.77.73H21a2 2 0 1 1 0 4h-.09c-.66 0-1.3.26-1.77.73-.47.47-.73 1.11-.73 1.77z"/>
          </svg>
          Admins
        </button>

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

      <div className="layout-content">
        {children}
      </div>

    </div>
  )
}
