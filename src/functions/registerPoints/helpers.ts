import { db } from "@/services"

export async function savePoints(
  quizId: string,
  username: string,
  points: number
) {
  const params = {
    TableName: "Quiztopia",
    Item: {
      PK: `q#${quizId}`,
      SK: `u#${username}#p#${points}`,
      EntityType: "Points",
      Points: points,
      User: username
    }
  }

  await db.put(params).promise()
}
