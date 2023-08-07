import { Request, Response } from "express"
import { LoginUserInput } from "../schema/auth.schema"
import { findUserByEmail } from "../service/user.service"
import { signJwt } from "../utils/auth.utils"

export async function loginUserHandler(
  req: Request<{}, {}, LoginUserInput>,
  res: Response
) {
  const { email, password } = req.body
  try {
    const user = await findUserByEmail(email)

    if (!user || !(await user.comparePassword(password))) {
      return res.status(501).json({ message: "Invalid Creadentials!" })
    }

    const paylaod = user.toJSON()
    const jwt = await signJwt(paylaod)

    res.cookie("accessToken", jwt, {
      maxAge: 3.154e10, // 1 year,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
    })

    return res.status(200).json(jwt)
  } catch (error) {
    console.log(error)
  }
}
