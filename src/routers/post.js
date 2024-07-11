const express = require("express");
const {
  createPost,
  getAllPosts,
  deletePost
} = require('../controllers/post');
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", createPost);
router.get('/', verifyToken, verifyAdmin, getAllPosts)
router.delete('/:id', verifyToken, deletePost)

module.exports = router;
