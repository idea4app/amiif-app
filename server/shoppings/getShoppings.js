import mongoClient from '../databases/mongodb'
import { httpStatus } from '../../constants'

export default async function getAllShoppings(req, res) {
  try {
    const { _id, roles } = res.user
    const page = Number(req.query.page || 10)
    const perPage = Number(req.query.perPage || 10)

    const skip = (page - 1) * perPage

    const db = await mongoClient()
    const collection = await db.collection('shoppings')
    const match = (roles.shoppings !== 'admin' && { creator: _id }) || {}

    const shoppings = await collection
      .aggregate([
        { $match: match },
        { $skip: skip },
        { $limit: perPage },
        { $project: { _id: 0, createdAt: 0 } },
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

    const docs = await collection.count(match)
    const pages = Math.ceil(docs / perPage)

    return res.status(httpStatus.HTTP_200_OK).json({
      page,
      pages,
      perPage,
      shoppings: shoppings || [],
    })
  } catch (error) {
    console.log(error)

    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
    })
  }
}
