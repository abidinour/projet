const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
      attributes: ["id", "name", "email", "createdAt"],
    });
    res.json(admins);
  } catch (err) {
    console.error("getAdmins error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({ name, email, password: hashed });

    res.json({ id: admin.id, name: admin.name, email: admin.email });
  } catch (err) {
    console.error("createAdmin error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await User.findByPk(req.params.id);

    if (!admin)
      return res.status(404).json({ error: "Admin not found" });

    if (name)  admin.name  = name;
    if (email) admin.email = email;

    if (password && password.trim() !== "") {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();
    res.json({ message: "Admin updated" });
  } catch (err) {
    console.error("updateAdmin error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });

    if (!deleted)
      return res.status(404).json({ error: "Admin not found" });

    res.json({ message: "Admin removed" });
  } catch (err) {
    console.error("deleteAdmin error:", err.message);
    res.status(500).json({ error: err.message });
  }
};