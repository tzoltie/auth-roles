const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt')

const createUserDb = async (username, password, role) => await prisma.user.create({
  data: {
    username,
    role,
    passwordHash: await bcrypt.hash(password, 6)
  },
  include: {
    posts: true
  }
})


const findUser = async (username) => await prisma.user.findUnique({
  where: {
    username: username
  }
})

const findUserByID = async (id) => await prisma.user.findUnique({
  where: {
    id: id
  }
})

const deleteUserByID = async (id) => await prisma.user.delete({
  where: {
    id: id
  }
})

module.exports = {
  createUserDb,
  findUser,
  findUserByID,
  deleteUserByID
}
