const express = require("express");
const {
  createUser,
  getAllUsers,
  login,
  deleteUser
} = require('../controllers/user');
const { verifyToken, verifyAdmin } = require("../middleware/auth.js");

const router = express.Router();

router.post("/", createUser);
router.get('/', verifyToken, verifyAdmin, getAllUsers)
router.post("/login", login)
router.delete("/:id", verifyToken, verifyAdmin, deleteUser)

module.exports = router;
