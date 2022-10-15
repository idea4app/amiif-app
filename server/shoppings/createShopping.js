import mongoClient from '../databases/mongodb'
import { httpStatus, shoppingStatus } from '../../constants'

export default async function createShopping(req, res, next) {
  try {
    const { _id, firstname, lastname } = res.user

    // check deliveryAt not null
    if (!req.body.deliveryAt) {
      return res.status(httpStatus.HTTP_400_BAD_REQUEST).json({
        error: 'deliveryAt is required',
      })
    }

    // validate deliveryAt has correct format
    const regexDate =
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
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
    const description = (req.body.description || '').trim()
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

    await collection.insertOne({
      id,
      status,
      createdAt,
      deliveryAt,
      description,
      creator: _id,
    })

    return res.status(httpStatus.HTTP_201_CREATED).json({
      id,
      status,
      deliveryAt,
      description,
      creator: { firstname, lastname },
    })
  } catch (error) {
    console.log(error.message)

    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
    })
  }
}
