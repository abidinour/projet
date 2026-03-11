const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const AttackLog = sequelize.define("AttackLog",{

    request:{
        type:DataTypes.STRING
    },

    method:{
        type:DataTypes.STRING
    },

    ip:{
        type:DataTypes.STRING
    },

    prediction:{
        type:DataTypes.STRING
    },

    confidence:{
        type:DataTypes.FLOAT
    },

    responseCode:{
        type:DataTypes.INTEGER
    },

    requestLength:{
        type:DataTypes.INTEGER
    }

})

module.exports = AttackLog