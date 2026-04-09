import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts"

export default function Dashboard() {

  const [logs, setLogs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchLogs()

    // 🔥 REALTIME REFRESH
    const interval = setInterval(fetchLogs, 3000)
    return () => clearInterval(interval)

  }, [])

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get("http://localhost:5000/logs", {
        headers: { Authorization: `Bearer ${token}` }
      })

      setLogs(res.data)

    } catch (err) {
      console.log(err)
    }
  }

  const total = logs.length
  const attacks = logs.filter(l => l.prediction === "attack").length
  const normal = logs.filter(l => l.prediction === "normal").length

  const data = [
    { name: "Attacks", value: attacks },
    { name: "Normal", value: normal }
  ]

  return (
    <div className="flex h-screen bg-gray-950 text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-black p-6 flex flex-col">

        <h2 className="text-2xl font-bold text-teal-400 mb-10">
          NEXALYTICS
        </h2>

        <button className="bg-teal-500 p-2 rounded mb-3">
          Dashboard
        </button>

        <button
          onClick={() => navigate("/simulation")}
          className="hover:bg-gray-800 p-2 rounded mb-3"
        >
          Simulation
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("token")
            navigate("/")
          }}
          className="mt-auto bg-red-500 p-2 rounded"
        >
          Logout
        </button>

      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 overflow-auto">

        <h1 className="text-3xl font-bold mb-6">
          Cybersecurity Dashboard 🛡️
        </h1>

        {/* CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-6">

          <Card title="Total Logs" value={total} color="bg-blue-500" />
          <Card title="Attacks" value={attacks} color="bg-red-500" />
          <Card title="Normal" value={normal} color="bg-green-500" />
          <Card title="Status" value="ACTIVE" color="bg-purple-500" />

        </div>

        {/* CHART */}
        <div className="bg-gray-900 p-5 rounded-xl mb-6">

          <h3 className="mb-4 text-xl">Traffic Analysis</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={100}
                label
              >
                <Cell fill="#ef4444" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* TABLE */}
        <div className="bg-gray-900 rounded-xl p-4">

          <h3 className="text-xl mb-4">Live Logs</h3>

          <table className="w-full text-sm">

            <thead>
              <tr className="bg-gray-800">
                <th className="p-3">URL</th>
                <th>Type</th>
                <th>Confidence</th>
              </tr>
            </thead>

            <tbody>

              {logs.map(log => (
                <tr key={log.id} className="border-b border-gray-700">

                  <td className="p-2">{log.url}</td>

                  <td>
                    <span className={`px-2 py-1 rounded text-xs
                      ${log.prediction === "attack"
                        ? "bg-red-500"
                        : "bg-green-500"}
                    `}>
                      {log.prediction}
                    </span>
                  </td>

                  <td className="w-40">
                    <div className="bg-gray-700 h-2 rounded">
                      <div
                        className="bg-green-500 h-2 rounded"
                        style={{ width: `${log.confidence * 100}%` }}
                      ></div>
                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  )
}

/* CARD COMPONENT */
function Card({ title, value, color }) {
  return (
    <div className={`${color} p-5 rounded-xl shadow`}>
      <h4>{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}