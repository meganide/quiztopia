import { errorHandler } from "@/middlewares"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { HttpError } from "http-errors"

import { getQuizById } from "../deleteQuiz/helpers"
import { getLeaderboards } from "./helpers"

async function getLeaderboard(
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
    const quiz = await getQuizById(quizId)
    const quizNameObj = quiz.find((item) => item.QuizName)

    if (!quizNameObj) {
      return sendResponse(404, {
        success: false,
        message: "Quiz name does not exist."
      })
    }

    const leaderboards = await getLeaderboards(quizId)
    return sendResponse(200, {
      success: true,
      quizName: quizNameObj.QuizName,
      leaderboards
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
      message: "Something went wrong, could not get leaderboards."
    })
  }
}

export const handler = middy(getLeaderboard)
  .use(errorHandler())
  .handler(getLeaderboard)
