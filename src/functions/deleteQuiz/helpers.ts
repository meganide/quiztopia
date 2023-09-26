import { db } from "@/services"
import { AWSError } from "aws-sdk/lib/error"
import createHttpError from "http-errors"

export async function removeQuiz(quizId: string) {
  console.log({ quizId })
  try {
    await db
      .delete({
        TableName: "Quiztopia",
        Key: {
          PK: `q#${quizId}`
        },
        ConditionExpression: "attribute_exists(PK)"
      })
      .promise()
  } catch (error) {
    let err = error as AWSError
    if (err.code === "ConditionalCheckFailedException") {
      throw new createHttpError.NotFound("Quiz does not exist.")
    }
  }
}
