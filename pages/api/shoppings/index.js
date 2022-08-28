import { emailNotifier } from '/lib/notifier'
import { verifyAccessToken } from '/utils'
import { mongoClient } from '/config/database'
import { httpStatus, shoppingStatus, notifyTypes } from '/constants'

const { SECRET_KEY } = process.env

async function getAllShoppings(req, res) {
  try {
    const { _id, type } = res.user
    const page = Number(req.query.page || 10)
    const perPage = Number(req.query.perPage || 10)

    const skip = (page - 1) * perPage

    const db = await mongoClient()
    const collection = await db.collection('shoppings')
    const query = (type !== 'admin' && { user: _id }) || {}

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

async function createShopping(req, res) {
  const { _id, email, firstname, paternalSurname } = res.user

  // check deliveryAt not null
  if (!req.body.deliveryAt) {
    return res.status(httpStatus.HTTP_400_BAD_REQUEST).json({
      error: 'deliveryAt is required',
    })
  }

  // validate deliveryAt has correct format
  const regexDate = /^\d{4}-\d{1,2}-\d{1,2}$/
  if (!regexDate.test(req.body.deliveryAt)) {
    return res.status(httpStatus.HTTP_400_BAD_REQUEST).json({
      error: 'format invalid deliveryAt',
    })
  }

  // deliveryAt has a correct range date
  const date = new Date()
  const deliveryDate = new Date(req.body.deliveryAt)
  if (deliveryDate.getTime() < date.getTime()) {
    return res.status(httpStatus.HTTP_400_BAD_REQUEST).json({
      error: 'deliveryAt must be greater than or equal to the current date',
    })
  }

  // check description not null
  const description = (req.body.description || '')
    .replace(/\n/, ',')
    .replace(/\t/, ',')
    .trim()

  if (!description) {
    return res.status(httpStatus.HTTP_400_BAD_REQUEST).json({
      error: 'description field is required',
    })
  }

  const db = await mongoClient()
  const collection = db.collection('shoppings')
  const count = await collection.countDocuments()

  const id = `COM-${('00000' + count).slice(-9)}`
  const createdAt = date.toISOString()
  const status = shoppingStatus.PENDING
  const deliveryAt = deliveryDate.toISOString()

  try {
    await collection.insertOne({
      id,
      status,
      createdAt,
      user: _id,
      deliveryAt,
      description,
    })

    emailNotifier({
      email,
      notifyType: notifyTypes.SHOPPING,
      subject: `Nueva order creada: ${id}`,
      name: `${firstname} ${paternalSurname}`,
      variables: { status, deliveryAt, description },
    })

    return res.status(httpStatus.HTTP_201_CREATED).json({
      id,
      status,
      deliveryAt,
      description,
      user: res.user,
    })
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

  if (req.method === 'GET') {
    return getAllShoppings(req, res)
  } else if (req.method === 'POST') {
    return createShopping(req, res)
  }

  return res.status(httpStatus.HTTP_404_NOT_FOUND).json({
    error: 'Not found',
  })
}
