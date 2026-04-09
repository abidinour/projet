const express = require("express")
const router = express.Router()
const axios = require("axios")
const AttackLog = require("../models/attackLog")

router.post("/simulate", async (req, res) => {

  const { profile, volume, paths } = req.body

  try {

    const count = volume || 10

    for (let i = 0; i < count; i++) {

      const randomPath = paths[Math.floor(Math.random() * paths.length)]

      let url = randomPath

      if (profile === "sqli") {
        url += "?id=1 OR 1=1"
      } else if (profile === "xss") {
        url += "<script>alert(1)</script>"
      }

      const aiRes = await axios.post("http://127.0.0.1:8000/predict", {
        url,
        content: ""
      })

      const result = aiRes.data

      await AttackLog.create({
        url,
        prediction: result.prediction,
        attack_type: result.attack_type,
        confidence: result.confidence
      })
    }

    res.json({ message: "Simulation completed", total: count })

  } catch (err) {
    console.log("❌ SIMULATION ERROR:", err.message)
    res.status(500).json({ error: "Simulation failed" })
  }
})

module.exports = router