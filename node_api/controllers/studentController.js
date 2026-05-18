const { Student, Class } = require("../models")

exports.getStudents = async (req, res) => {
  const students = await Student.findAll({
    include: Class,
    order: [["id", "DESC"]]
  })

  res.json(students)
}

exports.addStudent = async (req, res) => {
  const { name } = req.body

  const student = await Student.create({ name })

  res.json(student)
}

exports.deleteStudent = async (req, res) => {
  await Student.destroy({ where: { id: req.params.id } })
  res.json({ message: "Deleted" })
}

exports.updateStudent = async (req, res) => {
  await Student.update(
    { name: req.body.name },
    { where: { id: req.params.id } }
  )

  res.json({ message: "Updated" })
}