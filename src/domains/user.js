const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt')

const createUserDb = async (username, password) => await prisma.user.create({
  data: {
    username,
    passwordHash: await bcrypt.hash(password, 6)
  },
  include: {
    posts: true
  }
})


const findUser = async (username) => {
  if(!username) {
    throw "username is undefined"
  }
   prisma.user.findUnique({
  where: {
    username: username
  },
  include: {
    posts: true
  }
})}

const findUserByID = async (id) => await prisma.user.findUnique({
  where: {
    id: id
  },
  include: {
    posts: true
  }
})

const deleteUserByID = async (id) => await prisma.user.delete({
  where: {
    id: id
  },
  include: {
    posts: true
  }
})

module.exports = {
  createUserDb,
  findUser,
  findUserByID,
  deleteUserByID
}
