const bcrypt = require("bcrypt")
const {
  Student,
  Class,
  Subject,
  Schedule
} = require("../models")

/*
=========================
GET ALL STUDENTS
=========================
*/
exports.getStudents = async (req, res) => {

  try {

    const students = await Student.findAll({
      include: Class,
      order: [["id", "DESC"]]
    })

    res.json(students)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: "Error fetching students"
    })
  }
}

/*
=========================
ADD STUDENT
=========================
*/
exports.addStudent = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      classId
    } = req.body

    if (!name || !email || !password) {

      return res.status(400).json({
        error: "All fields required"
      })
    }

    const existingStudent =
      await Student.findOne({
        where: { email }
      })

    if (existingStudent) {

      return res.status(400).json({
        error: "Email already exists"
      })
    }

    const hashedPassword =
      await bcrypt.hash(password, 10)

    const student =
      await Student.create({

        name,
        email,

        password: hashedPassword,

        role: role || "student",

        classId: classId || null
      })

    console.log("STUDENT CREATED:", student.id)

    res.json(student)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: error.message
    })
  }
}

/*
=========================
DELETE STUDENT
=========================
*/
exports.deleteStudent = async (req, res) => {

  try {

    await Student.destroy({
      where: {
        id: req.params.id
      }
    })

    res.json({
      message: "Deleted"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: "Delete error"
    })
  }
}

/*
=========================
UPDATE STUDENT
=========================
*/
exports.updateStudent = async (req, res) => {

  try {

    await Student.update(

      {
        name: req.body.name
      },

      {
        where: {
          id: req.params.id
        }
      }

    )

    res.json({
      message: "Updated"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: "Update error"
    })
  }
}

/*
=========================
STUDENT DASHBOARD
=========================
*/
exports.getStudentDashboard = async (req, res) => {

  try {

    const { id } = req.params

    const student = await Student.findByPk(id, {
      include: Class
    })

    if (!student) {

      return res.status(404).json({
        error: "Student not found"
      })
    }

    const subjects =
      await Subject.findAll({
        where: {
          classId: student.classId
        }
      })

    const schedules =
      await Schedule.findAll({

        where: {
          classId: student.classId
        },

        include: Subject

      })

    res.json({

      student,

      subjects,

      schedules

    })

  } catch (error) {

    console.log(
      "DASHBOARD ERROR:",
      error
    )

    res.status(500).json({
      error: "Error loading dashboard data"
    })
  }
}