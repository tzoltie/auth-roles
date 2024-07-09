const express = require("express");
const {
  createPost,
  getAllPosts
} = require('../controllers/post');
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/", createPost);
router.get('/', verifyToken, getAllPosts)

module.exports = router;
