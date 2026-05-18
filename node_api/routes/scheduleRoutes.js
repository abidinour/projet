const router = require("express").Router()
const ctrl = require("../controllers/scheduleController")

router.get("/", ctrl.getSchedule)
router.post("/", ctrl.addSchedule)

router.put("/:id", ctrl.updateSchedule)
router.delete("/:id", ctrl.deleteSchedule)

module.exports = router