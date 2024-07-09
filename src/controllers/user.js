const { PrismaClientKnownRequestError } = require("@prisma/client")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const prisma = require('../utils/prisma.js')
const { createUserDb, findUser } = require('../domains/user.js')

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

  const token = jwt.sign({ sub: userFound.id }, process.env.JWT_SECRET)

  res.status(200).json({
    token
  })
}

const getAll = async (req, res) => {
  const users = await prisma.user.findMany()
  res.status(200).json({
    users
  })
}

module.exports = {
  createUser,
  login,
  getAll
}
