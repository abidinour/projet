import { useEffect, useState } from "react"
import axios from "axios"
import "./dashboard.css"

function Dashboard() {

  const [logs, setLogs] = useState([])

  useEffect(() => {

    const token = localStorage.getItem("token")

    axios.get("http://localhost:3000/logs", {
      headers: {
        Authorization: token
      }
    })
    .then(res => setLogs(res.data))
    .catch(() => alert("Error loading logs"))

  }, [])

  return (
    <div className="dash-container">

      <h1>AI Logs Dashboard 🚀</h1>

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
              <td>{log.url}</td>
              <td className={log.prediction === "attack" ? "attack" : "normal"}>
                {log.prediction}
              </td>
              <td>{log.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default Dashboard