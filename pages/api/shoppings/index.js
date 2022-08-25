import mongoClient from '/config/mongodb'
// import clientPromise from 'config/mongodb'
import { httpMethods, httpStatus } from '/constants'

async function getShoppigns({ req, res, db }) {
  try {
    // const { _id, typeUser } = req.user
    const { page = 1, perPage = 10 } = req.query
    const skip = (page - 1) * perPage

    const collection = await db.collection('shoppings')

    // const query = (typeUser !== 'admin' && { user: '63010aaf2fdac61163014f6a' }) || {}
    const query = {}

    const shoppings = await collection
      .aggregate([
        { $match: query },
        { $skip: skip },
        { $limit: perPage },
        { $project: { _id: 0, createdAt: 0 } },
        {
          $lookup: {
            as: 'user',
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            pipeline: [{ $project: { _id: 0, password: 0 } }],
          },
        },
      ])
      .toArray()

    const docs = await collection.count(query)
    const pages = Math.ceil(docs / perPage)

    return res.status(httpStatus.HTTP_200_OK).json({
      page,
      pages,
      perPage,
      shoppings,
    })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
    })
  }
}

export default async function handler(req, res) {
  const { method } = req
  const db = await mongoClient()

  switch (method) {
    case httpMethods.GET:
    default:
      return await getShoppigns({ req, res, db })
  }
}
