const { Schedule, Class, Subject } = require("../models")

// ============================
// GET ALL SCHEDULES
// ============================
exports.getSchedule = async (req, res) => {
  try {
    const data = await Schedule.findAll({
      include: [
        { model: Class, attributes: ["name"] },
        { model: Subject, attributes: ["name"] }
      ],
      order: [
        // 🔥 ترتيب الأيام
        [
          require("sequelize").literal(`
            FIELD(day, 
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday'
            )
          `)
        ],
        // 🔥 ترتيب الوقت
        ["startTime", "ASC"]
      ]
    })

    res.json(data)
  } catch (error) {
    console.error("❌ SCHEDULE ERROR:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// ============================
// ADD NEW SCHEDULE
// ============================
exports.addSchedule = async (req, res) => {
  try {
    const { day, startTime, endTime, classId, subjectId } = req.body

    if (!day || !startTime || !endTime || !classId || !subjectId) {
      return res.status(400).json({
        error: "All fields required"
      })
    }

    const schedule = await Schedule.create({
      day,
      startTime,
      endTime,
      classId,
      subjectId
    })

    res.json(schedule)

  } catch (error) {
    console.error("❌ ADD SCHEDULE ERROR:", error)
    res.status(500).json({ error: "Server error" })
  }
}

exports.updateSchedule = async (req, res) => {
  const { id } = req.params
  await Schedule.update(req.body, { where: { id } })
  res.json({ message: "Updated" })
}

exports.deleteSchedule = async (req, res) => {
  const { id } = req.params
  await Schedule.destroy({ where: { id } })
  res.json({ message: "Deleted" })
}