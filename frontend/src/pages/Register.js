import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Register() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      await axios.post("http://localhost:5000/register", {
        name,
        email,
        password
      })

      alert("User created ✅")
      navigate("/")

    } catch (err) {
      alert(err.response?.data?.error || "Error")
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button type="submit">Register</button>
    </form>
  )
}

export default Register