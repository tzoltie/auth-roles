const { PrismaClientKnownRequestError } = require("@prisma/client")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const prisma = require('../utils/prisma.js')
const { createUserDb, findUser, findUserByID, deleteUserByID } = require('../domains/user.js')

const createUser = async (req, res) => {
  const {
    username,
    password,
    role
  } = req.body

  if (!username || !password) {
    return res.status(400).json({
      error: "Missing fields in request body"
    })
  }

  try {
    const createdUser = await createUserDb(username, password, role)

    return res.status(201).json({ user: createdUser })
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(409).json({ error: "A user with the provided username already exists" })
      }
    }

    res.status(500).json({ error: e.message })
  }
}

const login = async (req, res) => {
  const { 
    username, 
    password 
  } = req.body

  const userFound = await findUser(username)
  const passwordCheck = await bcrypt.compare(password, userFound.passwordHash)
  
  if(!passwordCheck) {
    res.status(400).json({
      error: "Invalid password"
    })
  }

  const token = jwt.sign({ sub: userFound.id, role: userFound.role }, process.env.JWT_SECRET)

  res.status(200).json({
    token
  })
}

const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true
    }
  })
  res.status(200).json({
    users
  })
}

const deleteUser = async (req, res) => {
  const { username } = req.body
  const id = Number(req.params.id)
  const user = await findUser(username)
  const found = await findUserByID(id)

  if(!found) {
    return res.status(404).json({
      message: "User not found by that ID"
    })
  }
  if(
    user.id !== id &&
    user.role !== 'ADMIN'
  ) {
    return res.status(403).json({
      message: "Invalid Credentials"
    })
  }

  const deletetedUser = await deleteUserByID(id)
  return res.status(200).json({
    user: deletetedUser
  })
}

module.exports = {
  createUser,
  login,
  getAllUsers,
  deleteUser
}
