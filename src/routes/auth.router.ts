import { Router } from "express"
import { loginUserHandler } from "../controllers/auth.controller"
import { processRequestBody } from "zod-express-middleware"
import { loginUserSchema } from "../schema/auth.schema"

export const authRouter = Router()

authRouter.post(
  "/auth/login",
  processRequestBody(loginUserSchema.body),
  loginUserHandler
)
