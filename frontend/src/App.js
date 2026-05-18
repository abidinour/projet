import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Simulation from "./pages/Simulation"
import Statistiques from "./pages/Statistiques"
import Admins from "./pages/Admins"
import Chatbot from "./pages/Chatbot"
import ProtectedRoute from "./components/ProtectedRoute"
import Notifications from "./pages/Notifications"

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

        <Route
          path="/statistiques"
          element={
            <ProtectedRoute>
              <Statistiques />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admins"
          element={
            <ProtectedRoute>
              <Admins />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/notifications" 
          element={<Notifications />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App