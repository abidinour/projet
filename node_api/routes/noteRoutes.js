const router = require("express").Router()

const ctrl = require("../controllers/noteController")

router.get("/", ctrl.getNotes)

router.post("/", ctrl.addNote)

router.put("/:id", ctrl.updateNote)

router.delete("/:id", ctrl.deleteNote)

module.exports = router