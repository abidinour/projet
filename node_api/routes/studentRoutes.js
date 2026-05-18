const express = require("express")
const router = express.Router()

const controller = require("../controllers/studentController")
const security = require("../middleware/securityMiddleware")

router.get("/", controller.getStudents)
router.post("/", security, controller.addStudent)
router.delete("/:id", controller.deleteStudent)
router.put("/:id", security, controller.updateStudent)

module.exports = router