const express = require("express");
const {
  createUser,
  getAll,
  login
} = require('../controllers/user');
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/", createUser);
router.get('/', verifyToken, getAll)
router.post("/login", login)

module.exports = router;
