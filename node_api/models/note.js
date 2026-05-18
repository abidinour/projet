const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Note = sequelize.define("Note", {
  ds: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  exam: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
})

module.exports = Note