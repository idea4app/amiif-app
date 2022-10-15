import nextConnect from 'next-connect'
import { httpStatus } from '../../constants'

export default nextConnect({
  onError: (err, _, res, __) => {
    console.log(err.stack)
    return res
      .status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR)
      .end('Internal Server Error')
  },
  onNoMatch: (_, res) => {
    return res.status(httpStatus.HTTP_404_NOT_FOUND).end('Method Not Found')
  },
})
