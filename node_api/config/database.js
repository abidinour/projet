const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "ai_security", 
    "root",       
    "",            
    {
        host: "127.0.0.1", 
        dialect: "mysql",
        logging: false,    
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connection to MySQL has been established successfully.");
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
    }
}

testConnection();

module.exports = sequelize;