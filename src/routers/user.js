const express = require("express");
const {
  createUser,
  getAll,
  login,
  deleteUser
} = require('../controllers/user');
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", createUser);
router.get('/', verifyToken, verifyAdmin, getAll)
router.post("/login", login)
router.delete("/:id", verifyToken, verifyAdmin, deleteUser)

module.exports = router;
