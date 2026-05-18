import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "../components/Layout"
import "./Statistiques.css"

import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, Tooltip
} from "recharts"

export default function Statistiques() {
  const [data, setData] = useState(null)

  // FILTER STATES
  const [showFilter, setShowFilter] = useState(false)
  const [attackType, setAttackType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  // ESC TO CLOSE MODAL
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowFilter(false)
      }
    }

    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [])

  const fetchStats = async (
    customType = attackType,
    customStart = startDate,
    customEnd = endDate
  ) => {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      // PROFESSIONAL QUERY BUILDING
      const params = new URLSearchParams()

      if (customType) params.append("type", customType)
      if (customStart) params.append("start", customStart)
      if (customEnd) params.append("end", customEnd)

      const query = params.toString()

      const res = await axios.get(
        `http://localhost:3307/logs/stats?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setData(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setAttackType("")
    setStartDate("")
    setEndDate("")
    setShowFilter(false)

    // CLEAN RESET (without setTimeout)
    fetchStats("", "", "")
  }

  if (!data || loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    )
  }

  const pieData = [
    { name: "Attacks", value: data.attacks },
    { name: "Normal", value: data.normal }
  ]

  const barData = Object.keys(data.byType || {}).map((k) => ({
    name: k,
    value: data.byType[k]
  }))

  return (
    <Layout>
      <div className="stats">

        <h1>📊 Security Analytics Dashboard</h1>

        {/* FILTER BUTTON */}
        <button
          className="filter-btn"
          onClick={() => setShowFilter(true)}
        >
          🔍 Filter Statistics
        </button>

        {/* FILTER MODAL */}
        {showFilter && (
          <div
            className="modal-overlay"
            onClick={() => setShowFilter(false)}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Filter Statistics</h2>

              <div className="filter-grid">

                <div>
                  <label>Attack Type</label>

                  {/* PROFESSIONAL SELECT */}
                  <select
                    value={attackType}
                    onChange={(e) => setAttackType(e.target.value)}
                  >
                    <option value="">All Attack Types</option>
                    <option value="sql_injection">SQL Injection</option>
                    <option value="xss">XSS</option>
                    <option value="brute_force">Brute Force</option>
                    <option value="csrf">CSRF</option>
                    <option value="path_traversal">Path Traversal</option>
                    <option value="command_injection">Command Injection</option>
                  </select>
                </div>

                <div>
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

              </div>

              <div className="modal-actions">

                <button
                  className="apply-btn"
                  onClick={() => {
                    fetchStats()
                    setShowFilter(false)
                  }}
                >
                  Apply
                </button>

                <button
                  className="reset-btn"
                  onClick={resetFilters}
                >
                  Reset
                </button>

                <button
                  className="close-btn"
                  onClick={() => setShowFilter(false)}
                >
                  Close
                </button>

              </div>

            </div>
          </div>
        )}

        {/* KPIS */}
        <div className="kpis">
          <div className="card green">
            <h4>Total</h4>
            <p>{data.total}</p>
          </div>

          <div className="card red">
            <h4>Attacks</h4>
            <p>{data.attacks}</p>
          </div>

          <div className="card blue">
            <h4>Normal</h4>
            <p>{data.normal}</p>
          </div>

          <div className="card purple">
            <h4>Accuracy</h4>
            <p>{data.accurcy || data.accuracy}%</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="charts">

          <div className="box">
            <h3>Traffic</h3>

            <PieChart width={300} height={300}>
              <Pie data={pieData} dataKey="value">
                <Cell fill="#e74c3c" />
                <Cell fill="#2ecc71" />
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="box">
            <h3>Attack Types</h3>

            <BarChart
              width={400}
              height={300}
              data={barData}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#3498db"
              />
            </BarChart>
          </div>

        </div>

        {/* TIMELINE */}
        <div className="box full">
          <h3>Attacks Over Time</h3>

          <LineChart
            width={800}
            height={300}
            data={data.timeline || []}
          >
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="attacks"
              stroke="#e74c3c"
            />
          </LineChart>
        </div>

        {/* TOP URLS */}
        <div className="box full">
          <h3>Top Attacked URLs</h3>

          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Count</th>
              </tr>
            </thead>

            <tbody>
              {(data.topUrls || []).map((u, i) => (
                <tr key={i}>
                  <td>{u.url}</td>
                  <td>{u.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  )
}