import { errorHandler } from "@/middlewares"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { HttpError } from "http-errors"

import { getAllQuizzes } from "./helpers"

async function getQuizzes(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const quizzes = await getAllQuizzes()
    return sendResponse(200, {
      success: true,
      quizzes
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
      message: "Something went wrong, could not get quizzes."
    })
  }
}

export const handler = middy(getQuizzes).use(errorHandler()).handler(getQuizzes)
