import { MongoClient } from 'mongodb'
const { MONGODB_URI, MONGODB_NAME, NODE_ENV } = process.env

export default async function mongoClient() {
  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }

  let client
  let mongoPromise

  if (!MONGODB_URI) {
    throw new Error('Add Mongo URI to .env.local')
  }

  if (NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI, options)
      global._mongoClientPromise = client.connect()
    }
    mongoPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(MONGODB_URI, options)
    mongoPromise = client.connect()
  }

  const clientPromise = await mongoPromise
  return clientPromise.db(MONGODB_NAME)
}
