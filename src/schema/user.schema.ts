import { object, string, TypeOf } from "zod"

export const createUserSchema = {
  body: object({
    firstName: string({ required_error: "Firstname is required!" }),
    lastName: string({ required_error: "Lastname is required!" }),
    password: string({ required_error: "Password is required!" })
      .min(6, "Password must be atleast 6 characters!")
      .max(64, "Password must be less than 64 characters!"),
    confirmPassword: string({
      required_error: "Confirm Password is required!",
    })
      .min(6, "Password must be atleast 6 characters!")
      .max(64, "Password must be less than 64 characters!"),
    email: string({ required_error: "Email is required!" }).email(
      "Must be a valid email!"
    ),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match!",
    path: ["confirmPassword"],
  }),
}

export const updateUserSchema = {
  body: object({
    firstName: string(),
    lastName: string(),
  }),
}

export const searchForUsersSchema = {
  query: object({
    email: string().optional(),
  }),
}

export type CreateUserInput = TypeOf<typeof createUserSchema.body>
export type UpdateUserInputBody = TypeOf<typeof updateUserSchema.body>
export type SearchForUsersQuery = TypeOf<typeof searchForUsersSchema.query>
