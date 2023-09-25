import { db } from "@/services"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import createHttpError from "http-errors"

type QuizId = { quizId: string | undefined }

export function verifyOwner(): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> {
  return {
    before: async (handler) => {
      const quizIdBody = handler.event.body as unknown as QuizId
      const quizIdParams = handler.event.pathParameters?.quizId
      const quizId = quizIdBody?.quizId || quizIdParams
      const username = handler.event.username

      if (!quizId) {
        return sendResponse(400, {
          success: false,
          message: "No quizId provided."
        })
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
