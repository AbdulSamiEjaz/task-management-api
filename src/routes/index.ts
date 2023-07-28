import { Router } from "express"
import { userRouter } from "./user.route"
import { authRouter } from "./auth.router"
import { taskRouter } from "./task.router"

export const router = Router()
router.use(userRouter)
router.use(authRouter)
router.use(taskRouter)

// export default router
