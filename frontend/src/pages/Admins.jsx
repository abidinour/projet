import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "../components/Layout"
import "./Admins.css"

export default function Admins() {
  const [admins, setAdmins] = useState([])
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get(
        "http://localhost:5000/admins",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setAdmins(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const addAdmin = async () => {
    if (!email.trim()) {
      alert("Enter admin email")
      return
    }

    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      await axios.post(
        "http://localhost:5000/admins",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setEmail("")
      fetchAdmins()
      alert("Admin added successfully")
    } catch (err) {
      alert("Error adding admin")
    } finally {
      setLoading(false)
    }
  }

  const deleteAdmin = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    )

    if (!confirmDelete) return

    try {
      const token = localStorage.getItem("token")

      await axios.delete(
        `http://localhost:5000/admins/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchAdmins()
      alert("Admin deleted successfully")
    } catch (err) {
      alert("Error deleting admin")
      console.log(err)
    }
  }

  return (
    <Layout>
      <div className="admins-page">

        <div className="admins-header">
          <h1>Admin Management</h1>
          <p>Manage administrator access securely</p>
        </div>

        {/* ADD ADMIN */}
        <div className="admin-add-box">
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={addAdmin}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Admin"}
          </button>
        </div>

        {/* LIST + DELETE */}
        <div className="admin-list">

          {admins.length === 0 ? (
            <div className="empty-state">
              No admins found
            </div>
          ) : (
            admins.map((admin) => (
              <div
                className="admin-card"
                key={admin.id}
              >
                <div className="admin-info">
                  <div className="admin-avatar">
                    A
                  </div>

                  <div>
                    <h3>{admin.email}</h3>
                    <p>Administrator Access</p>
                  </div>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteAdmin(admin.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}

        </div>

      </div>
    </Layout>
  )
}