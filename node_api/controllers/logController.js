const axios = require("axios")
const AttackLog = require("../models/attackLog")

exports.checkUrl = async (req, res) => {
  try {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ error: "URL required" })
    }

    const ai = await axios.post("http://127.0.0.1:8000/predict", {
      message: url
    })

    const result = ai.data

    await AttackLog.create({
      url,
      method: req.method,
      ip: req.ip,
      prediction: result.prediction,
      attack_type: result.attack_type,
      confidence: result.confidence,
      responseCode: result.risk === "High Risk" ? 403 : 200,
      requestLength: url.length
    })

    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "AI error" })
  }
}