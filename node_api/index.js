const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req,res)=>{
    res.send("Node API running")
})

app.post("/check", async (req,res)=>{

    try{

        const {url} = req.body

        if(!url){
            return res.status(400).json({
                error:"URL required"
            })
        }

        const response = await axios.post(
            "http://127.0.0.1:8000/predict",
            {
                url:url,
                content:""
            }
        )

        res.json(response.data)

    }

    catch(error){

        res.status(500).json({
            error:"AI server error"
        })

    }

})

app.listen(3000,()=>{
    console.log("Server running on http://localhost:3000")
})