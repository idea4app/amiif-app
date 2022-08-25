// import mongoClient from '/config/mongodb'
import { httpMethods, httpStatus } from '/constants'

export default function handler(req, res) {
  const { method } = req

  switch (method) {
    case httpMethods.GET:
    default:
      return console.log({ req, res, httpStatus })
  }
}
