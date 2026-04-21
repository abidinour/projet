import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "../components/Layout" // ✅ أهم حاجة
import "./Statistiques.css"

import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, Tooltip
} from "recharts"

export default function Statistiques() {

  const [data, setData] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const token = localStorage.getItem("token")

    const res = await axios.get("http://localhost:5000/logs/stats", {
      headers: { Authorization: `Bearer ${token}` }
    })

    setData(res.data)
  }

  if (!data) return <Layout><p>Loading...</p></Layout>

  const pieData = [
    { name: "Attacks", value: data.attacks },
    { name: "Normal", value: data.normal }
  ]

  const barData = Object.keys(data.byType).map(k => ({
    name: k,
    value: data.byType[k]
  }))

  return (
    <Layout> {/* ✅ هذا هو الحل */}
      <div className="stats">

        <h1>📊 Security Analytics Dashboard</h1>

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
            <p>{data.accuracy}%</p>
          </div>
        </div>

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
            <BarChart width={400} height={300} data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3498db" />
            </BarChart>
          </div>
        </div>

        <div className="box full">
          <h3>Attacks Over Time</h3>
          <LineChart width={800} height={300} data={data.timeline}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="attacks" stroke="#e74c3c" />
          </LineChart>
        </div>

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
              {data.topUrls.map((u, i) => (
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