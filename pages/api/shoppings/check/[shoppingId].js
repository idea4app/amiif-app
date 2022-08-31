import { verifyAccessToken } from '/utils'
import { emailNotifier } from '/lib/notifier'
import { mongoClient } from '/config/database'
import { httpStatus, notifyTypes, shoppingStatus } from '/constants'

const { SECRET_KEY } = process.env

async function validateShopping(req, res) {
  if (res.user.roles.shoppings !== 'admin') {
    return res.status(httpStatus.HTTP_403_FORBIDDEN).json({
      error: 'Not authorized to perform requested action',
    })
  }

  try {
    const { action } = req.body
    const { shoppingId } = req.query

    const status = shoppingStatus[action]

    console.log({ status })

    const db = await mongoClient()
    const collection = await db.collection('shoppings')
    const { value } = await collection.findOneAndUpdate(
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
    const { email, firstname, paternalSurname } = res.user

    emailNotifier({
      email,
      notifyType: notifyTypes.SHOPPING,
      name: `${firstname} ${paternalSurname}`,
      variables: { status, deliveryAt, description },
      subject: `Order de compra ${id} fue ${
        (req.body.status && 'aprobada') || 'cancelada'
      }`,
    })

    return res.status(httpStatus.HTTP_200_OK).json({ ...value, status })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Something went wrong',
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
  res.user = await db.collection('users').findOne({ email: userData.email })

  if (req.method === 'PUT') {
    return validateShopping(req, res)
  }

  return res.status(httpStatus.HTTP_404_NOT_FOUND).json({
    error: 'method not allowed',
  })
}
