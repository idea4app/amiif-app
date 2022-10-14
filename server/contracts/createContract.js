import mongoClient from '../databases/mongodb'
import gsUploader from '../../lib/gs-uploader'
import { httpStatus, contractStatus } from '../../constants'

export default async function createContract(req, res) {
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
          remotePath: `${process.env.GOOGLE_CLOUD_STORAGE_BASE}/${process.env.CONTRACTS_FOLDER}/${fileName}`,
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
        name: req.body.name,
        creator: res.user._id,
        status: contractStatus.NEW,
      }

      await collection.insertOne(toSave)

      return res.status(httpStatus.HTTP_201_CREATED).json({
        ...toSave,
        creator: res.user,
      })
    })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
    })
  }
}
