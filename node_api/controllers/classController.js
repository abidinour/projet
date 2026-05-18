const Class = require("../models/Class")
const Student = require("../models/Student")

exports.getClasses = async (req, res) => {
  const classes = await Class.findAll()
  res.json(classes)
}

exports.addClass = async (req, res) => {
  const { name } = req.body
  const c = await Class.create({ name })
  res.json(c)
}

/*
================================
GET STUDENTS OF CLASS
================================
*/
exports.getClassStudents = async (req, res) => {
  const { id } = req.params

  const students = await Student.findAll({
    where: { classId: id }
  })

  res.json(students)
}