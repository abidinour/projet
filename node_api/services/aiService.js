const axios = require("axios")

exports.checkWithAI = async (input) => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/predict",
      { message: input },
      { timeout: 4000 }
    )

    return res.data
  } catch {
    return {
      prediction: "unknown",
      attack_type: "unknown",
      confidence: 0
    }
  }
}