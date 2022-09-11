import { httpStatus } from '../../constants'
import mongoClient from '../databases/mongodb'
import { verifyAccessToken } from '../../utils'

const { SECRET_KEY } = process.env

export default async function session(req, res, next) {
  try {
    const { authorization } = req.headers
    const token = authorization.replace('Bearer ', '')

    if (!token) {
      throw new Error('Undefined Authorization Token')
    }

    const tokenData = verifyAccessToken({ token, secretKey: SECRET_KEY })

    if (!tokenData.email) {
      throw new Error('Invalid Token Signature')
    }

    const db = await mongoClient()

    res.user = await db.collection('users').findOne(
      { email: tokenData.email },
      {
        projection: {
          password: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    )

    return next()
  } catch (error) {
    console.error(error.message)
    return res.status(httpStatus.HTTP_403_FORBIDDEN).json({
      error: 'Authentication Required',
    })
  }
}
