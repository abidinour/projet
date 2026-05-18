const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Notification = sequelize.define("Notification", {

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  barTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },

  body: {
    type: DataTypes.TEXT,
    allowNull: false
  }

})

module.exports = Notification