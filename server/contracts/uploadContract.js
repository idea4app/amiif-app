import mongoClient from '../databases/mongodb'
import gsUploader from '../../lib/gs-uploader'
import { httpStatus } from '../../constants'

export default async function uploadContract(req, res) {
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
        remotePath: `${process.env.GOOGLE_CLOUD_STORAGE_BASE}/${process.env.CONTRACTS_FOLDER}/${fileName}`,
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
    console.log(error)

    return res.status(httpStatus.HTTP_500_INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
    })
  }
}
