import mongoClient from '../databases/mongodb'
import { httpStatus, notifyTypes, shoppingStatus } from '../../constants'

export default async function updateShopping(req, res, next) {
  if (res.user.roles.shoppings !== 'admin') {
    return res.status(httpStatus.HTTP_403_FORBIDDEN).json({
      error: 'Not authorized to perform requested action',
    })
  }

  try {
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

    const { id, deliveryAt, description } = value
    const { email, firstname, lastname } = res.user

    res.status(httpStatus.HTTP_200_OK).json({ ...value, status })

    res.emailData = {
      email,
      name: `${firstname} ${lastname}`,
      notifyType: notifyTypes.SHOPPING,
      subject: `Order de compra ${id} fue ${status}`,
      variables: { status, deliveryAt, description },
    }
    next()
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Something went wrong',
    })
  }
}
