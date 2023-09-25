import { sendResponse } from "@/utils"
import middy from "@middy/core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import jwt, { JwtPayload } from "jsonwebtoken"

type TokenPayload =
  | JwtPayload
  | (string & {
      username?: string
    })

export function validateToken(): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> {
  return {
    before: (handler) => {
      try {
        const token = handler.event.headers.authorization?.replace(
          "Bearer ",
          ""
        )

        if (!token) {
          return sendResponse(400, {
            success: false,
            message: "No token provided."
          })
        }

        const data = jwt.verify(token, "mysupersecretkey") as TokenPayload
        handler.event.username = data.username
      } catch (error) {
        console.log(error)
        return sendResponse(403, {
          success: false,
          message: "Invalid or expired token."
        })
      }
    }
  }
}
