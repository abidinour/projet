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
          <span className="layout-logo-text">NEXALYTICS</span>
        </div>

        <nav className="layout-nav">

          <button
            className={`layout-nav-item ${isActive("/dashboard") ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            className={`layout-nav-item ${isActive("/simulation") ? "active" : ""}`}
            onClick={() => navigate("/simulation")}
          >
            Simulation
          </button>

          {/* ✅ الجديد فقط */}
          <button
            className={`layout-nav-item ${isActive("/statistiques") ? "active" : ""}`}
            onClick={() => navigate("/statistiques")}
          >
            Statistics
          </button>

        </nav>

        <button className="layout-logout" onClick={handleLogout}>
          Logout
        </button>

      </div>

      {/* CONTENT */}
      <div className="layout-content">
        {children}
      </div>

    </div>
  )
}