const axios = require("axios")
const AttackLog = require("../models/attackLog")

exports.checkUrl = async (req, res) => {
    try {
        const { url } = req.body

        if (!url) {
            return res.status(400).json({ error: "URL required" })
        }

        const ai = await axios.post("http://127.0.0.1:8000/predict", {
            url,
            content: ""
        })

        const result = ai.data

        const log = await AttackLog.create({
            url,
            method: req.method,
            ip: req.ip,
            prediction: result.prediction,
            attack_type: result.attack_type,
            confidence: result.confidence,
            responseCode: result.prediction === "attack" ? 403 : 200,
            requestLength: url.length
        })

        res.status(log.responseCode).json(result)

    } catch (error) {
        console.log("❌ AI ERROR:", error.message)
        res.status(500).json({ error: "AI error" })
    }
}