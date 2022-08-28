import jwt from 'jsonwebtoken'

export function createAccessToken({
  data,
  algorithm,
  secretKey,
  expirationInMinutes,
}) {
  const token = jwt.sign(data, secretKey, {
    expiresIn: expirationInMinutes * 60,
    algorithm,
  })

  return token
}

export function verifyAccessToken({ bearerToken, secretKey }) {
  try {
    const token = bearerToken.replace('Bearer ', '')

    const tokenData = jwt.verify(token, secretKey)

    return tokenData
  } catch (error) {
    console.error(error)
    return null
  }
}

export function decodeToken(token) {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}
