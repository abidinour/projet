const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()

// ========================
// Middlewares
// ========================

app.use(cors())
app.use(express.json())

// ========================
// Test route
// ========================

app.get("/", (req, res) => {
    res.send("Node API running")
})


// ========================
// Check if URL is attack
// ========================

app.post("/check", async (req, res) => {

    try {

        const { url } = req.body

        // تحقق من input
        if (!url) {
            return res.status(400).json({
                error: "URL is required"
            })
        }

        console.log("Checking URL:", url)

        // إرسال للـ Python AI
        const response = await axios.post(
            "http://127.0.0.1:8000/predict",
            {
                url: url,
                content: ""
            }
        )

        console.log("AI response:", response.data)

        res.json({
            url: url,
            prediction: response.data.prediction
        })

    } 
    catch (error) {

        console.error("Error contacting AI:", error.message)

        res.status(500).json({
            error: "AI server error"
        })

    }

})


// ========================
// Start server
// ========================

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Node server running on http://localhost:${PORT}`)
})