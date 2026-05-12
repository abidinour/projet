require("dotenv").config()

const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const sequelize = require("./config/database")

// ROUTES
const userRoutes = require("./routes/userRoutes")
const logRoutes = require("./routes/logRoutes")
const simulationRoutes = require("./routes/simulationRoutes")
const adminRoutes = require("./routes/adminRoutes")
const chatbotRoutes = require("./routes/chatbotRoutes")

app.use("/", userRoutes)
app.use("/logs", logRoutes)
app.use("/simulation", simulationRoutes)
app.use("/admins", adminRoutes)
app.use("/chatbot", chatbotRoutes)

app.get("/", (req, res) => {
  res.send("🚀 AI Security Server Running")
})

async function startServer() {
  try {
    await sequelize.authenticate()
    console.log("✅ Database connected")

    await sequelize.sync()
    console.log("✅ Tables synced")

    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000")
    })

  } catch (error) {
    console.error("❌ DB error:", error.message)
  }
}

startServer()