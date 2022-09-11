import { serialize } from 'cookie'
import { SHA256 } from 'crypto-js'

import { httpStatus } from '../../constants'
import mongoClient from '../databases/mongodb'
import { createAccessToken, validateEmail, validatePassword } from '../../utils'

const { ALGORITHM, SECRET_KEY, EXPIRATION_MINUTES } = process.env

const roles = {
  full: {
    contracts: 'admin',
    shoppings: 'admin',
  },
  standard: {
    contracts: 'standard',
    shoppings: 'standard',
  },
  legal: {
    contracts: 'admin',
    shoppings: 'standard',
  },
}

export default async function signup(req, res) {
  try {
    const { email, password, firstname, lastname } = req.body
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
      company: 'AMIIF',
      email,
      lastname,
      firstname,
      password: SHA256(password).toString(),
      roles: roles.standard,
    }

    await db.collection('users').insertOne(userFields)

    const token = createAccessToken({
      algorithm: ALGORITHM,
      secretKey: SECRET_KEY,
      expirationInMinutes: EXPIRATION_MINUTES,
      data: {
        email,
        roles: userFields.roles,
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
