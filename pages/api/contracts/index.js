import handler from '/server/handlers/protected'
import multer from '/server/middlewares/multer'
import getContracts from '/server/contracts/getContracts'
import createContract from '/server/contracts/createContract'

export const config = {
  api: {
    bodyParser: false,
  },
}

handler.get(getContracts)
handler.use(multer)
handler.post(createContract)

export default handler
