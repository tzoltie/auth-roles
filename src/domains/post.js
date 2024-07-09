const prisma = require('../utils/prisma')

const createPostDb = async (title, userId) => await prisma.post.create({
  data: {
    title,
    user: {
      connect: {
        id: userId
      }
    }
  }
})

const findPostByID = async (id) => await prisma.post.findUnique({
  where: {
    id: id
  }
})

const deletePostByID = async (id) => await prisma.post.delete({
  where: {
    id: id
  }
})

module.exports = {
  createPostDb,
  findPostByID,
  deletePostByID
}
