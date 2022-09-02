import formidable from 'formidable'
import { Storage } from '@google-cloud/storage'

import { verifyAccessToken } from '/utils'
import { mongoClient } from '/config/database'
import { httpStatus } from '../../../../../constants'

const {
  SECRET_KEY,
  GOOGLE_PROJECT_ID,
  GOOGLE_BUCKET_NAME,
  GOOGLE_KEY_FILE_NAME,
} = process.env

export const config = {
  api: {
    bodyParser: false,
  },
}

const gcpStorage = new Storage({
  projectId: GOOGLE_PROJECT_ID,
  keyFilename: GOOGLE_KEY_FILE_NAME,
})

const bucket = gcpStorage.bucket(GOOGLE_BUCKET_NAME)

async function updateFile(req, res) {
  const form = new formidable.IncomingForm()

  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(httpStatus.HTTP_406_NOT_ACCEPTABLE).json({
        error: error.message,
      })
    }

    try {
      const { contractId } = req.query
      const db = await mongoClient()
      const collection = db.collection('contracts')

      const contract = await collection.findOne({ id: contractId })
      const { documents } = contract
      const version = documents.length + 1

      const fileName = `${contractId}-v${version}.pdf`
      const remotePath = `contracts/${fileName}`

      const blob = bucket.file(remotePath)
      const blobStream = blob.createWriteStream()

      blobStream.on('finish', async (a, b, c) => {
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
              documents: updatedDocuments,
            },
          },
        )

        return res.status(httpStatus.HTTP_201_CREATED).json(newDocument)
      })

      blobStream.end(files.buffer)
    } catch (error) {
      console.error(error)
      return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error',
      })
    }
  })
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

  const { method } = req

  if (method === 'PUT') {
    return updateFile(req, res)
  }

  return res.status(httpStatus.HTTP_501_NOT_IMPLEMENTED).json({
    error: `${method} not implemented`,
  })
}
