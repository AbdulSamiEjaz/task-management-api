import { Router } from "express"
import { processRequestBody, processRequestQuery } from "zod-express-middleware"
import {
  addStaffMemberHandler,
  createUserHandler,
  getAllUsersHandler,
  getStaffMembersDataHandler,
  getUserDetailsHandler,
  removeStaffMemberHandler,
  searchForUsersHandler,
  updateUserHandler,
} from "../controllers/user.controller"
import { createUserSchema, searchForUsersSchema } from "../schema/user.schema"
import { upload } from "../middleware/multer"
import requireUser from "../middleware/requireUser"

export const userRouter = Router()

userRouter
  .route("/api/users")
  .post(processRequestBody(createUserSchema.body), createUserHandler)
  .get(requireUser, getAllUsersHandler)

userRouter.patch(
  "/api/users/:userId",
  upload.single("avatar"),
  updateUserHandler
)

userRouter.get("/api/users/me", requireUser, getUserDetailsHandler)

userRouter.get(
  "/api/searchUsers",
  requireUser,
  processRequestQuery(searchForUsersSchema.query),
  searchForUsersHandler
)

userRouter
  .route("/api/users/staff/:staffUserId")
  .patch(requireUser, addStaffMemberHandler)
  .put(requireUser, removeStaffMemberHandler)

userRouter.get("/api/users/staff", requireUser, getStaffMembersDataHandler)
