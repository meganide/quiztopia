import { db } from "@/services"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { AWSError } from "aws-sdk/lib/error"
import createHttpError from "http-errors"

export async function getQuizById(quizId: string) {
  const params = {
    TableName: "Quiztopia",
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": `q#${quizId}`
    }
  }

  const { Items } = await db.query(params).promise()

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
  const params = {
    RequestItems: {
      Quiztopia: deleteExpressions
    }
  }

  try {
    await db.batchWrite(params).promise()
  } catch (error) {
    let err = error as AWSError
    throw new createHttpError.InternalServerError(err.message)
  }
}
