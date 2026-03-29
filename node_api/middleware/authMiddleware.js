const jwt = require("jsonwebtoken")

const SECRET = "mysecretkey"

module.exports = (req, res, next) => {

    let token = req.headers["authorization"]

    if (!token) {
        return res.status(403).json({ error: "No token" })
    }

    // 🔥 fix Bearer
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1]
    }

    try {

        const decoded = jwt.verify(token, SECRET)
        req.user = decoded

        next()

    } catch (err) {

        console.log("❌ TOKEN ERROR:", err.message)

        return res.status(401).json({
            error: "Invalid token"
        })

    }
}