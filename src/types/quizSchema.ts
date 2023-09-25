import z from "zod"

export const QuizSchema = z.object({
  quizName: z
    .string({
      required_error: "Quiz name is required.",
      invalid_type_error: "Quiz name must be a string."
    })
    .min(1, "Quiz name must be at least 1 characters long.")
})

export type Quiz = z.infer<typeof QuizSchema>
