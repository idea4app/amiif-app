import { serialize } from 'cookie'
import { SHA256 } from 'crypto-js'

import { httpStatus } from '/constants'
import { createAccessToken } from '/utils'

import { mongoClient } from '/config/database'

const { ALGORITHM, SECRET_KEY, EXPIRATION_MINUTES } = process.env

export default async function handler(req, res) {
  const { email, password } = req.body

  try {
    const db = await mongoClient()
    const user = await db.collection('users').findOne({
      email,
      password: SHA256(password).toString(),
    })

    if (!user)
      return res.status(httpStatus.HTTP_403_FORBIDDEN).json({
        error: 'Invalid Credentials',
      })

    const token = createAccessToken({
      algorithm: ALGORITHM,
      secretKey: SECRET_KEY,
      expirationInMinutes: EXPIRATION_MINUTES,
      data: {
        email,
        roles: user.roles,
      },
    })

    return res
      .setHeader(
        'Set-Cookie',
        serialize('session', token, {
          path: '/',
          secure: true,
          priority: 'high',
          maxAge: EXPIRATION_MINUTES * 60,
        }),
      )
      .status(httpStatus.HTTP_200_OK)
      .json({
        token,
        tokenType: 'Bearer',
      })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'something went wrong',
    })
  }
}
