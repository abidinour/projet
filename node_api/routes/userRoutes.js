const express = require("express")
const router = express.Router()

const {
    register,
    login,
    getUsers,
    updateUser,
    changePassword
} = require("../controllers/userController")

const auth = require("../middleware/authMiddleware")

router.post("/register", register)
router.post("/login", login)

router.get("/users", getUsers)

router.put("/user/:id", auth, updateUser)
router.put("/change-password/:id", auth, changePassword)

module.exports = router