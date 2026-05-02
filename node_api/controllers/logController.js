const axios = require("axios")
const AttackLog = require("../models/attackLog")

/*
========================================
SIMPLE FALLBACK DETECTION (NO AI)
========================================
*/
function basicDetection(url) {
  const msg = url.toLowerCase()

  if (
    msg.includes("or 1=1") ||
    msg.includes("union select") ||
    msg.includes("drop table")
  ) {
    return {
      prediction: "malicious",
      attack_type: "SQL Injection",
      confidence: 0.7,
      risk: "High Risk"
    }
  }

  if (msg.includes("<script") || msg.includes("alert(")) {
    return {
      prediction: "malicious",
      attack_type: "XSS",
      confidence: 0.7,
      risk: "High Risk"
    }
  }

  if (msg.includes("../") || msg.includes("etc/passwd")) {
    return {
      prediction: "malicious",
      attack_type: "Path Traversal",
      confidence: 0.7,
      risk: "High Risk"
    }
  }

  if (msg.includes("cmd.exe") || msg.includes("whoami")) {
    return {
      prediction: "malicious",
      attack_type: "Command Injection",
      confidence: 0.7,
      risk: "High Risk"
    }
  }

  return {
    prediction: "normal",
    attack_type: "Normal Request",
    confidence: 0.9,
    risk: "Low Risk"
  }
}

/*
========================================
MAIN CONTROLLER
========================================
*/
exports.checkUrl = async (req, res) => {
  try {
    const { url } = req.body

    if (!url || !url.trim()) {
      return res.status(400).json({
        error: "URL is required"
      })
    }

    let aiData = {}

    /*
    ========================================
    AI CALL (WITH TIMEOUT + FALLBACK)
    ========================================
    */
    try {
      const ai = await axios.post(
        "http://127.0.0.1:8000/predict",
        { message: url },
        { timeout: 5000 }
      )

      aiData = ai.data || {}

      console.log("✅ AI response received")

    } catch (err) {
      console.log("⚠️ AI offline → using fallback detection")

      aiData = basicDetection(url)
    }

    /*
    ========================================
    SAFETY NORMALIZATION
    ========================================
    */
    aiData.prediction = aiData.prediction || "unknown"
    aiData.attack_type = aiData.attack_type || "unknown"
    aiData.confidence = aiData.confidence || 0
    aiData.risk = aiData.risk || "Unknown"

    /*
    ========================================
    SAVE TO DATABASE
    ========================================
    */
    await AttackLog.create({
      url,
      method: req.method,
      ip: req.ip,
      prediction: aiData.prediction,
      attack_type: aiData.attack_type,
      confidence: aiData.confidence,
      responseCode: aiData.risk === "High Risk" ? 403 : 200,
      requestLength: url.length
    })

    /*
    ========================================
    FINAL RESPONSE
    ========================================
    */
    return res.json({
      status: "success",
      source:
        aiData.prediction === "unknown"
          ? "fallback"
          : "AI",
      data: aiData
    })

  } catch (error) {
    console.log("❌ LOG CONTROLLER ERROR:", error.message)

    return res.status(500).json({
      error: "Internal server error"
    })
  }
}