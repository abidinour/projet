import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "../components/Layout"

export default function Notifications() {

  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {

    const res = await axios.get(
      "http://localhost:3307/notifications"
    )

    setNotifications(res.data)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (

    <Layout>

      <div className="card">

        <div className="page-header">

          <h2>Notifications</h2>

          <p className="page-subtitle">
            AI Security Alerts
          </p>

        </div>

        <div className="notifications-list">

          {notifications.map((notif) => (

            <div
              className="notification-card"
              key={notif.id}
            >

              <div className="notif-top">

                <div className="notif-badge">
                  {notif.barTitle}
                </div>

                <div className="notif-date">
                  {new Date(
                    notif.createdAt
                  ).toLocaleString()}
                </div>

              </div>

              <h3>{notif.title}</h3>

              <p>{notif.body}</p>

            </div>

          ))}

        </div>

      </div>

    </Layout>
  )
}