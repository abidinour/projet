require("dotenv").config()

const express = require("express")
const cors = require("cors")

const app = express()

/*
==========================
MIDDLEWARES
==========================
*/
app.use(cors())

app.use(express.json())

/*
==========================
DATABASE
==========================
*/
const sequelize = require("./config/database")

// 🔥 LOAD MODELS + RELATIONS
require("./models")

/*
==========================
ROUTES
==========================
*/

// AUTH + USERS
const userRoutes = require("./routes/userRoutes")

// SECURITY
const logRoutes = require("./routes/logRoutes")
const simulationRoutes = require("./routes/simulationRoutes")
const adminRoutes = require("./routes/adminRoutes")
const chatbotRoutes = require("./routes/chatbotRoutes")
const statsRoutes = require("./routes/statsRoutes")
const notificationRoutes = require("./routes/notificationRoutes")

// SCHOOL MANAGEMENT
const studentRoutes = require("./routes/studentRoutes")
const classRoutes = require("./routes/classRoutes")
const subjectRoutes = require("./routes/subjectRoutes")
const scheduleRoutes = require("./routes/scheduleRoutes")
const noteRoutes = require("./routes/noteRoutes")

/*
==========================
USE ROUTES
==========================
*/

// USERS
app.use("/", userRoutes)

// SECURITY
app.use("/logs", logRoutes)
app.use("/simulation", simulationRoutes)
app.use("/admins", adminRoutes)
app.use("/chatbot", chatbotRoutes)
app.use("/stats", statsRoutes)
app.use("/notifications", notificationRoutes)

// SCHOOL
app.use("/students", studentRoutes)
app.use("/classes", classRoutes)
app.use("/subjects", subjectRoutes)
app.use("/schedule", scheduleRoutes)
app.use("/notes", noteRoutes)

/*
==========================
ROOT
==========================
*/
app.get("/", (req, res) => {
  res.send("🚀 AI Security Server Running")
})

/*
==========================
404
==========================
*/
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  })
})

/*
==========================
GLOBAL ERROR HANDLER
==========================
*/
app.use((err, req, res, next) => {

  console.error("❌ GLOBAL ERROR:", err)

  res.status(500).json({
    error: "Internal server error"
  })
})

/*
==========================
START SERVER
==========================
*/
const PORT = process.env.PORT || 5000

async function startServer() {

  try {

    await sequelize.authenticate()
    console.log("✅ Database connected")

    await sequelize.sync()
    console.log("✅ Tables synced")

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })

  } catch (error) {

    console.error("❌ DB error:", error.message)

  }
}

startServer()