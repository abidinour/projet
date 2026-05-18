const router = require("express").Router()
const ctrl = require("../controllers/subjectController")

router.get("/", ctrl.getSubjects)
router.post("/", ctrl.addSubject)

module.exports = router