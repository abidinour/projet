const AttackLog = require("../models/attackLog")
const Notification = require("../models/notification")
const { checkWithAI } = require("../services/aiService")

module.exports = async (req, res, next) => {

  const input = JSON.stringify(req.body)

  const lower = input.toLowerCase()

  const patterns = [
    "or 1=1",
    "union",
    "<script",
    "drop",
    "../",
    "cmd",
    "whoami"
  ]

  const isAttack = patterns.some(p => lower.includes(p))

  // =========================
  // MANUAL DETECTION
  // =========================
  if (isAttack) {

    await AttackLog.create({
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      prediction: "malicious",
      attack_type: "Manual Detection",
      confidence: 0.9,
      responseCode: 403,
      requestLength: input.length
    })

    // 🔔 SAVE NOTIFICATION
    await Notification.create({
      title: "Security Attack Detected",
      barTitle: "Manual Detection",
      body: `Attack detected on ${req.originalUrl}`
    })

    return res.status(403).json({
      error: "🚨 Attack blocked",
      type: "Manual Detection"
    })
  }

// =========================
// AI DETECTION
// =========================

const ai = await checkWithAI(input)

console.log("AI RESULT:", ai)

if (
  ai.attack_type &&
  ai.attack_type !== "Normal Request" &&
  ai.attack_type !== "unknown"
) {

  await AttackLog.create({
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    prediction: ai.prediction,
    attack_type: ai.attack_type,
    confidence: ai.confidence,
    responseCode: 403,
    requestLength: input.length
  })

  await Notification.create({
    title: "AI Attack Detected",
    barTitle: ai.attack_type,
    body: `AI detected ${ai.attack_type} on ${req.originalUrl}`
  })

  return res.status(403).json({
    error: "🚨 Attack blocked",
    type: ai.attack_type
  })
}

next()
}