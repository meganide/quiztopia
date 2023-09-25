import { sendResponse } from "@/utils"
import middy from "@middy/core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import createHttpError from "http-errors"
import jwt from "jsonwebtoken"

export function createJWT(
  username: string
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> {
  return {
    after: (handler) => {
      console.log(username)
      try {
        const token = jwt.sign(username, "mysupersecretkey")
        return sendResponse(200, {
          success: true,
          token
        })
      } catch (error) {
        console.log(error)
        throw new createHttpError.InternalServerError("Could not create JWT")
      }
    },
    onError: (handler) => {
      console.log("onError")
    }
  }
}
