import mongoClient from '../databases/mongodb'
import { httpStatus } from '../../constants'

export default async function getContract(req, res) {
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
            as: 'creator',
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  email: 0,
                  phone: 0,
                  photo: 0,
                  roles: 0,
                  company: 0,
                  password: 0,
                  birthdate: 0,
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
          },
        },
        {
          $set: {
            creator: { $arrayElemAt: ['$creator', 0] },
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
