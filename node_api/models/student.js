const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Student = sequelize.define("Student", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
})

module.exports = Student