import Multer from 'multer'

import { httpStatus } from '../constants'
import { verifyAccessToken } from '../utils'
import { mongoClient } from '../config/database'

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5mb
  },
})

export const multerMiddleware = multer.single('file')

export async function validateSession(req, res, next) {
  const userData = await verifyAccessToken({
    token: req.headers.authorization.replace('Bearer ', ''),
    secretKey: process.env.SECRET_KEY,
  })

  if (!userData) {
    return res.status(httpStatus.HTTP_403_FORBIDDEN).json({
      error: 'Authentication required',
    })
  }

  const db = await mongoClient()
  res.user = await db
    .collection('users')
    .findOne(
      { email: userData.email },
      { projection: { createdAt: 0, password: 0 } },
    )

  next()
}
