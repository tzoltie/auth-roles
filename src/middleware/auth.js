const jwt = require('jsonwebtoken')
const prisma = require('../utils/prisma.js')

const verifyToken = async (req, res, next) => {
    const [_, token] = req.get('Authorization').split(' ')

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      const userFound = await prisma.user.findFirst({
        where: {
          id: decodedToken.sub
        }
      })
      if(!userFound) {
        throw "User not found"
      }
      req.user = userFound
    } catch(e) {
      return res.status(401).json({
        error: 'Invalid token'
      })
    }
    next()
  }

  const verifyAdmin = async (req, res, next) => {
    const [_, token] = req.get('Authorization').split(' ')

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      const userFound = await prisma.user.findFirst({
        where: {
          id: decodedToken.sub
        }
      })
      if(userFound.role !== "ADMIN") {
        throw "Not an Admin"
      }
      
    } catch(e) {
      return res.status(403).json({
        error: 'Invalid token'
      })
    }
    next()
  }

  module.exports = {
    verifyToken,
    verifyAdmin
  }