import formidable from 'formidable'
import { Storage } from '@google-cloud/storage'

import { verifyAccessToken } from '/utils'
import { mongoClient } from '/config/database'
import { httpStatus, contractStatus } from '../../../../constants'

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

async function updateContract(req, res) {
  const form = new formidable.IncomingForm()

  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(httpStatus.HTTP_406_NOT_ACCEPTABLE).json({
        error: error.message,
      })
    }

    try {
      const db = await mongoClient()
      const collection = db.collection('contracts')

      const count = await collection.countDocuments()
      const contractId = `CONT-${('00000' + count).slice(-9)}`
      const fileName = `${contractId}-v1.pdf`
      const remotePath = `contracts/${fileName}`

      const blob = bucket.file(remotePath)
      const blobStream = blob.createWriteStream()

      blobStream.on('finish', async (a, b, c) => {
        const currentDate = new Date()
        const createdAt = currentDate.toISOString()
        const updatedAt = currentDate.toISOString()
        const documents = [
          {
            fileName,
            version: 1,
            remotePath,
          },
        ]

        const toSave = {
          id: contractId,
          createdAt,
          updatedAt,
          documents,
          comments: [],
          lastVersion: 1,
          approvedAt: null,
          name: fields.name,
          user: res.user._id,
          status: contractStatus.NEW,
        }

        await collection.insertOne(toSave)

        return res.status(httpStatus.HTTP_201_CREATED).json({
          ...toSave,
          user: [req.user],
        })
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

async function getContract(req, res) {
  try {
    const { contractId } = req.query

    const db = await mongoClient()
    const collection = await db.collection('contracts')
    const [contract] = await collection
      .aggregate([
        { $match: { id: contractId } },
        { $project: { _id: 0 } },
        {
          $lookup: {
            as: 'user',
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  password: 0,
                },
              },
            ],
          },
        },
      ])
      .toArray()

    return res.status(httpStatus.HTTP_200_OK).json(contract)
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
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

  res.user = await db
    .collection('users')
    .findOne(
      { email: userData.email },
      { projection: { createdAt: 0, password: 0 } },
    )

  const { method } = req

  if (method === 'PUT') {
    return updateContract(req, res)
  } else if (method === 'GET') {
    return getContract(req, res)
  }

  return res.status(httpStatus.HTTP_501_NOT_IMPLEMENTED).json({
    error: `${method} not implemented`,
  })
}
