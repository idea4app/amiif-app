import handler from '/server/handlers/protected'
import multer from '/server/middlewares/multer'
import uploadContract from '/server/contracts/uploadContract'

export const config = {
  api: {
    bodyParser: false,
  },
}

handler.use(multer)
handler.put(uploadContract)

export default handler
