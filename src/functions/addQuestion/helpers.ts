import { db } from "@/services"
import { Question } from "@/types/questionSchema"
import createHttpError from "http-errors"
import { nanoid } from "nanoid"

export async function verifyOwner(username: string, quizId: string) {
  const { Items } = await db
    .query({
      TableName: "Quiztopia",
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `q#${quizId}`
      }
    })
    .promise()

  if (!Items || Items?.length === 0) {
    throw new createHttpError.NotFound("Quiz not found.")
  }

  const isOwner = Items.some(
    (item) => item.SK === `u#${username}` && item.EntityType === "Quiz"
  )

  if (!isOwner) {
    throw new createHttpError.Forbidden("You are not the owner of this quiz.")
  }
}

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
