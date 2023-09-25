import { errorHandler, zodValidation } from "@/middlewares"
import { User, UserSchema } from "@/types"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import jsonBodyParser from "@middy/http-json-body-parser"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { HttpError } from "http-errors"

import { createUser } from "./helpers"

async function signup(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const userCredentials = event.body as unknown as User

  try {
    await createUser(userCredentials)
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
      message: "Something went wrong, user could not be created."
    })
  }
}

export const handler = middy(signup)
  .use(jsonBodyParser())
  .use(zodValidation(UserSchema))
  .use(errorHandler())
  .handler(signup)
