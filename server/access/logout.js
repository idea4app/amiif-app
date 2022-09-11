import { serialize } from 'cookie'
import { httpStatus } from '../../constants'

export default async function logout(_, res) {
  try {
    return res
      .setHeader(
        'Set-Cookie',
        serialize('session', '', {
          path: '/',
          maxAge: 0,
          secure: true,
          priority: 'high',
        }),
      )
      .status(httpStatus.HTTP_202_ACCEPTED)
      .send('OK')
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'something went wrong',
    })
  }
}
