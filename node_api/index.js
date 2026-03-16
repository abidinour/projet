const express = require("express")
const axios = require("axios")
const cors = require("cors")
const bcrypt = require("bcrypt")

const sequelize = require("./config/database")
const AttackLog = require("./models/attackLog")
const User = require("./models/User")

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
   Register
========================== */

app.post("/register", async(req,res)=>{

    try{

        const {name,email,password} = req.body

        if(!name || !email || !password){

            return res.status(400).json({
                error:"All fields required"
            })

        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({

            name,
            email,
            password:hashedPassword

        })

        res.json({
            message:"User registered",
            user:user
        })

    }

    catch(error){

        console.log(error)

        res.status(500).json({
            error:"Register error"
        })

    }

})

/* ==========================
   Login
========================== */

app.post("/login", async(req,res)=>{

    try{

        const {email,password} = req.body

        const user = await User.findOne({
            where:{email}
        })

        if(!user){

            return res.status(404).json({
                error:"User not found"
            })

        }

        const validPassword = await bcrypt.compare(password,user.password)

        if(!validPassword){

            return res.status(401).json({
                error:"Wrong password"
            })

        }

        res.json({
            message:"Login successful",
            user:user
        })

    }

    catch(error){

        res.status(500).json({
            error:"Login error"
        })

    }

})

/* ==========================
   Update User
========================== */

app.put("/user/:id", async(req,res)=>{

    try{

        const {name,email} = req.body

        await User.update(

            {name,email},

            {where:{id:req.params.id}}

        )

        res.json({
            message:"User updated"
        })

    }

    catch(error){

        res.status(500).json({
            error:"Update error"
        })

    }

})

/* ==========================
   Change Password
========================== */

app.put("/change-password/:id", async(req,res)=>{

    try{

        const {password} = req.body

        const hashedPassword = await bcrypt.hash(password,10)

        await User.update(

            {password:hashedPassword},

            {where:{id:req.params.id}}

        )

        res.json({
            message:"Password changed"
        })

    }

    catch(error){

        res.status(500).json({
            error:"Password change error"
        })

    }

})

/* ==========================
   AI Attack Detection
========================== */

app.post("/check", async(req,res)=>{

    try{

        const {url} = req.body

        if(!url){

            return res.status(400).json({
                error:"URL required"
            })

        }

        const ai = await axios.post(

            "http://127.0.0.1:8000/predict",

            {
                url:url,
                content:""
            }

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

        console.log("Attack Log saved")

        res.status(log.responseCode).json(result)

    }

    catch(error){

        console.log("AI ERROR:",error.message)

        res.status(500).json({
            error:"AI server error"
        })

    }

})

/* ==========================
   Get Logs
========================== */

app.get("/logs", async(req,res)=>{

    try{

        const logs = await AttackLog.findAll({
            order:[["timestamp","DESC"]]
        })

        res.json(logs)

    }

    catch(error){

        res.status(500).json({
            error:"Database error"
        })

    }

})

/* ==========================
   Start Server
========================== */

app.listen(3000,()=>{

    console.log("Server running on http://localhost:3000")

})