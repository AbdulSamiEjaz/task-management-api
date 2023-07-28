import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || ""
const JWT_EXPRIRES_IN = process.env.JWT_EXPRIRES_IN || ""

export async function signJwt(payload: string | Buffer | Object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPRIRES_IN,
  })
}

export async function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}
