import nextConnect from 'next-connect'

import { httpStatus } from '../../../../../constants'
import { mongoClient } from '../../../../../config/database'
import { validateSession } from '../../../../../lib/middlewares'

async function updateStatus(req, res) {
  try {
    const { contractId } = req.query
    const { status } = req.body
    const db = await mongoClient()
    const collection = db.collection('contracts')

    await collection.updateOne(
      { id: contractId },
      {
        $set: {
          status,
        },
      },
    )

    return res.status(httpStatus.HTTP_200_OK).json({
      status,
    })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
    })
  }
}

const handler = nextConnect({
  onError: (error, req, res, next) => {
    if (error) {
      return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
        error: error.message,
      })
    }
  },
})
handler.use(validateSession)
handler.put(updateStatus)

export default handler
