import z from "zod"

export const QuestionSchema = z.object({
  quizId: z
    .string({
      required_error: "Quiz id is required.",
      invalid_type_error: "Quiz id must be a string."
    })
    .min(1, "Quiz id must be at least 1 characters long."),
  question: z
    .string({
      required_error: "Question is required.",
      invalid_type_error: "Question must be a string."
    })
    .min(5, "Question must be at least 5 characters long."),
  answer: z
    .string({
      required_error: "Answer is required.",
      invalid_type_error: "Answer must be a string."
    })
    .min(1, "Answer must be at least 1 characters long."),
  location: z.object(
    {
      longitude: z.number({
        required_error: "Longitude is required.",
        invalid_type_error: "Longitude must be a number."
      }),
      latitude: z.number({
        required_error: "Latitude is required.",
        invalid_type_error: "Latitude must be a number."
      })
    },
    {
      required_error: "Location is required.",
      invalid_type_error: "Location must be an object."
    }
  )
})

export type Question = z.infer<typeof QuestionSchema>
