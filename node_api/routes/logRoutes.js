const express = require("express")
const router = express.Router()

const AttackLog = require("../models/attackLog")
const auth = require("../middleware/authMiddleware")

router.get("/", auth, async (req, res) => {
    try {

        const logs = await AttackLog.findAll({
            order: [["timestamp", "DESC"]]
        })

        res.json(logs)

    } catch (error) {

        console.log("❌ GET LOGS ERROR:", error.message)

        res.status(500).json({
            error: "Database error"
        })
    }
})

router.delete("/cleanup/null", auth, async (req, res) => {
    try {

        const deleted = await AttackLog.destroy({
            where: { url: null }
        })

        res.json({
            message: "Null logs deleted",
            count: deleted
        })

    } catch (error) {

        console.log("❌ CLEAN ERROR:", error.message)

        res.status(500).json({
            error: "Cleanup error"
        })
    }
})

router.get("/:id", auth, async (req, res) => {
    try {

        const log = await AttackLog.findByPk(req.params.id)

        if (!log) {
            return res.status(404).json({
                error: "Log not found"
            })
        }

        res.json(log)

    } catch (error) {

        console.log("❌ GET LOG ERROR:", error.message)

        res.status(500).json({
            error: "Database error"
        })
    }
})

router.delete("/:id", auth, async (req, res) => {
    try {

        const deleted = await AttackLog.destroy({
            where: { id: req.params.id }
        })

        if (!deleted) {
            return res.status(404).json({
                error: "Log not found"
            })
        }

        res.json({
            message: "Log deleted"
        })

    } catch (error) {

        console.log("❌ DELETE LOG ERROR:", error.message)

        res.status(500).json({
            error: "Delete error"
        })
    }
})

module.exports = router