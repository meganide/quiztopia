import { errorHandler, zodValidation } from "@/middlewares"
import { validateToken } from "@/middlewares/auth"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import jsonBodyParser from "@middy/http-json-body-parser"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { HttpError } from "http-errors"

async function createQuiz(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
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
      message: "Something went wrong, could not create quiz."
    })
  }
}

export const handler = middy(createQuiz)
  .use(validateToken())
  .use(jsonBodyParser())
  // .use(zodValidation(UserSchema))
  .use(errorHandler())
  .handler(createQuiz)
