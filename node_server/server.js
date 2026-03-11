const express = require("express")
const cors = require("cors")

const sequelize = require("./config/database")
const checkRoute = require("./routes/checkRoute")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/", checkRoute)

app.get("/",(req,res)=>{
    res.send("AI Security Server Running")
})

async function start(){

    try{

        await sequelize.authenticate()

        console.log("Database connected")

        await sequelize.sync()

        console.log("Tables synced")

        app.listen(3000,()=>{
            console.log(
              "Server running on http://localhost:3000"
            )
        })

    }

    catch(error){

        console.error("DB error:",error)

    }

}

start()