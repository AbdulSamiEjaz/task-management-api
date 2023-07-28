import { Request, Response } from "express"
import {
  CreateTaskInput,
  UpdateTaskInputBody,
  UpdateTaskInputParams,
} from "../schema/task.schema"
import { createTask, deleteTask, findTaskById } from "../service/task.service"
import { Types } from "mongoose"
import { findUserById } from "../service/user.service"
import { findStaffMemberId } from "../service/staff.service"
import { UserModel } from "../models/user.model"

export async function createTaskHandler(
  req: Request<{}, {}, CreateTaskInput>,
  res: Response
) {
  const currentUser = res.locals.user
  const { title, description, difficulty, assignedStaff } = req.body

  const user = await findUserById(currentUser._id)

  const existingStaffMembers = user?.staffMembers.map(String) ?? []
  const inputAssignedstaff = assignedStaff?.map(String) ?? []

  const filteredUsers = existingStaffMembers.filter((memeber) =>
    inputAssignedstaff.includes(memeber)
  )

  if (filteredUsers.length === 0) {
    return res.status(400).json({
      message: "Staff members are required to create a task!",
    })
  }

  const task = await createTask({
    ownerId: currentUser._id,
    title,
    description,
    difficulty,
    assignedStaff: filteredUsers.map((member) => new Types.ObjectId(member)),
  })

  // Save the reference to task as its ID to the staff members tasks assigned to you!
  for (const staffId of task.assignedStaff) {
    const staffMember = await findStaffMemberId(String(staffId))
    const user = await findUserById(String(staffMember?.userId))
    user?.tasksAssignedToYou.push(task._id)
    await user?.save()
  }

  // Save the reference to task as its ID to the current User
  user?.tasks.push(task._id)
  await user?.save()

  return res.status(201).json({
    message: "Task created!",
    task,
  })
}

export async function updateTaskHandler(
  req: Request<UpdateTaskInputParams, {}, UpdateTaskInputBody>,
  res: Response
) {
  const currentUser = res.locals.user
  const { taskId } = req.params

  if (!Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({
      message: "Enter a correct task ID!",
    })
  }

  const { title, description, difficulty, completed, assignedStaff } = req.body
  const user = await findUserById(currentUser._id)

  if (!user) {
    return res.status(404).json({
      message: "User does not exists!",
    })
  }
  try {
    const task = await findTaskById(taskId)

    if (!task) {
      return res.status(404).json({ message: "Task not found!" })
    }

    task.title = title ?? task.title
    task.description = description ?? task.description
    task.difficulty = difficulty ?? task.difficulty
    task.completed = completed ?? task.completed
    // Update assigned users
    if (assignedStaff) {
      // Users which already are added in task
      const existingStaffInTask = task.assignedStaff.map(String)
      // Users which only are the part of current user staff
      const existingStaffInUser = user.staffMembers.map(String)
      // Users which come from req.body
      const inputStaff = assignedStaff.map(String)
      // Filtered users so that user can only add the staff which he/she owns
      const filteredUsers = existingStaffInUser.filter((member) =>
        inputStaff.includes(member)
      )
      // Creating a unique array where only unique staff member exists and no duplicates!
      let allStaffRef = [
        ...new Set([...existingStaffInTask, ...filteredUsers]),
      ].map((member) => new Types.ObjectId(member))

      for (const staffMember of allStaffRef) {
        const staffUser = await findStaffMemberId(String(staffMember))
        const user = await findUserById(String(staffUser?.userId))

        if (!user?.tasksAssignedToYou.includes(task._id)) {
          user?.tasksAssignedToYou.push(task._id)
          await user?.save()
        }
      }

      task.assignedStaff = allStaffRef
    }

    await task.save()

    return res.status(200).json({
      message: "Task Updated!",
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}

export async function findTaskHandler(
  req: Request<{ taskId: string }>,
  res: Response
) {
  const { taskId } = req.params

  if (!Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({
      message: "Enter a correct task ID!",
    })
  }

  try {
    const task = await findTaskById(taskId)

    if (!task) {
      return res.status(404).json({ message: "Task not found!" })
    }

    return res.status(200).json({
      task,
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}

export async function deleteTaskHandler(
  req: Request<{ taskId: string }>,
  res: Response
) {
  const { taskId } = req.params

  if (!Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({
      message: "Enter a correct task ID!",
    })
  }

  try {
    await deleteTask(taskId)

    // Delete all the references of task
    await UserModel.updateMany(
      { tasksAssignedToYou: taskId },
      { $pull: { tasksAssignedToYou: taskId } }
    )

    return res.status(200).json({
      message: "Task deleted successfully!",
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}

export async function removeStaffMemberFromTasksHandler(
  req: Request<{ taskId: string; staffMemberId: string }>,
  res: Response
) {
  const { taskId, staffMemberId } = req.params

  if (!Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({
      message: "Enter a correct task ID!",
    })
  }

  const task = await findTaskById(taskId)

  if (!task) {
    return res.status(404).json({
      message: "Task not found!",
    })
  }

  const staffMembersAfterDeletion = task.assignedStaff.filter((member) => {
    return member.toString() !== staffMemberId
  })

  const staffMember = await findStaffMemberId(staffMemberId)

  task.assignedStaff = staffMembersAfterDeletion
  await UserModel.updateOne(
    {
      _id: staffMember?.userId,
    },
    { $pull: { tasksAssignedToYou: task._id } }
  )
  await task.save()

  return res.status(200).json({
    message: "User removed successfully!",
  })
}
