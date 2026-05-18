const AttackLog = require("../models/attackLog")
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

    return res.status(403).json({
      error: "🚨 Attack blocked",
      type: "Manual Detection"
    })
  }

  // AI check
  const ai = await checkWithAI(input)

  if (ai.attack_type && ai.attack_type !== "Normal Request") {
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

    return res.status(403).json({
      error: "🚨 Attack blocked",
      type: ai.attack_type
    })
  }

  next()
}