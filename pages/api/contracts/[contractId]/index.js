import { httpStatus } from '../../../../constants'
import { verifyAccessToken } from '../../../../utils'
import { mongoClient } from '../../../../config/database'

async function getContract(req, res) {
  try {
    const { contractId } = req.query

    const db = await mongoClient()
    const collection = await db.collection('contracts')
    const [contract] = await collection
      .aggregate([
        { $match: { id: contractId } },
        { $project: { _id: 0 } },
        {
          $lookup: {
            as: 'user',
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  password: 0,
                },
              },
            ],
          },
        },
      ])
      .toArray()

    return res.status(httpStatus.HTTP_200_OK).json(contract)
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
    })
  }
}

export default async function handler(req, res) {
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

  const { method } = req

  if (method === 'GET') {
    return getContract(req, res)
  }

  return res.status(httpStatus.HTTP_501_NOT_IMPLEMENTED).json({
    error: `${method} not implemented`,
  })
}
