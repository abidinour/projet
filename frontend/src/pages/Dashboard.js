import { useEffect, useState } from "react"
import axios from "axios"
import "./Dashboard.css"

function Dashboard() {

  const [logs, setLogs] = useState([])
  const token = localStorage.getItem("token")

  const fetchLogs = () => {
    axios.get("http://localhost:5000/logs", {
      headers: { Authorization: token }
    })
    .then(res => setLogs(res.data))
    .catch(err => console.log(err.response?.data))
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  // stats
  const total = logs.length
  const attacks = logs.filter(l => l.prediction === "attack").length
  const normal = logs.filter(l => l.prediction === "normal").length

  const accuracy = total ? ((normal / total) * 100).toFixed(1) : 0

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>NEXALYTICS</h2>
        <p className="menu active">Dashboard</p>
        <p className="menu">Logs</p>
        <p className="menu logout"
           onClick={() => {
             localStorage.removeItem("token")
             window.location.href = "/"
           }}
        >
          Logout
        </p>
      </div>

      {/* MAIN */}
      <div className="main">

        <h1>AI Logs Dashboard 🚀</h1>

        {/* CARDS */}
        <div className="cards">

          <div className="card">
            <h3>Total Logs</h3>
            <p>{total}</p>
          </div>

          <div className="card red">
            <h3>Attacks</h3>
            <p>{attacks}</p>
          </div>

          <div className="card green">
            <h3>Normal</h3>
            <p>{normal}</p>
          </div>

          <div className="card blue">
            <h3>Accuracy</h3>
            <p>{accuracy}%</p>
          </div>

        </div>

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>URL</th>
              <th>Type</th>
              <th>Confidence</th>
            </tr>
          </thead>

          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>

                <td className="url">{log.url}</td>

                <td>
                  <span className={
                    log.prediction === "attack"
                      ? "badge red"
                      : "badge green"
                  }>
                    {log.attack_type || log.prediction}
                  </span>
                </td>

                <td>
                  <div className="progress">
                    <div
                      className="bar"
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
  )
}

export default Dashboard