import middy from "@middy/core"
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import createError from "http-errors"
import z from "zod"

export function zodValidation(
  schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>
): middy.MiddlewareObj<APIGatewayProxyEventV2, APIGatewayProxyResultV2> {
  return {
    before: async (handler) => {
      try {
        schema.parse(handler.event.body)
      } catch (error) {
        let err = error
        if (err instanceof z.ZodError) {
          err = err.issues[0].message
        }
        throw new createError.BadRequest(err as string)
      }
    }
  }
}
