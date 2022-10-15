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

export function verifyAccessToken({ token, secretKey }) {
  try {
    const tokenData = jwt.verify(token, secretKey)

    return tokenData
  } catch (error) {
    console.log(error.message)
    return null
  }
}

export function decodeToken(token) {
  try {
    const tokenData = jwt.decode(token)
    return {
      ...tokenData,
      token,
    }
  } catch (error) {
    return null
  }
}
