import { db } from "@/services"
import { nanoid } from "nanoid"

export async function saveQuiz(username: string, quizName: string) {
  const id = nanoid()

  await db
    .put({
      TableName: "Quiztopia",
      Item: {
        PK: `q#${id}`,
        SK: `u#${username}`,
        EntityType: "Quiz",
        QuizName: quizName
      }
    })
    .promise()

  return id
}
