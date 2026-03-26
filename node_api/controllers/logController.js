const axios = require("axios")
const AttackLog = require("../models/attackLog")

/* ==========================
   CHECK URL (AI)
========================== */
exports.checkUrl = async (req, res) => {

    try {

        const { url } = req.body

        if (!url) {
            return res.status(400).json({
                error: "URL required"
            })
        }

        // 🔥 DEBUG
        console.log("➡️ Calling AI...")
        console.log("URL:", url)

        // 🔥 CALL FASTAPI
        const ai = await axios.post(
            "http://127.0.0.1:8000/predict",
            {
                url: url,
                content: ""
            }
        )

        const result = ai.data

        console.log("✅ AI RESPONSE:", result)

        // 🔥 SAVE LOG
        const log = {
            url: url,
            method: req.method,
            ip: req.ip,
            prediction: result.prediction,
            attack_type: result.attack_type || "none",
            confidence: result.confidence,
            responseCode: result.prediction === "attack" ? 403 : 200,
            requestLength: url.length,
            timestamp: new Date()
        }

        await AttackLog.create(log)

        console.log("💾 Log saved")

        res.status(log.responseCode).json(result)

    } catch (error) {

        // 🔥 IMPORTANT DEBUG
        console.log("❌ AI ERROR:", error.message)

        // إذا فما response من AI
        if (error.response) {
            console.log("AI RESPONSE ERROR:", error.response.data)
        }

        res.status(500).json({
            error: "AI error"
        })

    }

}

/* ==========================
   GET LOGS
========================== */
exports.getLogs = async (req, res) => {

    try {

        const logs = await AttackLog.findAll({
            order: [["timestamp", "DESC"]]
        })

        res.json(logs)

    } catch (error) {

        console.log("❌ LOG ERROR:", error.message)

        res.status(500).json({
            error: "Database error"
        })

    }

}