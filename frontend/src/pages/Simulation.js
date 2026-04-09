import { useState } from "react"
import axios from "axios"

export default function Simulation() {

  const [profile, setProfile] = useState("sqli")
  const [volume, setVolume] = useState(5000)

  const startSimulation = async () => {
    try {
      await axios.post("http://localhost:5000/simulation/simulate", {
        profile,
        volume,
        paths: ["/login", "/search", "/api"]
      })

      alert("Simulation finished ✅")

    } catch {
      alert("Error ❌")
    }
  }

  return (
    <div className="h-screen bg-gray-950 text-white p-10">

      <h1 className="text-3xl mb-8 text-center">
        WAF Simulator ⚡
      </h1>

      <div className="bg-gray-900 p-6 max-w-xl mx-auto rounded-xl">

        <label>Attack Type</label>
        <select
          onChange={(e)=>setProfile(e.target.value)}
          className="w-full p-2 mt-2 bg-black"
        >
          <option value="sqli">SQL Injection</option>
          <option value="xss">XSS</option>
        </select>

        <label className="block mt-4">Traffic</label>
        <input
          type="range"
          min="1000"
          max="10000"
          value={volume}
          onChange={(e)=>setVolume(e.target.value)}
          className="w-full"
        />

        <button
          onClick={startSimulation}
          className="w-full bg-teal-500 mt-5 p-3 rounded"
        >
          START ATTACK
        </button>

      </div>
    </div>
  )
}
