import { db } from "@/services"
import { Question } from "@/types"
import { nanoid } from "nanoid"

export async function saveQuestion(questionBody: Question) {
  const questionId = nanoid()
  const { quizId, answer, location, question } = questionBody

  const params = {
    TableName: "Quiztopia",
    Item: {
      PK: `q#${quizId}`,
      SK: `qu#${questionId}`,
      EntityType: "Question",
      Question: question,
      Answer: answer,
      Location: { location }
    }
  }

  await db.put(params).promise()
}
