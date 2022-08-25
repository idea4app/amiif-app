import { SHA256 } from 'crypto-js'

import mongoClient from '/config/mongodb'
import { httpStatus } from '/constants'
import { createAccessToken } from '/utils'

const { ALGORITHM, SECRET_KEY, EXPIRATION_MINUTES } = process.env

export default async function handler(req, res) {
  console.log({ query: req.body })
  const { email, password } = req.body

  console.log({ password }, SHA256({ password }).toString())

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
        type: user.type,
      },
    })

    return res.status(httpStatus.HTTP_200_OK).json({
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
