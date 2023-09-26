import { db } from "@/services"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2
} from "aws-lambda"
import createHttpError from "http-errors"

type QuizId = { quizId: string | undefined }

export function verifyOwner(): middy.MiddlewareObj<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> {
  return {
    before: async (handler) => {
      let quizId

      if (handler.event.routeKey === "POST /api/quiz/question") {
        quizId = (handler.event.body as unknown as QuizId)?.quizId
      } else if (handler.event.routeKey === "DELETE /api/quiz/{quizId}") {
        quizId = handler.event.pathParameters?.quizId
      }

      const username = handler.event.username

      if (!quizId) {
        throw new createHttpError.BadRequest("No quizId provided.")
      }

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
        throw new createHttpError.Forbidden(
          "You are not the owner of this quiz."
        )
      }
    }
  }
}
