import mongoClient from '../databases/mongodb'
import { httpStatus } from '../../constants'

export default async function createComment(req, res) {
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
    console.log(error.message)

    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: error.message,
    })
  }
}
