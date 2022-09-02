import nextConnect from 'next-connect'

import gsUploader from '../../../lib/gs-uploader'
import { mongoClient } from '../../../config/database'
import { httpStatus, contractStatus } from '../../../constants'
import { multerMiddleware, validateSession } from '../../../lib/middlewares'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function createContract(req, res) {
  try {
    const db = await mongoClient()
    const collection = db.collection('contracts')

    const count = await collection.countDocuments()
    const contractId = `CONT-${('00000' + count).slice(-9)}`
    const fileName = `${contractId}-v1.pdf`
    const remotePath = `${process.env.CONTRACTS_FOLDER}/${fileName}`

    gsUploader({ remotePath, buffer: req.file.buffer }, async () => {
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
        user: res.user._id,
        name: req.body.name,
        status: contractStatus.NEW,
      }

      await collection.insertOne(toSave)

      return res.status(httpStatus.HTTP_201_CREATED).json({
        ...toSave,
        user: [res.user],
      })
    })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
    })
  }
}

async function getAllContracts(req, res) {
  try {
    const { _id, roles } = res.user
    const page = Number(req.query.page || 10)
    const perPage = Number(req.query.perPage || 10)

    const skip = (page - 1) * perPage

    const db = await mongoClient()
    const collection = await db.collection('contracts')
    const query = (roles.contracts !== 'admin' && { user: _id }) || {}

    const contracts = await collection
      .aggregate([
        { $match: query },
        { $skip: skip },
        { $limit: perPage },
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

    const docs = await collection.count(query)
    const pages = Math.ceil(docs / perPage)

    return res.status(httpStatus.HTTP_200_OK).json({
      page,
      pages,
      perPage,
      contracts,
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
handler.get(getAllContracts)
handler.use(multerMiddleware)
handler.post(createContract)

export default handler
