import { serialize } from 'cookie'
import { SHA256 } from 'crypto-js'

import { mongoClient } from '/config/database'
import { httpStatus } from '/constants'
import { createAccessToken, validateEmail, validatePassword } from '/utils'

const { ALGORITHM, SECRET_KEY, EXPIRATION_MINUTES } = process.env

export default async function handler(req, res) {
  try {
    const { email, password, firstname, maternalSurname, paternalSurname } =
      req.body

    const db = await mongoClient()
    const user = await db.collection('users').findOne({ email })

    if (user || !validateEmail(email)) {
      return res.status(httpStatus.HTTP_409_CONFLICT).json({
        error: 'invalid or existing email',
      })
    }

    if (!validatePassword(password)) {
      return res.status(httpStatus.HTTP_400_BAD_REQUEST).json({
        error: 'the password is insecure',
      })
    }

    const currentDate = new Date().toISOString()
    const userFields = {
      createdAt: currentDate,
      updatedAt: currentDate,
      phone: '',
      photo: '',
      birthdate: '',
      type: 'admin',
      company: 'AMIIF',
      email,
      firstname,
      maternalSurname,
      paternalSurname,
      password: SHA256(password).toString(),
    }

    await db.collection('users').insertOne(userFields)

    const token = createAccessToken({
      algorithm: ALGORITHM,
      secretKey: SECRET_KEY,
      expirationInMinutes: EXPIRATION_MINUTES,
      data: {
        email,
        type: userFields.type,
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
      .status(httpStatus.HTTP_201_CREATED)
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
