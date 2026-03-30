const express = require("express")
const cors = require("cors")

// ==========================
// Database
// ==========================
const sequelize = require("./config/database")

// ==========================
// Routes
// ==========================
const userRoutes = require("./routes/userRoutes")
const logRoutes = require("./routes/logRoutes")

// ==========================
// App Init
// ==========================
const app = express()

app.use(cors())
app.use(express.json())

// ==========================
// Routes Usage
// ==========================

// User routes → register / login / update / password
app.use("/", userRoutes)

// Logs & AI routes → check / logs
app.use("/logs", logRoutes)

// ==========================
// Test Route
// ==========================
app.get("/", (req, res) => {
    res.send("🚀 AI Security Server Running")
})

// ==========================
// Start Server
// ==========================
async function startServer() {
    try {
        await sequelize.authenticate()
        console.log("✅ Database connected")

        await sequelize.sync({ alter: true })
        console.log("✅ Tables synced")

        app.listen(5000, () => {
            console.log("🚀 Server running on http://localhost:5000")
        })

    } catch (error) {
        console.error("❌ DB error:", error.message)
    }
}

startServer()