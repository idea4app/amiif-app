import { Storage } from '@google-cloud/storage'

const { GOOGLE_PROJECT_ID, GOOGLE_BUCKET_NAME, GOOGLE_KEY_FILE_NAME } =
  process.env

const gcpStorage = new Storage({
  projectId: GOOGLE_PROJECT_ID,
  keyFilename: GOOGLE_KEY_FILE_NAME,
})

const bucket = gcpStorage.bucket(GOOGLE_BUCKET_NAME)

export default async function fileUploader({ remotePath, buffer }, callback) {
  const blob = bucket.file(remotePath)
  const blobStream = blob.createWriteStream()
  blobStream.on('finish', callback)
  blobStream.end(buffer)
}
