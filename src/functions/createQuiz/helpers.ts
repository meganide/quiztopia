import { db } from "@/services"
import { nanoid } from "nanoid"

export async function saveQuiz(username: string, quizName: string) {
  const id = nanoid()

  const params = {
    TableName: "Quiztopia",
    Item: {
      PK: `q#${id}`,
      SK: `u#${username}`,
      EntityType: "Quiz",
      QuizName: quizName
    }
  }

  await db.put(params).promise()

  return id
}
