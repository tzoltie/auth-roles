const { PrismaClientKnownRequestError } = require("@prisma/client")
const { createPostDb, findPostByID, deletePostByID } = require('../domains/post.js')
const prisma = require("../utils/prisma.js")
const { findUser } = require("../domains/user.js")

const createPost = async (req, res) => {
  const {
    title,
    userId
  } = req.body

  if (!title || !userId) {
    return res.status(400).json({
      error: "Missing fields in request body"
    })
  }

  try {
    const createdPost = await createPostDb(title, userId)

    return res.status(201).json({ post: createdPost })
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(409).json({ error: "A user with the provided ID does not exist" })
      }
    }

    res.status(500).json({ error: e.message })
  }
}

const getAllPosts = async (req, res) => {
  const posts = await prisma.post.findMany()
  res.status(200).json({
    posts
  })
}


const deletePost = async (req, res) => {
  const { username } = req.body
  const id = Number(req.params.id)
  const found = await findPostByID(id)
  const user = await findUser(username)

  if(!found) {
    return res.status(404).json({
      message: "Post not found by that ID"
    })
  }
  if(
    user.id !== found.userId &&
    user.role !== 'ADMIN'
  ) {
    return res.status(403).json({
      message: "Invalid Credentials"
    })
  }
  
  const deletedPost = await deletePostByID(id)
  res.status(200).json({
  post: deletedPost
  })
}

module.exports = {
  createPost,
  getAllPosts,
  deletePost
}
