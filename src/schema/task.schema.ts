import { array, boolean, object, string, TypeOf } from "zod"

const DIFFICULTY_LEVEL = {
  Easy: "Easy",
  Hard: "Hard",
  Medium: "Medium",
} as const

const assignedUserSchema = string({
  required_error: "One Staff Member must be assigned to a task!",
})

export const createTaskSchema = {
  body: object({
    title: string({ required_error: "Title is required!" }),
    description: string().optional(),
    difficulty: string().refine(
      (value) => {
        return Object.values(DIFFICULTY_LEVEL).includes(value as any)
      },
      { message: "Invalid difficulty level!" }
    ),
    assignedStaff: array(assignedUserSchema).optional(),
  }),
}

export const updateTaskSchema = {
  body: object({
    title: string({ required_error: "Title is required!" }).optional(),
    description: string().optional(),
    difficulty: string()
      .refine(
        (value) => {
          return Object.values(DIFFICULTY_LEVEL).includes(value as any)
        },
        { message: "Invalid difficulty level!" }
      )
      .optional(),
    completed: boolean().optional(),
    assignedStaff: array(assignedUserSchema).optional(),
  }),
  params: object({
    taskId: string(),
  }),
}

export type CreateTaskInput = TypeOf<typeof createTaskSchema.body>
export type UpdateTaskInputBody = TypeOf<typeof updateTaskSchema.body>
export type UpdateTaskInputParams = TypeOf<typeof updateTaskSchema.params>
