import { NextResponse } from 'next/server'

import mongoClient from '/config/mongodb'
import { httpStatus } from '/constants'
import { verifyAccessToken } from '/utils'

const NOT_VERIFIED_ROUTES = ['/api/login', '/api/register']

export async function middleware(req) {
  try {
    if (NOT_VERIFIED_ROUTES.includes(req.nextUrl.pathname)) {
      return NextResponse.next()
    }

    const bearerToken = req.headers.get('authorization')

    console.log({ bearerToken })

    const tokenData = verifyAccessToken({
      bearerToken,
      secretKey: process.env.SECRET_KEY,
    })

    if (!tokenData) {
      throw new Error('Authentication required')
    }

    const db = await mongoClient()
    const user = await db
      .collection('users')
      .findOne(
        { email: tokenData.email },
        { projection: { createdAt: 0, password: 0 } },
      )

    console.log({ user })

    return NextResponse.next()
  } catch (error) {
    return new Response(error.message, {
      status: httpStatus.HTTP_403_FORBIDDEN,
    })
  }
}

// import mongoClient from 'config/mongodb'
// import httpStatus from 'contants/http-status'
// const NOT_VERIFIED_ROUTES = ['/login', '/register']
// export async function verifyAccessToken(req, res, next) {
// if (NOT_VERIFIED_ROUTES.includes(req.path)) return next()
// const token = (req.headers.authorization || '').replace('Bearer ', '')
// if (!token) {
//   return res.status(httpStatus.HTTP_403_FORBIDDEN).json({
//     error: 'Not authotized to perform requested action',
//   })
// }
// const db = await mongoClient()
// const user = await db
//   .collection('users')
//   .findOne(
//     { nickname: tokenData.nickname },
//     { projection: { createdAt: 0, password: 0 } },
//   )
// req.user = user
// next()
