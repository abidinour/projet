const express = require("express")
const router = express.Router()
const axios = require("axios")
const AttackLog = require("../models/attackLog")

const AI_URL = "http://127.0.0.1:8000/predict"

function buildUrl(basePath, profile) {
  if (profile === "sqli") {
    return `${basePath}?id=1 OR 1=1--`
  }

  if (profile === "xss") {
    return `${basePath}?q=<script>alert(1)</script>`
  }

  return basePath
}

router.post("/simulate", async (req, res) => {
  try {
    const { profile = "normal", volume = 10, paths = ["/"] } = req.body

    for (let i = 0; i < Number(volume); i++) {
      const url = buildUrl(paths[0], profile)

      const aiRes = await axios.post(AI_URL, {
        message: url
      })

      await AttackLog.create({
        url,
        prediction: aiRes.data.prediction,
        attack_type: aiRes.data.attack_type,
        confidence: aiRes.data.confidence
      })
    }

    res.json({ message: "Simulation completed" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Simulation error" })
  }
})

module.exports = router