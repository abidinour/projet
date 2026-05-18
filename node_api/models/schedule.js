const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Schedule = sequelize.define("Schedule", {
  day: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

module.exports = Schedule