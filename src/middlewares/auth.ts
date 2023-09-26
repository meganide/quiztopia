import { db } from "@/services"
import { sendResponse } from "@/utils"
import middy from "@middy/core"
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import jwt, { JwtPayload } from "jsonwebtoken"

type TokenPayload =
  | JwtPayload
  | (string & {
      username?: string
    })

export function validateToken(): middy.MiddlewareObj<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> {
  return {
    before: async (handler) => {
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

        const { Items } = await db
          .query({
            TableName: "Quiztopia",
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
              ":pk": `u#${data.username}`,
              ":sk": "p#"
            }
          })
          .promise()

        if (!Items || Items.length === 0) {
          return sendResponse(404, {
            success: false,
            message: "User doesn't exist."
          })
        }

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
