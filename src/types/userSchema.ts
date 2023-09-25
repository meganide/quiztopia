import z from "zod"

export const UserSchema = z.object({
  username: z
    .string({
      required_error: "Username is required.",
      invalid_type_error: "Username must be a string."
    })
    .min(3, "Username must be at least 3 characters long."),
  password: z
    .string({
      required_error: "Password is required.",
      invalid_type_error: "Password must be a string."
    })
    .min(6, "Password must be at least 6 characters long.")
})

export type User = z.infer<typeof UserSchema>
