require("dotenv").config() 

 const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

// DB
const sequelize = require("./config/database")

// Routes
const userRoutes = require("./routes/userRoutes")
const logRoutes = require("./routes/logRoutes")
const simulationRoutes = require("./routes/simulationRoutes")

// Use routes
app.use("/", userRoutes)
app.use("/logs", logRoutes)
app.use("/simulation", simulationRoutes)

// Test
app.get("/", (req, res) => {
  res.send("🚀 AI Security Server Running")
})

// Start
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