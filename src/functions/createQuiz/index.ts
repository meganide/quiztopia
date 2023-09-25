import { errorHandler, zodValidation } from "@/middlewares"
import { validateToken } from "@/middlewares/auth"
import { Quiz, QuizSchema } from "@/types/quizSchema"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import jsonBodyParser from "@middy/http-json-body-parser"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { HttpError } from "http-errors"

import { saveQuiz } from "./helpers"

async function createQuiz(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const { quizName } = event.body as unknown as Quiz

  try {
    const quizId = await saveQuiz(event.username, quizName)
    return sendResponse(200, {
      success: true,
      quizId
    })
  } catch (error) {
    console.log(error)
    if (error instanceof HttpError) {
      return sendResponse(error.statusCode, {
        success: false,
        message: error.message
      })
    }
    return sendResponse(500, {
      success: false,
      message: "Something went wrong, could not create quiz."
    })
  }
}

export const handler = middy(createQuiz)
  .use(validateToken())
  .use(jsonBodyParser())
  .use(zodValidation(QuizSchema))
  .use(errorHandler())
  .handler(createQuiz)
