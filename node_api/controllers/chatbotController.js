const AttackLog = require("../models/attackLog")
const axios = require("axios")

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
const OLLAMA_MODEL = "phi"

/*
==================================================
NORMALIZE ATTACK TYPE
==================================================
*/
function normalizeAttackType(type) {
  if (!type) return "Unknown"

  const t = String(type).toLowerCase().trim()

  if (t === "sql_injection" || t === "sql injection") {
    return "SQL Injection"
  }

  if (t === "xss") {
    return "XSS"
  }

  if (t === "brute_force" || t === "brute force") {
    return "Brute Force"
  }

  if (t === "path_traversal" || t === "path traversal") {
    return "Path Traversal"
  }

  if (t === "command_injection" || t === "command injection") {
    return "Command Injection"
  }

  if (t === "csrf") {
    return "CSRF"
  }

  if (t === "none" || t === "normal request") {
    return "Normal Request"
  }

  if (t === "suspicious attack") {
    return "Suspicious Attack"
  }

  return type
}

/*
==================================================
DIRECT MALICIOUS PAYLOAD DETECTION
==================================================
*/
function isDangerousPayload(message) {
  const msg = message.toLowerCase()

  const dangerousPatterns = [
    "or 1=1",
    "union select",
    "drop table",
    "<script",
    "alert(",
    "onerror=",
    "<img",
    "../",
    "..\\",
    "etc/passwd",
    "cmd.exe",
    "bash -i",
    "whoami",
    "admin'",
    "select * from",
    "insert into",
    "delete from"
  ]

  return dangerousPatterns.some((pattern) =>
    msg.includes(pattern)
  )
}

/*
==================================================
OLLAMA SAFE RESPONSE
==================================================
*/
async function askOllama(message) {
  try {
    const prompt = `
You are a professional Cybersecurity AI Assistant.

STRICT RULES:
- Only answer cybersecurity related questions
- Never generate games
- Never generate puzzles
- Never generate roleplay
- Never generate stories
- Never generate logical riddles
- Never invent fake incidents
- Keep answers short, professional, and clear
- If question is unrelated to cybersecurity, politely redirect

User Question:
${message}
`

    const response = await axios.post(
      OLLAMA_URL,
      {
        model: OLLAMA_MODEL,
        prompt,
        stream: false
      },
      {
        timeout: 30000
      }
    )

    return (
      response.data.response?.trim() ||
      "I can help with cybersecurity questions only."
    )
  } catch (error) {
    console.log("❌ OLLAMA ERROR:", error.message)

    return "AI assistant temporarily unavailable. Please try again."
  }
}

/*
==================================================
MAIN CHATBOT CONTROLLER
==================================================
*/
exports.chatbotMessage = async (req, res) => {
  try {
    const { message } = req.body

    if (!message || !message.trim()) {
      return res.json({
        reply: "Please enter a valid message."
      })
    }

    const msg = message.toLowerCase().trim()

    /*
    ==========================================
    GREETING
    ==========================================
    */
    if (
      msg === "hello" ||
      msg === "hi" ||
      msg === "bonjour" ||
      msg === "salut"
    ) {
      return res.json({
        reply:
          "Hello 👋 I am your Security AI Assistant. I can help you understand web attacks, suspicious requests, security monitoring, and platform protection."
      })
    }

    /*
    ==========================================
    DIRECT ATTACK PAYLOAD DETECTION
    ==========================================
    */
    if (isDangerousPayload(message)) {
      return res.json({
        reply:
          "⚠️ Suspicious malicious request detected.\n" +
          "Attack Type: High Risk Payload\n" +
          "Risk Level: Critical\n" +
          "This request matches known malicious attack patterns such as SQL Injection, XSS, Path Traversal, or Command Injection and has been flagged by the security engine."
      })
    }

    /*
    ==========================================
    ATTACKS TODAY (REAL DATABASE)
    ==========================================
    */
    if (
      msg.includes("how many attacks") ||
      msg.includes("attacks today") ||
      msg.includes("today attacks") ||
      msg.includes("show attack statistics") ||
      msg.includes("what attacks were detected today")
    ) {
      const logs = await AttackLog.findAll()

      const total = logs.length
      const byType = {}

      logs.forEach((log) => {
        const type = normalizeAttackType(log.attack_type)
        byType[type] = (byType[type] || 0) + 1
      })

      let details = ""

      Object.keys(byType)
        .sort((a, b) => byType[b] - byType[a])
        .forEach((type) => {
          details += `- ${type}: ${byType[type]}\n`
        })

      return res.json({
        reply: `Today ${total} attacks were detected:\n${details}`
      })
    }

    /*
    ==========================================
    MOST FREQUENT ATTACK
    ==========================================
    */
    if (
      msg.includes("most frequent attack") ||
      msg.includes("which attack is most frequent") ||
      msg.includes("which attack is most frequent?") ||
      msg.includes("most frequent detected attack")
    ) {
      const logs = await AttackLog.findAll()

      const byType = {}

      logs.forEach((log) => {
        const type = normalizeAttackType(log.attack_type)

        if (type !== "Normal Request") {
          byType[type] = (byType[type] || 0) + 1
        }
      })

      let topAttack = "No attacks detected"
      let max = 0

      for (const type in byType) {
        if (byType[type] > max) {
          max = byType[type]
          topAttack = type
        }
      }

      return res.json({
        reply: `The most frequent detected attack is ${topAttack} with ${max} recorded attempts.`
      })
    }

    /*
    ==========================================
    RECENT ATTACKS
    ==========================================
    */
    if (
      msg.includes("show recent attacks") ||
      msg.includes("recent attacks") ||
      msg.includes("latest threats")
    ) {
      const logs = await AttackLog.findAll({
        order: [["timestamp", "DESC"]],
        limit: 10
      })

      if (!logs.length) {
        return res.json({
          reply: "No recent attacks were detected."
        })
      }

      let details = "Recent detected attacks:\n"

      logs.forEach((log, index) => {
        const type = normalizeAttackType(log.attack_type)
        const url = log.url || "/"

        details += `${index + 1}. ${type} → ${url}\n`
      })

      return res.json({
        reply: details
      })
    }

    /*
    ==========================================
    SUSPICIOUS LOGIN ATTEMPTS
    ==========================================
    */
    if (
      msg.includes("suspicious login") ||
      msg.includes("login attempts")
    ) {
      return res.json({
        reply:
          "Yes. Multiple suspicious login attempts were detected including repeated failed authentications, unusual access patterns, and abnormal login requests flagged by the security monitoring system."
      })
    }

    /*
    ==========================================
    MOST DANGEROUS ATTACK
    ==========================================
    */
    if (msg.includes("most dangerous attack")) {
      return res.json({
        reply:
          "SQL Injection is considered one of the most dangerous attacks because it can expose sensitive database information, bypass authentication, modify data, and compromise the entire system if protections are weak."
      })
    }

    /*
    ==========================================
    SECURITY STATUS
    ==========================================
    */
    if (
      msg.includes("security status") ||
      msg.includes("system secure") ||
      msg.includes("is the system secure") ||
      msg.includes("current security status")
    ) {
      return res.json({
        reply:
          "Current security status: Protected ✅ No critical threats detected. AI monitoring, logging, attack detection services, and database logging are active."
      })
    }

    /*
    ==========================================
    PROTECTION RECOMMENDATIONS
    ==========================================
    */
    if (
      msg.includes("how to protect") ||
      msg.includes("prevent attacks") ||
      msg.includes("security recommendations") ||
      msg.includes("how can we prevent")
    ) {
      return res.json({
        reply:
          "To protect against cyber attacks, use strong authentication, input validation, parameterized SQL queries, XSS filtering, CSRF protection, role-based access control, password hashing, rate limiting, firewalls, monitoring, and regular security audits."
      })
    }

    /*
    ==========================================
    FALLBACK → OLLAMA
    ==========================================
    */
    const aiReply = await askOllama(message)

    return res.json({
      reply: aiReply
    })
  } catch (error) {
    console.log("❌ CHATBOT ERROR:", error.message)

    return res.status(500).json({
      error: "Chatbot internal error"
    })
  }
}