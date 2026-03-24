const express = require("express")
const router = express.Router()

const { getLogs, checkUrl } = require("../controllers/logController")
const auth = require("../middleware/authMiddleware")

router.post("/check", checkUrl)   // ✅ لازم checkUrl موجودة
router.get("/logs", auth, getLogs)

module.exports = router