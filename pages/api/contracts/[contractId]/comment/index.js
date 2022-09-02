import { verifyAccessToken } from '/utils'
import { mongoClient } from '/config/database'
import { httpStatus } from '../../../../../constants'

const { SECRET_KEY } = process.env

async function createComment(req, res) {
  try {
    const { contractId, comment } = req.body
    const { _id, firstname, lastname } = res.user

    const db = await mongoClient()
    const collection = await db.collection('contracts')

    const contract = await collection.findOne({ id: contractId })

    const newComment = {
      comment,
      user: { _id, firstname, lastname },
      commentId: contract.comments.length,
      createdAt: new Date().toISOString(),
    }

    const updatedComments = [newComment, ...(contract.comments || [])]

    await collection.updateOne(
      { id: contractId },
      {
        $set: {
          comments: updatedComments,
        },
      },
    )

    return res.status(httpStatus.HTTP_201_CREATED).json(newComment)
  } catch (error) {
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: error.message,
    })
  }
}

export default async function handler(req, res) {
  const userData = await verifyAccessToken({
    token: req.headers.authorization.replace('Bearer ', ''),
    secretKey: SECRET_KEY,
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

  if (method === 'POST') {
    return createComment(req, res)
  }

  return res.status(httpStatus.HTTP_501_NOT_IMPLEMENTED).json({
    error: `${method} not implemented`,
  })
}
