const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Subject = sequelize.define("Subject", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  classId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

module.exports = Subject