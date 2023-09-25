import { errorHandler, zodValidation } from "@/middlewares"
import { createJWT } from "@/middlewares/auth"
import { User, UserSchema } from "@/types"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import jsonBodyParser from "@middy/http-json-body-parser"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { HttpError } from "http-errors"

import { createToken, loginUser } from "./helpers"

async function login(event: APIGatewayProxyEvent) {
  const userCredentials = event.body as unknown as User

  try {
    const username = await loginUser(userCredentials)
    const token = createToken(username)
    return sendResponse(200, {
      success: true,
      token
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
      message: "Something went wrong, could not log in."
    })
  }
}

export const handler = middy(login)
  .use(jsonBodyParser())
  .use(zodValidation(UserSchema))
  .use(errorHandler())
  .handler(login)
