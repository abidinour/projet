const { Subject, Class } = require("../models")

/*
==========================
GET SUBJECTS
==========================
*/
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: {
        model: Class,
        attributes: ["id", "name"]
      },
      order: [["id", "DESC"]]
    })

    res.json(subjects)
  } catch (error) {
    console.error("❌ SUBJECT ERROR:", error)
    res.status(500).json({ error: "Server error" })
  }
}

/*
==========================
ADD SUBJECT
==========================
*/
exports.addSubject = async (req, res) => {
  try {
    const { name, classId } = req.body

    if (!name || !classId) {
      return res.status(400).json({
        error: "Name and classId required"
      })
    }

    const subject = await Subject.create({
      name,
      classId
    })

    res.json(subject)
  } catch (error) {
    console.error("❌ ADD SUBJECT ERROR:", error)
    res.status(500).json({ error: "Server error" })
  }
}