import { db } from "@/services"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import createHttpError from "http-errors"

export async function getLeaderboards(quizId: string) {
  const { Items } = await db
    .scan({
      TableName: "Quiztopia",
      FilterExpression: "PK = :pk AND :entityType = EntityType",
      ExpressionAttributeValues: {
        ":pk": `q#${quizId}`,
        ":entityType": "Points"
      },
      ExpressionAttributeNames: {
        "#user": "User"
      },
      ProjectionExpression: "#user, Points"
    })
    .promise()

  if (!Items || Items.length === 0) {
    throw new createHttpError.NotFound("No quizzes exist.")
  }

  return sortByHigestPoints(Items)
    .slice(0, 20)
    .map((item) => ({ user: item.User, points: item.Points }))
}

function sortByHigestPoints(leaderboards: DocumentClient.ItemList) {
  return leaderboards.sort((a, b) => b.Points - a.Points)
}
