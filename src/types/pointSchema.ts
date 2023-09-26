import z from "zod"

export const PointSchema = z.object({
  points: z
    .number({
      required_error: "Points is required.",
      invalid_type_error: "Points must be a number."
    })
    .min(0, "Points must be at least 0.")
})

export type Point = z.infer<typeof PointSchema>
