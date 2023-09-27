import { db } from "@/services"
import createHttpError from "http-errors"

export async function getQuizQuestions(quizId: string) {
  const params = {
    TableName: "Quiztopia",
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": `q#${quizId}`,
      ":sk": "qu#"
    },
    ProjectionExpression: "Question"
  }

  const { Items } = await db.query(params).promise()

  if (!Items || Items.length === 0) {
    throw new createHttpError.NotFound(
      "Quiz does not exist or has no questions"
    )
  }

  return Items.map((item) => item.Question)
}
