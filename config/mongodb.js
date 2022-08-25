import { MongoClient } from 'mongodb'
const { MONGODB_URI, MONGODB_NAME, NODE_ENV } = process.env

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

let client
let mongoClient

if (!MONGODB_URI) {
  throw new Error('Add Mongo URI to .env.local')
}

if (NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options)
    global._mongoClientPromise = client.connect()
  }
  mongoClient = global._mongoClientPromise
} else {
  client = new MongoClient(MONGODB_URI, options)
  mongoClient = client.connect()
}

export default async () => {
  const clientPromise = await mongoClient
  return clientPromise.db(MONGODB_NAME)
}
