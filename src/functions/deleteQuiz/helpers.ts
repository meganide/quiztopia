import { db } from "@/services"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { AWSError } from "aws-sdk/lib/error"
import createHttpError from "http-errors"

export async function getQuizById(quizId: string) {
  const { Items } = await db
    .query({
      TableName: "Quiztopia",
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `q#${quizId}`
      }
    })
    .promise()

  console.log(Items)

  if (!Items || Items.length === 0) {
    throw new createHttpError.NotFound("Quiz does not exist.")
  }

  return Items
}

export function createDeleteExpressions(quiz: DocumentClient.ItemList) {
  return quiz.map((item) => ({
    DeleteRequest: {
      TableName: "Quiztopia",
      Key: {
        PK: item.PK,
        SK: item.SK
      }
    }
  }))
}

export async function removeQuiz(deleteExpressions: DocumentClient.ItemList) {
  try {
    await db
      .batchWrite({
        RequestItems: {
          Quiztopia: deleteExpressions
        }
      })
      .promise()
  } catch (error) {
    let err = error as AWSError
    throw new createHttpError.InternalServerError(err.message)
  }
}
