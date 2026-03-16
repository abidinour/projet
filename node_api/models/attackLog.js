const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const AttackLog = sequelize.define("AttackLog",{

    url:{
        type:DataTypes.TEXT
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

    attack_type:{
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
    },

    timestamp:{
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

})

module.exports = AttackLog