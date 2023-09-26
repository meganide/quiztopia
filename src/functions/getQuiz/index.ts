import { errorHandler } from "@/middlewares"
import { validateToken } from "@/middlewares/auth"
import { verifyOwner } from "@/middlewares/verifyOwner"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import jsonBodyParser from "@middy/http-json-body-parser"
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { HttpError } from "http-errors"

import { getQuizQuestions } from "./helpers"

async function getQuiz(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const { quizId } = event.pathParameters as { quizId: string | undefined }

  if (!quizId) {
    return sendResponse(400, {
      success: false,
      message: "Quiz id is required."
    })
  }

  try {
    const questions = await getQuizQuestions(quizId)
    return sendResponse(200, {
      success: true,
      questions
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
      message: "Something went wrong, could not get quiz questions."
    })
  }
}

export const handler = middy(getQuiz).use(errorHandler()).handler(getQuiz)
