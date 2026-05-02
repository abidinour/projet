const AttackLog = require("../models/attackLog")
const axios = require("axios")

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
const OLLAMA_MODEL = "phi"

/*
===============================
NORMALIZE ATTACK TYPE
===============================
*/
function normalizeAttackType(type) {
  if (!type) return "Unknown"

  const t = String(type).toLowerCase().trim()

  if (t.includes("sql")) return "SQL Injection"
  if (t.includes("xss")) return "XSS"
  if (t.includes("brute")) return "Brute Force"
  if (t.includes("path")) return "Path Traversal"
  if (t.includes("command")) return "Command Injection"
  if (t.includes("csrf")) return "CSRF"
  if (t.includes("none") || t.includes("normal")) return "Normal Request"
  if (t.includes("suspicious")) return "Suspicious Attack"

  return type
}

/*
===============================
DETECT MALICIOUS PAYLOAD
===============================
*/
function isDangerousPayload(message) {
  const msg = message.toLowerCase()

  const patterns = [
    "or 1=1",
    "union select",
    "drop table",
    "<script",
    "alert(",
    "onerror=",
    "../",
    "..\\",
    "etc/passwd",
    "cmd.exe",
    "whoami",
    "admin'",
    "select * from"
  ]

  return patterns.some(p => msg.includes(p))
}

/*
===============================
OLLAMA AI
===============================
*/
async function askOllama(message) {
  try {
    const prompt = `
You are a professional Cybersecurity AI Assistant.

RULES:
- Only cybersecurity topics
- No games / no puzzles / no stories
- Short and clear answers

User:
${message}
`

    const response = await axios.post(
      OLLAMA_URL,
      {
        model: OLLAMA_MODEL,
        prompt,
        stream: false
      },
      { timeout: 20000 }
    )

    return response.data.response?.trim() ||
      "I can help with cybersecurity questions only."

  } catch (err) {
    console.log("❌ OLLAMA ERROR:", err.message)
    return "AI temporarily unavailable."
  }
}

/*
===============================
MAIN CONTROLLER
===============================
*/
exports.chatbotMessage = async (req, res) => {
  try {
    const { message } = req.body

    if (!message || !message.trim()) {
      return res.json({ reply: "Please enter a valid message." })
    }

    const msg = message.toLowerCase().trim()

    /*
    =========================
    GREETING
    =========================
    */
    if (["hello", "hi", "bonjour", "salut"].includes(msg)) {
      return res.json({
        reply:
          "Hello 👋 I am your Security AI Assistant. I can help you with attacks, monitoring, and platform security."
      })
    }

    /*
    =========================
    MALICIOUS PAYLOAD
    =========================
    */
    if (isDangerousPayload(message)) {
      return res.json({
        reply:
          "⚠️ Suspicious malicious request detected.\n" +
          "Risk Level: Critical\n" +
          "Possible SQL Injection / XSS / Command Injection."
      })
    }

    /*
    =========================
    ATTACK STATS
    =========================
    */
    if (
      msg.includes("attacks today") ||
      msg.includes("how many attacks") ||
      msg.includes("statistics")
    ) {
      const logs = await AttackLog.findAll({
        attributes: ["attack_type"]
      })

      const total = logs.length
      const byType = {}

      logs.forEach(log => {
        const type = normalizeAttackType(log.attack_type)
        byType[type] = (byType[type] || 0) + 1
      })

      let details = ""

      Object.keys(byType)
        .sort((a, b) => byType[b] - byType[a])
        .forEach(type => {
          details += `- ${type}: ${byType[type]}\n`
        })

      return res.json({
        reply: `Today ${total} attacks were detected:\n${details}`
      })
    }

    /*
    =========================
    MOST FREQUENT
    =========================
    */
    if (msg.includes("most frequent")) {
      const logs = await AttackLog.findAll({
        attributes: ["attack_type"]
      })

      const count = {}

      logs.forEach(log => {
        const type = normalizeAttackType(log.attack_type)
        if (type !== "Normal Request") {
          count[type] = (count[type] || 0) + 1
        }
      })

      let top = "None"
      let max = 0

      for (const t in count) {
        if (count[t] > max) {
          max = count[t]
          top = t
        }
      }

      return res.json({
        reply: `Most frequent attack: ${top} (${max} times)`
      })
    }

    /*
    =========================
    RECENT ATTACKS
    =========================
    */
    if (msg.includes("recent")) {
      const logs = await AttackLog.findAll({
        order: [["timestamp", "DESC"]],
        limit: 10
      })

      let text = "Recent attacks:\n"

      logs.forEach((log, i) => {
        text += `${i + 1}. ${normalizeAttackType(log.attack_type)} → ${log.url || "/"}\n`
      })

      return res.json({ reply: text })
    }

    /*
    =========================
    SECURITY STATUS
    =========================
    */
    if (msg.includes("security")) {
      return res.json({
        reply: "System secure ✅ Monitoring active. No critical threats."
      })
    }

    /*
    =========================
    FALLBACK AI
    =========================
    */
    const ai = await askOllama(message)

    return res.json({ reply: ai })

  } catch (error) {
    console.log("❌ CHATBOT ERROR:", error.message)

    return res.status(500).json({
      error: "Internal chatbot error"
    })
  }
}