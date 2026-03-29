import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import "./login.css"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")

    axios.post("http://localhost:3000/login", {
      email,
      password
    })
    .then(res => {
      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    })
    .catch(err => {
      setError(err.response?.data?.error || "Login failed")
    })
  }

  return (
    <div className="login-container">

      <div className="login-card">

        <h2 className="logo">NEXALYTICS</h2>

        <h3>AI Web Attack Detection</h3>
        <p className="subtitle">
          Log in with your administrator credentials to monitor live threats.
        </p>

        <form onSubmit={handleLogin}>

          {/* EMAIL */}
          <label>Email Address</label>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <label>Password</label>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <span
              className="eye"
              onClick={()=>setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* OPTIONS */}
          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span className="forgot">Forgot Password?</span>
          </div>

          {/* ERROR */}
          {error && <p className="error">{error}</p>}

          <button type="submit">Sign In →</button>

        </form>

      </div>

    </div>
  )
}

export default Login