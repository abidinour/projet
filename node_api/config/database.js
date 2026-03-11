const { Sequelize } = require("sequelize")

const sequelize = new Sequelize(
    "ai_security",
    "root",
    "",
    {
        host:"localhost",
        dialect:"mysql"
    }
)

module.exports = sequelize