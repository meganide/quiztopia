import { errorHandler, zodValidation } from "@/middlewares"
import { User, UserSchema } from "@/types"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import jsonBodyParser from "@middy/http-json-body-parser"
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { HttpError } from "http-errors"

import { createUser } from "./helpers"

async function signup(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
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
      message: "Something went wrong, could not create user."
    })
  }
}

export const handler = middy(signup)
  .use(jsonBodyParser())
  .use(zodValidation(UserSchema))
  .use(errorHandler())
  .handler(signup)
