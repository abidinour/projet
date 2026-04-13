const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET || "mysecretkey"

exports.register = async (req, res) => {
    try {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "All fields required"
            })
        }

        const exist = await User.findOne({ where: { email } })

        if (exist) {
            return res.status(400).json({
                error: "Email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.json({
            message: "User registered"
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            error: "Register error"
        })
    }
}

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ where: { email } })

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.status(401).json({
                error: "Wrong password"
            })
        }

        // ✅ generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            SECRET,
            { expiresIn: "1h" }
        )

        res.json({
            message: "Login successful",
            token: token
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            error: "Login error"
        })
    }
}

/* ==========================
   GET USERS (debug)
========================== */
exports.getUsers = async (req, res) => {
    try {

        const users = await User.findAll()

        res.json(users)

    } catch (error) {
        res.status(500).json({
            error: "Error fetching users"
        })
    }
}

/* ==========================
   UPDATE USER
========================== */
exports.updateUser = async (req, res) => {
    try {

        const { name, email } = req.body

        await User.update(
            { name, email },
            { where: { id: req.params.id } }
        )

        res.json({
            message: "User updated"
        })

    } catch (error) {
        res.status(500).json({
            error: "Update error"
        })
    }
}

/* ==========================
   CHANGE PASSWORD
========================== */
exports.changePassword = async (req, res) => {
    try {

        const { oldPassword, newPassword } = req.body

        const user = await User.findByPk(req.params.id)

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        const valid = await bcrypt.compare(oldPassword, user.password)

        if (!valid) {
            return res.status(401).json({
                error: "Wrong old password"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        await user.save()

        res.json({
            message: "Password changed"
        })

    } catch (error) {
        res.status(500).json({
            error: "Password change error"
        })
    }
}