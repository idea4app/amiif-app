import nextConnect from 'next-connect'

import { httpStatus } from '../../../../../constants'
import gsUploader from '../../../../../lib/gs-uploader'
import { mongoClient } from '../../../../../config/database'
import {
  validateSession,
  multerMiddleware,
} from '../../../../../lib/middlewares'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function updateFile(req, res) {
  try {
    const { contractId } = req.query
    const db = await mongoClient()
    const collection = db.collection('contracts')

    const contract = await collection.findOne({ id: contractId })
    const { documents } = contract
    const version = documents.length + 1

    const fileName = `${contractId}-v${version}.pdf`
    const remotePath = `${process.env.CONTRACTS_FOLDER}/${fileName}`

    gsUploader({ remotePath, buffer: req.file.buffer }, async () => {
      const newDocument = {
        version,
        fileName,
        remotePath,
      }

      const updatedDocuments = [newDocument, ...documents]

      await collection.updateOne(
        { id: contractId },
        {
          $set: {
            lastVersion: version,
            documents: updatedDocuments,
          },
        },
      )

      return res.status(httpStatus.HTTP_201_CREATED).json(newDocument)
    })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
    })
  }
}

const handler = nextConnect({
  onError: (error, req, res, next) => {
    if (error) {
      return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
        error: error.message,
      })
    }
  },
})
handler.use(validateSession)
handler.use(multerMiddleware)
handler.put(updateFile)

export default handler
