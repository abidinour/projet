const express = require("express")
const router = express.Router()

const controller = require("../controllers/studentController")
const security = require("../middleware/securityMiddleware")

/*
=========================
GET ALL STUDENTS
=========================
*/
router.get(
  "/",
  controller.getStudents
)

/*
=========================
STUDENT DASHBOARD
=========================
*/
router.get(
  "/dashboard/:id",
  controller.getStudentDashboard
)

/*
=========================
ADD STUDENT
=========================
*/
router.post(
  "/",
  security,
  controller.addStudent
)

/*
=========================
UPDATE STUDENT
=========================
*/
router.put(
  "/:id",
  security,
  controller.updateStudent
)

/*
=========================
DELETE STUDENT
=========================
*/
router.delete(
  "/:id",
  security,
  controller.deleteStudent
)

module.exports = router