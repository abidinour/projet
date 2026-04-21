const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminController");

router.get("/", auth, getAdmins);
router.post("/", auth, createAdmin);
router.put("/:id", auth, updateAdmin);
router.delete("/:id", auth, deleteAdmin);

module.exports = router;