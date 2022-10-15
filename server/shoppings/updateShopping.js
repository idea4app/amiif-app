import mongoClient from '../databases/mongodb'
import { httpStatus, shoppingStatus } from '../../constants'

export default async function updateShopping(req, res, next) {
  try {
    if (res.user.roles.shoppings !== 'admin') {
      return res.status(httpStatus.HTTP_403_FORBIDDEN).json({
        error: 'Not authorized to perform requested action',
      })
    }

    const { shoppingId } = req.query
    const status = shoppingStatus[req.body.status]

    const db = await mongoClient()
    const { value } = await db
      .collection('shoppings')
      .findOneAndUpdate(
        { id: shoppingId },
        { $set: { status } },
        { projection: { _id: 0, createdAt: 0, user: 0 } },
      )

    if (!value) {
      return res.status(httpStatus.HTTP_404_NOT_FOUND).json({
        error: `shopping with id: ${shoppingId} not exists`,
      })
    }

    return res.status(httpStatus.HTTP_200_OK).json({ ...value, status })
  } catch (error) {
    console.log(error.message)

    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Something went wrong',
    })
  }
}
