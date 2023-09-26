import { db } from "@/services"
import createHttpError from "http-errors"

export async function getAllQuizzes() {
  const { Items } = await db
    .scan({
      TableName: "Quiztopia",
      FilterExpression:
        "begins_with(PK, :pk) AND begins_with(SK, :sk) AND EntityType = :entityType",
      ExpressionAttributeValues: {
        ":pk": "q#",
        ":sk": "u#",
        ":entityType": "Quiz"
      },
      ProjectionExpression: "QuizName, SK, PK"
    })
    .promise()

  if (!Items || Items.length === 0) {
    throw new createHttpError.NotFound("No quizzes exist.")
  }

  return Items.map((item) => ({
    quizId: item.PK.split("#")[1],
    quizName: item.QuizName,
    createdBy: item.SK.split("#")[1]
  }))
}
