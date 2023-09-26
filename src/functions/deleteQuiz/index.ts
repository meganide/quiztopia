import { errorHandler } from "@/middlewares"
import { validateToken } from "@/middlewares/auth"
import { verifyOwner } from "@/middlewares/verifyOwner"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import jsonBodyParser from "@middy/http-json-body-parser"
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { HttpError } from "http-errors"

import { removeQuiz } from "./helpers"

async function deleteQuiz(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const { quizId } = event.pathParameters as { quizId: string }

  try {
    await removeQuiz(quizId)
    return sendResponse(200, {
      success: true
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
      message: "Something went wrong, could not delete quiz."
    })
  }
}

export const handler = middy(deleteQuiz)
  .use(validateToken())
  .use(jsonBodyParser())
  .use(verifyOwner())
  .use(errorHandler())
  .handler(deleteQuiz)
