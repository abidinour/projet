import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Simulation from "./pages/Simulation"
import Statistiques from "./pages/Statistiques" // 🆕 zidna hedhi

import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulation"
          element={
            <ProtectedRoute>
              <Simulation />
            </ProtectedRoute>
          }
        />

        {/* 🆕 page statistiques */}
        <Route
          path="/statistiques"
          element={
            <ProtectedRoute>
              <Statistiques />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App