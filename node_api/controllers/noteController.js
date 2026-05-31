const { Note, Student, Subject } = require("../models")

// ==========================
// GET NOTES
// ==========================
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      include: [
        {
          model: Student,
          attributes: ["name"]
        },
        {
          model: Subject,
          attributes: ["name"]
        }
      ],
      order: [["id", "DESC"]]
    })

    res.json(notes)

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: "Server error"
    })
  }
}

// ==========================
// ADD NOTE
// ==========================
exports.addNote = async (req, res) => {
  try {

    const {
      studentId,
      subjectId,
      ds,
      exam
    } = req.body

    const note = await Note.create({
      studentId,
      subjectId,
      ds,
      exam
    })

    res.json(note)

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: "Server error"
    })
  }
}

// ==========================
// UPDATE NOTE
// ==========================
exports.updateNote = async (req, res) => {
  try {

    const { id } = req.params

    await Note.update(
      req.body,
      {
        where: { id }
      }
    )

    res.json({
      message: "Updated"
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: "Server error"
    })
  }
}

// ==========================
// DELETE NOTE
// ==========================
exports.deleteNote = async (req, res) => {
  try {

    const { id } = req.params

    await Note.destroy({
      where: { id }
    })

    res.json({
      message: "Deleted"
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: "Server error"
    })
  }
}

// ==========================
// STUDENT NOTES
// ==========================
exports.getStudentNotes = async (req, res) => {

  try {

    const notes = await Note.findAll({

      where: {
        studentId: req.params.id
      },

      include: [
        {
          model: Subject,
          attributes: ["name"]
        }
      ]

    })

    res.json(notes)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: "Server error"
    })

  }
}