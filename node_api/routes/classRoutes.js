const express = require("express")
const router = express.Router()
const controller = require("../controllers/classController")

router.get("/", controller.getClasses)
router.post("/", controller.addClass)

/* 🔥 NEW */
router.get("/:id/students", controller.getClassStudents)

module.exports = router