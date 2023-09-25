import { sendResponse } from "@/utils"
import middy from "@middy/core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import createHttpError from "http-errors"
import jwt, { JwtPayload } from "jsonwebtoken"

type TokenPayload =
  | JwtPayload
  | (string & {
      username?: string
    })

export function validateToken(
  username: string
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> {
  return {
    before: (handler) => {
      try {
        const token = handler.event.headers.Authorization?.replace(
          "Bearer ",
          ""
        )

        if (!token) {
          throw new createHttpError.Unauthorized("No token provided.")
        }

        const data = jwt.verify(token, "mysupersecretkey") as TokenPayload
        handler.event.username = data.username
      } catch (error) {
        console.log(error)
        throw new createHttpError.Unauthorized("Failed to verify token.")
      }
    }
  }
}
