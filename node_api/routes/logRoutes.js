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

router.get("/stats", auth, async (req, res) => {
    try {

        const logs = await AttackLog.findAll({
            order: [["timestamp", "ASC"]]
        })

        const total = logs.length
        const attacks = logs.filter(l => l.prediction === "attack").length
        const normal = logs.filter(l => l.prediction === "normal").length

        const accuracy = total ? ((normal / total) * 100).toFixed(2) : 0

        // by type
        const byType = {}

        logs.forEach(log => {
            if (log.attack_type && log.attack_type !== "none") {
                byType[log.attack_type] = (byType[log.attack_type] || 0) + 1
            }
        })

        // timeline
        const timeline = {}

        logs.forEach(log => {
            const time = new Date(log.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })

            if (!timeline[time]) timeline[time] = 0

            if (log.prediction === "attack") {
                timeline[time]++
            }
        })

        const timelineData = Object.keys(timeline).map(t => ({
            time: t,
            attacks: timeline[t]
        }))

        // top urls
        const urlMap = {}

        logs.forEach(log => {
            if (log.prediction === "attack") {
                urlMap[log.url] = (urlMap[log.url] || 0) + 1
            }
        })

        const topUrls = Object.keys(urlMap)
            .map(url => ({ url, count: urlMap[url] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        res.json({
            total,
            attacks,
            normal,
            accuracy,
            byType,
            timeline: timelineData,
            topUrls
        })

    } catch (error) {

        console.log("❌ STATS ERROR:", error.message)

        res.status(500).json({
            error: "Stats error"
        })
    }
})

/* ==========================
   CLEAN NULL LOGS
========================== */
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