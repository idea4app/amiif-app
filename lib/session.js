import { decodeToken } from '/utils'

export async function getLoggedUser(req) {
  const { session } = req.cookies

  if (!session) {
    return null
  }

  const tokenUser = decodeToken(session)

  return tokenUser
}
