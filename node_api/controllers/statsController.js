const Student = require("../models/student")
const Class = require("../models/class")
const AttackLog = require("../models/attackLog")

exports.getStats = async (req, res) => {

  const studentsPerClass = await Class.findAll({
    include: {
      model: Student,
      attributes: []
    },
    attributes: [
      "name",
      [require("sequelize").fn("COUNT", require("sequelize").col("Students.id")), "count"]
    ],
    group: ["Class.id"]
  })

  const attacks = await AttackLog.findAll()

  const attacksByType = {}
  attacks.forEach(a => {
    attacksByType[a.attack_type] =
      (attacksByType[a.attack_type] || 0) + 1
  })

  res.json({
    studentsPerClass,
    attacksByType
  })
}