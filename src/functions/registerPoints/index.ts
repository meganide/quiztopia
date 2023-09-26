import { errorHandler, zodValidation } from "@/middlewares"
import { validateToken } from "@/middlewares/auth"
import { Point, PointSchema } from "@/types/pointSchema"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import jsonBodyParser from "@middy/http-json-body-parser"
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { HttpError } from "http-errors"

import { getQuizById } from "../deleteQuiz/helpers"
import { savePoints } from "./helpers"

async function registerPoints(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const { quizId } = event.pathParameters as { quizId: string | undefined }
  const { points } = event.body as unknown as Point
  const username = event.username

  if (!quizId) {
    return sendResponse(400, {
      success: false,
      message: "Quiz id is required."
    })
  }

  try {
    await getQuizById(quizId)
    await savePoints(quizId, username, points)
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
      message: "Something went wrong, could not register points."
    })
  }
}

export const handler = middy(registerPoints)
  .use(validateToken())
  .use(jsonBodyParser())
  .use(zodValidation(PointSchema))
  .use(errorHandler())
  .handler(registerPoints)
