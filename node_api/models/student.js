const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Student = sequelize.define("Student", {

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    unique: true
  },

  password: {
    type: DataTypes.STRING
  },

  role: {
    type: DataTypes.ENUM("administration", "student"),
    defaultValue: "student"
  },

  classId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }

})

module.exports = Student