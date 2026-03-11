const express = require("express")
const axios = require("axios")
const cors = require("cors")

const sequelize = require("./config/database")
const AttackLog = require("./models/attackLog")

const app = express()

app.use(cors())
app.use(express.json())

/* ==========================
   Database Connection
========================== */

sequelize.sync()
.then(()=>{
    console.log("Database synced")
})
.catch(err=>{
    console.log("Database error:",err)
})

/* ==========================
   Test Route
========================== */

app.get("/",(req,res)=>{
    res.send("Node API running")
})

/* ==========================
   AI Attack Detection Route
========================== */

app.post("/check", async(req,res)=>{

    try{

        const {url} = req.body

        if(!url){
            return res.status(400).json({
                error:"URL required"
            })
        }

        /* ==========================
           Send request to Python AI
        =========================== */

        const ai = await axios.post(
            "http://127.0.0.1:8000/predict",
            {
                url:url,
                content:""
            }
        )

        const result = ai.data

        /* ==========================
           Create Log Object
        =========================== */

        const log = {

            request:url,
            method:req.method,
            ip:req.ip,
            prediction:result.attack_type || result.prediction,
            confidence:result.confidence,
            timestamp:new Date(),
            responseCode: result.prediction === "attack" ? 403 : 200,
            requestLength:url.length
        }

        /* ==========================
           Save Log in Database
        =========================== */

        await AttackLog.create(log)

        console.log("Attack Log:",log)

        /* ==========================
           Send Response
        =========================== */

        res.status(log.responseCode).json(result)

    }

    catch(error){

        console.log("AI ERROR:", error.response?.data || error.message)

        res.status(500).json({
            error:"AI server error"
        })

    }

})

/* ==========================
   Start Server
========================== */

app.listen(3000,()=>{
    console.log("Server running on http://localhost:3000")
})