const { Student } = require("../models")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET || "mysecretkey"

/* ==========================
   REGISTER
========================== */
exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role
    } = req.body

    /*
    ==========================
    VALIDATION
    ==========================
    */
    if (!name || !email || !password) {

      return res.status(400).json({
        error: "All fields required"
      })
    }

    /*
    ==========================
    CHECK EMAIL
    ==========================
    */
    const exist = await Student.findOne({
      where: { email }
    })

    if (exist) {

      return res.status(400).json({
        error: "Email already exists"
      })
    }

    /*
    ==========================
    HASH PASSWORD
    ==========================
    */
    const hashedPassword =
      await bcrypt.hash(password, 10)

    /*
    ==========================
    CREATE USER
    ==========================
    */
    const student = await Student.create({

      name,
      email,

      password: hashedPassword,

      role: role || "student"

    })

    res.json({

      message: "User registered",

      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        role: student.role
      }

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: "Register error"
    })
  }
}

/* ==========================
   LOGIN
========================== */
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body

    /*
    ==========================
    FIND USER
    ==========================
    */
    const user = await Student.findOne({
      where: { email }
    })

    if (!user) {

      return res.status(404).json({
        error: "User not found"
      })
    }

    /*
    ==========================
    CHECK PASSWORD
    ==========================
    */
    const validPassword =
      await bcrypt.compare(password, user.password)

    if (!validPassword) {

      return res.status(401).json({
        error: "Wrong password"
      })
    }

    /*
    ==========================
    JWT TOKEN
    ==========================
    */
    const token = jwt.sign(

      {
        id: user.id,
        email: user.email,
        role: user.role
      },

      SECRET,

      {
        expiresIn: "1h"
      }

    )

    /*
    ==========================
    RESPONSE
    ==========================
    */
    res.json({

      message: "Login successful",

      token,
       role: user.role,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: "Login error"
    })
  }
}

/* ==========================
   GET USERS
========================== */
exports.getUsers = async (req, res) => {

  try {

    const users = await Student.findAll({

      attributes: {
        exclude: ["password"]
      }

    })

    res.json(users)

  } catch (error) {

    console.log(error)

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

    const {
      name,
      email,
      role
    } = req.body

    await Student.update(

      {
        name,
        email,
        role
      },

      {
        where: {
          id: req.params.id
        }
      }

    )

    res.json({
      message: "User updated"
    })

  } catch (error) {

    console.log(error)

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

    const {
      oldPassword,
      newPassword
    } = req.body

    /*
    ==========================
    FIND USER
    ==========================
    */
    const user =
      await Student.findByPk(req.params.id)

    if (!user) {

      return res.status(404).json({
        error: "User not found"
      })
    }

    /*
    ==========================
    CHECK OLD PASSWORD
    ==========================
    */
    const valid =
      await bcrypt.compare(
        oldPassword,
        user.password
      )

    if (!valid) {

      return res.status(401).json({
        error: "Wrong old password"
      })
    }

    /*
    ==========================
    HASH NEW PASSWORD
    ==========================
    */
    const hashedPassword =
      await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword

    await user.save()

    res.json({
      message: "Password changed"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: "Password change error"
    })
  }
}