const AttackLog = require("../models/attackLog")
const axios = require("axios")

exports.checkUrl = async (req,res)=>{
    try{

        const {url} = req.body

        if(!url){
            return res.status(400).json({ error:"URL required" })
        }

        const ai = await axios.post(
            "http://127.0.0.1:8000/predict",
            { url, content:"" }
        )

        const result = ai.data

        const log = {
            url:url,
            method:req.method,
            ip:req.ip,
            prediction:result.prediction,
            attack_type:result.attack_type || "none",
            confidence:result.confidence,
            responseCode: result.prediction === "attack" ? 403 : 200,
            requestLength:url.length,
            timestamp:new Date()
        }

        await AttackLog.create(log)

        res.status(log.responseCode).json(result)

    }catch(error){
        console.log(error.message)
        res.status(500).json({ error:"AI error" })
    }
}


exports.getLogs = async (req,res)=>{
    const logs = await AttackLog.findAll({
        order:[["timestamp","DESC"]]
    })

    res.json(logs)
}