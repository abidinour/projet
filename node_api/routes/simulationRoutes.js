const express = require("express")
const router  = express.Router()
const axios   = require("axios")
const AttackLog = require("../models/attackLog")

const AI_URL    = "http://127.0.0.1:8000/predict"
const MAX_COUNT = 500  // hard cap per run
const BATCH     = 20   // parallel requests per batch

function buildUrl(basePath, profile) {
  if (profile === "sqli")  return basePath + "?id=1 UNION SELECT password FROM users--"
  if (profile === "xss")   return basePath + "?q=<script>alert(document.cookie)</script>"
  if (profile === "mixed") {
    const pick = Math.random()
    if (pick < 0.5)  return basePath
    if (pick < 0.75) return basePath + "?id=1 OR 1=1--"
    return               basePath + "?search=<img src=x onerror=alert(1)>"
  }
  return basePath 
}

async function simulateOne(url) {
  const aiRes = await axios.post(AI_URL, { url, content: "" }, { timeout: 5000 })
  const { prediction, attack_type, confidence } = aiRes.data
  await AttackLog.create({ url, prediction, attack_type, confidence })
}

router.post("/simulate", async (req, res) => {
  const { profile = "normal", volume = 10, paths = ["/"] } = req.body

  const count = Math.min(Number(volume), MAX_COUNT)

  const urls = Array.from({ length: count }, () => {
    const randomPath = paths[Math.floor(Math.random() * paths.length)]
    return buildUrl(randomPath, profile)
  })

  let completed = 0
  let failed    = 0

  for (let i = 0; i < urls.length; i += BATCH) {
    const batch   = urls.slice(i, i + BATCH)
    const results = await Promise.allSettled(batch.map(url => simulateOne(url)))
    results.forEach(r => r.status === "fulfilled" ? completed++ : failed++)
  }

  res.json({ message: "Simulation completed", total: count, completed, failed })
})

module.exports = router