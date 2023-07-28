import { string, object, TypeOf } from "zod"

export const loginUserSchema = {
  body: object({
    email: string({ required_error: "Email is required!" }).email(
      "Must be a valid email!"
    ),
    password: string({ required_error: "Password is required!" })
      .min(6, "Password must be atleast 6 characters!")
      .max(64, "Password must be less than 64 characters!"),
  }),
}

export type LoginUserInput = TypeOf<typeof loginUserSchema.body>
