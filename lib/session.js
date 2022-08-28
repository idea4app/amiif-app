import { decodeToken } from '/utils'

export async function getLoggedUser(req, res) {
  const { session } = req.cookies
  const tokenUser = decodeToken(session)

  return tokenUser
}
