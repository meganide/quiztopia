import {
  errorHandler,
  validateToken,
  verifyOwner,
  zodValidation
} from "@/middlewares"
import { Question, QuestionSchema } from "@/types"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import jsonBodyParser from "@middy/http-json-body-parser"
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { HttpError } from "http-errors"

import { saveQuestion } from "./helpers"

async function addQuestion(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const questionBody = event.body as unknown as Question

  try {
    await saveQuestion(questionBody)
    return sendResponse(201, {
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
      message: "Something went wrong, could not add question to Quiz."
    })
  }
}

export const handler = middy(addQuestion)
  .use(validateToken())
  .use(jsonBodyParser())
  .use(zodValidation(QuestionSchema))
  .use(verifyOwner())
  .use(errorHandler())
  .handler(addQuestion)
