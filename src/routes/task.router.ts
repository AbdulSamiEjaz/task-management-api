import { Router } from "express"
import {
  createTaskHandler,
  deleteTaskHandler,
  findTaskHandler,
  removeStaffMemberFromTasksHandler,
  updateTaskHandler,
} from "../controllers/task.controller"
import requireUser from "../middleware/requireUser"
import { processRequestBody } from "zod-express-middleware"
import { createTaskSchema, updateTaskSchema } from "../schema/task.schema"

export const taskRouter = Router()

taskRouter
  .route("/api/tasks")
  .post(
    requireUser,
    processRequestBody(createTaskSchema.body),
    createTaskHandler
  )

taskRouter
  .route("/api/tasks/:taskId")
  .patch(
    requireUser,
    processRequestBody(updateTaskSchema.body),
    updateTaskHandler
  )
  .get(requireUser, findTaskHandler)
  .delete(requireUser, deleteTaskHandler)

taskRouter
  .route("/api/tasks/:taskId/:staffMemberId")
  .patch(requireUser, removeStaffMemberFromTasksHandler)
